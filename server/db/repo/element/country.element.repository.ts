import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema";
import {
  CertificateElementEntity,
  CountryElementCreateInput,
  CountryElementUpdateInput,
  ElementType,
  CountryElementConfig,
  CountryElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils, CountryElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { merge } from "lodash";
import { BaseElementUtils } from "@/server/utils/element";

/**
 * Repository for COUNTRY element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace CountryElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new COUNTRY element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: CountryElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await CountryElementUtils.validateCreateInput(input);

    // 2. Extract FKs from config (only fontId for COUNTRY elements)
    const fontId = ElementUtils.extractFontIdFromConfigTextProps(input.config);
    const storageFileId = ElementUtils.extractStorageFileIdFromConfigTextProps(
      input.config
    );

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.COUNTRY,
        fontId,
        storageFileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`COUNTRY element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing COUNTRY element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: CountryElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a COUNTRY element
    if (existing.type !== ElementType.COUNTRY) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not COUNTRY. Use correct type.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await CountryElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates = BaseElementUtils.baseUpdates(baseUpdates, existing);

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig = merge(
        {},
        existing.config as CountryElementConfig,
        input.config
      );

      // Validate merged config
      // await CountryElementUtils.validateConfigCreateInput(mergedConfig);

      // Apply merged config and extract FKs
      updates.fontId = ElementUtils.extractFontIdFromConfigTextProps(
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

    logger.info(`COUNTRY element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operations (for Pothos)
  // ============================================================================

  /**
   * Load COUNTRY elements by IDs for Pothos GraphQL layer
   * Returns Error for missing/invalid elements
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(CountryElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    const elements = await ElementRepository.loadByIds(ids);

    return elements.map(element => {
      if (element instanceof Error) return element;

      if (element.type !== ElementType.COUNTRY) {
        return new Error(
          `Element ${element.id} is ${element.type}, not COUNTRY`
        );
      }

      return {
        ...element,
        config: element.config as CountryElementConfig,
      };
    });
  };
}
