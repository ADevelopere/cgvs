import {
  ImageDataSourceType,
  ElementImageFit,
  ImageElementInput,
  ImageElementUpdateInput,
  ImageDataSourceInput,
  ImageDataSourceInputGraphql,
  ImageElementInputGraphql,
  ImageElementUpdateInputGraphql,
  ImageDataSource,
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
    input: ImageDataSourceInputGraphql
  ): ImageDataSourceInput => {
    if (!input || input.storageFile === undefined) {
      throw new Error(
        "Invalid ImageDataSource input: must specify storageFile"
      );
    }
    return {
      type: ImageDataSourceType.STORAGE_FILE,
      storageFileId: input.storageFile.storageFileId,
    };
  };

  /**
   * Map GraphQL ImageElement create input to repository ImageElement create input
   */
  export const mapImageElementCreateGraphqlToInput = (
    input: ImageElementInputGraphql
  ): ImageElementInput => {
    if (!input || !input.base || !input.imageProps || !input.dataSource) {
      throw new Error(
        "ImageElementInputGraphql must include base, imageProps, and dataSource"
      );
    }
    return {
      base: input.base,
      imageProps: input.imageProps,
      dataSource: mapImageDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL ImageElement update input to repository ImageElement update input
   */
  export const mapImageElementUpdateGraphqlToInput = (
    input: ImageElementUpdateInputGraphql
  ): ImageElementUpdateInput => {
    if (!input || !input.base || !input.imageProps || !input.dataSource) {
      throw new Error(
        "ImageElementUpdateInputGraphql must include base, imageProps, and dataSource"
      );
    }
    return {
      id: input.id,
      base: input.base,
      imageProps: input.imageProps,
      dataSource: mapImageDataSourceGraphqlToInput(input.dataSource),
    };
  };
  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate image data source
   * IMAGE elements only support STORAGE_FILE data source
   */
  const validateDataSource = async (
    dataSource: ImageDataSourceInput
  ): Promise<void> => {
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
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for IMAGE element (create/update)
   */
  export const validateInput = async (
    input: ImageElementInput
  ): Promise<void> => {
    if (!input.base || !input.imageProps || !input.dataSource) {
      throw new Error(
        "ImageElementInput must include base, imageProps, and dataSource"
      );
    }

    // Validate base element properties
    await CommonElementUtils.checkBaseInput(input.base);

    // Validate data source
    await validateDataSource(input.dataSource);

    // Validate image fit
    validateImageFit(input.imageProps.fit);
  };

  // ============================================================================
  // Data Source Conversion
  // ============================================================================

  /**
   * Convert input data source format to output format
   */
  export const convertInputDataSourceToOutput = (
    input: ImageDataSourceInput
  ): ImageDataSource => {
    return {
      type: input.type,
      storageFileId: input.storageFileId,
    };
  };
}
