import {
  ImageElementConfigCreateInput,
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
  ImageElementConfigUpdateInput,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
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
    input?: ImageDataSourceInputGraphql | null
  ): ImageDataSourceInput | null | undefined => {
    if (!input) {
      return input;
    }
    if (input.storageFile !== undefined) {
      return {
        type: ImageDataSourceType.STORAGE_FILE,
        storageFileId: input.storageFile.storageFileId,
      };
    }
    throw new Error("Invalid ImageDataSource input: must specify storageFile");
  };

  /**
   * Map GraphQL ImageElementConfig input to repository ImageElementConfig input
   */
  export const mapImageElementConfigGraphqlToInput = (
    input: ImageElementConfigInputGraphql
  ): ImageElementConfigCreateInput => {
    return {
      ...input,
      dataSource: mapImageDataSourceGraphqlToInput(input.dataSource)!,
    };
  };

  /**
   * Map GraphQL ImageElementConfig update input (partial) to repository ImageElementConfig input (partial)
   */
  export const mapImageElementConfigUpdateGraphqlToInput = (
    input?: ImageElementConfigUpdateInputGraphql | null
  ): ImageElementConfigUpdateInput | null | undefined => {
    if (!input) {
      return input;
    }
    return {
      ...input,
      dataSource: mapImageDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL ImageElement create input to repository ImageElement create input
   */
  export const mapImageElementCreateGraphqlToInput = (
    input: ImageElementCreateInputGraphql
  ): ImageElementCreateInput => {
    return {
      ...input,
      config: mapImageElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL ImageElement update input to repository ImageElement update input
   */
  export const mapImageElementUpdateGraphqlToInput = (
    input: ImageElementUpdateInputGraphql
  ): ImageElementUpdateInput => {
    return {
      ...input,
      config: mapImageElementConfigUpdateGraphqlToInput(input.config),
    };
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete IMAGE element config
   * Validates storage file reference and image fit
   */
  export const validateConfig = async (
    config: ImageElementConfigCreateInput
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
    config: ImageElementConfigCreateInput
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
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

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
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Config validation (if provided) - handled separately with deep merge
  };

  export const extractStorageFileId = (
    config?:
      | ImageElementConfigCreateInput
      | ImageElementConfigUpdateInput
      | null
  ): number | null | undefined => {
    if (!config) return config;

    const { dataSource } = config;
    if (!dataSource) return dataSource;

    if (dataSource.type !== ImageDataSourceType.STORAGE_FILE) {
      throw new Error(
        `Invalid image data source type: ${dataSource.type}. Must be STORAGE_FILE`
      );
    }

    return dataSource.storageFileId;
  };
}
