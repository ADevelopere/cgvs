import {
  QRCodeElementConfigInput,
  QRCodeDataSourceType,
  QRCodeDataSourceInput,
  QRCodeDataSourceInputGraphql,
  QRCodeElementConfigInputGraphql,
  QRCodeElementConfigUpdateInputGraphql,
  QRCodeElementCreateInput,
  QRCodeElementCreateInputGraphql,
  QRCodeElementUpdateInput,
  QRCodeElementUpdateInputGraphql,
  ElementType,
  CertificateElementEntity,
  QRCodeErrorCorrection,
} from "@/server/types/element/output";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation and mapper utilities for QR_CODE elements
 * Contains all QR_CODE-specific validation and mapping logic
 */
export namespace QRCodeElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL QRCodeDataSource input (isOneOf) to repository QRCodeDataSource input (discriminated union)
   */
  export const mapQRCodeDataSourceGraphqlToInput = (
    input: QRCodeDataSourceInputGraphql
  ): QRCodeDataSourceInput => {
    if (input.verificationUrl !== undefined) {
      return { type: QRCodeDataSourceType.VERIFICATION_URL };
    } else if (input.verificationCode !== undefined) {
      return { type: QRCodeDataSourceType.VERIFICATION_CODE };
    }
    throw new Error(
      "Invalid QRCodeDataSource input: must specify either verificationUrl or verificationCode"
    );
  };

  /**
   * Map GraphQL QRCodeElementConfig input to repository QRCodeElementConfig input
   */
  export const mapQRCodeElementConfigGraphqlToInput = (
    input: QRCodeElementConfigInputGraphql
  ): QRCodeElementConfigInput => {
    return {
      type: ElementType.QR_CODE,
      dataSource: mapQRCodeDataSourceGraphqlToInput(input.dataSource),
      errorCorrection: input.errorCorrection,
      foregroundColor: input.foregroundColor,
      backgroundColor: input.backgroundColor,
    };
  };

  /**
   * Map GraphQL QRCodeElementConfig update input (partial) to repository QRCodeElementConfig input (partial)
   */
  export const mapQRCodeElementConfigUpdateGraphqlToInput = (
    input: QRCodeElementConfigUpdateInputGraphql
  ): Partial<QRCodeElementConfigInput> => {
    const result: Partial<QRCodeElementConfigInput> = {};

    if (input.dataSource !== undefined) {
      result.dataSource = mapQRCodeDataSourceGraphqlToInput(input.dataSource);
    }
    if (input.errorCorrection !== undefined) {
      result.errorCorrection = input.errorCorrection;
    }
    if (input.foregroundColor !== undefined) {
      result.foregroundColor = input.foregroundColor;
    }
    if (input.backgroundColor !== undefined) {
      result.backgroundColor = input.backgroundColor;
    }

    return result;
  };

  /**
   * Map GraphQL QRCodeElement create input to repository QRCodeElement create input
   */
  export const mapQRCodeElementCreateGraphqlToInput = (
    input: QRCodeElementCreateInputGraphql
  ): QRCodeElementCreateInput => {
    return {
      ...input,
      config: mapQRCodeElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL QRCodeElement update input to repository QRCodeElement update input
   */
  export const mapQRCodeElementUpdateGraphqlToInput = (
    input: QRCodeElementUpdateInputGraphql
  ): QRCodeElementUpdateInput => {
    return {
      ...input,
      config: input.config !== undefined ? mapQRCodeElementConfigUpdateGraphqlToInput(input.config) : undefined,
    };
  };

  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete QR_CODE element config
   * Validates data source, error correction, and colors
   */
  export const validateConfig = async (
    config: QRCodeElementConfigInput
  ): Promise<void> => {
    // Validate data source
    validateDataSource(config);

    // Validate error correction level
    validateErrorCorrection(config.errorCorrection);

    // Validate colors
    CommonElementUtils.validateColor(config.foregroundColor);
    CommonElementUtils.validateColor(config.backgroundColor);
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate QR code data source
   */
  const validateDataSource = (config: QRCodeElementConfigInput): void => {
    const dataSource = config.dataSource;
    const validTypes = Object.values(QRCodeDataSourceType);

    if (!validTypes.includes(dataSource.type)) {
      throw new Error(
        `Invalid QR code data source type: ${dataSource.type}. Must be one of: ${validTypes.join(", ")}`
      );
    }
  };

  /**
   * Validate error correction level
   */
  const validateErrorCorrection = (
    errorCorrection: QRCodeErrorCorrection
  ): void => {
    const validLevels = Object.values(QRCodeErrorCorrection);
    if (!validLevels.includes(errorCorrection)) {
      throw new Error(
        `Invalid error correction level: ${errorCorrection}. Must be one of: ${validLevels.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Element Validation (Create/Update)
  // ============================================================================

  /**
   * Validate QR_CODE element creation input
   */
  export const validateCreateInput = async (
    input: QRCodeElementCreateInput
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

    // Validate config
    await validateConfig(input.config);
  };

  /**
   * Validate QR_CODE element update input
   */
  export const validateUpdateInput = async (
    input: QRCodeElementUpdateInput,
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate element type
    if (existing.type !== ElementType.QR_CODE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not QR_CODE. Use correct repository.`
      );
    }

    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Validate updated config if provided
    if (input.config) {
      // For partial updates, merge with existing config for validation
      const mergedConfig: QRCodeElementConfigInput = {
        type: ElementType.QR_CODE,
        dataSource:
          input.config.dataSource ||
          (existing.config as QRCodeElementConfigInput).dataSource,
        errorCorrection:
          input.config.errorCorrection ??
          (existing.config as QRCodeElementConfigInput).errorCorrection,
        foregroundColor:
          input.config.foregroundColor ??
          (existing.config as QRCodeElementConfigInput).foregroundColor,
        backgroundColor:
          input.config.backgroundColor ??
          (existing.config as QRCodeElementConfigInput).backgroundColor,
      };
      await validateConfig(mergedConfig);
    }
  };
}

