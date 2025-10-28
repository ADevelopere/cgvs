import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  GenderElementCreateInput,
  GenderElementUpdateInput,
  ElementType,
  GenderElementConfig,
  GenderElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, GenderElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";

/**
 * Repository for GENDER element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace GenderElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new GENDER element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: GenderElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await GenderElementUtils.validateCreateInput(input);

    // 2. Extract FKs from config (GENDER only has fontId)
    const fontId = ElementUtils.extractFontId(input.config);
    const templateVariableId = null; // GENDER doesn't use template variables
    const storageFileId = null; // GENDER doesn't use storage files

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.GENDER,
        fontId,
        templateVariableId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`GENDER element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing GENDER element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: GenderElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a GENDER element
    if (existing.type !== ElementType.GENDER) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not GENDER. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await GenderElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates: Partial<CertificateElementEntity> = {
      ...baseUpdates,
      updatedAt: new Date(),
    };

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig: GenderElementConfig = merge(
        {},
        existing.config,
        input.config
      );

      // Validate merged config
      await GenderElementUtils.validateConfig(mergedConfig);

      // Apply merged config and extract FKs (GENDER only has fontId)
      updates.config = mergedConfig;
      updates.fontId = ElementUtils.extractFontId(mergedConfig);
      updates.templateVariableId = null; // GENDER doesn't use template variables
      updates.storageFileId = null; // GENDER doesn't use storage files
    }

    // 6. Update
    const [updated] = await db
      .update(certificateElement)
      .set(updates)
      .where(eq(certificateElement.id, input.id))
      .returning();

    logger.info(`GENDER element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operation (for Pothos DataLoader)
  // ============================================================================

  /**
   * Load GENDER elements by IDs (for GraphQL DataLoader)
   * Returns elements in same order as input IDs, with Error for missing/wrong type
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(GenderElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    const elements = await ElementRepository.loadByIds(ids);

    return elements.map(element => {
      if (element instanceof Error) return element;

      if (element.type !== ElementType.GENDER) {
        return new Error(
          `Element ${element.id} is ${element.type}, not GENDER`
        );
      }

      return {
        ...element,
        config: element.config as GenderElementConfig,
      };
    });
  };
}
