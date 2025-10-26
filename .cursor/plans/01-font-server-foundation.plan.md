# Sub-Plan 1: Font Management - Server Foundation

**Parent Plan**: Font Management Master Plan

**Status**: Ready for Implementation

**Scope**: Complete server-side GraphQL API for font management

---

## Overview

Implement all server-side components for font management including types, repository, GraphQL schema (Pothos), mutations, and queries. Fonts reference storage files and include locale support with usage validation before deletion.

---

## Implementation Steps

### Step 1: Create Font Types

**File**: `/workspaces/cgvs/server/types/font.types.ts`

**Dependencies**:

- `server/db/schema/font.ts` (exists)
- Pattern: `server/types/templateCategory.types.ts`

**Content**:

```typescript
import { font } from "@/server/db/schema/font";
import { FileInfo } from "@/server/types/storage.types";

// Type aliases to match schema
export type FontEntity = typeof font.$inferSelect;
export type FontInsertInput = typeof font.$inferInsert;
export type FontSelectType = typeof font.$inferSelect;

// Pothos definition with relations
export type FontPothosDefinition = FontSelectType & {
  storageFile?: FileInfo | null;
};

// Input types for GraphQL
export type FontCreateInput = {
  name: string;
  locale: string[]; // Array of locale codes: ["all", "en", "ar", etc.]
  storageFileId: number;
};

export type FontUpdateInput = {
  id: number;
  name: string;
  locale: string[];
  storageFileId: number;
};

// Usage check result
export type FontUsageReference = {
  elementId: number;
  elementType: string;
  templateId?: number | null;
  templateName?: string | null;
};

export type FontUsageCheckResult = {
  isInUse: boolean;
  usageCount: number;
  usedBy: FontUsageReference[];
  canDelete: boolean;
  deleteBlockReason?: string | null;
};

// Search result with pagination
export type FontSearchResult = {
  fonts: FontSelectType[];
  totalCount: number;
};
```

**Validation**:

- Locale array must contain at least one value
- StorageFileId must reference valid storage file
- Name must be non-empty string

---

### Step 2: Create Font Repository

**File**: `/workspaces/cgvs/server/db/repo/font.repository.ts`

**Dependencies**:

- `server/db/drizzleDb`
- `server/db/schema/font`
- `server/db/schema/certificateElements/certificateElement` (for usage check)
- `server/db/schema/storage` (for storageFiles)
- Pattern: `server/db/repo/templateCategory.repository.ts`

**Content**:

```typescript
import { db } from "@/server/db/drizzleDb";
import { eq, ilike, and, sql, inArray } from "drizzle-orm";
import { font } from "@/server/db/schema/font";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import { storageFiles } from "@/server/db/schema/storage";
import { templates } from "@/server/db/schema";
import {
  FontSelectType,
  FontCreateInput,
  FontUpdateInput,
  FontUsageCheckResult,
  FontUsageReference,
} from "@/server/types/font.types";
import logger from "@/server/lib/logger";

export namespace FontRepository {
  /**
   * Find font by ID
   */
  export const findById = async (
    id: number
  ): Promise<FontSelectType | null> => {
    const result = await db.select().from(font).where(eq(font.id, id)).limit(1);
    return result[0] || null;
  };

  /**
   * Find all fonts ordered by name
   */
  export const findAll = async (): Promise<FontSelectType[]> => {
    return db.select().from(font).orderBy(font.name);
  };

  /**
   * Check if font exists by ID
   */
  export const existsById = async (id: number): Promise<boolean> => {
    const result = await db
      .select({ id: font.id })
      .from(font)
      .where(eq(font.id, id))
      .limit(1);
    return result.length > 0;
  };

  /**
   * Search fonts by name (case-insensitive, paginated)
   */
  export const searchByName = async (
    searchTerm: string,
    limit: number = 50
  ): Promise<FontSelectType[]> => {
    return db
      .select()
      .from(font)
      .where(ilike(font.name, `%${searchTerm}%`))
      .orderBy(font.name)
      .limit(limit);
  };

  /**
   * Find fonts by storage file ID
   */
  export const findByStorageFileId = async (
    fileId: number
  ): Promise<FontSelectType[]> => {
    return db.select().from(font).where(eq(font.storageFileId, fileId));
  };

  /**
   * Validate storage file exists
   */
  const validateStorageFile = async (storageFileId: number): Promise<void> => {
    const file = await db
      .select({ id: storageFiles.id })
      .from(storageFiles)
      .where(eq(storageFiles.id, BigInt(storageFileId)))
      .limit(1);

    if (file.length === 0) {
      throw new Error(
        `Storage file with ID ${storageFileId} does not exist. Please upload the font file first.`
      );
    }
  };

  /**
   * Validate locale array
   */
  const validateLocale = (locale: string[]): void => {
    if (!locale || locale.length === 0) {
      throw new Error("At least one locale must be specified.");
    }

    // Validate locale codes (basic validation)
    const validLocales = [
      "all",
      "ar",
      "en",
      "fr",
      "de",
      "es",
      "zh",
      "ja",
      "ru",
      "pt",
      "it",
      "ko",
      "tr",
    ];
    const invalidLocales = locale.filter(l => !validLocales.includes(l));

    if (invalidLocales.length > 0) {
      logger.warn(
        `Invalid locale codes detected: ${invalidLocales.join(", ")}`
      );
      // Don't throw, just warn - allow flexibility
    }
  };

  /**
   * Validate font name
   */
  const validateName = (name: string): void => {
    if (!name || name.trim().length === 0) {
      throw new Error("Font name cannot be empty.");
    }
    if (name.length > 255) {
      throw new Error("Font name cannot exceed 255 characters.");
    }
  };

  /**
   * Create a new font
   */
  export const create = async (
    input: FontCreateInput
  ): Promise<FontSelectType> => {
    // Validate inputs
    validateName(input.name);
    validateLocale(input.locale);
    await validateStorageFile(input.storageFileId);

    // Convert locale array to comma-separated string for storage
    const localeString = input.locale.join(",");

    const [newFont] = await db
      .insert(font)
      .values({
        name: input.name.trim(),
        locale: localeString,
        storageFileId: input.storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newFont) {
      throw new Error("Failed to create font.");
    }

    logger.info(`Font created: ${newFont.name} (ID: ${newFont.id})`);
    return newFont;
  };

  /**
   * Update an existing font
   */
  export const update = async (
    input: FontUpdateInput
  ): Promise<FontSelectType> => {
    const existingFont = await findById(input.id);
    if (!existingFont) {
      throw new Error(`Font with ID ${input.id} does not exist.`);
    }

    // Validate inputs
    validateName(input.name);
    validateLocale(input.locale);
    await validateStorageFile(input.storageFileId);

    // Convert locale array to comma-separated string
    const localeString = input.locale.join(",");

    const [updatedFont] = await db
      .update(font)
      .set({
        name: input.name.trim(),
        locale: localeString,
        storageFileId: input.storageFileId,
        updatedAt: new Date(),
      })
      .where(eq(font.id, input.id))
      .returning();

    if (!updatedFont) {
      throw new Error("Failed to update font.");
    }

    logger.info(`Font updated: ${updatedFont.name} (ID: ${updatedFont.id})`);
    return updatedFont;
  };

  /**
   * Check font usage in certificate elements
   */
  export const checkUsage = async (
    id: number
  ): Promise<FontUsageCheckResult> => {
    try {
      // Query certificate elements that use this font
      const usages = await db
        .select({
          elementId: certificateElement.id,
          elementType: certificateElement.type,
          templateId: certificateElement.templateId,
        })
        .from(certificateElement)
        .where(eq(certificateElement.fontId, id));

      if (usages.length === 0) {
        return {
          isInUse: false,
          usageCount: 0,
          usedBy: [],
          canDelete: true,
        };
      }

      // Get template names for context
      const templateIds = usages
        .map(u => u.templateId)
        .filter((id): id is number => id !== null);

      const uniqueTemplateIds = [...new Set(templateIds)];

      const templateNames =
        uniqueTemplateIds.length > 0
          ? await db
              .select({
                id: templates.id,
                name: templates.name,
              })
              .from(templates)
              .where(inArray(templates.id, uniqueTemplateIds))
          : [];

      const templateMap = new Map(templateNames.map(t => [t.id, t.name]));

      // Build usage references
      const usedBy: FontUsageReference[] = usages.map(usage => ({
        elementId: usage.elementId,
        elementType: usage.elementType,
        templateId: usage.templateId,
        templateName: usage.templateId
          ? templateMap.get(usage.templateId) || null
          : null,
      }));

      return {
        isInUse: true,
        usageCount: usages.length,
        usedBy,
        canDelete: false,
        deleteBlockReason: `Font is currently used in ${usages.length} certificate element(s). Remove the font from these elements before deleting.`,
      };
    } catch (error) {
      logger.error("Error checking font usage:", error);
      return {
        isInUse: false,
        usageCount: 0,
        usedBy: [],
        canDelete: false,
        deleteBlockReason:
          "Unable to verify font usage. Deletion blocked for safety.",
      };
    }
  };

  /**
   * Delete a font by ID (with usage check)
   */
  export const deleteById = async (id: number): Promise<FontSelectType> => {
    const existingFont = await findById(id);
    if (!existingFont) {
      throw new Error(`Font with ID ${id} does not exist.`);
    }

    // Check if font is in use
    const usageCheck = await checkUsage(id);
    if (usageCheck.isInUse) {
      throw new Error(
        usageCheck.deleteBlockReason ||
          "Cannot delete font: it is currently in use."
      );
    }

    // Proceed with deletion
    const [deletedFont] = await db
      .delete(font)
      .where(eq(font.id, id))
      .returning();

    if (!deletedFont) {
      throw new Error("Failed to delete font.");
    }

    logger.info(`Font deleted: ${deletedFont.name} (ID: ${deletedFont.id})`);
    return deletedFont;
  };

  /**
   * Load fonts by IDs (for Pothos dataloader)
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(FontSelectType | Error)[]> => {
    if (ids.length === 0) return [];

    const fonts = await db.select().from(font).where(inArray(font.id, ids));

    // Map results to maintain order
    return ids.map(id => {
      const found = fonts.find(f => f.id === id);
      return found || new Error(`Font with ID ${id} not found`);
    });
  };
}
```

**Key Features**:

- Locale stored as comma-separated string in DB, parsed to array in types
- Storage file validation before create/update
- Usage check queries certificate elements with font references
- Blocks deletion if font is in use
- Comprehensive error handling and logging

---

### Step 3: Create Pothos Schema

**File**: `/workspaces/cgvs/server/graphql/pothos/font.pothos.ts`

**Dependencies**:

- `server/graphql/gqlSchemaBuilder`
- `server/types/font.types`
- `server/db/repo/font.repository`
- Pattern: `server/graphql/pothos/templateCategory.pothos.ts`

**Content**:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosDefinition,
  FontCreateInput,
  FontUpdateInput,
  FontUsageCheckResult,
  FontUsageReference,
} from "@/server/types/font.types";
import { FontRepository } from "@/server/db/repo";

// Font object
const FontObjectRef = gqlSchemaBuilder.objectRef<FontPothosDefinition>("Font");

export const FontPothosObject = gqlSchemaBuilder.loadableObject<
  FontPothosDefinition | Error,
  number,
  [],
  typeof FontObjectRef
>(FontObjectRef, {
  load: async (ids: number[]) => await FontRepository.loadByIds(ids),
  sort: f => f.id,
  fields: t => ({
    id: t.exposeInt("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    locale: t.field({
      type: ["String"],
      nullable: false,
      resolve: font => {
        // Parse comma-separated locale string to array
        return font.locale.split(",").filter(l => l.trim().length > 0);
      },
    }),
    storageFileId: t.exposeInt("storageFileId", { nullable: false }),
    createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
    updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
  }),
});

// Font usage reference object
export const FontUsageReferencePothosObject = gqlSchemaBuilder
  .objectRef<FontUsageReference>("FontUsageReference")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId", { nullable: false }),
      elementType: t.exposeString("elementType", { nullable: false }),
      templateId: t.exposeInt("templateId", { nullable: true }),
      templateName: t.exposeString("templateName", { nullable: true }),
    }),
  });

// Font usage check result object
export const FontUsageCheckResultPothosObject = gqlSchemaBuilder
  .objectRef<FontUsageCheckResult>("FontUsageCheckResult")
  .implement({
    fields: t => ({
      isInUse: t.exposeBoolean("isInUse", { nullable: false }),
      usageCount: t.exposeInt("usageCount", { nullable: false }),
      usedBy: t.expose("usedBy", {
        type: [FontUsageReferencePothosObject],
        nullable: false,
      }),
      canDelete: t.exposeBoolean("canDelete", { nullable: false }),
      deleteBlockReason: t.exposeString("deleteBlockReason", {
        nullable: true,
      }),
    }),
  });

// Font create input
const FontCreateInputRef =
  gqlSchemaBuilder.inputRef<FontCreateInput>("FontCreateInput");

export const FontCreateInputPothosObject = FontCreateInputRef.implement({
  fields: t => ({
    name: t.string({ required: true }),
    locale: t.stringList({ required: true }),
    storageFileId: t.int({ required: true }),
  }),
});

// Font update input
const FontUpdateInputRef =
  gqlSchemaBuilder.inputRef<FontUpdateInput>("FontUpdateInput");

export const FontUpdateInputPothosObject = FontUpdateInputRef.implement({
  fields: t => ({
    id: t.int({ required: true }),
    name: t.string({ required: true }),
    locale: t.stringList({ required: true }),
    storageFileId: t.int({ required: true }),
  }),
});
```

**Key Features**:

- Locale field converts DB string to GraphQL string array
- Loadable pattern for efficient batching
- Usage check result includes detailed reference information
- Input validation through required fields

---

### Step 4: Create GraphQL Mutations

**File**: `/workspaces/cgvs/server/graphql/mutation/font.mutation.ts`

**Dependencies**:

- `server/graphql/gqlSchemaBuilder`
- `server/graphql/pothos/font.pothos`
- `server/db/repo/font.repository`
- Pattern: `server/graphql/mutation/templateCategory.mutation.ts`

**Content**:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosObject,
  FontCreateInputPothosObject,
  FontUpdateInputPothosObject,
} from "../pothos/font.pothos";
import { FontRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields(t => ({
  createFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.create(args.input);
    },
  }),

  updateFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.update(args.input);
    },
  }),

  deleteFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.deleteById(args.id);
    },
  }),
}));
```

**Key Features**:

- Simple pass-through to repository layer
- Repository handles validation and business logic
- Throws errors on failure (caught by GraphQL error handling)

---

### Step 5: Create GraphQL Queries

**File**: `/workspaces/cgvs/server/graphql/query/font.query.ts`

**Dependencies**:

- `server/graphql/gqlSchemaBuilder`
- `server/graphql/pothos/font.pothos`
- `server/db/repo/font.repository`
- Pattern: `server/graphql/query/templateCategory.query.ts`

**Content**:

```typescript
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosObject,
  FontUsageCheckResultPothosObject,
} from "../pothos/font.pothos";
import { FontRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields(t => ({
  font: t.field({
    type: FontPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.findById(args.id);
    },
  }),

  fonts: t.field({
    type: [FontPothosObject],
    nullable: false,
    resolve: async () => {
      return await FontRepository.findAll();
    },
  }),

  searchFonts: t.field({
    type: [FontPothosObject],
    nullable: false,
    args: {
      name: t.arg.string({ required: true }),
      limit: t.arg.int({
        required: false,
        defaultValue: 50,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.searchByName(args.name, args.limit || 50);
    },
  }),

  checkFontUsage: t.field({
    type: FontUsageCheckResultPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.checkUsage(args.id);
    },
  }),
}));
```

**Key Features**:

- All fonts query for list view
- Search with pagination for filtering
- Usage check query for pre-delete validation
- Single font query for detail view

---

### Step 6: Update Export Files

#### 6.1 Update Types Export

**File**: `/workspaces/cgvs/server/types/index.ts`

**Action**: Add at appropriate location (alphabetically):

```typescript
export * from "./font.types";
```

#### 6.2 Update Repository Export

**File**: `/workspaces/cgvs/server/db/repo/index.ts`

**Action**: Add at appropriate location (alphabetically):

```typescript
export * from "./font.repository";
```

#### 6.3 Update Pothos Export

**File**: `/workspaces/cgvs/server/graphql/pothos/index.ts`

**Action**: Add at appropriate location:

```typescript
export * from "./font.pothos";
```

#### 6.4 Update Mutation Export

**File**: `/workspaces/cgvs/server/graphql/mutation/index.ts`

**Action**: Add import at top:

```typescript
import "./font.mutation";
```

#### 6.5 Update Query Export

**File**: `/workspaces/cgvs/server/graphql/query/index.ts`

**Action**: Add import at top:

```typescript
import "./font.query";
```

---

## Validation Checklist

After implementation, verify:

1. **TypeScript Compilation**

```bash
~/.bun/bin/bun tsc
```

Expected: No errors

2. **Linting**

```bash
~/.bun/bin/bun lint
```

Expected: No errors

3. **Schema Files**

- [ ] `/workspaces/cgvs/server/types/font.types.ts` created
- [ ] `/workspaces/cgvs/server/db/repo/font.repository.ts` created
- [ ] `/workspaces/cgvs/server/graphql/pothos/font.pothos.ts` created
- [ ] `/workspaces/cgvs/server/graphql/mutation/font.mutation.ts` created
- [ ] `/workspaces/cgvs/server/graphql/query/font.query.ts` created

4. **Exports Updated**

- [ ] `server/types/index.ts` includes font.types export
- [ ] `server/db/repo/index.ts` includes font.repository export
- [ ] `server/graphql/pothos/index.ts` includes font.pothos export
- [ ] `server/graphql/mutation/index.ts` includes font.mutation import
- [ ] `server/graphql/query/index.ts` includes font.query import

5. **Manual Testing** (optional, after GraphQL regeneration)

- Test createFont mutation with valid inputs
- Test createFont mutation with invalid storage file ID (should fail)
- Test updateFont mutation
- Test deleteFont mutation on unused font
- Test deleteFont mutation on used font (should fail)
- Test fonts query
- Test searchFonts query
- Test checkFontUsage query

---

## Next Steps

After successful validation:

1. Regenerate GraphQL schema (if auto-generation is not enabled)
2. Proceed to Sub-Plan 2: Client Foundation
3. Update master plan progress

---

## Notes

- Locale format: Stored as comma-separated string in DB, exposed as array in GraphQL
- Storage file validation ensures referential integrity
- Usage check prevents orphaned references in certificate elements
- All operations logged for debugging
- Error messages are user-friendly and descriptive
