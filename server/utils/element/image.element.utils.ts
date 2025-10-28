import {
  ImageElementConfigInput,
  ImageDataSourceType,
  ElementImageFit,
  ImageElementCreateInput,
  ImageElementUpdateInput,
  CertificateElementEntity,
  ImageDataSourceInput,
  ImageDataSourceInputGraphql,
  ImageElementConfigInputGraphql,
  ImageElementConfigUpdateInputGraphql,
  ImageElementCreateInputGraphql,
  ImageElementUpdateInputGraphql,
  ElementType,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for IMAGE elements
 * Contains all IMAGE-specific validation logic
 */
export namespace ImageElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL ImageDataSource input to repository ImageDataSource input
   * Note: IMAGE has only one data source variant (storageFile)
   */
  export const mapImageDataSourceGraphqlToInput = (
    input: ImageDataSourceInputGraphql
  ): ImageDataSourceInput => {
    if (input.storageFile !== undefined) {
      return {
        type: ImageDataSourceType.STORAGE_FILE,
        storageFileId: input.storageFile.storageFileId,
      };
    }
    throw new Error(
      "Invalid ImageDataSource input: must specify storageFile"
    );
  };

  /**
   * Map GraphQL ImageElementConfig input to repository ImageElementConfig input
   */
  export const mapImageElementConfigGraphqlToInput = (
    input: ImageElementConfigInputGraphql
  ): ImageElementConfigInput => {
    return {
      type: ElementType.IMAGE,
      dataSource: mapImageDataSourceGraphqlToInput(input.dataSource),
      fit: input.fit,
    };
  };

  /**
   * Map GraphQL ImageElementConfig update input (partial) to repository ImageElementConfig input (partial)
   */
  export const mapImageElementConfigUpdateGraphqlToInput = (
    input: ImageElementConfigUpdateInputGraphql
  ): Partial<ImageElementConfigInput> => {
    const result: Partial<ImageElementConfigInput> = {};

    if (input.dataSource !== undefined) {
      result.dataSource = mapImageDataSourceGraphqlToInput(input.dataSource);
    }
    if (input.fit !== undefined) {
      result.fit = input.fit;
    }

    return result;
  };

  /**
   * Map GraphQL ImageElement create input to repository ImageElement create input
   */
  export const mapImageElementCreateGraphqlToInput = (
    input: ImageElementCreateInputGraphql
  ): ImageElementCreateInput => {
    return {
      templateId: input.templateId,
      name: input.name,
      description: input.description,
      positionX: input.positionX,
      positionY: input.positionY,
      width: input.width,
      height: input.height,
      alignment: input.alignment,
      renderOrder: input.renderOrder,
      config: mapImageElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL ImageElement update input to repository ImageElement update input
   */
  export const mapImageElementUpdateGraphqlToInput = (
    input: ImageElementUpdateInputGraphql
  ): ImageElementUpdateInput => {
    const result: ImageElementUpdateInput = {
      id: input.id,
    };

    if (input.name !== undefined) result.name = input.name;
    if (input.description !== undefined) result.description = input.description;
    if (input.positionX !== undefined) result.positionX = input.positionX;
    if (input.positionY !== undefined) result.positionY = input.positionY;
    if (input.width !== undefined) result.width = input.width;
    if (input.height !== undefined) result.height = input.height;
    if (input.alignment !== undefined) result.alignment = input.alignment;
    if (input.renderOrder !== undefined) result.renderOrder = input.renderOrder;

    if (input.config !== undefined) {
      result.config = mapImageElementConfigUpdateGraphqlToInput(input.config);
    }

    return result;
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete IMAGE element config
   * Validates storage file reference and image fit
   */
  export const validateConfig = async (
    config: ImageElementConfigInput
  ): Promise<void> => {
    // Validate data source
    await validateDataSource(config);

    // Validate image fit
    validateImageFit(config.fit);
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate image data source
   * IMAGE elements only support STORAGE_FILE data source
   */
  const validateDataSource = async (
    config: ImageElementConfigInput
  ): Promise<void> => {
    const dataSource = config.dataSource;

    // Validate type is STORAGE_FILE
    if (dataSource.type !== ImageDataSourceType.STORAGE_FILE) {
      throw new Error(
        `Invalid image data source type: ${dataSource.type}. Must be STORAGE_FILE`
      );
    }

    // Validate storage file exists
    await ElementRepository.validateStorageFileId(dataSource.storageFileId);
  };

  /**
   * Validate image fit enum
   */
  const validateImageFit = (fit: ElementImageFit): void => {
    const validFits = Object.values(ElementImageFit);
    if (!validFits.includes(fit)) {
      throw new Error(
        `Invalid image fit: ${fit}. Must be one of: ${validFits.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for IMAGE element creation
   */
  export const validateCreateInput = async (
    input: ImageElementCreateInput
  ): Promise<void> => {
    // Template exists
    await ElementRepository.validateTemplateId(input.templateId);

    // Name validation
    const nameError = await ElementUtils.validateName(input.name);
    if (nameError) throw new Error(nameError);

    // Description validation
    CommonElementUtils.validateDescription(input.description);

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
    const orderError = await ElementUtils.validateRenderOrder(
      input.renderOrder
    );
    if (orderError) throw new Error(orderError);

    // Config validation
    await validateConfig(input.config);
  };

  // ============================================================================
  // Update Input Validation
  // ============================================================================

  /**
   * Validate all fields for IMAGE element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: ImageElementUpdateInput,
    existing?: CertificateElementEntity
  ): Promise<void> => {
    // Cache existing element if not provided
    let cachedExisting = existing;

    const getExisting = async () => {
      if (!cachedExisting) {
        cachedExisting = await ElementRepository.findByIdOrThrow(input.id);
      }
      return cachedExisting;
    };

    // Name validation (if provided)
    if (input.name !== undefined) {
      const nameError = await ElementUtils.validateName(input.name);
      if (nameError) throw new Error(nameError);
    }

    // Description validation (if provided)
    if (input.description !== undefined) {
      CommonElementUtils.validateDescription(input.description);
    }

    // Dimensions validation (if provided)
    if (input.width !== undefined || input.height !== undefined) {
      const elem = await getExisting();
      const width = input.width ?? elem.width;
      const height = input.height ?? elem.height;
      const dimError = await ElementUtils.validateDimensions(width, height);
      if (dimError) throw new Error(dimError);
    }

    // Position validation (if provided)
    if (input.positionX !== undefined || input.positionY !== undefined) {
      const elem = await getExisting();
      const x = input.positionX ?? elem.positionX;
      const y = input.positionY ?? elem.positionY;
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

    // Config validation (if provided) - handled separately with deep merge
  };
}
