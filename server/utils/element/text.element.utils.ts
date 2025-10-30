import {
  TextDataSourceType,
  StudentTextField,
  CertificateTextField,
  TextElementInput,
  TextElementUpdateInput,
  TextDataSourceInput,
  TextDataSourceInputGraphql,
  TextElementInputGraphql,
  TextElementUpdateInputGraphql,
  TextDataSource,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { CommonElementUtils } from "./common.element.utils";
import { TemplateVariableType } from "@/server/types";

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
    if (!input) {
      throw new Error(
        "TextDataSourceInputGraphql must not be null or undefined"
      );
    }

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
   * Map GraphQL TextElement create input to repository TextElement create input
   */
  export const mapTextElementGraphqlToInput = (
    input: TextElementInputGraphql
  ): TextElementInput => {
    if (!input || !input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "TextElementInputGraphql must include base, textProps, and dataSource"
      );
    }
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapTextDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL TextElement update input to repository TextElement update input
   */
  export const mapTextElementUpdateGraphqlToInput = (
    input: TextElementUpdateInputGraphql
  ): TextElementUpdateInput => {
    if (!input || !input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "TextElementUpdateInputGraphql must include base, textProps, and dataSource"
      );
    }
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapTextDataSourceGraphqlToInput(input.dataSource),
    };
  };
  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate text data source based on type
   */
  const validateDataSource = async (
    dataSource: TextDataSourceInput
  ): Promise<void> => {
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
    await ElementRepository.validateTemplateVariableId(
      variableId,
      TemplateVariableType.TEXT
    );
  };

  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for TEXT element (create/update)
   */
  export const validateInput = async (
    input: TextElementInput
  ): Promise<void> => {
    if (!input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "TextElementInput must include base, textProps, and dataSource"
      );
    }

    // Validate base element properties
    await CommonElementUtils.validateBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // Validate data source
    await validateDataSource(input.dataSource);
  };

  // ============================================================================
  // Data Source Conversion
  // ============================================================================

  /**
   * Convert input data source format to output format
   * Input uses 'field' property, output uses 'studentField'/'certificateField'
   */
  export const convertInputDataSourceToOutput = (
    input: TextDataSourceInput
  ): TextDataSource => {
    switch (input.type) {
      case TextDataSourceType.STATIC:
        return { type: input.type, value: input.value };

      case TextDataSourceType.STUDENT_TEXT_FIELD:
        return { type: input.type, studentField: input.field };

      case TextDataSourceType.CERTIFICATE_TEXT_FIELD:
        return { type: input.type, certificateField: input.field };

      case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
        return { type: input.type, textVariableId: input.variableId };

      case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
        return { type: input.type, selectVariableId: input.variableId };

      default:
        throw new Error(`Invalid text data source type`);
    }
  };

  /**
   * Extract variableId from text data source (inline in repository)
   * Maps to correct TypeScript field name based on type
   */
  export const extractVariableIdFromDataSource = (
    dataSource: TextDataSourceInput
  ): number | null => {
    switch (dataSource.type) {
      case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
      case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
        return dataSource.variableId;
      default:
        return null;
    }
  };
}
