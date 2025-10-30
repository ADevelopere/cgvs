import {
  DateDataSourceType,
  StudentDateField,
  CertificateDateField,
  CalendarType,
  DateElementInput,
  DateElementUpdateInput,
  DateTransformationType,
  DateDataSourceInput,
  DateDataSourceInputGraphql,
  DateElementInputGraphql,
  DateElementUpdateInputGraphql,
  DateDataSource,
} from "@/server/types/element";
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
    input: DateDataSourceInputGraphql
  ): DateDataSourceInput => {
    if (!input) {
      throw new Error(
        "DateDataSourceInputGraphql must not be null or undefined"
      );
    }
    if (input.static) {
      return {
        type: DateDataSourceType.STATIC,
        value: input.static.value,
      };
    } else if (input.studentField) {
      return {
        type: DateDataSourceType.STUDENT_DATE_FIELD,
        field: input.studentField.field,
      };
    } else if (input.certificateField) {
      return {
        type: DateDataSourceType.CERTIFICATE_DATE_FIELD,
        field: input.certificateField.field,
      };
    } else if (input.templateVariable) {
      return {
        type: DateDataSourceType.TEMPLATE_DATE_VARIABLE,
        variableId: input.templateVariable.variableId,
      };
    }
    throw new Error(
      "Invalid DateDataSource input: must specify one of static, studentField, certificateField, or templateVariable"
    );
  };

  /**
   * Map GraphQL DateElement create input to repository DateElement create input
   */
  export const mapDateElementCreateGraphqlToInput = (
    input: DateElementInputGraphql
  ): DateElementInput => {
    if (
      !input ||
      !input.base ||
      !input.textProps ||
      !input.dataSource ||
      !input.dateProps
    ) {
      throw new Error(
        "DateElementInputGraphql must include base, textProps, dataSource, and dateProps"
      );
    }
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapDateDataSourceGraphqlToInput(input.dataSource),
      dateProps: input.dateProps,
    };
  };

  /**
   * Map GraphQL DateElement update input to repository DateElement update input
   */
  export const mapDateElementUpdateGraphqlToInput = (
    input: DateElementUpdateInputGraphql
  ): DateElementUpdateInput => {
    if (
      !input ||
      !input.base ||
      !input.textProps ||
      !input.dataSource ||
      !input.dateProps
    ) {
      throw new Error(
        "DateElementUpdateInputGraphql must include base, textProps, dataSource, and dateProps"
      );
    }
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
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
  const validateCalendarType = (calendarType: CalendarType): void => {
    const validTypes = Object.values(CalendarType);
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
  const validateOffsetDays = (offsetDays: number): void => {
    if (!Number.isFinite(offsetDays)) {
      throw new Error("Offset days must be a finite number");
    }
    // Allow negative offsets (for dates in the past)
    if (!Number.isInteger(offsetDays)) {
      throw new Error("Offset days must be an integer");
    }
  };

  // ============================================================================
  // Date Format Validation
  // ============================================================================

  /**
   * Validate date format string
   */
  const validateDateFormat = (format: string): void => {
    if (!format || format.trim().length === 0) {
      throw new Error("Date format cannot be empty");
    }

    // Check for common date format tokens (moment.js / date-fns style)
    // YYYY, MM, DD, HH, mm, ss, etc.
    const validTokens = /^[YMDHhmsaAZzTWwEedDo\s\-\/:.,']+$/;

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
  const validateTransformation = (
    transformation: DateTransformationType
  ): void => {
    const validTypes = Object.values(DateTransformationType);
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
  const validateDataSource = async (
    dataSource: DateDataSourceInput
  ): Promise<void> => {
    switch (dataSource.type) {
      case DateDataSourceType.STATIC:
        validateStaticDataSource(dataSource.value);
        break;

      case DateDataSourceType.STUDENT_DATE_FIELD:
        validateStudentDateField(dataSource.field);
        break;

      case DateDataSourceType.CERTIFICATE_DATE_FIELD:
        validateCertificateDateField(dataSource.field);
        break;

      case DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        await validateTemplateVariable(
          dataSource.variableId,
          TemplateVariableType.DATE
        );
        break;

      default:
        throw new Error(`Invalid date data source type}`);
    }
  };

  /**
   * Validate static date value (ISO 8601 format)
   */
  const validateStaticDataSource = (value: string): void => {
    if (!value || value.trim().length === 0) {
      throw new Error("Static date value cannot be empty");
    }

    // Validate ISO 8601 date format or basic date format
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(
        "Invalid static date value. Use ISO 8601 format (e.g., 2024-01-15 or 2024-01-15T10:30:00Z)"
      );
    }
  };

  /**
   * Validate student date field enum
   */
  const validateStudentDateField = (field: StudentDateField): void => {
    const validFields = Object.values(StudentDateField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid student date field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate certificate date field enum
   */
  const validateCertificateDateField = (field: CertificateDateField): void => {
    const validFields = Object.values(CertificateDateField);
    if (!validFields.includes(field)) {
      throw new Error(
        `Invalid certificate date field: ${field}. Must be one of: ${validFields.join(", ")}`
      );
    }
  };

  /**
   * Validate template variable exists
   */
  const validateTemplateVariable = async (
    variableId: number,
    type: TemplateVariableType
  ): Promise<void> => {
    await ElementRepository.validateTemplateVariableId(variableId, type);
  };

  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for DATE element (create/update)
   */
  export const validateInput = async (
    input: DateElementInput
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
    await CommonElementUtils.validateBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // Validate calendar type
    validateCalendarType(input.dateProps.calendarType);

    // Validate offset days
    if (input.dateProps.offsetDays === undefined) {
      throw new Error("offsetDays is required for DATE element");
    }
    validateOffsetDays(input.dateProps.offsetDays);

    // Validate date format
    validateDateFormat(input.dateProps.format);

    // Validate transformation (if provided)
    if (
      input.dateProps.transformation !== undefined &&
      input.dateProps.transformation !== null
    ) {
      validateTransformation(input.dateProps.transformation);
    }

    // Validate data source
    await validateDataSource(input.dataSource);
  };

  /**
   * Convert input data source format to output format
   * Input uses 'field' property, output uses 'studentField'/'certificateField'
   */
  export const convertInputDataSourceToOutput = (
    input: DateDataSourceInput
  ): DateDataSource => {
    switch (input.type) {
      case DateDataSourceType.STATIC:
        return { type: input.type, value: input.value };

      case DateDataSourceType.STUDENT_DATE_FIELD:
        return { type: input.type, studentField: input.field };

      case DateDataSourceType.CERTIFICATE_DATE_FIELD:
        return { type: input.type, certificateField: input.field };

      case DateDataSourceType.TEMPLATE_DATE_VARIABLE:
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
    dataSource: DateDataSourceInput
  ): number | null => {
    switch (dataSource.type) {
      case DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        return dataSource.variableId;
      default:
        return null;
    }
  };
}
