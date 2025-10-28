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
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
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
      templateId: input.templateId,
      name: input.name,
      description: input.description,
      positionX: input.positionX,
      positionY: input.positionY,
      width: input.width,
      height: input.height,
      alignment: input.alignment,
      renderOrder: input.renderOrder,
      config: mapQRCodeElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL QRCodeElement update input to repository QRCodeElement update input
   */
  export const mapQRCodeElementUpdateGraphqlToInput = (
    input: QRCodeElementUpdateInputGraphql
  ): QRCodeElementUpdateInput => {
    const result: QRCodeElementUpdateInput = {
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
      result.config = mapQRCodeElementConfigUpdateGraphqlToInput(input.config);
    }

    return result;
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
    // Validate config
    await validateConfig(input.config);

    // Validate common properties
    const nameError = await ElementUtils.validateName(input.name);
    if (nameError) throw new Error(nameError);

    const dimensionsError = await ElementUtils.validateDimensions(
      input.width,
      input.height
    );
    if (dimensionsError) throw new Error(dimensionsError);

    const positionError = await ElementUtils.validatePosition(
      input.positionX,
      input.positionY
    );
    if (positionError) throw new Error(positionError);

    const renderOrderError = await ElementUtils.validateRenderOrder(
      input.renderOrder
    );
    if (renderOrderError) throw new Error(renderOrderError);

    CommonElementUtils.validateDescription(input.description);
  };

  /**
   * Validate QR_CODE element update input
   */
  export const validateUpdateInput = async (
    input: QRCodeElementUpdateInput,
    existing?: CertificateElementEntity
  ): Promise<void> => {
    // Get existing element if not provided
    const element =
      existing || (await ElementRepository.findByIdOrThrow(input.id));

    // Validate element type
    if (element.type !== ElementType.QR_CODE) {
      throw new Error(
        `Element ${input.id} is ${element.type}, not QR_CODE. Use correct repository.`
      );
    }

    // Validate updated config if provided
    if (input.config) {
      // For partial updates, merge with existing config for validation
      const mergedConfig: QRCodeElementConfigInput = {
        type: ElementType.QR_CODE,
        dataSource:
          input.config.dataSource ||
          (element.config as QRCodeElementConfigInput).dataSource,
        errorCorrection:
          input.config.errorCorrection ??
          (element.config as QRCodeElementConfigInput).errorCorrection,
        foregroundColor:
          input.config.foregroundColor ??
          (element.config as QRCodeElementConfigInput).foregroundColor,
        backgroundColor:
          input.config.backgroundColor ??
          (element.config as QRCodeElementConfigInput).backgroundColor,
      };
      await validateConfig(mergedConfig);
    }

    // Validate updated common properties if provided
    if (input.name !== undefined) {
      const nameError = await ElementUtils.validateName(input.name);
      if (nameError) throw new Error(nameError);
    }

    if (input.width !== undefined || input.height !== undefined) {
      const width = input.width ?? element.width;
      const height = input.height ?? element.height;
      const dimensionsError = await ElementUtils.validateDimensions(
        width,
        height
      );
      if (dimensionsError) throw new Error(dimensionsError);
    }

    if (input.positionX !== undefined || input.positionY !== undefined) {
      const x = input.positionX ?? element.positionX;
      const y = input.positionY ?? element.positionY;
      const positionError = await ElementUtils.validatePosition(x, y);
      if (positionError) throw new Error(positionError);
    }

    if (input.renderOrder !== undefined) {
      const renderOrderError = await ElementUtils.validateRenderOrder(
        input.renderOrder
      );
      if (renderOrderError) throw new Error(renderOrderError);
    }

    if (input.description !== undefined) {
      CommonElementUtils.validateDescription(input.description);
    }
  };
}

