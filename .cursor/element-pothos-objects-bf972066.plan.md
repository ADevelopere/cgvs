<!-- bf972066-ec6d-4478-bc03-b23cd7b6ce2a 4dd0ca72-8f29-4597-9b76-0c5525c1d7ce -->
# Element Pothos Objects Structure

## Overview

Create Pothos GraphQL layer mirroring the exact structure of `server/types/element/`:

- **base.element.pothos.ts** - Shared objects (like base.element.types.ts)
- **Individual element files** - One per element type (like text.element.types.ts, etc.)
- **union.element.pothos.ts** - GraphQL union (like union.element.types.ts)

This structure avoids circular imports.

## Directory Structure (Mirrors Types)

```
server/graphql/pothos/element/
├── index.ts                          # Export all (like types/element/index.ts)
├── base.element.pothos.ts            # Shared objects (mirrors base.element.types.ts)
├── text.element.pothos.ts            # TEXT element (mirrors text.element.types.ts)
├── date.element.pothos.ts            # DATE element (mirrors date.element.types.ts)
├── number.element.pothos.ts          # NUMBER element (mirrors number.element.types.ts)
├── country.element.pothos.ts         # COUNTRY element (mirrors country.element.types.ts)
├── gender.element.pothos.ts          # GENDER element (mirrors gender.element.types.ts)
├── image.element.pothos.ts           # IMAGE element (mirrors image.element.types.ts)
├── qrcode.element.pothos.ts          # QR_CODE element (mirrors qrcode.element.types.ts)
└── union.element.pothos.ts           # Union (mirrors union.element.types.ts)
```

## Import Flow (No Circular Dependencies)

```
base.element.pothos.ts
  ↓ (imported by)
text.element.pothos.ts
date.element.pothos.ts
number.element.pothos.ts
country.element.pothos.ts
gender.element.pothos.ts
image.element.pothos.ts
qrcode.element.pothos.ts
  ↓ (imported by)
union.element.pothos.ts
  ↓ (imported by)
index.ts
```

**Key**: union.element.pothos.ts is ONLY imported by index.ts, never by individual element files.

## base.element.pothos.ts

**Contains ONLY shared Pothos objects** (NO union, NO individual elements):

### Shared Enums

```typescript
import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";

// From enum.element.types.ts
export const FontSourcePothosEnum = gqlSchemaBuilder.enumType(
  "FontSource",
  { values: Object.values(Types.FontSource) }
);

export const ElementTypePothosEnum = gqlSchemaBuilder.enumType(
  "ElementType",
  { values: Object.values(Types.ElementType) }
);

export const ElementAlignmentPothosEnum = gqlSchemaBuilder.enumType(
  "ElementAlignment",
  { values: Object.values(Types.ElementAlignment) }
);

// From config.element.types.ts
export const ElementOverflowPothosEnum = gqlSchemaBuilder.enumType(
  "ElementOverflow",
  { values: Object.values(Types.ElementOverflow) }
);
```

### FontReference Objects (Output)

```typescript
export const FontReferenceGoogleObject = gqlSchemaBuilder
  .objectRef<Types.FontReferenceGoogle>("FontReferenceGoogle")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      identifier: t.exposeString("identifier"),
    }),
  });

export const FontReferenceSelfHostedObject = gqlSchemaBuilder
  .objectRef<Types.FontReferenceSelfHosted>("FontReferenceSelfHosted")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      fontId: t.exposeInt("fontId"),
    }),
  });

export const FontReferenceUnion = gqlSchemaBuilder.unionType("FontReference", {
  types: [FontReferenceGoogleObject, FontReferenceSelfHostedObject],
  resolveType: (ref) => 
    ref.type === Types.FontSource.GOOGLE 
      ? "FontReferenceGoogle" 
      : "FontReferenceSelfHosted",
});
```

### FontReference Input (Single Object - GraphQL Input Unions Not Supported)

```typescript
export const FontReferenceInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceInput>("FontReferenceInput")
  .implement({
    fields: t => ({
      type: t.field({ type: FontSourcePothosEnum, required: true }),
      // For GOOGLE
      identifier: t.string({ required: false }),
      // For SELF_HOSTED
      fontId: t.int({ required: false }),
    }),
  });
```

### TextProps Objects (Used by TEXT, DATE, NUMBER, COUNTRY, GENDER)

```typescript
export const TextPropsObject = gqlSchemaBuilder
  .objectRef<Types.TextProps>("TextProps")
  .implement({
    fields: t => ({
      fontRef: t.expose("fontRef", { type: FontReferenceUnion }),
      fontSize: t.exposeInt("fontSize"),
      color: t.exposeString("color"),
      overflow: t.expose("overflow", { type: ElementOverflowPothosEnum }),
    }),
  });

export const TextPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsInput>("TextPropsInput")
  .implement({
    fields: t => ({
      fontRef: t.field({ type: FontReferenceInputObject, required: true }),
      fontSize: t.int({ required: true }),
      color: t.string({ required: true }),
      overflow: t.field({ type: ElementOverflowPothosEnum, required: true }),
    }),
  });
```

**File size: ~150 lines**

## Individual Element Files Pattern

Each file imports from `base.element.pothos.ts` and exports its own Pothos objects.

### Common Structure (All Element Files)

1. **Import shared objects from base**
2. **Define element-specific enums**
3. **Define data source objects (output)**
4. **Define data source inputs**
5. **Define config objects (output)**
6. **Define config inputs**
7. **Define create/update mutation inputs**
8. **Define loadable element object**

### Example: text.element.pothos.ts

```typescript
import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
  ElementAlignmentPothosEnum,
  TextPropsObject,
  TextPropsInputObject,
} from "./base.element.pothos";

// 1. Enums
export const TextDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "TextDataSourceType",
  { values: Object.values(Types.TextDataSourceType) }
);

export const StudentTextFieldPothosEnum = gqlSchemaBuilder.enumType(
  "StudentTextField",
  { values: Object.values(Types.StudentTextField) }
);

export const CertificateTextFieldPothosEnum = gqlSchemaBuilder.enumType(
  "CertificateTextField",
  { values: Object.values(Types.CertificateTextField) }
);

// 2. Data Source Objects (5 types for TEXT)
export const TextDataSourceStaticObject = gqlSchemaBuilder
  .objectRef<Extract<Types.TextDataSource, { type: Types.TextDataSourceType.STATIC }>>(
    "TextDataSourceStatic"
  )
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      value: t.exposeString("value"),
    }),
  });

// ... 4 more data source objects ...

// 3. Data Source Union
export const TextDataSourceUnion = gqlSchemaBuilder.unionType(
  "TextDataSource",
  {
    types: [/* all 5 data source objects */],
    resolveType: (ds) => { /* switch on ds.type */ },
  }
);

// 4. Data Source Input (Single input with discriminator)
export const TextDataSourceInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceInput>("TextDataSourceInput")
  .implement({
    fields: t => ({
      type: t.field({ type: TextDataSourceTypePothosEnum, required: true }),
      // All possible fields (optional based on type)
      value: t.string({ required: false }),
      field: t.field({ type: StudentTextFieldPothosEnum, required: false }),
      // ... etc
    }),
  });

// 5. Config Object
export const TextElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.TextElementConfig>("TextElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      textProps: t.expose("textProps", { type: TextPropsObject }),
      dataSource: t.expose("dataSource", { type: TextDataSourceUnion }),
    }),
  });

// 6. Config Input
export const TextElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementConfigInput>("TextElementConfigInput")
  .implement({
    fields: t => ({
      type: t.field({ type: ElementTypePothosEnum, required: true }),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({ type: TextDataSourceInputObject, required: true }),
    }),
  });

// 7. Mutation Inputs
export const TextElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementCreateInput>("TextElementCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: true }),
      positionX: t.int({ required: true }),
      positionY: t.int({ required: true }),
      width: t.int({ required: true }),
      height: t.int({ required: true }),
      alignment: t.field({ type: ElementAlignmentPothosEnum, required: true }),
      renderOrder: t.int({ required: true }),
      config: t.field({ type: TextElementConfigInputObject, required: true }),
    }),
  });

export const TextElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementUpdateInput>("TextElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      positionX: t.int({ required: false }),
      positionY: t.int({ required: false }),
      width: t.int({ required: false }),
      height: t.int({ required: false }),
      alignment: t.field({ type: ElementAlignmentPothosEnum, required: false }),
      renderOrder: t.int({ required: false }),
      config: t.field({ type: TextElementConfigInputObject, required: false }),
    }),
  });

// 8. Loadable Element Object
const TextElementObjectRef = gqlSchemaBuilder.loadableObjectRef<
  Types.TextElementPothosDefinition,
  number
>("TextElement", {
  load: async (ids: number[]) => {
    const elements = await ElementRepository.loadByIds(ids);
    return ids.map(id => {
      const element = elements.find(e => e.id === id);
      if (!element) return new Error(`Element ${id} not found`);
      if (element.type !== Types.ElementType.TEXT) {
        return new Error(`Element ${id} is ${element.type}, not TEXT`);
      }
      return element as Types.TextElementPothosDefinition;
    });
  },
  sort: e => e.id,
});

export const TextElementObject = TextElementObjectRef.implement({
  fields: t => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
    templateId: t.exposeInt("templateId"),
    type: t.expose("type", { type: ElementTypePothosEnum }),
    positionX: t.exposeInt("positionX"),
    positionY: t.exposeInt("positionY"),
    width: t.exposeInt("width"),
    height: t.exposeInt("height"),
    alignment: t.expose("alignment", { type: ElementAlignmentPothosEnum }),
    renderOrder: t.exposeInt("renderOrder"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    parsedConfig: t.expose("parsedConfig", { type: TextElementConfigObject }),
    template: t.loadable({
      type: TemplatePothosObject,
      load: (ids: number[]) => TemplateRepository.loadByIds(ids),
      resolve: element => element.templateId,
    }),
  }),
});
```

## union.element.pothos.ts

**Imports all individual element objects and creates the GraphQL union:**

```typescript
import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TextElementObject } from "./text.element.pothos";
import { DateElementObject } from "./date.element.pothos";
import { NumberElementObject } from "./number.element.pothos";
import { CountryElementObject } from "./country.element.pothos";
import { GenderElementObject } from "./gender.element.pothos";
import { ImageElementObject } from "./image.element.pothos";
import { QRCodeElementObject } from "./qrcode.element.pothos";

export const CertificateElementUnion = gqlSchemaBuilder.unionType(
  "CertificateElement",
  {
    types: [
      TextElementObject,
      DateElementObject,
      NumberElementObject,
      CountryElementObject,
      GenderElementObject,
      ImageElementObject,
      QRCodeElementObject,
    ],
    resolveType: element => {
      switch (element.type) {
        case Types.ElementType.TEXT:
          return "TextElement";
        case Types.ElementType.DATE:
          return "DateElement";
        case Types.ElementType.NUMBER:
          return "NumberElement";
        case Types.ElementType.COUNTRY:
          return "CountryElement";
        case Types.ElementType.GENDER:
          return "GenderElement";
        case Types.ElementType.IMAGE:
          return "ImageElement";
        case Types.ElementType.QR_CODE:
          return "QRCodeElement";
        default:
          throw new Error(`Unknown element type: ${(element as any).type}`);
      }
    },
  }
);
```

**File size: ~40 lines**

## index.ts

```typescript
// Export shared base objects
export * from "./base.element.pothos";

// Export individual element objects
export * from "./text.element.pothos";
export * from "./date.element.pothos";
export * from "./number.element.pothos";
export * from "./country.element.pothos";
export * from "./gender.element.pothos";
export * from "./image.element.pothos";
export * from "./qrcode.element.pothos";

// Export union (last, after all individual elements)
export * from "./union.element.pothos";
```

## File Size Estimates

- **base.element.pothos.ts**: ~150 lines
- **text.element.pothos.ts**: ~300 lines (5 data sources)
- **date.element.pothos.ts**: ~280 lines (4 data sources)
- **number.element.pothos.ts**: ~250 lines (1 data source + mapping)
- **country.element.pothos.ts**: ~220 lines (1 data source + representation)
- **gender.element.pothos.ts**: ~200 lines (1 data source)
- **image.element.pothos.ts**: ~180 lines (no TextProps)
- **qrcode.element.pothos.ts**: ~160 lines (simplest)
- **union.element.pothos.ts**: ~40 lines
- **index.ts**: ~15 lines

**Total: ~1,795 lines across 10 files**

## Implementation Order

1. **base.element.pothos.ts** - Foundation (no dependencies on element files)
2. **qrcode.element.pothos.ts** - Simplest element (test pattern)
3. **gender.element.pothos.ts** - Simple text-based
4. **country.element.pothos.ts** - Add representation enum
5. **image.element.pothos.ts** - Different (no TextProps)
6. **number.element.pothos.ts** - Add mapping
7. **date.element.pothos.ts** - Complex data source
8. **text.element.pothos.ts** - Most complex
9. **union.element.pothos.ts** - Create union (requires all element files)
10. **index.ts** - Export all
11. **Update graphql/pothos/index.ts** - Add element export