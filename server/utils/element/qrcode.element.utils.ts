import {
  QRCodeDataSourceType,
  QRCodeDataSourceInput,
  QRCodeDataSourceInputGraphql,
  QRCodeElementCreateInput,
  QRCodeElementCreateInputGraphql,
  QRCodeElementUpdateInput,
  QRCodeElementUpdateInputGraphql,
  ElementType,
  CertificateElementEntity,
  QRCodeErrorCorrection,
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
    input?: QRCodeDataSourceInputGraphql | null
  ): QRCodeDataSourceInput | null | undefined => {
    if (!input) {
      return input;
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
    input: QRCodeElementCreateInputGraphql
  ): QRCodeElementCreateInput => {
    return {
      ...input,
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

    // Validate error correction level
    validateErrorCorrection(input.errorCorrection);

    // Validate colors
    CommonElementUtils.validateColor(input.foregroundColor);
    CommonElementUtils.validateColor(input.backgroundColor);
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

    // Validate error correction (if provided)
    if (input.errorCorrection !== undefined && input.errorCorrection !== null) {
      validateErrorCorrection(input.errorCorrection);
    }

    // Validate foreground color (if provided)
    if (input.foregroundColor !== undefined && input.foregroundColor !== null) {
      CommonElementUtils.validateColor(input.foregroundColor);
    }

    // Validate background color (if provided)
    if (input.backgroundColor !== undefined && input.backgroundColor !== null) {
      CommonElementUtils.validateColor(input.backgroundColor);
    }
  };
}
