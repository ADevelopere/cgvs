import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import {
  CertificateElementEntity,
  TextElementCreateInput,
  TextElementUpdateInput,
  TextElementConfigInput,
  ElementType,
  FontSource,
  TextDataSourceType,
  ElementConfig,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";
import { ElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";

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
    await validateCreateInput(input);

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

    // 3. Validate update input
    await validateUpdateInput(input);

    // 4. Build update object (exclude config as it needs special handling)
    const { config: _, ...baseUpdates } = input;
    const updates: Partial<CertificateElementEntity> = {
      ...baseUpdates,
      updatedAt: new Date(),
    };

    // 5. If config is being updated, re-extract FKs
    if (input.config) {
      // Merge partial config with existing - cast to ElementConfig since we know it's TEXT
      const mergedConfig = {
        ...existing.config,
        ...input.config,
      } as ElementConfig;
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
  // Validation
  // ============================================================================

  /**
   * Validate TEXT element config
   * Checks font reference, template variable reference, and static text value
   */
  export const validateConfig = async (
    config: TextElementConfigInput
  ): Promise<void> => {
    // Validate font exists (if self-hosted)
    if (config.textProps.fontRef.type === FontSource.SELF_HOSTED) {
      await ElementRepository.validateFontId(config.textProps.fontRef.fontId);
    }

    // Validate template variable (if using)
    if (
      config.dataSource.type === TextDataSourceType.TEMPLATE_TEXT_VARIABLE ||
      config.dataSource.type === TextDataSourceType.TEMPLATE_SELECT_VARIABLE
    ) {
      await ElementRepository.validateTemplateVariableId(
        config.dataSource.variableId
      );
    }

    // TEXT-specific validation
    if (config.dataSource.type === TextDataSourceType.STATIC) {
      if (!config.dataSource.value || config.dataSource.value.trim().length === 0) {
        throw new Error("Static text value cannot be empty");
      }
    }
  };

  // ============================================================================
  // Helper: Validate Create Input
  // ============================================================================

  /**
   * Validate all fields for create operation
   * Checks template, name, dimensions, position, render order, and config
   */
  const validateCreateInput = async (
    input: TextElementCreateInput
  ): Promise<void> => {
    // Template exists
    await ElementRepository.validateTemplateId(input.templateId);

    // Name validation
    const nameError = await ElementUtils.validateName(input.name);
    if (nameError) throw new Error(nameError);

    // Dimensions validation
    const dimError = await ElementUtils.validateDimensions(
      input.width,
      input.height
    );
    if (dimError) throw new Error(dimError);

    // Position validation
    const posError = await ElementUtils.validatePosition(
      input.positionX,
      input.positionY
    );
    if (posError) throw new Error(posError);

    // Render order validation
    const orderError = await ElementUtils.validateRenderOrder(input.renderOrder);
    if (orderError) throw new Error(orderError);

    // Config validation
    await validateConfig(input.config);
  };

  // ============================================================================
  // Helper: Validate Update Input
  // ============================================================================

  /**
   * Validate all fields for update operation (partial)
   * Only validates fields that are being updated
   */
  const validateUpdateInput = async (
    input: TextElementUpdateInput
  ): Promise<void> => {
    // Name validation (if provided)
    if (input.name !== undefined) {
      const nameError = await ElementUtils.validateName(input.name);
      if (nameError) throw new Error(nameError);
    }

    // Dimensions validation (if provided)
    if (input.width !== undefined || input.height !== undefined) {
      // For partial updates, need to get existing values
      const existing = await ElementRepository.findByIdOrThrow(input.id);
      const width = input.width ?? existing.width;
      const height = input.height ?? existing.height;
      const dimError = await ElementUtils.validateDimensions(width, height);
      if (dimError) throw new Error(dimError);
    }

    // Position validation (if provided)
    if (input.positionX !== undefined || input.positionY !== undefined) {
      const existing = await ElementRepository.findByIdOrThrow(input.id);
      const x = input.positionX ?? existing.positionX;
      const y = input.positionY ?? existing.positionY;
      const posError = await ElementUtils.validatePosition(x, y);
      if (posError) throw new Error(posError);
    }

    // Render order validation (if provided)
    if (input.renderOrder !== undefined) {
      const orderError = await ElementUtils.validateRenderOrder(
        input.renderOrder
      );
      if (orderError) throw new Error(orderError);
    }

    // Config validation (if provided)
    if (input.config) {
      // Get existing element to merge partial config
      const existing = await ElementRepository.findByIdOrThrow(input.id);
      // Merge partial config with existing for validation
      const mergedConfig = {
        ...existing.config,
        ...input.config,
      } as TextElementConfigInput;
      await validateConfig(mergedConfig);
    }
  };
}

