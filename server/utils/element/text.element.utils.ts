import {
  TextElementConfigCreateInput,
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
} from "@/server/types/element/output";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
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
    if (input.static) {
      return {
        type: TextDataSourceType.STATIC,
        value: input.static.value,
      };
    } else if (input.studentField) {
      return {
        type: TextDataSourceType.STUDENT_TEXT_FIELD,
        field: input.studentField.field,
      };
    } else if (input.certificateField) {
      return {
        type: TextDataSourceType.CERTIFICATE_TEXT_FIELD,
        field: input.certificateField.field,
      };
    } else if (input.templateTextVariable) {
      return {
        type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE,
        variableId: input.templateTextVariable.variableId,
      };
    } else if (input.templateSelectVariable) {
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
  ): TextElementConfigCreateInput => {
    return {
      type: ElementType.TEXT,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapTextDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL TextElementConfig update input (partial) to repository TextElementConfig input (partial)
   */
  export const mapTextElementConfigUpdateGraphqlToInput = (
    input: TextElementConfigUpdateInputGraphql
  ): Partial<TextElementConfigCreateInput> => {
    const result: Partial<TextElementConfigCreateInput> = {};

    if (input.textProps !== undefined) {
      const textPropsUpdate =
        CommonElementUtils.mapTextPropsUpdateGraphqlToInput(input.textProps);
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
      ...input,
      config: mapTextElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL TextElement update input to repository TextElement update input
   */
  export const mapTextElementUpdateGraphqlToInput = (
    input: TextElementUpdateInputGraphql
  ): TextElementUpdateInput => {
    return {
      ...input,
      config:
        input.config !== undefined
          ? mapTextElementConfigUpdateGraphqlToInput(input.config)
          : undefined,
    };
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete TEXT element config
   * Validates font reference, data source, and text properties
   */
  export const validateConfig = async (
    config: TextElementConfigCreateInput
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
    config: TextElementConfigCreateInput
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
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

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
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Config validation (if provided) - handled separately with deep merge
  };
}
