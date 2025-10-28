import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  ImageElementCreateInput,
  ImageElementUpdateInput,
  ElementType,
  ImageElementConfig,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, ImageElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";

/**
 * Repository for IMAGE element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace ImageElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new IMAGE element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: ImageElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await ImageElementUtils.validateCreateInput(input);

    // 2. Extract FKs from config
    const storageFileId = ElementUtils.extractStorageFileId(input.config);
    const fontId = null; // IMAGE elements don't have textProps
    const templateVariableId = null; // IMAGE elements don't use variables

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.IMAGE,
        fontId,
        templateVariableId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`IMAGE element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing IMAGE element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: ImageElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's an IMAGE element
    if (existing.type !== ElementType.IMAGE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not IMAGE. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await ImageElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates: Partial<CertificateElementEntity> = {
      ...baseUpdates,
      updatedAt: new Date(),
    };

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig: ImageElementConfig = merge(
        {},
        existing.config,
        input.config
      );

      // Validate merged config
      await ImageElementUtils.validateConfig(mergedConfig);

      // Apply merged config and extract FKs
      updates.config = mergedConfig;
      updates.storageFileId = ElementUtils.extractStorageFileId(mergedConfig);
      // IMAGE elements don't have fontId or templateVariableId
    }

    // 6. Update
    const [updated] = await db
      .update(certificateElement)
      .set(updates)
      .where(eq(certificateElement.id, input.id))
      .returning();

    logger.info(`IMAGE element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };
}
