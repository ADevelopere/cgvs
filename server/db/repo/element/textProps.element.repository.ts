import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { elementTextProps } from "@/server/db/schema";
import {
  TextPropsInput,
  TextPropsUpdateInput,
  ElementTextPropsEntity,
  ElementTextPropsInsert,
  FontSource,
} from "@/server/types/element";
import logger from "@/server/lib/logger";
import { CommonElementUtils } from "@/server/utils";

/**
 * Repository for element_text_props table operations
 * Handles CRUD operations for shared text properties across multiple element types
 * (TEXT, DATE, NUMBER, COUNTRY, GENDER)
 */
export namespace TextPropsRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create new TextProps row
   * Converts TextPropsCreateInput → ElementTextPropsInsert
   * Always creates new row (no deduplication)
   */
  export const create = async (textProps: TextPropsInput): Promise<ElementTextPropsEntity> => {
    const fontVariantId = textProps.fontRef.type === FontSource.SELF_HOSTED ? textProps.fontRef.fontVariantId : null;

    const googleFontFamily = textProps.fontRef.type === FontSource.GOOGLE ? textProps.fontRef.family : null;

    const googleFontVariant = textProps.fontRef.type === FontSource.GOOGLE ? textProps.fontRef.variant : null;

    // Insert
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

    if (!created) throw new Error("Failed to create TextProps");

    logger.info(`TextProps created: ID ${created.id}`);
    return created;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update TextProps row
   * Supports deep partial semantics:
   * - undefined = preserve existing value (don't update)
   * - null = update field to null
   * - value = update field to value
   */
  export const update = async (
    input: TextPropsUpdateInput,
    validated: boolean = false
  ): Promise<ElementTextPropsEntity> => {
    // Validate exists
    if (!validated) {
      await findByIdOrThrow(input.id);
      await CommonElementUtils.checkTextProps(input);
    }

    const updates: ElementTextPropsInsert = {
      ...input,
      fontSource: input.fontRef.type,
      fontVariantId: input.fontRef.type === FontSource.SELF_HOSTED ? input.fontRef.fontVariantId : null,
      googleFontFamily: input.fontRef.type === FontSource.GOOGLE ? input.fontRef.family : null,
      googleFontVariant: input.fontRef.type === FontSource.GOOGLE ? input.fontRef.variant : null,
    };

    // Update
    const [updated] = await db
      .update(elementTextProps)
      .set(updates)
      .where(eq(elementTextProps.id, input.id))
      .returning();

    if (!updated) throw new Error("Failed to update TextProps");

    logger.info(`TextProps updated: ID ${updated.id}`);
    return updated;
  };

  // ============================================================================
  // Read Operations
  // ============================================================================

  /**
   * Find TextProps by ID
   * @returns TextProps entity or null if not found
   */
  export const findById = async (id: number): Promise<ElementTextPropsEntity | null> => {
    const result = await db.select().from(elementTextProps).where(eq(elementTextProps.id, id)).limit(1);
    return result[0] || null;
  };

  /**
   * Find TextProps by ID or throw error
   * @throws Error if TextProps not found
   */
  export const findByIdOrThrow = async (id: number): Promise<ElementTextPropsEntity> => {
    const entity = await findById(id);
    if (!entity) {
      throw new Error(`TextProps with ID ${id} does not exist.`);
    }
    return entity;
  };

  // ============================================================================
  // Delete Operation
  // ============================================================================

  /**
   * Delete TextProps by ID
   * Note: Will fail if referenced by any element due to FK constraints
   */
  export const deleteById = async (id: number): Promise<void> => {
    await findByIdOrThrow(id); // Validate exists
    await db.delete(elementTextProps).where(eq(elementTextProps.id, id));
    logger.info(`TextProps deleted: ID ${id}`);
  };
}
