import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  QRCodeElementCreateInput,
  QRCodeElementUpdateInput,
  ElementType,
  QRCodeElementConfig,
  QRCodeElementPothosDefinition,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import logger from "@/server/lib/logger";
import { merge } from "lodash";
import { BaseElementUtils, QRCodeElementUtils } from "@/server/utils/element";

/**
 * Repository for QR_CODE element operations
 * Handles create, update, and validation with automatic FK synchronization
 */
export namespace QRCodeElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new QR_CODE element
   * Validates input, extracts FKs from config, and inserts element
   */
  export const create = async (
    input: QRCodeElementCreateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Validate input
    await QRCodeElementUtils.validateCreateInput(input);

    // 3. Insert element
    const [element] = await db
      .insert(certificateElement)
      .values({
        ...input,
        type: ElementType.QR_CODE,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Log and return
    logger.info(`QR_CODE element created: ${element.name} (ID: ${element.id})`);
    return element;
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing QR_CODE element
   * Supports partial updates with config merging and FK re-extraction
   */
  export const update = async (
    input: QRCodeElementUpdateInput
  ): Promise<CertificateElementEntity> => {
    // 1. Get existing element
    const existing = await ElementRepository.findByIdOrThrow(input.id);

    // 2. Validate it's a QR_CODE element
    if (existing.type !== ElementType.QR_CODE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not QR_CODE. Use correct repository.`
      );
    }

    // 3. Validate update input (pass existing to avoid redundant DB query)
    await QRCodeElementUtils.validateUpdateInput(input, existing);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates = BaseElementUtils.baseUpdates(baseUpdates, existing);

    // 5. If config is being updated, deep merge and re-extract FKs
    if (input.config) {
      // Deep merge partial config with existing to preserve nested properties
      const mergedConfig = merge({}, existing.config, input.config);

      updates.config = mergedConfig;
    }

    // 6. Update element
    const [updated] = await db
      .update(certificateElement)
      .set(updates)
      .where(eq(certificateElement.id, input.id))
      .returning();

    // 7. Log and return
    logger.info(`QR_CODE element updated: ${updated.name} (ID: ${updated.id})`);
    return updated;
  };

  // ============================================================================
  // Load Operations (for Pothos Dataloader)
  // ============================================================================

  /**
   * Load QR_CODE elements by IDs for Pothos dataloader
   * Returns array with QRCodeElementPothosDefinition or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(QRCodeElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    // Get elements from repository
    const elements = await ElementRepository.loadByIds(ids);

    // Map to maintain order and validate QR_CODE type
    return elements.map(element => {
      if (element instanceof Error) return element;

      // Validate element type
      if (element.type !== ElementType.QR_CODE) {
        return new Error(
          `Element ${element.id} is ${element.type}, not QR_CODE`
        );
      }

      // Return as QRCodeElementPothosDefinition
      return {
        ...element,
        config: element.config as QRCodeElementConfig,
      };
    });
  };
}
