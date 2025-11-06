import {
  QRCodeElementInput,
  QRCodeElementInputGraphql,
  QRCodeElementUpdateInput,
  QRCodeElementUpdateInputGraphql,
  QRCodeErrorCorrection,
  QRCodeElementSpecPropsInput,
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
   * Map GraphQL QRCodeElement create input to repository QRCodeElement create input
   */
  export const mapQRCodeElementCreateGraphqlToInput = (input: QRCodeElementInputGraphql): QRCodeElementInput => {
    if (!input || !input.base || !input.qrCodeProps) {
      throw new Error("QRCodeElementInputGraphql must include base, qrCodeProps, and dataSource");
    }
    return {
      base: input.base,
      qrCodeProps: input.qrCodeProps,
    };
  };

  /**
   * Map GraphQL QRCodeElement update input to repository QRCodeElement update input
   */
  export const mapQRCodeElementUpdateGraphqlToInput = (
    input: QRCodeElementUpdateInputGraphql
  ): QRCodeElementUpdateInput => {
    if (!input || !input.base || !input.qrCodeProps) {
      throw new Error("QRCodeElementUpdateInputGraphql must include base, qrCodeProps");
    }
    return {
      id: input.id,
      base: input.base,
      qrCodeProps: input.qrCodeProps,
    };
  };

  /**
   * Validate error correction level
   */
  const validateErrorCorrection = (errorCorrection: QRCodeErrorCorrection): void => {
    const validLevels = Object.values(QRCodeErrorCorrection);
    if (!validLevels.includes(errorCorrection)) {
      throw new Error(`Invalid error correction level: ${errorCorrection}. Must be one of: ${validLevels.join(", ")}`);
    }
  };

  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for QR_CODE element (create/update)
   */
  export const validateInput = async (input: QRCodeElementInput): Promise<void> => {
    if (!input.base || !input.qrCodeProps) {
      throw new Error("QRCodeElementInput must include base, qrCodeProps");
    }

    // Validate base element properties
    await CommonElementUtils.checkBaseInput(input.base);

    // Validate error correction level
    validateErrorCorrection(input.qrCodeProps.errorCorrection);

    // Validate colors
    CommonElementUtils.validateColor(input.qrCodeProps.foregroundColor);
    CommonElementUtils.validateColor(input.qrCodeProps.backgroundColor);
  };

  /**
   * Validate qrCodeProps for standalone update
   */
  export const checkSpecProps = async (qrCodeProps: QRCodeElementSpecPropsInput): Promise<void> => {
    // Validate error correction level
    validateErrorCorrection(qrCodeProps.errorCorrection);

    // Validate colors
    CommonElementUtils.validateColor(qrCodeProps.foregroundColor);
    CommonElementUtils.validateColor(qrCodeProps.backgroundColor);
  };
}
