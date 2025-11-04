import * as ElType from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { CommonElementUtils } from "./common.element.utils";
import { TemplateVariableType } from "@/server/types";

/**
 * Validation utilities for DATE elements
 * Contains all DATE-specific validation logic
 */
export namespace DateElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL DateDataSource input (isOneOf) to repository DateDataSource input (discriminated union)
   */
  export const mapDateDataSourceGraphqlToInput = (
    input: ElType.DateDataSourceInputGraphql
  ): ElType.DateDataSourceInput => {
    if (input.static) {
      return {
        type: ElType.DateDataSourceType.STATIC,
        value: input.static.value,
      };
    } else if (input.studentField) {
      return {
        type: ElType.DateDataSourceType.STUDENT_DATE_FIELD,
        field: input.studentField.field,
      };
    } else if (input.certificateField) {
      return {
        type: ElType.DateDataSourceType.CERTIFICATE_DATE_FIELD,
        field: input.certificateField.field,
      };
    } else if (input.templateVariable) {
      return {
        type: ElType.DateDataSourceType.TEMPLATE_DATE_VARIABLE,
        variableId: input.templateVariable.variableId,
      };
    }
    throw new Error(
      "Invalid DateDataSource input: must specify one of static, studentField, certificateField, or templateVariable"
    );
  };

  export const mapDataSourceStandaloneGqlToInput = (
    input: ElType.DateDataSourceStandaloneInputGraphql
  ): ElType.DateDataSourceStandaloneInput => {
    return {
      ...input,
      dataSource: mapDateDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL DateElement create input to repository DateElement create input
   */
  export const mapDateElementCreateGraphqlToInput = (
    input: ElType.DateElementInputGraphql
  ): ElType.DateElementInput => {
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      ),
      dataSource: mapDateDataSourceGraphqlToInput(input.dataSource),
      dateProps: input.dateProps,
    };
  };

  /**
   * Map GraphQL DateElement update input to repository DateElement update input
   */
  export const mapDateElementUpdateGraphqlToInput = (
    input: ElType.DateElementUpdateInputGraphql
  ): ElType.DateElementUpdateInput => {
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      ),
      dataSource: mapDateDataSourceGraphqlToInput(input.dataSource),
      dateProps: input.dateProps,
    };
  };
  // ============================================================================
  // Calendar Type Validation
  // ============================================================================

  /**
   * Validate calendar type enum
   */
  const checkCalendarType = (calendarType: ElType.CalendarType): void => {
    const validTypes = Object.values(ElType.CalendarType);
    if (!validTypes.includes(calendarType)) {
      throw new Error(
        `Invalid calendar type: ${calendarType}. Must be one of: ${validTypes.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Offset Days Validation
  // ============================================================================

  /**
   * Validate offset days is a finite number
   */
  const checkOffsetDays = (offsetDays?: number | null): void => {
    if (offsetDays === undefined || offsetDays === null) return;
    if (!Number.isFinite(offsetDays)) {
      throw new TypeError("Offset days must be a finite number");
    }
    // Allow negative offsets (for dates in the past)
    if (!Number.isInteger(offsetDays)) {
      throw new TypeError("Offset days must be an integer");
    }
  };

  // ============================================================================
  // Date Format Validation
  // ============================================================================

  /**
   * Validate date format string
   */
  const checkDateFormat = (format: string): void => {
    if (!format || format.trim().length === 0) {
      throw new Error("Date format cannot be empty");
    }

    // Check for common date format tokens (moment.js / date-fns style)
    // YYYY, MM, DD, HH, mm, ss, etc.
    const validTokens = /^[YMDHhmsaAZzTWwEedDo\s\-/:.,']+$/;

    if (!validTokens.test(format)) {
      throw new Error(
        "Invalid date format. Use valid date format tokens (e.g., YYYY-MM-DD, DD/MM/YYYY)"
      );
    }

    // Must contain at least one date component (Y, M, or D)
    if (!/[YMD]/.test(format)) {
      throw new Error(
        "Date format must contain at least one date component (Year, Month, or Day)"
      );
    }
  };

  // ============================================================================
  // Transformation Validation
  // ============================================================================

  /**
   * Validate transformation type
   */
  const checkTransformation = (
    transformation: ElType.DateTransformationType
  ): void => {
    const validTypes = Object.values(ElType.DateTransformationType);
    if (!validTypes.includes(transformation)) {
      throw new Error(
        `Invalid transformation type: ${transformation}. Must be one of: ${validTypes.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate date data source based on type
   */
  export const checkDataSource = async (
    dataSource: ElType.DateDataSourceInput
  ): Promise<void> => {
    switch (dataSource.type) {
      case ElType.DateDataSourceType.STATIC:
        checkStaticDataSource(dataSource.value);
        break;

      case ElType.DateDataSourceType.STUDENT_DATE_FIELD:
        checkStudentDateField(dataSource.field);
        break;

      case ElType.DateDataSourceType.CERTIFICATE_DATE_FIELD:
        checkCertificateDateField(dataSource.field);
        break;

      case ElType.DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        await checkTemplateVariable(
          dataSource.variableId,
          TemplateVariableType.DATE
        );
        break;

      default:
        throw new Error(`Invalid date data source type`);
    }
  };

  /**
   * Validate static date value (ISO 8601 format)
   */
  const checkStaticDataSource = (value: string): void => {
    if (!value || value.trim().length === 0) {
      throw new Error("Static date value cannot be empty");
    }

    // Validate ISO 8601 date format or basic date format
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new TypeError(
        "Invalid static date value. Use ISO 8601 format (e.g., 2024-01-15 or 2024-01-15T10:30:00Z)"
      );
    }
  };

  /**
   * Validate student date field enum
   */
  const checkStudentDateField = (field: ElType.StudentDateField): void => {
    const validFields = Object.values(ElType.StudentDateField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid student date field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate certificate date field enum
   */
  const checkCertificateDateField = (
    field: ElType.CertificateDateField
  ): void => {
    const validFields = Object.values(ElType.CertificateDateField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid certificate date field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate template variable exists
   */
  const checkTemplateVariable = async (
    variableId: number,
    type: TemplateVariableType
  ): Promise<void> => {
    await ElementRepository.checkTemplateVariableId(variableId, type);
  };

  export const checkSpecProps = async (
    dateProps: ElType.DateElementSpecPropsInput
  ): Promise<void> => {
    // Validate calendar type
    checkCalendarType(dateProps.calendarType);

    // Validate offset days
    if (dateProps.offsetDays === undefined) {
      throw new Error("offsetDays is required for DATE element");
    }
    checkOffsetDays(dateProps.offsetDays);

    // Validate date format
    checkDateFormat(dateProps.format);

    // Validate transformation (if provided)
    if (
      dateProps.transformation !== undefined &&
      dateProps.transformation !== null
    ) {
      checkTransformation(dateProps.transformation);
    }
  };

  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for DATE element (create/update)
   */
  export const checkInput = async (
    input: ElType.DateElementInput
  ): Promise<void> => {
    if (
      !input.base ||
      !input.textProps ||
      !input.dataSource ||
      !input.dateProps
    ) {
      throw new Error(
        "DateElementInput must include base, textProps, dataSource, and dateProps"
      );
    }

    // Validate base element properties
    await CommonElementUtils.checkBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.checkTextProps(input.textProps);

    await checkSpecProps(input.dateProps);

    // Validate data source
    await checkDataSource(input.dataSource);
  };

  /**
   * Convert input data source format to output format
   * Input uses 'field' property, output uses 'studentField'/'certificateField'
   */
  export const convertInputDataSourceToOutput = (
    input: ElType.DateDataSourceInput
  ): ElType.DateDataSource => {
    switch (input.type) {
      case ElType.DateDataSourceType.STATIC:
        return { type: input.type, value: input.value };

      case ElType.DateDataSourceType.STUDENT_DATE_FIELD:
        return { type: input.type, studentField: input.field };

      case ElType.DateDataSourceType.CERTIFICATE_DATE_FIELD:
        return { type: input.type, certificateField: input.field };

      case ElType.DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        return { type: input.type, dateVariableId: input.variableId };

      default:
        throw new Error(`Invalid date data source type`);
    }
  };

  /**
   * Extract variableId from date data source (inline in repository)
   * Maps to correct TypeScript field name based on type
   */
  export const extractVariableIdFromDataSource = (
    dataSource: ElType.DateDataSourceInput
  ): number | null => {
    if (dataSource.type === ElType.DateDataSourceType.TEMPLATE_DATE_VARIABLE) {
      return dataSource.variableId;
    }
    return null;
  };
}
