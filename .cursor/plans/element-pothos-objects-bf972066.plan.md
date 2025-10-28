<!-- bf972066-ec6d-4478-bc03-b23cd7b6ce2a 0d1c2380-167e-4c0d-bcc0-1f094e0fcdd2 -->
# base.element.pothos.ts Implementation Plan

## Overview

Create the foundation file for element Pothos objects containing all shared types and objects. This file has NO dependencies on individual element files (no circular imports).

## File Location

`server/graphql/pothos/element/base.element.pothos.ts`

## Structure Breakdown

### 1. Imports (4 lines)

```typescript
import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
```

**Purpose:** Import schema builder and all element types

---

### 2. Shared Enums Section (25 lines)

Four enums from `enum.element.types.ts` and `config.element.types.ts`:

#### FontSourcePothosEnum

```typescript
export const FontSourcePothosEnum = gqlSchemaBuilder.enumType(
  "FontSource",
  { values: Object.values(Types.FontSource) }
);
```

**Values:** GOOGLE, SELF_HOSTED

#### ElementTypePothosEnum

```typescript
export const ElementTypePothosEnum = gqlSchemaBuilder.enumType(
  "ElementType",
  { values: Object.values(Types.ElementType) }
);
```

**Values:** TEXT, NUMBER, DATE, IMAGE, GENDER, COUNTRY, QR_CODE

#### ElementAlignmentPothosEnum

```typescript
export const ElementAlignmentPothosEnum = gqlSchemaBuilder.enumType(
  "ElementAlignment",
  { values: Object.values(Types.ElementAlignment) }
);
```

**Values:** START, END, TOP, BOTTOM, CENTER, BASELINE

#### ElementOverflowPothosEnum

```typescript
export const ElementOverflowPothosEnum = gqlSchemaBuilder.enumType(
  "ElementOverflow",
  { values: Object.values(Types.ElementOverflow) }
);
```

**Values:** RESIZE_DOWN, TRUNCATE, ELLIPSE, WRAP

---

### 3. FontReference Union (Output Types) (40 lines)

Discriminated union for font references (GOOGLE vs SELF_HOSTED).

#### FontReferenceGoogleObject

```typescript
export const FontReferenceGoogleObject = gqlSchemaBuilder
  .objectRef<Extract<Types.FontReference, { type: Types.FontSource.GOOGLE }>>(
    "FontReferenceGoogle"
  )
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      identifier: t.exposeString("identifier"),
    }),
  });
```

**Fields:**

- `type`: FontSource (GOOGLE)
- `identifier`: String (Google font name)

#### FontReferenceSelfHostedObject

```typescript
export const FontReferenceSelfHostedObject = gqlSchemaBuilder
  .objectRef<Extract<Types.FontReference, { type: Types.FontSource.SELF_HOSTED }>>(
    "FontReferenceSelfHosted"
  )
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      fontId: t.exposeInt("fontId"),
    }),
  });
```

**Fields:**

- `type`: FontSource (SELF_HOSTED)
- `fontId`: Int (DB font ID)

#### FontReferenceUnion

```typescript
export const FontReferenceUnion = gqlSchemaBuilder.unionType("FontReference", {
  types: [FontReferenceGoogleObject, FontReferenceSelfHostedObject],
  resolveType: (ref) =>
    ref.type === Types.FontSource.GOOGLE
      ? "FontReferenceGoogle"
      : "FontReferenceSelfHosted",
});
```

**Purpose:** GraphQL union that resolves to correct type based on `type` field

---

### 4. FontReference Input (20 lines)

GraphQL doesn't support input unions natively, so we use a single input with optional fields.

```typescript
export const FontReferenceInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceInput>("FontReferenceInput")
  .implement({
    fields: t => ({
      type: t.field({ type: FontSourcePothosEnum, required: true }),
      // For GOOGLE font
      identifier: t.string({ required: false }),
      // For SELF_HOSTED font
      fontId: t.int({ required: false }),
    }),
  });
```

**Fields:**

- `type`: FontSource (required) - discriminator
- `identifier`: String (optional) - required when type=GOOGLE
- `fontId`: Int (optional) - required when type=SELF_HOSTED

**Validation:** Handled at mutation resolver level

---

### 5. TextProps Objects (35 lines)

Shared by TEXT, DATE, NUMBER, COUNTRY, and GENDER elements.

#### TextPropsObject (Output)

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
```

**Fields:**

- `fontRef`: FontReference (union)
- `fontSize`: Int (in points)
- `color`: String (hex or rgba)
- `overflow`: ElementOverflow (enum)

#### TextPropsInputObject (Input)

```typescript
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

**All fields required** for input (no partial updates at this level)

---

## Type Safety Considerations

### Extract Type for Union Members

Using TypeScript's `Extract` to ensure type safety:

```typescript
Extract<Types.FontReference, { type: Types.FontSource.GOOGLE }>
```

This extracts only the GOOGLE variant from the FontReference union, ensuring:

- Type safety at compile time
- Autocomplete for fields
- Prevents accessing fields that don't exist on this variant

### Enum Value Mapping

Using `Object.values()` to automatically map TypeScript enums to GraphQL enums:

```typescript
{ values: Object.values(Types.FontSource) }
```

This ensures:

- Single source of truth (TypeScript enum)
- No manual duplication
- Automatic sync if enum values change

---

## File Structure Summary

```typescript
// 1. Imports
import { gqlSchemaBuilder } from "...";
import * as Types from "...";

// 2. Shared Enums (4 enums)
export const FontSourcePothosEnum = ...
export const ElementTypePothosEnum = ...
export const ElementAlignmentPothosEnum = ...
export const ElementOverflowPothosEnum = ...

// 3. FontReference Union (Output)
export const FontReferenceGoogleObject = ...
export const FontReferenceSelfHostedObject = ...
export const FontReferenceUnion = ...

// 4. FontReference Input
export const FontReferenceInputObject = ...

// 5. TextProps Objects
export const TextPropsObject = ...
export const TextPropsInputObject = ...
```

---

## Dependencies

### Imports FROM:

- `@/server/graphql/gqlSchemaBuilder` - Pothos schema builder
- `@/server/types/element` - All element type definitions

### Imported BY:

- All individual element Pothos files (text, date, number, country, gender, image, qrcode)
- Eventually exported through `element/index.ts`

**NO circular dependencies** - this file doesn't import any element-specific files

---

## Validation After Implementation

1. **TypeScript compilation:**
   ```bash
   ~/.bun/bin/bun tsc --noEmit
   ```

2. **Verify exports:**

   - 4 enum objects
   - 3 FontReference objects (2 types + 1 union)
   - 1 FontReference input
   - 2 TextProps objects (output + input)
   - Total: 10 exports

3. **No runtime dependencies:**

   - File should compile without needing any element-specific files
   - Only depends on gqlSchemaBuilder and types

---

## Estimated File Size

**~150 lines total:**

- Imports: 4 lines
- Enums: 25 lines
- FontReference union: 40 lines
- FontReference input: 20 lines
- TextProps objects: 35 lines
- Comments/spacing: 26 lines

---

## Next Steps After Completion

Once base.element.pothos.ts is complete:

1. Can immediately start any individual element file (they're independent)
2. Recommended order: qrcode → gender → country → image → number → date → text
3. All element files will import from this base file

### To-dos

- [ ] Create directory server/graphql/pothos/element/
- [ ] Add imports and implement 4 shared enums (FontSource, ElementType, ElementAlignment, ElementOverflow)
- [ ] Implement FontReference output union (FontReferenceGoogle, FontReferenceSelfHosted, FontReferenceUnion)
- [ ] Implement FontReferenceInput object with discriminator pattern
- [ ] Implement TextProps output and input objects
- [ ] Verify TypeScript compilation and ensure all 10 exports are correct