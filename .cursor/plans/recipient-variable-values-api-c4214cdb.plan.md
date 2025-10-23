<!-- c4214cdb-c8ee-45ef-9024-a257f714d7ef 56132763-8303-457a-89eb-aa19e9d5aa55 -->
# Clean Recipient Variable Values API

## Design Philosophy

**Separation of concerns:**

- Variable **values** (this API) - just the data as a map
- Variable **definitions** (separate query) - constraints, types, order, etc.
- Frontend fetches both, maps them together to build table columns
- Backend validates types in repository, **automatically fixes invalid data** by setting to null
- **Auto-healing**: Invalid fields are set to null in DB, then valid data is returned (no invalidData in response)
- Single batch update: Repository collects all fixes and performs one INSERT operation before returning

**Key improvements:**

- Use **map structure** (not array) for O(1) column access
- Simplified GraphQL (JSON type, no discriminated unions)
- All template variables present in map (even if null) for consistent rendering
- **Auto-fix validation**: Invalid fields automatically set to null and saved to DB
- **Simplified types**: No invalidData in return types - just clean data
- **Batch updates**: Collect all fixes, perform single INSERT before returning data
- **Pagination & Filtering**: All list queries support pagination and filtering for scalability

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

// Simplified results - no invalidData, auto-fixed in DB
export type RecipientVariableValuesGroupResult = {
  data: RecipientWithVariableValues[];
  total: number;
};
```

Export from `server/types/index.ts`

## 2. Create Pothos Objects

Create `/workspaces/workspaces/server/graphql/pothos/recipientVariableValue.pothos.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";

// Recipient row for table
const RecipientWithVariableValuesRef = gqlSchemaBuilder
  .objectRef<Types.RecipientWithVariableValues>("RecipientWithVariableValues");

export const RecipientWithVariableValuesPothosObject = RecipientWithVariableValuesRef.implement({
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
const VariableValueInputRef = gqlSchemaBuilder
  .inputRef<Types.VariableValueInput>("VariableValueInput");

export const VariableValueInputPothosObject = VariableValueInputRef.implement({
  fields: t => ({
    variableId: t.int({ required: true }),
    value: t.string({
      required: true,
      description: "Value as string. Backend parses to correct type. For SELECT multiple: JSON array string like '[\"opt1\",\"opt2\"]'",
    }),
  }),
});

// Simplified result objects - no invalidData
const RecipientVariableValuesGroupResultRef = gqlSchemaBuilder
  .objectRef<Types.RecipientVariableValuesGroupResult>("RecipientVariableValuesGroupResult");
export const RecipientVariableValuesGroupResultPothosObject = RecipientVariableValuesGroupResultRef.implement({
  fields: t => ({
    data: t.field({ type: [RecipientWithVariableValuesRef] }),
    total: t.exposeInt("total"),
  }),
});
```

Export from `server/graphql/pothos/index.ts`

## 3. Create Repository

Create `/workspaces/workspaces/server/db/repo/recipientVariableValue.repository.ts`:

**Core responsibilities:**

1. Fetch JSONB values from database
2. Fetch template variable definitions to know types
3. Transform JSONB to map with ALL variables (null if not set)
4. **Validate types - collect invalid fields that need fixing**
5. **Batch update DB: Set all invalid fields to null in one INSERT operation**
6. Return clean, valid data only
```typescript
import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import * as DB from "@/server/db";
import { eq } from "drizzle-orm";
import { TemplateVariableRepository } from "./templateVariable.repository";

export namespace RecipientVariableValueRepository {
  
  // Get values for single recipient
  export const findByRecipientGroupItemId = async (
    recipientGroupItemId: number
  ): Promise<Types.RecipientWithVariableValues | null> => {
    // 1. Fetch recipient group item with student name
    const recipientItem = await db
      .select({
        id: DB.templateRecipientGroupItems.id,
        recipientGroupId: DB.templateRecipientGroupItems.recipientGroupId,
        studentId: DB.templateRecipientGroupItems.studentId,
        studentName: DB.students.name,
      })
      .from(DB.templateRecipientGroupItems)
      .leftJoin(DB.students, eq(DB.templateRecipientGroupItems.studentId, DB.students.id))
      .where(eq(DB.templateRecipientGroupItems.id, recipientGroupItemId))
      .limit(1);

    if (!recipientItem[0]) return null;

    const item = recipientItem[0];

    // 2. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: DB.templateRecipientGroups.templateId })
      .from(DB.templateRecipientGroups)
      .where(eq(DB.templateRecipientGroups.id, item.recipientGroupId))
      .limit(1);

    if (!group[0]) return null;

    // 3. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(group[0].templateId);

    // 4. Fetch JSONB values
    const valueRow = await db
      .select()
      .from(DB.recipientGroupItemVariableValues)
      .where(eq(DB.recipientGroupItemVariableValues.templateRecipientGroupItemId, recipientGroupItemId))
      .limit(1);

    const jsonbValues = valueRow[0]?.variableValues || {};

    // 5. Transform to map and collect invalid fields
    const { values, invalidFields } = transformAndValidateJsonb(
      jsonbValues,
      variables,
      item.id
    );

    // 6. If there are invalid fields, fix them in DB (set to null)
    if (invalidFields.length > 0 && valueRow[0]) {
      const fixedJsonb = { ...jsonbValues };
      for (const fieldId of invalidFields) {
        delete fixedJsonb[fieldId]; // Remove invalid entries
      }
      
      await db
        .update(DB.recipientGroupItemVariableValues)
        .set({
          variableValues: fixedJsonb,
          updatedAt: new Date(),
        })
        .where(eq(DB.recipientGroupItemVariableValues.id, valueRow[0].id));
    }

    return {
      recipientGroupItemId: item.id,
      studentId: item.studentId,
      studentName: item.studentName || "Unknown",
      variableValues: values,
    };
  };

  // Get values for all recipients in group (table-ready with pagination)
  export const findByRecipientGroupId = async (
    recipientGroupId: number,
    pagination?: { limit?: number; offset?: number }
  ): Promise<Types.RecipientVariableValuesGroupResult> => {
    // 1. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: DB.templateRecipientGroups.templateId })
      .from(DB.templateRecipientGroups)
      .where(eq(DB.templateRecipientGroups.id, recipientGroupId))
      .limit(1);

    if (!group[0]) return { data: [], total: 0 };

    // 2. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(group[0].templateId);

    // 3. Fetch all recipients with student names (with pagination)
    let recipientsQuery = db
      .select({
        id: DB.templateRecipientGroupItems.id,
        studentId: DB.templateRecipientGroupItems.studentId,
        studentName: DB.students.name,
      })
      .from(DB.templateRecipientGroupItems)
      .leftJoin(DB.students, eq(DB.templateRecipientGroupItems.studentId, DB.students.id))
      .where(eq(DB.templateRecipientGroupItems.recipientGroupId, recipientGroupId));

    if (pagination?.limit) {
      recipientsQuery = recipientsQuery.limit(pagination.limit);
    }
    if (pagination?.offset) {
      recipientsQuery = recipientsQuery.offset(pagination.offset);
    }

    const recipients = await recipientsQuery;

    // Get total count
    const total = await db.$count(
      DB.templateRecipientGroupItems,
      eq(DB.templateRecipientGroupItems.recipientGroupId, recipientGroupId)
    );

    // 4. Fetch all JSONB values
    const valueRows = await db
      .select()
      .from(DB.recipientGroupItemVariableValues)
      .where(eq(DB.recipientGroupItemVariableValues.recipientGroupId, recipientGroupId));

    const valuesMap = new Map(
      valueRows.map(row => [row.templateRecipientGroupItemId, { jsonb: row.variableValues, dbId: row.id }])
    );

    // 5. Transform each recipient and collect fixes
    const recipientsData: Types.RecipientWithVariableValues[] = [];
    const fixesToApply: Array<{ dbId: number; fixedJsonb: any }> = [];

    for (const recipient of recipients) {
      const valueData = valuesMap.get(recipient.id);
      const jsonbValues = valueData?.jsonb || {};
      
      const { values, invalidFields } = transformAndValidateJsonb(
        jsonbValues,
        variables,
        recipient.id
      );

      // Collect fixes for this recipient
      if (invalidFields.length > 0 && valueData?.dbId) {
        const fixedJsonb = { ...jsonbValues };
        for (const fieldId of invalidFields) {
          delete fixedJsonb[fieldId]; // Remove invalid entries
        }
        fixesToApply.push({ dbId: valueData.dbId, fixedJsonb });
      }

      recipientsData.push({
        recipientGroupItemId: recipient.id,
        studentId: recipient.studentId,
        studentName: recipient.studentName || "Unknown",
        variableValues: values,
      });
    }

    // 6. Apply all fixes in a single batch update
    if (fixesToApply.length > 0) {
      await db.transaction(async (tx) => {
        for (const fix of fixesToApply) {
          await tx
            .update(DB.recipientGroupItemVariableValues)
            .set({
              variableValues: fix.fixedJsonb,
              updatedAt: new Date(),
            })
            .where(eq(DB.recipientGroupItemVariableValues.id, fix.dbId));
        }
      });
    }

    return { data: recipientsData, total };
  };

  // Upsert values with validation (uses transaction)
  export const upsertVariableValues = async (
    recipientGroupItemId: number,
    values: Types.VariableValueInput[]
  ): Promise<Types.RecipientWithVariableValues> => {
    return await db.transaction(async (tx) => {
      // 1. Fetch recipient + template ID
      const recipientItem = await tx
        .select({
          id: DB.templateRecipientGroupItems.id,
          recipientGroupId: DB.templateRecipientGroupItems.recipientGroupId,
          studentId: DB.templateRecipientGroupItems.studentId,
          studentName: DB.students.name,
        })
        .from(DB.templateRecipientGroupItems)
        .leftJoin(DB.students, eq(DB.templateRecipientGroupItems.studentId, DB.students.id))
        .where(eq(DB.templateRecipientGroupItems.id, recipientGroupItemId))
        .limit(1);

      if (!recipientItem[0]) {
        throw new Error(`Recipient group item ${recipientGroupItemId} not found`);
      }

      const item = recipientItem[0];

      const group = await tx
        .select({ templateId: DB.templateRecipientGroups.templateId })
        .from(DB.templateRecipientGroups)
        .where(eq(DB.templateRecipientGroups.id, item.recipientGroupId))
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

      // 4. Parse and validate inputs - throw on first error
      const parsedValues: { [key: string]: { type: string; value: any } } = {};

      for (const input of values) {
        const variable = variablesById.get(input.variableId)!;
        const parseResult = parseInputValue(input, variable);

        if (parseResult.error) {
          throw new Error(`Variable ${variable.name}: ${parseResult.error}`);
        }
        
        parsedValues[input.variableId] = {
          type: variable.type,
          value: parseResult.parsed,
        };
      }

      // 5. Fetch current JSONB
      const currentRow = await tx
        .select()
        .from(DB.recipientGroupItemVariableValues)
        .where(eq(DB.recipientGroupItemVariableValues.templateRecipientGroupItemId, recipientGroupItemId))
        .limit(1);

      const currentValues = currentRow[0]?.variableValues || {};

      // 6. Merge and save
      const mergedValues = { ...currentValues, ...parsedValues };

      if (currentRow[0]) {
        await tx
          .update(DB.recipientGroupItemVariableValues)
          .set({
            variableValues: mergedValues,
            updatedAt: new Date(),
          })
          .where(eq(DB.recipientGroupItemVariableValues.id, currentRow[0].id));
      } else {
        await tx.insert(DB.recipientGroupItemVariableValues).values({
          templateRecipientGroupItemId: recipientGroupItemId,
          templateId: group[0].templateId,
          recipientGroupId: item.recipientGroupId,
          studentId: item.studentId,
          variableValues: mergedValues,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 7. Return result (will be clean since we just saved validated data)
      const result = await findByRecipientGroupItemId(recipientGroupItemId);
      if (!result) {
        throw new Error("Failed to fetch updated values");
      }
      return result;
    });
  };

  // Helper: Transform JSONB to map and collect invalid field IDs
  const transformAndValidateJsonb = (
    jsonbValue: any,
    variables: Types.TemplateVariablePothosUnion[],
    recipientGroupItemId: number
  ): {
    values: Types.VariableValuesMap;
    invalidFields: number[];
  } => {
    const values: Types.VariableValuesMap = {};
    const invalidFields: number[] = [];

    // Initialize all variables with null (or [] for SELECT multiple)
    for (const variable of variables) {
      if (variable.type === Types.TemplateVariableType.SELECT && (variable as any).multiple) {
        values[variable.id] = [];
      } else {
        values[variable.id] = null;
      }
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
        invalidFields.push(variable.id);
        continue; // Keep null
      }

      // Type-specific validation
      const validationError = validateValue(actualValue, variable);
      if (validationError) {
        invalidFields.push(variable.id);
        continue; // Keep null
      }

      // Valid - assign value
      values[variable.id] = actualValue;
    }

    return { values, invalidFields };
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
        case Types.TemplateVariableType.TEXT:
          // Validate pattern if exists (patterns should be sanitized at create/update)
          if (variable.pattern) {
            try {
              const re = new RegExp(variable.pattern);
              if (!re.test(input.value)) {
                return { parsed: null, error: `Does not match pattern: ${variable.pattern}` };
              }
            } catch {
              return { parsed: null, error: "Invalid pattern configuration" };
            }
          }
          return { parsed: input.value, error: null };

        case Types.TemplateVariableType.NUMBER:
          const num = parseFloat(input.value);
          if (isNaN(num)) {
            return { parsed: null, error: "Invalid number format" };
          }
          if (variable.decimalPlaces !== undefined && variable.decimalPlaces !== null) {
            const decimals = (Math.abs(num).toString().split(".")[1] || "").length;
            if (decimals > (variable.decimalPlaces as number)) {
              return { parsed: null, error: `Too many decimal places (max ${variable.decimalPlaces})` };
            }
          }
          if (variable.minValue !== undefined && num < variable.minValue) {
            return { parsed: null, error: `Value ${num} is less than minimum ${variable.minValue}` };
          }
          if (variable.maxValue !== undefined && num > variable.maxValue) {
            return { parsed: null, error: `Value ${num} exceeds maximum ${variable.maxValue}` };
          }
          return { parsed: num, error: null };

        case Types.TemplateVariableType.DATE:
          const date = new Date(input.value);
          if (isNaN(date.getTime())) {
            return { parsed: null, error: "Invalid date format" };
          }
          if (variable.minDate) {
            const minDate = new Date(variable.minDate);
            if (date < minDate) {
              return { parsed: null, error: `Date is before minimum ${variable.minDate}` };
            }
          }
          if (variable.maxDate) {
            const maxDate = new Date(variable.maxDate);
            if (date > maxDate) {
              return { parsed: null, error: `Date is after maximum ${variable.maxDate}` };
            }
          }
          return { parsed: date.toISOString(), error: null };

        case Types.TemplateVariableType.SELECT:
          // Try parse as JSON array for multiple select
          let selectedValues: string[];
          try {
            const parsed = JSON.parse(input.value);
            selectedValues = Array.isArray(parsed) ? parsed : [input.value];
          } catch {
            selectedValues = [input.value];
          }

          // Validate against options
          const validOptions = (variable as any).options || [];
          const invalidOptions = selectedValues.filter(v => !validOptions.includes(v));
          if (invalidOptions.length > 0) {
            return { parsed: null, error: `Invalid options: ${invalidOptions.join(", ")}` };
          }

          if ((variable as any).multiple) {
            return { parsed: selectedValues, error: null };
          } else {
            if (selectedValues.length > 1) {
              return { parsed: null, error: "Multiple values provided for single-select" };
            }
            return { parsed: selectedValues[0] ?? null, error: null };
          }

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
    // Absence of value is acceptable at query time; required is enforced in mutation/UI
    if (value === null) return null;

    switch (variable.type) {
      case Types.TemplateVariableType.TEXT:
        if (typeof value !== "string") return "Expected string";
        if (variable.minLength && value.length < variable.minLength) {
          return `Length ${value.length} is less than minimum ${variable.minLength}`;
        }
        if (variable.maxLength && value.length > variable.maxLength) {
          return `Length ${value.length} exceeds maximum ${variable.maxLength}`;
        }
        // Pattern correctness is validated on create/update; skip pattern matching at query time
        return null;

      case Types.TemplateVariableType.NUMBER:
        if (typeof value !== "number") return "Expected number";
        if (variable.minValue !== undefined && value < variable.minValue) {
          return `Value ${value} is less than minimum ${variable.minValue}`;
        }
        if (variable.maxValue !== undefined && value > variable.maxValue) {
          return `Value ${value} exceeds maximum ${variable.maxValue}`;
        }
        if (variable.decimalPlaces !== undefined && variable.decimalPlaces !== null) {
          const decimals = (Math.abs(value).toString().split(".")[1] || "").length;
          if (decimals > (variable.decimalPlaces as number)) {
            return `Too many decimal places (max ${variable.decimalPlaces})`;
          }
        }
        return null;

      case Types.TemplateVariableType.DATE:
        // Handle both string and Date objects
        let dateValue: Date;
        if (typeof value === "string") {
          dateValue = new Date(value);
        } else if (value instanceof Date) {
          dateValue = value;
        } else {
          return "Expected valid date";
        }
        
        if (isNaN(dateValue.getTime())) {
          return "Expected valid date";
        }
        
        if (variable.minDate) {
          const minDate = new Date(variable.minDate);
          if (dateValue < minDate) {
            return `Date is before minimum`;
          }
        }
        if (variable.maxDate) {
          const maxDate = new Date(variable.maxDate);
          if (dateValue > maxDate) {
            return `Date is after maximum`;
          }
        }
        return null;

      case Types.TemplateVariableType.SELECT:
        const isMultiple = (variable as any).multiple;
        if (isMultiple) {
          const values = Array.isArray(value) ? value : [value];
          const validOptions = (variable as any).options || [];
          const invalid = values.filter(v => !validOptions.includes(v));
          if (invalid.length > 0) {
            return `Invalid options: ${invalid.join(", ")}`;
          }
          return null;
        } else {
          if (Array.isArray(value)) return "Expected single value";
          const validOptions = (variable as any).options || [];
          if (!validOptions.includes(value)) return `Invalid options: ${value}`;
          return null;
        }

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
import { RecipientVariableValueRepository } from "@/server/db/repo";
import {
  RecipientVariableValuesMutationResultPothosObject,
  VariableValueInputPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.mutationFields(t => ({
  setRecipientVariableValues: t.field({
    type: RecipientWithVariableValuesPothosObject,
    authScopes: { loggedIn: true },
    description: "Update variable values. Throws on validation errors.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
      values: t.arg({ type: [VariableValueInputPothosObject], required: true }),
    },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.upsertVariableValues(
        args.recipientGroupItemId,
        args.values
      ),
  }),
}));
```

Import in `server/graphql/mutation/index.ts`

## 5. Add Queries

Create `/workspaces/workspaces/server/graphql/query/recipientVariableValue.query.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { RecipientVariableValueRepository } from "@/server/db/repo";
import {
  RecipientVariableValuesResultPothosObject,
  RecipientVariableValuesGroupResultPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.queryFields(t => ({
  // Single recipient (auto-fixes invalid data)
  recipientVariableValues: t.field({
    type: RecipientWithVariableValuesPothosObject,
    nullable: true,
    authScopes: { loggedIn: true },
    description:
      "Get variable values for a recipient. Auto-fixes invalid data by setting to null.",
    args: { recipientGroupItemId: t.arg.int({ required: true }) },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.findByRecipientGroupItemId(
        args.recipientGroupItemId
      ),
  }),

  // All recipients in group (with pagination, auto-fixes invalid data)
  recipientVariableValuesByGroup: t.field({
    type: RecipientVariableValuesGroupResultPothosObject,
    authScopes: { loggedIn: true },
    description:
      "Get all recipients with values. Auto-fixes invalid data by setting to null. Supports pagination.",
    args: {
      recipientGroupId: t.arg.int({ required: true }),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.findByRecipientGroupId(
        args.recipientGroupId,
        { limit: args.limit ?? undefined, offset: args.offset ?? undefined }
      ),
  }),
}));
```

Import in `server/graphql/query/index.ts`

## 6. Update Index Files

### Update `server/types/index.ts`

```typescript
export * from "./recipientVariableValue.types";
```

### Update `server/db/repo/index.ts`

```typescript
export { RecipientVariableValueRepository } from "./recipientVariableValue.repository";
```

### Update `server/graphql/pothos/index.ts`

```typescript
import "./recipientVariableValue.pothos";
```

### Update `server/graphql/mutation/index.ts`

```typescript
import "./recipientVariableValue.mutation";
```

### Update `server/graphql/query/index.ts`

```typescript
import "./recipientVariableValue.query";
```

## 7. Add JSON Scalar Type

### Create `server/graphql/scalars/jsonScalar.ts`

```typescript
import { GraphQLScalarType, Kind, type ValueNode } from "graphql";

// Pothos custom scalar for JSON
export const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "A type representing arbitrary JSON values",
  serialize(value: unknown): any {
    return value; // Return as-is for JSON
  },
  parseValue(value: unknown): any {
    return value; // Accept any JSON value
  },
  parseLiteral(ast: ValueNode, variables?: { [key: string]: any }): any {
    // Parse JSON literals from GraphQL queries
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT:
        return ast.fields.reduce((acc, field) => {
          // @ts-ignore - recursive call
          acc[field.name.value] = JSONScalar.parseLiteral(
            field.value as ValueNode,
            variables
          );
          return acc;
        }, {} as Record<string, any>);
      case Kind.LIST:
        return ast.values.map(v =>
          // @ts-ignore - recursive call
          JSONScalar.parseLiteral(v as ValueNode, variables)
        );
      case Kind.NULL:
        return null;
      default:
        return null;
    }
  },
});
```

### Update `server/graphql/gqlSchemaBuilder.ts`

Add JSON to Scalars interface:

```typescript
export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: BaseContext;
  AuthScopes: {
    loggedIn: boolean;
    admin: boolean;
    role: string;
  };
  AuthContexts: AuthContexts;
  Scalars: {
    DateTime: { Input: Date; Output: Date | string };
    Date: { Input: Date; Output: Date };
    JSON: { Input: any; Output: any }; // Add this line
    // use following scalars for input types only for automatic validation
    PhoneNumber: { Input: PhoneNumber; Output: PhoneNumber };
    Email: { Input: Email; Output: Email };
  };
}
```

### Update `server/graphql/gqlSchema.ts`

Add JSON scalar import and registration:

```typescript
import "./query";
import "./mutation";

import { gqlSchemaBuilder } from "./gqlSchemaBuilder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";
import { PhoneNumberScalar } from "./scalars/phoneNumberScalar";
import { EmailScalar } from "./scalars/emailScalar";
import { JSONScalar } from "./scalars/jsonScalar"; // Add this line

gqlSchemaBuilder.addScalarType("Date", DateResolver, {});
gqlSchemaBuilder.addScalarType("DateTime", DateTimeResolver, {});
gqlSchemaBuilder.addScalarType("PhoneNumber", PhoneNumberScalar);
gqlSchemaBuilder.addScalarType("Email", EmailScalar);
gqlSchemaBuilder.addScalarType("JSON", JSONScalar); // Add this line

gqlSchemaBuilder.mutationType({});

gqlSchemaBuilder.queryType({});

export const graphQLSchema = gqlSchemaBuilder.toSchema();
```

## Frontend Usage Pattern

### 1. Fetch Template Variables (once, with order!)

```tsx
const { data: templateData } = useQuery(GET_TEMPLATE_VARIABLES, {
  variables: { templateId: 123 }
});

// Variables are already sorted by order field (order field cannot be null)
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

### 3. Fetch Recipients (simplified - no error handling needed)

```tsx
const { data } = useQuery(GET_RECIPIENTS_WITH_VALUES, {
  variables: { 
    recipientGroupId: 456,
    limit: 50,
    offset: 0,
  }
});

// Data is clean - invalid fields already fixed in DB
const recipients = data?.recipientVariableValuesByGroup.data ?? [];
const total = data?.recipientVariableValuesByGroup.total ?? 0;
```

### 4. Use in Table

```tsx
<TableProvider 
  data={recipients} 
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
4. **Auto-healing** - Invalid data automatically fixed in DB (set to null)
5. **Clean separation** - Values vs. definitions fetched separately
6. **Frontend friendly** - Data structure matches table component perfectly, no error handling needed
7. **Scalable** - Pagination and filtering support for large recipient groups
8. **Transaction safety** - Upsert operations wrapped in database transactions
9. **Simplified types** - No invalidData in return types, cleaner API
10. **Batch fixes** - All DB fixes collected and applied in single transaction

### To-dos

- [ ] Create recipientVariableValue.types.ts with map-based types and simplified result types (no invalidData)
- [ ] Create recipientVariableValue.pothos.ts with JSON-based objects, simplified wrapper result Pothos objects, and proper naming (*PothosObject suffix)
- [ ] Create recipientVariableValue.repository.ts with auto-fix logic (collect invalid fields, batch update DB to set to null), db.$count for totals, parse/validate implementing edge cases, and SELECT multiple default value []
- [ ] Create recipientVariableValue.mutation.ts using gqlSchemaBuilder.mutationFields, authScopes, returning clean object (throws on validation errors)
- [ ] Create recipientVariableValue.query.ts using gqlSchemaBuilder.queryFields, authScopes, returning simplified objects (auto-fixes invalid data), with pagination args and total
- [ ] Create jsonScalar.ts for JSON scalar with typed parseLiteral(ast: ValueNode, variables?)
- [ ] Update gqlSchemaBuilder.ts to add JSON to Scalars interface
- [ ] Update gqlSchema.ts to register JSON scalar
- [ ] Update server/types/index.ts to export recipientVariableValue types
- [ ] Update server/db/repo/index.ts to export RecipientVariableValueRepository
- [ ] Update server/graphql/pothos/index.ts to import recipientVariableValue.pothos
- [ ] Update server/graphql/mutation/index.ts to import recipientVariableValue.mutation
- [ ] Update server/graphql/query/index.ts to import recipientVariableValue.query
- [ ] SELECT single: reject multi-value input
- [ ] NUMBER: enforce decimalPlaces and bounds
- [ ] DATE: reject invalid ISO; accept timezone offsets and normalize to ISO string
- [ ] Required fields: not enforced at query time; enforced only on mutation/UI flows
- [ ] TEXT pattern: sanitize/validate patterns at variable create/update; guard in parse with try/catch
- [ ] Type mismatch: Set field to null in DB
- [ ] Validation failure: Set field to null in DB
- [ ] Batch all fixes per query and apply in single transaction
- [ ] Return clean data with nulls for fixed fields