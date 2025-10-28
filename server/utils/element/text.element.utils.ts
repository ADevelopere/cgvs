import {
  TextElementConfigInput,
  TextDataSourceType,
  StudentTextField,
  CertificateTextField,
  TextElementCreateInput,
  TextElementUpdateInput,
  CertificateElementEntity,
  TextDataSourceInput,
  TextDataSourceInputGraphql,
  TextElementConfigInputGraphql,
  TextElementConfigUpdateInputGraphql,
  TextElementCreateInputGraphql,
  TextElementUpdateInputGraphql,
  ElementType,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for TEXT elements
 * Contains all TEXT-specific validation logic
 */
export namespace TextElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL TextDataSource input (isOneOf) to repository TextDataSource input (discriminated union)
   */
  export const mapTextDataSourceGraphqlToInput = (
    input: TextDataSourceInputGraphql
  ): TextDataSourceInput => {
    if (input.static !== undefined) {
      return {
        type: TextDataSourceType.STATIC,
        value: input.static.value,
      };
    } else if (input.studentField !== undefined) {
      return {
        type: TextDataSourceType.STUDENT_TEXT_FIELD,
        field: input.studentField.field,
      };
    } else if (input.certificateField !== undefined) {
      return {
        type: TextDataSourceType.CERTIFICATE_TEXT_FIELD,
        field: input.certificateField.field,
      };
    } else if (input.templateTextVariable !== undefined) {
      return {
        type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE,
        variableId: input.templateTextVariable.variableId,
      };
    } else if (input.templateSelectVariable !== undefined) {
      return {
        type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE,
        variableId: input.templateSelectVariable.variableId,
      };
    }
    throw new Error(
      "Invalid TextDataSource input: must specify one of static, studentField, certificateField, templateTextVariable, or templateSelectVariable"
    );
  };

  /**
   * Map GraphQL TextElementConfig input to repository TextElementConfig input
   */
  export const mapTextElementConfigGraphqlToInput = (
    input: TextElementConfigInputGraphql
  ): TextElementConfigInput => {
    return {
      type: ElementType.TEXT,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps),
      dataSource: mapTextDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL TextElementConfig update input (partial) to repository TextElementConfig input (partial)
   */
  export const mapTextElementConfigUpdateGraphqlToInput = (
    input: TextElementConfigUpdateInputGraphql
  ): Partial<TextElementConfigInput> => {
    const result: Partial<TextElementConfigInput> = {};

    if (input.textProps !== undefined) {
      const textPropsUpdate = CommonElementUtils.mapTextPropsUpdateGraphqlToInput(
        input.textProps
      );
      if (Object.keys(textPropsUpdate).length > 0) {
        result.textProps = textPropsUpdate as Types.TextPropsInput;
      }
    }
    if (input.dataSource !== undefined) {
      result.dataSource = mapTextDataSourceGraphqlToInput(input.dataSource);
    }

    return result;
  };

  /**
   * Map GraphQL TextElement create input to repository TextElement create input
   */
  export const mapTextElementCreateGraphqlToInput = (
    input: TextElementCreateInputGraphql
  ): TextElementCreateInput => {
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
      config: mapTextElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL TextElement update input to repository TextElement update input
   */
  export const mapTextElementUpdateGraphqlToInput = (
    input: TextElementUpdateInputGraphql
  ): TextElementUpdateInput => {
    const result: TextElementUpdateInput = {
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
      result.config = mapTextElementConfigUpdateGraphqlToInput(input.config);
    }

    return result;
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete TEXT element config
   * Validates font reference, data source, and text properties
   */
  export const validateConfig = async (
    config: TextElementConfigInput
  ): Promise<void> => {
    // Validate textProps
    await CommonElementUtils.validateTextProps(config);

    // Validate data source
    await validateDataSource(config);
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate text data source based on type
   */
  const validateDataSource = async (
    config: TextElementConfigInput
  ): Promise<void> => {
    const dataSource = config.dataSource;
    switch (dataSource.type) {
      case TextDataSourceType.STATIC:
        validateStaticDataSource(dataSource.value);
        break;

      case TextDataSourceType.STUDENT_TEXT_FIELD:
        validateStudentTextField(dataSource.field);
        break;

      case TextDataSourceType.CERTIFICATE_TEXT_FIELD:
        validateCertificateTextField(dataSource.field);
        break;

      case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
      case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
        await validateTemplateVariable(dataSource.variableId);
        break;

      default:
        throw new Error(`Invalid text data source type}`);
    }
  };

  /**
   * Validate static text value
   */
  const validateStaticDataSource = (value: string): void => {
    if (!value || value.trim().length === 0) {
      throw new Error("Static text value cannot be empty");
    }
  };

  /**
   * Validate student text field enum
   */
  const validateStudentTextField = (field: StudentTextField): void => {
    const validFields = Object.values(StudentTextField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid student text field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate certificate text field enum
   */
  const validateCertificateTextField = (field: CertificateTextField): void => {
    const validFields = Object.values(CertificateTextField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid certificate text field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate template variable exists
   */
  const validateTemplateVariable = async (
    variableId: number
  ): Promise<void> => {
    await ElementRepository.validateTemplateVariableId(variableId);
  };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for TEXT element creation
   */
  export const validateCreateInput = async (
    input: TextElementCreateInput
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
   * Validate all fields for TEXT element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: TextElementUpdateInput,
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
