import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  NumberElementCreateInput,
  NumberElementUpdateInput,
  ElementType,
  NumberElementConfig,
  NumberElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, NumberElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";
import { BaseElementUtils } from "@/server/utils/element";

/**
 * Repository for NUMBER element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace NumberElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new NUMBER element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: NumberElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await NumberElementUtils.validateCreateInput(input);

    // 2. Extract FKs from config
    const fontId = ElementUtils.extractFontIdFromConfigTextProps(input.config);
    const templateVariableId =
      ElementUtils.extractTemplateVariableIdFromConfigDataSource(input.config);
    const storageFileId = ElementUtils.extractStorageFileIdFromConfigTextProps(
      input.config
    );

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.NUMBER,
        fontId,
        templateVariableId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`NUMBER element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing NUMBER element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: NumberElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a NUMBER element
    if (existing.type !== ElementType.NUMBER) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not NUMBER. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await NumberElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates = BaseElementUtils.baseUpdates(baseUpdates, existing);

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig = merge({}, existing.config, input.config);

      // Validate merged config
      // await NumberElementUtils.validateConfig(input.config);

      // Apply merged config and extract FKs
      updates.fontId = ElementUtils.extractFontIdFromConfigTextProps(
        input.config
      );
      updates.templateVariableId =
        ElementUtils.extractTemplateVariableIdFromConfigDataSource(
          input.config
        );
      updates.storageFileId =
        ElementUtils.extractStorageFileIdFromConfigTextProps(input.config);
      updates.config = mergedConfig;
    }

    // 6. Update
    const [updated] = await db
      .update(certificateElement)
      .set(updates)
      .where(eq(certificateElement.id, input.id))
      .returning();

    logger.info(`NUMBER element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load NUMBER elements by IDs for GraphQL dataloader
   * Returns Error for missing or mismatched elements
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(NumberElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    const elements = await ElementRepository.loadByIds(ids);

    return elements.map(element => {
      if (element instanceof Error) return element;

      if (element.type !== ElementType.NUMBER) {
        return new Error(
          `Element ${element.id} is ${element.type}, not NUMBER`
        );
      }

      return {
        ...element,
        config: element.config as NumberElementConfig,
      };
    });
  };
}
