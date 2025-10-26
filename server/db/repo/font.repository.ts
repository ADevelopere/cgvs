import { db } from "@/server/db/drizzleDb";
import { eq, ilike, inArray, sql } from "drizzle-orm";
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
    const result = await db
      .select()
      .from(font)
      .where(eq(font.id, id))
      .limit(1);
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
    return db
      .select()
      .from(font)
      .where(eq(font.storageFileId, fileId));
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
      logger.warn(`Invalid locale codes detected: ${invalidLocales.join(", ")}`);
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
   * Fonts are stored in the config JSONB field as:
   * { textProps: { fontRef: { type: "SELF_HOSTED", fontId: number } } }
   */
  export const checkUsage = async (
    id: number
  ): Promise<FontUsageCheckResult> => {
    try {
      // Query certificate elements where config contains this fontId
      // Using JSON path query: config->>'textProps'->>'fontRef'->>'fontId'
      const usages = await db
        .select({
          elementId: certificateElement.id,
          elementType: certificateElement.type,
          templateId: certificateElement.templateId,
          config: certificateElement.config,
        })
        .from(certificateElement)
        .where(
          sql`${certificateElement.config}::jsonb @> jsonb_build_object('textProps', jsonb_build_object('fontRef', jsonb_build_object('type', 'SELF_HOSTED', 'fontId', ${id})))`
        );

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
