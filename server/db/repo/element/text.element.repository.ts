import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  TextElementCreateInput,
  TextElementUpdateInput,
  ElementType,
  TextElementConfig,
  TextElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, TextElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";

/**
 * Repository for TEXT element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace TextElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new TEXT element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: TextElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await TextElementUtils.validateCreateInput(input);

    // 2. Extract FKs from config
    const fontId = ElementUtils.extractFontId(input.config);
    const templateVariableId = ElementUtils.extractTemplateVariableId(
      input.config
    );
    const storageFileId = ElementUtils.extractStorageFileId(input.config);

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.TEXT,
        fontId,
        templateVariableId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`TEXT element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing TEXT element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: TextElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a TEXT element
    if (existing.type !== ElementType.TEXT) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not TEXT. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await TextElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates: Partial<CertificateElementEntity> = {
      ...baseUpdates,
      updatedAt: new Date(),
    };

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig: TextElementConfig = merge(
        {},
        existing.config,
        input.config
      );

      // Validate merged config
      await TextElementUtils.validateConfig(mergedConfig);

      // Apply merged config and extract FKs
      updates.config = mergedConfig;
      updates.fontId = ElementUtils.extractFontId(mergedConfig);
      updates.templateVariableId =
        ElementUtils.extractTemplateVariableId(mergedConfig);
      updates.storageFileId = ElementUtils.extractStorageFileId(mergedConfig);
    }

    // 6. Update
    const [updated] = await db
      .update(certificateElement)
      .set(updates)
      .where(eq(certificateElement.id, input.id))
      .returning();

    logger.info(`TEXT element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operations (for Pothos Dataloader)
  // ============================================================================

  /**
   * Load TEXT elements by IDs for Pothos dataloader
   * Returns array with TextElementPothosDefinition or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(TextElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    // Get elements from repository
    const elements = await ElementRepository.loadByIds(ids);

    // Map to maintain order and validate TEXT type
    return elements.map((element) => {
      if (element instanceof Error) return element;

      // Validate element type
      if (element.type !== ElementType.TEXT) {
        return new Error(`Element ${element.id} is ${element.type}, not TEXT`);
      }

      // Return as TextElementPothosDefinition
      return {
        ...element,
        config: element.config as TextElementConfig,
      };
    });
  };
}
