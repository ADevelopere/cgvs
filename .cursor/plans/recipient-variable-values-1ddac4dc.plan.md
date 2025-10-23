<!-- 1ddac4dc-47a2-444c-adaf-a2980946bf80 69fad9c7-0f0f-4146-9cd1-2f3629e7e82d -->
# Clean Recipient Variable Values API

## Design Philosophy

**Separation of concerns:**

- Variable **values** (this API) - just the data
- Variable **definitions** (separate query) - constraints, types, etc.
- Frontend fetches both, maps them together
- Backend validates types in repository, reports errors via GraphQL extensions
- Invalid data returns with errors but doesn't crash - frontend can prompt fixes

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

// Simple value objects (no template constraints, just values)
export type TextVariableValue = {
  variableId: number;
  value: string | null;
};

export type NumberVariableValue = {
  variableId: number;
  value: number | null;
};

export type DateVariableValue = {
  variableId: number;
  value: Date | null;
};

export type SelectVariableValue = {
  variableId: number;
  value: string | string[] | null;
};

// Union (GraphQL will return correct type based on actual variable definition)
export type VariableValue =
  | TextVariableValue
  | NumberVariableValue
  | DateVariableValue
  | SelectVariableValue;

// Table row - recipient with their values
export type RecipientWithVariableValues = {
  recipientGroupItemId: number;
  studentId: number;
  studentName: string;
  variableValues: VariableValue[];
};

// Simple input (backend determines type from variable ID)
export type VariableValueInput = {
  variableId: number;
  value: string; // Always string, backend parses based on variable type
};

// Validation error info (for GraphQL extensions)
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

## 2. Create Pothos Objects

Create `/workspaces/workspaces/server/graphql/pothos/recipientVariableValue.pothos.ts`:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";

// Interface for all variable values (just variableId)
const VariableValueInterface = gqlSchemaBuilder
  .interfaceRef<Types.VariableValue>("VariableValue")
  .implement({
    fields: t => ({
      variableId: t.exposeInt("variableId", {
        description: "ID of the template variable this value belongs to",
      }),
    }),
  });

// Text value
export const TextVariableValuePothosObject = gqlSchemaBuilder
  .objectRef<Types.TextVariableValue>("TextVariableValue")
  .implement({
    interfaces: [VariableValueInterface],
    isTypeOf: (obj) => {
      // Repository ensures correct type, but check just in case
      return typeof obj === "object" && "value" in obj && 
             (typeof obj.value === "string" || obj.value === null);
    },
    fields: t => ({
      value: t.exposeString("value", {
        nullable: true,
        description: "Text value",
      }),
    }),
  });

// Number value
export const NumberVariableValuePothosObject = gqlSchemaBuilder
  .objectRef<Types.NumberVariableValue>("NumberVariableValue")
  .implement({
    interfaces: [VariableValueInterface],
    isTypeOf: (obj) => {
      return typeof obj === "object" && "value" in obj && 
             (typeof obj.value === "number" || obj.value === null);
    },
    fields: t => ({
      value: t.exposeFloat("value", {
        nullable: true,
        description: "Numeric value",
      }),
    }),
  });

// Date value
export const DateVariableValuePothosObject = gqlSchemaBuilder
  .objectRef<Types.DateVariableValue>("DateVariableValue")
  .implement({
    interfaces: [VariableValueInterface],
    isTypeOf: (obj) => {
      return typeof obj === "object" && "value" in obj && 
             (obj.value instanceof Date || obj.value === null);
    },
    fields: t => ({
      value: t.expose("value", {
        type: "DateTime",
        nullable: true,
        description: "Date value",
      }),
    }),
  });

// Select value
export const SelectVariableValuePothosObject = gqlSchemaBuilder
  .objectRef<Types.SelectVariableValue>("SelectVariableValue")
  .implement({
    interfaces: [VariableValueInterface],
    isTypeOf: (obj) => {
      return typeof obj === "object" && "value" in obj;
    },
    fields: t => ({
      value: t.field({
        type: ["String"],
        nullable: true,
        description: "Selected value(s) - array for multiple select, single item array for single select",
        resolve: (obj) => {
          if (obj.value === null) return null;
          return Array.isArray(obj.value) ? obj.value : [obj.value];
        },
      }),
    }),
  });

// Recipient row for table
export const RecipientWithVariableValuesPothosObject = gqlSchemaBuilder
  .objectRef<Types.RecipientWithVariableValues>("RecipientWithVariableValues")
  .implement({
    fields: t => ({
      recipientGroupItemId: t.exposeInt("recipientGroupItemId"),
      studentId: t.exposeInt("studentId"),
      studentName: t.exposeString("studentName"),
      variableValues: t.expose("variableValues", {
        type: [VariableValueInterface],
        description: "Array of variable values. Map with template variables query to get full info.",
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
3. Transform JSONB to typed union array
4. **Validate types match - collect errors instead of throwing**
5. Return data + validation errors separately
```typescript
import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import * as Db from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TemplateVariableRepository } from "./templateVariable.repository";
import logger from "@/server/lib/logger";

export namespace RecipientVariableValueRepository {
  
  // Get values for single recipient
  export const findByRecipientGroupItemId = async (
    recipientGroupItemId: number
  ): Promise<{
    values: Types.VariableValue[];
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch recipient to get template ID
    // 2. Fetch JSONB values
    // 3. Fetch template variables for type info
    // 4. Transform JSONB to typed array
    // 5. Validate each value matches expected type
    // 6. Collect validation errors (don't throw!)
    // 7. Return both values and errors
  };

  // Get values for all recipients in group (table-ready)
  export const findByRecipientGroupId = async (
    recipientGroupId: number
  ): Promise<{
    recipients: Types.RecipientWithVariableValues[];
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch all recipients with student names
    // 2. Fetch all JSONB values
    // 3. Fetch template variables for the template
    // 4. Transform each recipient's JSONB to typed array
    // 5. Validate types and collect errors across all recipients
    // 6. Return recipients + aggregated errors
  };

  // Upsert values with validation
  export const upsertVariableValues = async (
    recipientGroupItemId: number,
    values: Types.VariableValueInput[]
  ): Promise<{
    values: Types.VariableValue[];
    errors: Types.VariableValueValidationError[];
  }> => {
    // 1. Fetch recipient + template ID
    // 2. Fetch template variables
    // 3. Validate all variable IDs belong to template
    // 4. Parse each input value to correct type based on variable definition
    // 5. Validate parsed values (range checks, pattern, etc.)
    // 6. Fetch current JSONB, merge with new values
    // 7. Save to database
    // 8. Return typed values + any validation errors
  };

  // Helper: Transform JSONB value to typed object
  const transformValue = (
    variableId: number,
    jsonbValue: { type: string; value: any } | undefined,
    variable: Types.TemplateVariablePothosUnion
  ): {
    value: Types.VariableValue | null;
    error: Types.VariableValueValidationError | null;
  } => {
    // Based on variable.type, create appropriate typed object
    // Validate value type matches
    // Return value + error if type mismatch
  };

  // Helper: Parse string input to correct type
  const parseInputValue = (
    input: Types.VariableValueInput,
    variable: Types.TemplateVariablePothosUnion
  ): {
    parsed: any;
    error: string | null;
  } => {
    // TEXT: return string, validate pattern if exists
    // NUMBER: parse to number, validate range
    // DATE: parse to Date, validate range
    // SELECT: parse JSON if array, validate against options
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
  VariableValueInterface,
  VariableValueInputPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.mutationField("setRecipientVariableValues", t =>
  t.field({
    type: [VariableValueInterface],
    description: "Update variable values. Backend validates types. Returns values with errors in extensions if validation fails.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
      values: t.arg({
        type: [VariableValueInputPothosObject],
        required: true,
      }),
    },
    resolve: async (_, args, context, info) => {
      const result = await RecipientVariableValueRepository.upsertVariableValues(
        args.recipientGroupItemId,
        args.values
      );

      // If there are validation errors, add them to GraphQL errors
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          context.errors = context.errors || [];
          context.errors.push(
            new GraphQLError(
              `Validation error for variable "${err.variableName}": ${err.error}`,
              {
                extensions: {
                  code: "VARIABLE_VALUE_VALIDATION_ERROR",
                  recipientGroupItemId: err.recipientGroupItemId,
                  studentName: err.studentName,
                  variableId: err.variableId,
                  variableName: err.variableName,
                  expectedType: err.expectedType,
                  actualValue: err.actualValue,
                },
              }
            )
          );
        });
      }

      return result.values;
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
import {
  VariableValueInterface,
  RecipientWithVariableValuesPothosObject,
} from "../pothos/recipientVariableValue.pothos";

// Single recipient
gqlSchemaBuilder.queryField("recipientVariableValues", t =>
  t.field({
    type: [VariableValueInterface],
    description: "Get variable values for a recipient. Check errors extension for type mismatches.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
    },
    resolve: async (_, args, context) => {
      const result = await RecipientVariableValueRepository.findByRecipientGroupItemId(
        args.recipientGroupItemId
      );

      // Add validation errors to GraphQL errors
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          context.errors = context.errors || [];
          context.errors.push(
            new GraphQLError(
              `Type mismatch for variable "${err.variableName}": expected ${err.expectedType}`,
              {
                extensions: {
                  code: "VARIABLE_VALUE_TYPE_MISMATCH",
                  recipientGroupItemId: err.recipientGroupItemId,
                  variableId: err.variableId,
                  variableName: err.variableName,
                  expectedType: err.expectedType,
                  actualValue: err.actualValue,
                },
              }
            )
          );
        });
      }

      return result.values;
    },
  })
);

// All recipients in group
gqlSchemaBuilder.queryField("recipientVariableValuesByGroup", t =>
  t.field({
    type: [RecipientWithVariableValuesPothosObject],
    description: "Get all recipients with their values. Check errors extension for rows with type mismatches.",
    args: {
      recipientGroupId: t.arg.int({ required: true }),
    },
    resolve: async (_, args, context) => {
      const result = await RecipientVariableValueRepository.findByRecipientGroupId(
        args.recipientGroupId
      );

      // Add all validation errors
      if (result.errors.length > 0) {
        result.errors.forEach(err => {
          context.errors = context.errors || [];
          context.errors.push(
            new GraphQLError(
              `Type mismatch for "${err.studentName}" - variable "${err.variableName}": expected ${err.expectedType}`,
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
            )
          );
        });
      }

      return result.recipients;
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

### 1. Fetch Template Variables (once)

```tsx
const { data: templateData } = useQuery(GET_TEMPLATE_VARIABLES, {
  variables: { templateId: 123 }
});

// Map by ID for easy lookup
const variablesById = Object.fromEntries(
  templateData.templateVariables.map(v => [v.id, v])
);
```

### 2. Fetch Recipient Values

```tsx
const { data, error } = useQuery(GET_RECIPIENT_VARIABLE_VALUES_BY_GROUP, {
  variables: { recipientGroupId: 456 }
});

// Check for validation errors
if (error?.graphQLErrors) {
  const typeMismatches = error.graphQLErrors.filter(
    e => e.extensions?.code === "VARIABLE_VALUE_TYPE_MISMATCH"
  );
  
  if (typeMismatches.length > 0) {
    // Show notification: "Some data has type mismatches. Click to fix."
    showValidationErrorNotification(typeMismatches);
  }
}
```

### 3. Render Table

```tsx
data.recipientVariableValuesByGroup.map(row => (
  <tr key={row.recipientGroupItemId}>
    <td>{row.studentName}</td>
    {row.variableValues.map(varValue => {
      const varDef = variablesById[varValue.variableId];
      return (
        <td key={varValue.variableId}>
          {renderInput(varValue, varDef)}
        </td>
      );
    })}
  </tr>
));

function renderInput(value: VariableValue, definition: TemplateVariable) {
  // TypeScript narrows the union based on __typename
  if (value.__typename === "TextVariableValue") {
    return <input type="text" value={value.value} 
                  minLength={definition.minLength}
                  maxLength={definition.maxLength} />;
  }
  // ... etc
}
```

## Key Benefits

1. **No expensive joins** - Variable definitions queried separately, cached
2. **Type safety** - Discriminated unions with proper narrowing
3. **Graceful error handling** - Invalid data doesn't crash, shows in errors
4. **Clean separation** - Values vs. definitions
5. **Frontend friendly** - Get exactly what's needed for tables

### To-dos

- [ ] Create recipientVariableValue.types.ts with entity, Pothos definitions, input types, and wrapper types
- [ ] Create recipientVariableValue.pothos.ts with interface, concrete types, input objects, and wrapper object
- [ ] Create recipientVariableValue.repository.ts with findByRecipientGroupItemId, findByRecipientGroupId, upsert, delete, and helper functions
- [ ] Create recipientVariableValue.mutation.ts with setRecipientVariableValues mutation
- [ ] Create recipientVariableValue.query.ts with recipientVariableValues and recipientVariableValuesByGroup queries
- [ ] Update index files to export types, repository, and import Pothos objects