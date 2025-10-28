import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema";
import {
  CertificateElementEntity,
  DateElementCreateInput,
  DateElementUpdateInput,
  ElementType,
  DateElementConfig,
  DateElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, DateElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";

/**
 * Repository for DATE element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace DateElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new DATE element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: DateElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await DateElementUtils.validateCreateInput(input);

    const config: DateElementConfig = input.config;
    // 3. Extract FKs from config
    const fontId = ElementUtils.extractFontId(config);
    const templateVariableId = ElementUtils.extractTemplateVariableId(config);
    const storageFileId = ElementUtils.extractStorageFileId(config);

    // 4. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        config: config,
        type: ElementType.DATE,
        fontId,
        templateVariableId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 5. Log and return
    logger.info(`DATE element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing DATE element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: DateElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a DATE element
    if (existing.type !== ElementType.DATE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not DATE. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await DateElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates: Partial<CertificateElementEntity> = {
      ...baseUpdates,
      updatedAt: new Date(),
    };

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig: DateElementConfig = merge(
        {},
        existing.config,
        input.config
      );

      // Validate merged config
      await DateElementUtils.validateConfig(mergedConfig);

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

    logger.info(`DATE element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operation (for Pothos)
  // ============================================================================

  /**
   * Load multiple DATE elements by IDs for Pothos GraphQL layer
   * Returns elements with typed config for GraphQL schema
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(DateElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    const elements = await ElementRepository.loadByIds(ids);

    return elements.map(element => {
      if (element instanceof Error) return element;

      if (element.type !== ElementType.DATE) {
        return new Error(`Element ${element.id} is ${element.type}, not DATE`);
      }

      return {
        ...element,
        config: element.config as DateElementConfig,
      };
    });
  };
}
