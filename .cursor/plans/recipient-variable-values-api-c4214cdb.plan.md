<!-- c4214cdb-c8ee-45ef-9024-a257f714d7ef 56132763-8303-457a-89eb-aa19e9d5aa55 -->
# Clean Recipient Variable Values API

## Design Philosophy

**Separation of concerns:**

- Variable **values** (this API) - just the data as a map
- Variable **definitions** (separate query) - constraints, types, order, etc.
- Frontend fetches both, maps them together to build table columns
- Backend validates types in repository, returns ONLY valid data
- Invalid data triggers GraphQL errors with extensions containing row details
- Frontend catches errors and shows dialog to fix invalid rows

**Key improvements:**

- Use **map structure** (not array) for O(1) column access
- Simplified GraphQL (JSON type, no discriminated unions)
- All template variables present in map (even if null) for consistent rendering
- Strict validation: invalid data excluded from results, returned as errors

## 1. Create Types File

Create `/workspaces/workspaces/server/types/recipientVariableValue.types.ts`:

```typescript
import * as Db from "@/server/db/schema";
import { TemplateVariableType } from "./templateVariable.types";

// Entity types
export type RecipientVariableValueEntity =
  typeof Db.recipientGroupItemVariableValues.$inferSelect;

export type RecipientVariableValueEntityInput =
  typeof Db.recipientGroupItemVariableValues.$inferInsert;

// Simple value map (matches DB structure, allows O(1) access)
export type VariableValuesMap = {
  [variableId: string]: any; // Value type determined by template variable definition
};

// Table row - recipient with their values as map
export type RecipientWithVariableValues = {
  recipientGroupItemId: number;
  studentId: number;
  studentName: string;
  variableValues: VariableValuesMap; // Map for efficient column access
};

// Simple input (backend determines type from variable ID)
export type VariableValueInput = {
  variableId: number;
  value: string; // Always string, backend parses based on variable type
};

// Validation error info (for GraphQL extensions when invalid data exists)
export type VariableValueValidationError = {
  recipientGroupItemId: number;
  studentName: string;
  variableId: number;
  variableName: string;
  expectedType: TemplateVariableType;
  actualValue: any;
  error: string;
};
```

Export from `server/types/index.ts`

## 2. Create Pothos Objects

Create `/workspaces/workspaces/server/graphql/pothos/recipientVariableValue.pothos.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";

// Recipient row for table
export const RecipientWithVariableValuesPothosObject = gqlSchemaBuilder
  .objectRef<Types.RecipientWithVariableValues>("RecipientWithVariableValues")
  .implement({
    fields: t => ({
      recipientGroupItemId: t.exposeInt("recipientGroupItemId"),
      studentId: t.exposeInt("studentId"),
      studentName: t.exposeString("studentName"),
      variableValues: t.field({
        type: "JSON",
        description: "Map of variableId to value. Use template variables query to get type/constraint info. All template variables are present (null if not set).",
        resolve: (obj) => obj.variableValues,
      }),
    }),
  });

// Simple input (just string value, backend parses)
export const VariableValueInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.VariableValueInput>("VariableValueInput")
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
      value: t.string({
        required: true,
        description: "Value as string. Backend parses to correct type. For SELECT multiple: JSON array string like '[\"opt1\",\"opt2\"]'",
      }),
    }),
  });
```

## 3. Create Repository

Create `/workspaces/workspaces/server/db/repo/recipientVariableValue.repository.ts`:

**Core responsibilities:**

1. Fetch JSONB values from database
2. Fetch template variable definitions to know types
3. Transform JSONB to map with ALL variables (null if not set)
4. **Validate types match - collect errors, EXCLUDE invalid rows**
5. Return valid data only + validation errors separately
```typescript
import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import * as Db from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TemplateVariableRepository } from "./templateVariable.repository";
import logger from "@/server/lib/logger";

export namespace RecipientVariableValueRepository {
  
  // Get values for single recipient
  export const findByRecipientGroupItemId = async (
    recipientGroupItemId: number
  ): Promise<{
    data: Types.RecipientWithVariableValues | null;
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch recipient group item with student name
    const recipientItem = await db
      .select({
        id: Db.templateRecipientGroupItems.id,
        recipientGroupId: Db.templateRecipientGroupItems.recipientGroupId,
        studentId: Db.templateRecipientGroupItems.studentId,
        studentName: Db.students.name,
      })
      .from(Db.templateRecipientGroupItems)
      .leftJoin(Db.students, eq(Db.templateRecipientGroupItems.studentId, Db.students.id))
      .where(eq(Db.templateRecipientGroupItems.id, recipientGroupItemId))
      .limit(1);

    if (!recipientItem[0]) return { data: null, errors: [] };

    const item = recipientItem[0];

    // 2. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: Db.templateRecipientGroups.templateId })
      .from(Db.templateRecipientGroups)
      .where(eq(Db.templateRecipientGroups.id, item.recipientGroupId))
      .limit(1);

    if (!group[0]) return { data: null, errors: [] };

    // 3. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(group[0].templateId);

    // 4. Fetch JSONB values
    const valueRow = await db
      .select()
      .from(Db.recipientGroupItemVariableValues)
      .where(eq(Db.recipientGroupItemVariableValues.templateRecipientGroupItemId, recipientGroupItemId))
      .limit(1);

    const jsonbValues = valueRow[0]?.variableValues || {};

    // 5. Transform to map with ALL variables
    const { values, errors } = transformJsonbToMap(
      jsonbValues,
      variables,
      item.id,
      item.studentName || "Unknown"
    );

    // 6. If there are validation errors, return null data (strict mode)
    if (errors.length > 0) {
      return { data: null, errors };
    }

    return {
      data: {
        recipientGroupItemId: item.id,
        studentId: item.studentId,
        studentName: item.studentName || "Unknown",
        variableValues: values,
      },
      errors: [],
    };
  };

  // Get values for all recipients in group (table-ready)
  export const findByRecipientGroupId = async (
    recipientGroupId: number
  ): Promise<{
    data: Types.RecipientWithVariableValues[];
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: Db.templateRecipientGroups.templateId })
      .from(Db.templateRecipientGroups)
      .where(eq(Db.templateRecipientGroups.id, recipientGroupId))
      .limit(1);

    if (!group[0]) return { data: [], errors: [] };

    // 2. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(group[0].templateId);

    // 3. Fetch all recipients with student names
    const recipients = await db
      .select({
        id: Db.templateRecipientGroupItems.id,
        studentId: Db.templateRecipientGroupItems.studentId,
        studentName: Db.students.name,
      })
      .from(Db.templateRecipientGroupItems)
      .leftJoin(Db.students, eq(Db.templateRecipientGroupItems.studentId, Db.students.id))
      .where(eq(Db.templateRecipientGroupItems.recipientGroupId, recipientGroupId));

    // 4. Fetch all JSONB values
    const valueRows = await db
      .select()
      .from(Db.recipientGroupItemVariableValues)
      .where(eq(Db.recipientGroupItemVariableValues.recipientGroupId, recipientGroupId));

    const valuesMap = new Map(
      valueRows.map(row => [row.templateRecipientGroupItemId, row.variableValues])
    );

    // 5. Transform each recipient
    const validRecipients: Types.RecipientWithVariableValues[] = [];
    const allErrors: Types.VariableValueValidationError[] = [];

    for (const recipient of recipients) {
      const jsonbValues = valuesMap.get(recipient.id) || {};
      const { values, errors } = transformJsonbToMap(
        jsonbValues,
        variables,
        recipient.id,
        recipient.studentName || "Unknown"
      );

      // Only include recipients with valid data
      if (errors.length === 0) {
        validRecipients.push({
          recipientGroupItemId: recipient.id,
          studentId: recipient.studentId,
          studentName: recipient.studentName || "Unknown",
          variableValues: values,
        });
      } else {
        // Collect errors for invalid recipients
        allErrors.push(...errors);
      }
    }

    return { data: validRecipients, errors: allErrors };
  };

  // Upsert values with validation
  export const upsertVariableValues = async (
    recipientGroupItemId: number,
    values: Types.VariableValueInput[]
  ): Promise<{
    data: Types.RecipientWithVariableValues | null;
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch recipient + template ID
    const recipientItem = await db
      .select({
        id: Db.templateRecipientGroupItems.id,
        recipientGroupId: Db.templateRecipientGroupItems.recipientGroupId,
        studentId: Db.templateRecipientGroupItems.studentId,
        studentName: Db.students.name,
      })
      .from(Db.templateRecipientGroupItems)
      .leftJoin(Db.students, eq(Db.templateRecipientGroupItems.studentId, Db.students.id))
      .where(eq(Db.templateRecipientGroupItems.id, recipientGroupItemId))
      .limit(1);

    if (!recipientItem[0]) {
      throw new Error(`Recipient group item ${recipientGroupItemId} not found`);
    }

    const item = recipientItem[0];

    const group = await db
      .select({ templateId: Db.templateRecipientGroups.templateId })
      .from(Db.templateRecipientGroups)
      .where(eq(Db.templateRecipientGroups.id, item.recipientGroupId))
      .limit(1);

    if (!group[0]) {
      throw new Error(`Recipient group ${item.recipientGroupId} not found`);
    }

    // 2. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(group[0].templateId);
    const variablesById = new Map(variables.map(v => [v.id, v]));

    // 3. Validate all variable IDs belong to template
    const invalidIds = values.filter(v => !variablesById.has(v.variableId));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid variable IDs: ${invalidIds.map(v => v.variableId).join(", ")}`);
    }

    // 4. Parse and validate inputs
    const errors: Types.VariableValueValidationError[] = [];
    const parsedValues: { [key: string]: { type: string; value: any } } = {};

    for (const input of values) {
      const variable = variablesById.get(input.variableId)!;
      const parseResult = parseInputValue(input, variable);

      if (parseResult.error) {
        errors.push({
          recipientGroupItemId: item.id,
          studentName: item.studentName || "Unknown",
          variableId: input.variableId,
          variableName: variable.name,
          expectedType: variable.type as Types.TemplateVariableType,
          actualValue: input.value,
          error: parseResult.error,
        });
      } else {
        parsedValues[input.variableId] = {
          type: variable.type,
          value: parseResult.parsed,
        };
      }
    }

    // 5. If validation errors, return them without saving
    if (errors.length > 0) {
      return { data: null, errors };
    }

    // 6. Fetch current JSONB
    const currentRow = await db
      .select()
      .from(Db.recipientGroupItemVariableValues)
      .where(eq(Db.recipientGroupItemVariableValues.templateRecipientGroupItemId, recipientGroupItemId))
      .limit(1);

    const currentValues = currentRow[0]?.variableValues || {};

    // 7. Merge and save
    const mergedValues = { ...currentValues, ...parsedValues };

    if (currentRow[0]) {
      await db
        .update(Db.recipientGroupItemVariableValues)
        .set({
          variableValues: mergedValues,
          updatedAt: new Date(),
        })
        .where(eq(Db.recipientGroupItemVariableValues.id, currentRow[0].id));
    } else {
      await db.insert(Db.recipientGroupItemVariableValues).values({
        templateRecipientGroupItemId: recipientGroupItemId,
        templateId: group[0].templateId,
        recipientGroupId: item.recipientGroupId,
        studentId: item.studentId,
        variableValues: mergedValues,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 8. Return transformed data
    return findByRecipientGroupItemId(recipientGroupItemId);
  };

  // Helper: Transform JSONB to map with ALL variables
  const transformJsonbToMap = (
    jsonbValue: any,
    variables: Types.TemplateVariablePothosUnion[],
    recipientGroupItemId: number,
    studentName: string
  ): {
    values: Types.VariableValuesMap;
    errors: Types.VariableValueValidationError[];
  } => {
    const values: Types.VariableValuesMap = {};
    const errors: Types.VariableValueValidationError[] = [];

    // Initialize all variables with null
    for (const variable of variables) {
      values[variable.id] = null;
    }

    // Fill in actual values and validate
    for (const variable of variables) {
      const jsonbEntry = jsonbValue[variable.id];
      if (!jsonbEntry) continue; // Keep null

      const expectedType = variable.type;
      const actualType = jsonbEntry.type;
      const actualValue = jsonbEntry.value;

      // Type mismatch check
      if (expectedType !== actualType) {
        errors.push({
          recipientGroupItemId,
          studentName,
          variableId: variable.id,
          variableName: variable.name,
          expectedType: expectedType as Types.TemplateVariableType,
          actualValue,
          error: `Type mismatch: expected ${expectedType}, got ${actualType}`,
        });
        continue; // Keep null
      }

      // Type-specific validation
      const validationError = validateValue(actualValue, variable);
      if (validationError) {
        errors.push({
          recipientGroupItemId,
          studentName,
          variableId: variable.id,
          variableName: variable.name,
          expectedType: expectedType as Types.TemplateVariableType,
          actualValue,
          error: validationError,
        });
        continue; // Keep null
      }

      // Valid - assign value
      values[variable.id] = actualValue;
    }

    return { values, errors };
  };

  // Helper: Parse string input to correct type
  const parseInputValue = (
    input: Types.VariableValueInput,
    variable: Types.TemplateVariablePothosUnion
  ): {
    parsed: any;
    error: string | null;
  } => {
    try {
      switch (variable.type) {
        case "TEXT":
          // Validate pattern if exists
          if (variable.pattern && !new RegExp(variable.pattern).test(input.value)) {
            return { parsed: null, error: `Does not match pattern: ${variable.pattern}` };
          }
          return { parsed: input.value, error: null };

        case "NUMBER":
          const num = parseFloat(input.value);
          if (isNaN(num)) {
            return { parsed: null, error: "Invalid number format" };
          }
          if (variable.minValue !== undefined && num < variable.minValue) {
            return { parsed: null, error: `Value ${num} is less than minimum ${variable.minValue}` };
          }
          if (variable.maxValue !== undefined && num > variable.maxValue) {
            return { parsed: null, error: `Value ${num} exceeds maximum ${variable.maxValue}` };
          }
          return { parsed: num, error: null };

        case "DATE":
          const date = new Date(input.value);
          if (isNaN(date.getTime())) {
            return { parsed: null, error: "Invalid date format" };
          }
          if (variable.minDate && date < new Date(variable.minDate)) {
            return { parsed: null, error: `Date is before minimum ${variable.minDate}` };
          }
          if (variable.maxDate && date > new Date(variable.maxDate)) {
            return { parsed: null, error: `Date is after maximum ${variable.maxDate}` };
          }
          return { parsed: date.toISOString(), error: null };

        case "SELECT":
          // Try parse as JSON array for multiple select
          let selectedValues: string[];
          try {
            const parsed = JSON.parse(input.value);
            selectedValues = Array.isArray(parsed) ? parsed : [input.value];
          } catch {
            selectedValues = [input.value];
          }

          // Validate against options
          const validOptions = variable.options || [];
          const invalidOptions = selectedValues.filter(v => !validOptions.includes(v));
          if (invalidOptions.length > 0) {
            return { parsed: null, error: `Invalid options: ${invalidOptions.join(", ")}` };
          }

          return {
            parsed: variable.multiple ? selectedValues : selectedValues[0],
            error: null,
          };

        default:
          return { parsed: null, error: `Unknown variable type: ${variable.type}` };
      }
    } catch (err) {
      return { parsed: null, error: `Parse error: ${err}` };
    }
  };

  // Helper: Validate value against constraints
  const validateValue = (
    value: any,
    variable: Types.TemplateVariablePothosUnion
  ): string | null => {
    if (value === null) return null;

    switch (variable.type) {
      case "TEXT":
        if (typeof value !== "string") return "Expected string";
        if (variable.minLength && value.length < variable.minLength) {
          return `Length ${value.length} is less than minimum ${variable.minLength}`;
        }
        if (variable.maxLength && value.length > variable.maxLength) {
          return `Length ${value.length} exceeds maximum ${variable.maxLength}`;
        }
        if (variable.pattern && !new RegExp(variable.pattern).test(value)) {
          return `Does not match pattern`;
        }
        return null;

      case "NUMBER":
        if (typeof value !== "number") return "Expected number";
        if (variable.minValue !== undefined && value < variable.minValue) {
          return `Value ${value} is less than minimum ${variable.minValue}`;
        }
        if (variable.maxValue !== undefined && value > variable.maxValue) {
          return `Value ${value} exceeds maximum ${variable.maxValue}`;
        }
        return null;

      case "DATE":
        const dateValue = typeof value === "string" ? new Date(value) : value;
        if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
          return "Expected valid date";
        }
        if (variable.minDate && dateValue < new Date(variable.minDate)) {
          return `Date is before minimum`;
        }
        if (variable.maxDate && dateValue > new Date(variable.maxDate)) {
          return `Date is after maximum`;
        }
        return null;

      case "SELECT":
        const values = Array.isArray(value) ? value : [value];
        const validOptions = variable.options || [];
        const invalid = values.filter(v => !validOptions.includes(v));
        if (invalid.length > 0) {
          return `Invalid options: ${invalid.join(", ")}`;
        }
        return null;

      default:
        return null;
    }
  };
}
```


Export from `server/db/repo/index.ts`

## 4. Add Mutations

Create `/workspaces/workspaces/server/graphql/mutation/recipientVariableValue.mutation.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { GraphQLError } from "graphql";
import { RecipientVariableValueRepository } from "@/server/db/repo";
import {
  RecipientWithVariableValuesPothosObject,
  VariableValueInputPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.mutationField("setRecipientVariableValues", t =>
  t.field({
    type: RecipientWithVariableValuesPothosObject,
    nullable: true,
    description: "Update variable values. Returns null if validation fails. Check errors for details.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
      values: t.arg({
        type: [VariableValueInputPothosObject],
        required: true,
      }),
    },
    resolve: async (_, args, context) => {
      const result = await RecipientVariableValueRepository.upsertVariableValues(
        args.recipientGroupItemId,
        args.values
      );

      // If validation errors, add to GraphQL errors with extensions
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          throw new GraphQLError(
            `Validation error for "${err.studentName}" - variable "${err.variableName}": ${err.error}`,
            {
              extensions: {
                code: "VARIABLE_VALUE_VALIDATION_ERROR",
                recipientGroupItemId: err.recipientGroupItemId,
                studentName: err.studentName,
                variableId: err.variableId,
                variableName: err.variableName,
                expectedType: err.expectedType,
                actualValue: err.actualValue,
                error: err.error,
              },
            }
          );
        });
      }

      return result.data;
    },
  })
);
```

## 5. Add Queries

Create `/workspaces/workspaces/server/graphql/query/recipientVariableValue.query.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { GraphQLError } from "graphql";
import { RecipientVariableValueRepository } from "@/server/db/repo";
import { RecipientWithVariableValuesPothosObject } from "../pothos/recipientVariableValue.pothos";

// Single recipient
gqlSchemaBuilder.queryField("recipientVariableValues", t =>
  t.field({
    type: RecipientWithVariableValuesPothosObject,
    nullable: true,
    description: "Get variable values for a recipient. Returns null if data has validation errors. Check errors extension for details.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => {
      const result = await RecipientVariableValueRepository.findByRecipientGroupItemId(
        args.recipientGroupItemId
      );

      // If validation errors, throw GraphQL error
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          throw new GraphQLError(
            `Type mismatch for variable "${err.variableName}": ${err.error}`,
            {
              extensions: {
                code: "VARIABLE_VALUE_TYPE_MISMATCH",
                recipientGroupItemId: err.recipientGroupItemId,
                studentName: err.studentName,
                variableId: err.variableId,
                variableName: err.variableName,
                expectedType: err.expectedType,
                actualValue: err.actualValue,
              },
            }
          );
        });
      }

      return result.data;
    },
  })
);

// All recipients in group
gqlSchemaBuilder.queryField("recipientVariableValuesByGroup", t =>
  t.field({
    type: [RecipientWithVariableValuesPothosObject],
    description: "Get all recipients with valid values. Invalid recipients excluded and returned as errors with extensions.",
    args: {
      recipientGroupId: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => {
      const result = await RecipientVariableValueRepository.findByRecipientGroupId(
        args.recipientGroupId
      );

      // If any validation errors, add to GraphQL errors
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          throw new GraphQLError(
            `Invalid data for "${err.studentName}" - variable "${err.variableName}": ${err.error}`,
            {
              extensions: {
                code: "VARIABLE_VALUE_TYPE_MISMATCH",
                recipientGroupItemId: err.recipientGroupItemId,
                studentName: err.studentName,
                variableId: err.variableId,
                variableName: err.variableName,
                expectedType: err.expectedType,
                actualValue: err.actualValue,
              },
            }
          );
        });
      }

      return result.data;
    },
  })
);
```

## 6. Update Index Files

- Export types from `server/types/index.ts`
- Export repository from `server/db/repo/index.ts`
- Import Pothos objects in `server/graphql/pothos/index.ts`
- Import mutations/queries in schema

## Frontend Usage Pattern

### 1. Fetch Template Variables (once, with order!)

```tsx
const { data: templateData } = useQuery(GET_TEMPLATE_VARIABLES, {
  variables: { templateId: 123 }
});

// Sort by order field for proper column order
const sortedVariables = [...templateData.templateVariables]
  .sort((a, b) => a.order - b.order);
```

### 2. Generate Table Columns from Variables

```tsx
const columns = useMemo(() => 
  sortedVariables.map(variable => ({
    id: `var_${variable.id}`,
    type: variable.type.toLowerCase(), // "TEXT" -> "text"
    label: variable.name,
    accessor: (row) => row.variableValues[variable.id], // O(1) map access!
    editable: true,
    sortable: false,
    filterable: false,
    resizable: true,
    // For select type
    options: variable.type === "SELECT" 
      ? variable.options.map(opt => ({ label: opt, value: opt }))
      : undefined,
    // Update handler
    onUpdate: async (rowId, value) => {
      await updateVariableValue(rowId, variable.id, value);
    },
    // Validator using variable constraints
    getIsValid: (value) => {
      if (variable.required && !value) return "Required";
      if (variable.type === "TEXT" && variable.minLength && value.length < variable.minLength) {
        return `Minimum ${variable.minLength} characters`;
      }
      // ... other validations
      return null;
    },
  })),
  [sortedVariables]
);
```

### 3. Fetch Recipients with Error Handling

```tsx
const { data, error } = useQuery(GET_RECIPIENTS_WITH_VALUES, {
  variables: { recipientGroupId: 456 }
});

// Check for validation errors (invalid recipients excluded from data)
useEffect(() => {
  if (error?.graphQLErrors) {
    const invalidRows = error.graphQLErrors
      .filter(e => e.extensions?.code === "VARIABLE_VALUE_TYPE_MISMATCH")
      .map(e => ({
        studentName: e.extensions.studentName,
        recipientGroupItemId: e.extensions.recipientGroupItemId,
        variableId: e.extensions.variableId,
        variableName: e.extensions.variableName,
        error: e.extensions.error,
      }));
    
    if (invalidRows.length > 0) {
      // Show dialog: "X students have invalid data. Click to fix."
      showInvalidDataDialog(invalidRows);
    }
  }
}, [error]);
```

### 4. Use in Table

```tsx
<TableProvider 
  data={data?.recipientVariableValuesByGroup || []} 
  columns={columns}
  isLoading={loading}
  {...otherProps}
>
  <Table />
</TableProvider>
```

## Key Benefits

1. **Efficient access** - Map structure gives O(1) column access
2. **Simple GraphQL** - JSON type, no complex unions
3. **Consistent rendering** - All variables present in map (null if not set)
4. **Strict validation** - Invalid data caught, frontend prompted to fix
5. **Clean separation** - Values vs. definitions fetched separately
6. **Frontend friendly** - Data structure matches table component perfectly

### To-dos

- [ ] Create recipientVariableValue.types.ts with map-based types and validation error types
- [ ] Create recipientVariableValue.pothos.ts with simplified JSON-based objects
- [ ] Create recipientVariableValue.repository.ts with findByRecipientGroupItemId, findByRecipientGroupId, upsert, and helper functions for validation
- [ ] Create recipientVariableValue.mutation.ts with setRecipientVariableValues mutation that throws errors for invalid data
- [ ] Create recipientVariableValue.query.ts with recipientVariableValues and recipientVariableValuesByGroup queries that throw errors for invalid data
- [ ] Update index files to export types, repository, and import Pothos objects