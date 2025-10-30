import {
  QRCodeDataSourceType,
  QRCodeDataSourceInput,
  QRCodeDataSourceInputGraphql,
  QRCodeElementInput,
  QRCodeElementInputGraphql,
  QRCodeElementUpdateInput,
  QRCodeElementUpdateInputGraphql,
  QRCodeErrorCorrection,
  QRCodeDataSource,
} from "@/server/types/element";
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
    if (!input) {
      throw new Error(
        "QRCodeDataSourceInputGraphql must not be null or undefined"
      );
    }
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
   * Map GraphQL QRCodeElement create input to repository QRCodeElement create input
   */
  export const mapQRCodeElementCreateGraphqlToInput = (
    input: QRCodeElementInputGraphql
  ): QRCodeElementInput => {
    if (!input || !input.base || !input.qrCodeProps || !input.dataSource) {
      throw new Error(
        "QRCodeElementInputGraphql must include base, qrCodeProps, and dataSource"
      );
    }
    return {
      base: input.base,
      qrCodeProps: input.qrCodeProps,
      dataSource: mapQRCodeDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL QRCodeElement update input to repository QRCodeElement update input
   */
  export const mapQRCodeElementUpdateGraphqlToInput = (
    input: QRCodeElementUpdateInputGraphql
  ): QRCodeElementUpdateInput => {
    if (!input || !input.base || !input.qrCodeProps || !input.dataSource) {
      throw new Error(
        "QRCodeElementUpdateInputGraphql must include base, qrCodeProps, and dataSource"
      );
    }
    return {
      id: input.id,
      base: input.base,
      qrCodeProps: input.qrCodeProps,
      dataSource: mapQRCodeDataSourceGraphqlToInput(input.dataSource),
    };
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
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for QR_CODE element (create/update)
   */
  export const validateInput = async (
    input: QRCodeElementInput
  ): Promise<void> => {
    if (!input.base || !input.qrCodeProps || !input.dataSource) {
      throw new Error(
        "QRCodeElementInput must include base, qrCodeProps, and dataSource"
      );
    }

    // Validate base element properties
    await CommonElementUtils.validateBaseInput(input.base);

    // Validate error correction level
    validateErrorCorrection(input.qrCodeProps.errorCorrection);

    // Validate colors
    CommonElementUtils.validateColor(input.qrCodeProps.foregroundColor);
    CommonElementUtils.validateColor(input.qrCodeProps.backgroundColor);
  };

  // ============================================================================
  // Data Source Conversion
  // ============================================================================

  /**
   * Convert input data source format to output format
   */
  export const convertInputDataSourceToOutput = (
    input: QRCodeDataSourceInput
  ): QRCodeDataSource => {
    switch (input.type) {
      case QRCodeDataSourceType.VERIFICATION_URL:
        return { type: input.type };
      case QRCodeDataSourceType.VERIFICATION_CODE:
        return { type: input.type };
      default:
        throw new Error(`Invalid QR code data source type`);
    }
  };
}
