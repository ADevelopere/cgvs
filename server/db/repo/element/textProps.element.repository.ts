import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { elementTextProps } from "@/server/db/schema";
import {
  TextPropsCreateInput,
  TextPropsUpdateInput,
  ElementTextPropsEntity,
  ElementTextPropsInsert,
  FontSource,
} from "@/server/types/element";
import logger from "@/server/lib/logger";

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
  export const create = async (
    textProps: TextPropsCreateInput
  ): Promise<ElementTextPropsEntity> => {
    // Extract fontId from fontRef
    const fontId =
      textProps.fontRef.type === FontSource.SELF_HOSTED
        ? textProps.fontRef.fontId
        : null;

    const googleFontIdentifier =
      textProps.fontRef.type === FontSource.GOOGLE
        ? textProps.fontRef.identifier
        : null;

    // Insert
    const [created] = await db
      .insert(elementTextProps)
      .values({
        ...textProps,
        fontSource: textProps.fontRef.type,
        fontId,
        googleFontIdentifier,
      })
      .returning();

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
    id: number,
    textProps: TextPropsUpdateInput
  ): Promise<ElementTextPropsEntity> => {
    // Validate exists
    await findByIdOrThrow(id);

    // Build update object - only include fields that are not undefined
    const updates: Partial<ElementTextPropsInsert> = {
      fontSize: textProps.fontSize,
      color: textProps.color,
      overflow: textProps.overflow,
    };

    // Handle fontRef update
    if (textProps.fontRef) {
      updates.fontSource = textProps.fontRef.type;
      updates.fontId =
        textProps.fontRef.type === FontSource.SELF_HOSTED
          ? textProps.fontRef.fontId
          : null;
      updates.googleFontIdentifier =
        textProps.fontRef.type === FontSource.GOOGLE
          ? textProps.fontRef.identifier
          : null;
    }

    // Handle fontSize
    if (textProps.fontSize) {
      updates.fontSize = textProps.fontSize;
    }

    // Handle color
    if (textProps.color) {
      updates.color = textProps.color;
    }

    // Handle overflow
    if (textProps.overflow) {
      updates.overflow = textProps.overflow;
    }

    // Only update if there are changes
    if (Object.keys(updates).length === 0) {
      logger.info(`TextProps update skipped (no changes): ID ${id}`);
      return findByIdOrThrow(id);
    }

    // Update
    const [updated] = await db
      .update(elementTextProps)
      .set(updates)
      .where(eq(elementTextProps.id, id))
      .returning();

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
  export const findById = async (
    id: number
  ): Promise<ElementTextPropsEntity | null> => {
    const result = await db
      .select()
      .from(elementTextProps)
      .where(eq(elementTextProps.id, id))
      .limit(1);
    return result[0] || null;
  };

  /**
   * Find TextProps by ID or throw error
   * @throws Error if TextProps not found
   */
  export const findByIdOrThrow = async (
    id: number
  ): Promise<ElementTextPropsEntity> => {
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
