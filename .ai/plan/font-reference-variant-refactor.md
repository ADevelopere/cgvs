# Font Reference Variant Refactor Plan - Backend

## Overview

Refactor the font reference system to include variant information for both Google Fonts and self-hosted fonts. This plan covers backend changes only. See `font-reference-variant-refactor-client.md` for client-side changes.

## Current Structure

### Font Reference Types (Output)

```typescript
// server/types/element/output/config.element.types.ts
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

type FontReference = { type: FontSource.GOOGLE; family: FontFamily } | { type: FontSource.SELF_HOSTED; fontId: number };
```

### Database Schema

```typescript
// server/db/schema/certificateElements/elementTextProps.ts
elementTextProps = {
  fontSource: fontSourceEnum,
  fontId: integer,
  googleFontFamily: text,
  // ... other fields
};
```

## Problem Statement

1. **Google Fonts**: Only stores family name, no variant info
2. **Self-Hosted Fonts**: `fontId` references `fontVariant.id`, but type system doesn't reflect this
3. **Inconsistency**: Google fonts can't specify variants, but self-hosted fonts implicitly do

## Proposed New Structure

### 1. Updated Font Reference Types (Output)

**File:** `server/types/element/output/config.element.types.ts`

```typescript
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

export type FontReference =
  | {
      type: FontSource.GOOGLE;
      family: FontFamily;
      variant: string;
    }
  | {
      type: FontSource.SELF_HOSTED;
      fontVariantId: number;
    };
```

### 2. Updated Font Reference Input (GraphQL)

**File:** `server/types/element/inputGql/config.element.inputGql.ts`

```typescript
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

export type FontReferenceGoogleInputGraphql = {
  family: FontFamily;
  variant: string;
};

export type FontReferenceSelfHostedInputGraphql = {
  fontVariantId: number;
};
```

### 3. Updated Database Schema

**File:** `server/db/schema/certificateElements/templateElementEnums.ts`

```typescript
import { FontFamily } from "@/lib/font/google/fontFamily.enum";
import { createPgEnumFromEnum } from "@/server/utils/db.utils";

export const googleFontFamilyEnum = createPgEnumFromEnum("google_font_family", FontFamily);
```

**File:** `server/db/schema/certificateElements/elementTextProps.ts`

```typescript
import { googleFontFamilyEnum } from "./templateElementEnums";

elementTextProps = pgTable("element_text_props", {
  fontSource: fontSourceEnum("font_source").notNull(),
  fontVariantId: integer("font_variant_id"),
  googleFontFamily: googleFontFamilyEnum("google_font_family"),
  googleFontVariant: text("google_font_variant"),
  // ... other fields
});
```

### 4. Updated GraphQL Schema

**File:** `server/graphql/pothos/enum.pothos.ts`

```typescript
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

export const FontFamilyPothosObject = gqlSchemaBuilder.enumType("FontFamily", {
  values: Object.values(FontFamily),
});
```

**File:** `server/graphql/pothos/element/textProps.pothos.ts`

```typescript
import { FontFamilyPothosObject } from "../enum.pothos";

export const FontReferenceGoogleObject = gqlSchemaBuilder
  .objectRef<Extract<Types.FontReference, { type: Types.FontSource.GOOGLE }>>("FontReferenceGoogle")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      family: t.expose("family", { type: FontFamilyPothosObject }),
      variant: t.exposeString("variant"),
    }),
  });

export const FontReferenceSelfHostedObject = gqlSchemaBuilder
  .objectRef<Extract<Types.FontReference, { type: Types.FontSource.SELF_HOSTED }>>("FontReferenceSelfHosted")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      fontVariantId: t.exposeInt("fontVariantId"),
    }),
  });

export const FontReferenceGoogleInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceGoogleInputGraphql>("FontReferenceGoogleInput")
  .implement({
    fields: t => ({
      family: t.field({ type: FontFamilyPothosObject, required: true }),
      variant: t.string({ required: true }),
    }),
  });

export const FontReferenceSelfHostedInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceSelfHostedInputGraphql>("FontReferenceSelfHostedInput")
  .implement({
    fields: t => ({
      fontVariantId: t.int({ required: true }),
    }),
  });
```

### 5. Repository Layer

**File:** `server/db/repo/element/textProps.element.repository.ts`

```typescript
export const create = async (textProps: TextPropsInput): Promise<ElementTextPropsEntity> => {
  const fontVariantId = textProps.fontRef.type === FontSource.SELF_HOSTED ? textProps.fontRef.fontVariantId : null;

  const googleFontFamily = textProps.fontRef.type === FontSource.GOOGLE ? textProps.fontRef.family : null;

  const googleFontVariant = textProps.fontRef.type === FontSource.GOOGLE ? textProps.fontRef.variant : null;

  const [created] = await db
    .insert(elementTextProps)
    .values({
      ...textProps,
      fontSource: textProps.fontRef.type,
      fontVariantId,
      googleFontFamily,
      googleFontVariant,
    })
    .returning();

  return created;
};
```

### 6. Utility Functions

**File:** `server/utils/element/textProps.utils.ts`

```typescript
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

export const entityToTextProps = (entity: ElementTextPropsEntity): TextProps => {
  const fontRef: FontReference =
    entity.fontSource === FontSource.SELF_HOSTED
      ? {
          type: FontSource.SELF_HOSTED as const,
          fontVariantId: entity.fontVariantId!,
        }
      : {
          type: FontSource.GOOGLE as const,
          family: entity.googleFontFamily! as FontFamily,
          variant: entity.googleFontVariant!,
        };

  return {
    ...entity,
    fontRef: fontRef,
    overflow: entity.overflow as ElementOverflow,
  };
};
```

### 7. Validation Utilities

**File:** `server/utils/element/common.element.utils.ts`

```typescript
import { getFontByFamily, FontFamily } from "@/lib/font/google";

export const validateGoogleFontReference = (family: FontFamily, variant: string): void => {
  const fontItem = getFontByFamily(family);

  if (!fontItem) {
    throw new Error(`Invalid Google Font family: "${family}".`);
  }

  if (!fontItem.variants.includes(variant)) {
    throw new Error(`Invalid variant "${variant}" for Google Font "${family}".`);
  }
};

export const checkTextProps = async (input: TextPropsInput | TextPropsUpdateInput): Promise<void> => {
  if (input.fontRef.type === FontSource.GOOGLE) {
    validateGoogleFontReference(input.fontRef.family, input.fontRef.variant);
  }

  if (input.fontRef.type === FontSource.SELF_HOSTED) {
    const variant = await FontVariantRepository.findById(input.fontRef.fontVariantId);
    if (!variant) {
      throw new Error(`Font variant with ID ${input.fontRef.fontVariantId} does not exist.`);
    }
  }
};
```

## Database Migration

**File:** `server/drizzle/XXXX_add_google_font_variant.sql`

```sql
ALTER TABLE element_text_props
ADD COLUMN google_font_variant TEXT;

ALTER TABLE element_text_props
RENAME COLUMN font_id TO font_variant_id;

ALTER TABLE element_text_props
RENAME COLUMN google_font_identifier TO google_font_family;

UPDATE element_text_props
SET google_font_variant = '400'
WHERE font_source = 'GOOGLE' AND google_font_variant IS NULL;
```

## Implementation Steps

### Phase 1: Backend Schema & Types

1. Add `googleFontFamilyEnum` to `templateElementEnums.ts`
2. Update `elementTextProps.ts` schema
3. Update type definitions
4. Add `FontFamilyPothosObject` to `enum.pothos.ts`
5. Update GraphQL schema

### Phase 2: Repository & Utils

1. Update repository create/update methods
2. Update `entityToTextProps` utility
3. Add validation utilities

### Phase 3: Migration & Testing

1. Create migration SQL
2. Run migration
3. Regenerate GraphQL types
4. Test all changes

### Phase 4: Client Updates

See `font-reference-variant-refactor-client.md`

## Breaking Changes

1. **FontReferenceGoogle**: Renamed `identifier` → `family` (now uses `FontFamily` enum)
2. **FontReferenceGoogle**: Added required `variant` field
3. **FontReferenceSelfHosted**: Renamed `fontId` → `fontVariantId`
4. **Database**: Renamed `font_id` → `font_variant_id`
5. **Database**: Renamed `google_font_identifier` → `google_font_family`
6. **Database**: Added `google_font_variant`

## Files to Modify

1. `server/db/schema/certificateElements/templateElementEnums.ts`
2. `server/db/schema/certificateElements/elementTextProps.ts`
3. `server/types/element/output/config.element.types.ts`
4. `server/types/element/inputGql/config.element.inputGql.ts`
5. `server/graphql/pothos/enum.pothos.ts`
6. `server/graphql/pothos/element/textProps.pothos.ts`
7. `server/db/repo/element/textProps.element.repository.ts`
8. `server/utils/element/textProps.utils.ts`
9. `server/utils/element/common.element.utils.ts`
10. `server/drizzle/XXXX_add_google_font_variant.sql` (new)

## Estimated Effort

4 hours
