# DATE Element Pothos Implementation Plan

## Overview

Implement DATE element Pothos GraphQL layer following the TEXT and QR_CODE patterns, with isOneOf for data sources (4 variants) and deep partial update support.

## Current DATE Element Structure

**Complexity**: Medium (4 data source variants, uses TextProps, has mapping field)

**Enums**:

- `DateDataSourceType`: STATIC, TEMPLATE_DATE_VARIABLE, STUDENT_DATE_FIELD, CERTIFICATE_DATE_FIELD
- `StudentDateField`: DATE_OF_BIRTH
- `CertificateDateField`: RELEASE_DATE
- `CalendarType`: GREGORIAN, HIJRI

**Config Fields**:

- `textProps`: TextProps (shared, uses TextPropsObject from base)
- `calendarType`: CalendarType enum
- `offsetDays`: number
- `format`: string (e.g., "YYYY-MM-DD")
- `mapping`: Record<string, string> | undefined (optional custom mappings)
- `dataSource`: DateDataSource union (4 variants)

**Data Source Variants**:

1. STATIC: `{ type, value: string }`
2. STUDENT_DATE_FIELD: `{ type, field: StudentDateField }`
3. CERTIFICATE_DATE_FIELD: `{ type, field: CertificateDateField }`
4. TEMPLATE_DATE_VARIABLE: `{ type, variableId: number }`

## Step 1: Add GraphQL Input Types to `server/types/element/date.element.types.ts`

### 1.1: Add Individual Data Source Input Types (no discriminator)

Add after line 77 (after `DateDataSourceInput`):

```typescript
// GraphQL input types (used in Pothos isOneOf definitions)
export type DateDataSourceStaticInputGraphql = {
  value: string;
};

export type DateDataSourceStudentFieldInputGraphql = {
  field: StudentDateField;
};

export type DateDataSourceCertificateFieldInputGraphql = {
  field: CertificateDateField;
};

export type DateDataSourceTemplateVariableInputGraphql = {
  variableId: number;
};

export type DateDataSourceInputGraphql =
  | {
      static: DateDataSourceStaticInputGraphql;
      studentField?: never;
      certificateField?: never;
      templateVariable?: never;
    }
  | {
      studentField: DateDataSourceStudentFieldInputGraphql;
      static?: never;
      certificateField?: never;
      templateVariable?: never;
    }
  | {
      certificateField: DateDataSourceCertificateFieldInputGraphql;
      static?: never;
      studentField?: never;
      templateVariable?: never;
    }
  | {
      templateVariable: DateDataSourceTemplateVariableInputGraphql;
      static?: never;
      studentField?: never;
      certificateField?: never;
    };
```

### 1.2: Update Config Types

Replace lines 93-113 (the config type section):

```typescript
// GraphQL input type (type field omitted - implied by mutation)
export type DateElementConfigInputGraphql = {
  textProps: TextPropsInputGraphql;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  mapping?: Record<string, string> | null;
  dataSource: DateDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type DateElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  calendarType?: CalendarType;
  offsetDays?: number;
  format?: string;
  mapping?: Record<string, string> | null;
  dataSource?: DateDataSourceInputGraphql;
};

// Repository input type (matches Config structure)
export type DateElementConfigInput = {
  type: ElementType.DATE;
  textProps: TextPropsInput;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  mapping?: Record<string, string> | null;
  dataSource: DateDataSourceInput;
};
```

### 1.3: Add Missing Import

Add `TextPropsUpdateInputGraphql` to imports at the top:

```typescript
import {
  TextProps,
  TextPropsInput,
  TextPropsInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.types";
```

### 1.4: Add GraphQL Mutation Input Types

Add after `DateElementUpdateInput` (around line 134):

```typescript
// GraphQL create input type
export type DateElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: DateElementConfigInputGraphql;
};

// GraphQL update input type (deep partial support)
export type DateElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: DateElementConfigUpdateInputGraphql;
};
```

### 1.5: Fix Pothos Definition

Change line 140-144:

```typescript
export type DateElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: DateElementConfig;
};
```

## Step 2: Create `server/graphql/pothos/element/date.element.pothos.ts`

### File Structure (~280 lines)

```typescript
import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { DateElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
  TextPropsObject,
  TextPropsInputObject,
  TextPropsUpdateInputObject,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Enums
// ============================================================================

export const DateDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "DateDataSourceType",
  { values: Object.values(Types.DateDataSourceType) }
);

export const StudentDateFieldPothosEnum = gqlSchemaBuilder.enumType(
  "StudentDateField",
  { values: Object.values(Types.StudentDateField) }
);

export const CertificateDateFieldPothosEnum = gqlSchemaBuilder.enumType(
  "CertificateDateField",
  { values: Object.values(Types.CertificateDateField) }
);

export const CalendarTypePothosEnum = gqlSchemaBuilder.enumType(
  "CalendarType",
  { values: Object.values(Types.CalendarType) }
);

// ============================================================================
// Data Source Objects (Output) - 4 variants
// ============================================================================

export const DateDataSourceStaticObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.DateDataSource, { type: Types.DateDataSourceType.STATIC }>
  >("DateDataSourceStatic")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      value: t.exposeString("value"),
    }),
  });

export const DateDataSourceStudentFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.STUDENT_DATE_FIELD }
    >
  >("DateDataSourceStudentField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      field: t.expose("field", { type: StudentDateFieldPothosEnum }),
    }),
  });

export const DateDataSourceCertificateFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.CERTIFICATE_DATE_FIELD }
    >
  >("DateDataSourceCertificateField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      field: t.expose("field", { type: CertificateDateFieldPothosEnum }),
    }),
  });

export const DateDataSourceTemplateVariableObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.TEMPLATE_DATE_VARIABLE }
    >
  >("DateDataSourceTemplateVariable")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      variableId: t.exposeInt("variableId"),
    }),
  });

// ============================================================================
// Data Source Union (Output)
// ============================================================================

export const DateDataSourceUnion = gqlSchemaBuilder.unionType(
  "DateDataSource",
  {
    types: [
      DateDataSourceStaticObject,
      DateDataSourceStudentFieldObject,
      DateDataSourceCertificateFieldObject,
      DateDataSourceTemplateVariableObject,
    ],
    resolveType: ds => {
      switch (ds.type) {
        case Types.DateDataSourceType.STATIC:
          return "DateDataSourceStatic";
        case Types.DateDataSourceType.STUDENT_DATE_FIELD:
          return "DateDataSourceStudentField";
        case Types.DateDataSourceType.CERTIFICATE_DATE_FIELD:
          return "DateDataSourceCertificateField";
        case Types.DateDataSourceType.TEMPLATE_DATE_VARIABLE:
          return "DateDataSourceTemplateVariable";
        default: {
          const exhaustiveCheck: never = ds;
          throw new Error(
            `Unknown DateDataSource type: ${(exhaustiveCheck as { type: string }).type}`
          );
        }
      }
    },
  }
);

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const DateDataSourceStaticInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceStaticInputGraphql>(
    "DateDataSourceStaticInput"
  )
  .implement({
    fields: t => ({
      value: t.string({ required: true }),
    }),
  });

export const DateDataSourceStudentFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceStudentFieldInputGraphql>(
    "DateDataSourceStudentFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({ type: StudentDateFieldPothosEnum, required: true }),
    }),
  });

export const DateDataSourceCertificateFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceCertificateFieldInputGraphql>(
    "DateDataSourceCertificateFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({
        type: CertificateDateFieldPothosEnum,
        required: true,
      }),
    }),
  });

export const DateDataSourceTemplateVariableInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceTemplateVariableInputGraphql>(
    "DateDataSourceTemplateVariableInput"
  )
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

export const DateDataSourceInputObject = gqlSchemaBuilder.inputType(
  "DateDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      static: t.field({
        type: DateDataSourceStaticInputObject,
        required: false,
      }),
      studentField: t.field({
        type: DateDataSourceStudentFieldInputObject,
        required: false,
      }),
      certificateField: t.field({
        type: DateDataSourceCertificateFieldInputObject,
        required: false,
      }),
      templateVariable: t.field({
        type: DateDataSourceTemplateVariableInputObject,
        required: false,
      }),
    }),
  }
);

// ============================================================================
// Config Objects
// ============================================================================

export const DateElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.DateElementConfig>("DateElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      textProps: t.expose("textProps", { type: TextPropsObject }),
      calendarType: t.expose("calendarType", { type: CalendarTypePothosEnum }),
      offsetDays: t.exposeInt("offsetDays"),
      format: t.exposeString("format"),
      mapping: t.field({
        type: "JSON",
        nullable: true,
        resolve: config => config.mapping ?? null,
      }),
      dataSource: t.expose("dataSource", { type: DateDataSourceUnion }),
    }),
  });

export const DateElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementConfigInputGraphql>("DateElementConfigInput")
  .implement({
    fields: t => ({
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      calendarType: t.field({ type: CalendarTypePothosEnum, required: true }),
      offsetDays: t.int({ required: true }),
      format: t.string({ required: true }),
      mapping: t.field({ type: "JSON", required: false }),
      dataSource: t.field({ type: DateDataSourceInputObject, required: true }),
    }),
  });

export const DateElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementConfigUpdateInputGraphql>(
    "DateElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      textProps: t.field({
        type: TextPropsUpdateInputObject,
        required: false,
      }),
      calendarType: t.field({ type: CalendarTypePothosEnum, required: false }),
      offsetDays: t.int({ required: false }),
      format: t.string({ required: false }),
      mapping: t.field({ type: "JSON", required: false }),
      dataSource: t.field({
        type: DateDataSourceInputObject,
        required: false,
      }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const DateElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementCreateInputGraphql>("DateElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      config: t.field({ type: DateElementConfigInputObject, required: true }),
    }),
  });

export const DateElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementUpdateInputGraphql>("DateElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({
        type: DateElementConfigUpdateInputObject,
        required: false,
      }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const DateElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.DateElementPothosDefinition>("DateElement");

export const DateElementObject = gqlSchemaBuilder.loadableObject<
  Types.DateElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof DateElementObjectRef
>(DateElementObjectRef, {
  load: async ids => await DateElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.DATE,
  fields: t => ({
    config: t.expose("config", { type: DateElementConfigObject }),
  }),
});

gqlSchemaBuilder.objectFields(DateElementObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));
```

## Step 3: Create `server/db/repo/element/date.element.repository.ts`

Update the existing file to add `loadByIds`:

```typescript
// Add to imports
import { DateElementPothosDefinition } from "@/server/types/element";

// Add to DateElementRepository namespace
export const loadByIds = async (
  ids: number[]
): Promise<(DateElementPothosDefinition | Error)[]> => {
  if (ids.length === 0) return [];

  const elements = await ElementRepository.loadByIds(ids);

  return elements.map(element => {
    if (element instanceof Error) return element;

    if (element.type !== ElementType.DATE) {
      return new Error(`Element ${element.id} is ${element.type}, not DATE`);
    }

    return {
      ...element,
      config: element.config as DateElementConfig,
    };
  });
};
```

## Step 4: Verification

Run these commands:

1. `~/.bun/bin/bun tsc` - Verify TypeScript compilation
2. `~/.bun/bin/bun lint` - Verify linting passes

## Key Differences from TEXT

1. **Fewer Data Sources**: 4 variants vs TEXT's 5
2. **Additional Config Fields**: `calendarType`, `offsetDays`, `format`, `mapping`
3. **Mapping Field**: Uses `"JSON"` type in Pothos, nullable/optional
4. **Similar Complexity**: Still uses TextProps, isOneOf pattern, deep partial updates

## Implementation Checklist

- [ ] Step 1.1: Add individual data source input types
- [ ] Step 1.2: Update config types (remove type field from GraphQL inputs)
- [ ] Step 1.3: Add TextPropsUpdateInputGraphql import
- [ ] Step 1.4: Add GraphQL mutation input types
- [ ] Step 1.5: Fix DateElementPothosDefinition to use `config`
- [ ] Step 2: Create date.element.pothos.ts file
- [ ] Step 3: Add loadByIds to date.element.repository.ts
- [ ] Step 4: Run tsc and lint verification

## File Size Estimate

- **date.element.types.ts**: +80 lines (new types)
- **date.element.pothos.ts**: ~280 lines (new file)
- **date.element.repository.ts**: +20 lines (loadByIds function)

**Total**: ~380 new/modified lines