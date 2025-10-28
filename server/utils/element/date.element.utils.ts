import {
  DateElementConfigInput,
  DateDataSourceType,
  StudentDateField,
  CertificateDateField,
  CalendarType,
  DateElementCreateInput,
  DateElementUpdateInput,
  CertificateElementEntity,
  DateTransformation,
  DateTransformationType,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for DATE elements
 * Contains all DATE-specific validation logic
 */
export namespace DateElementUtils {
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete DATE element config
   * Validates font reference, data source, calendar type, format, and text properties
   */
  export const validateConfig = async (
    config: DateElementConfigInput
  ): Promise<void> => {
    // Validate textProps (font, size, color, overflow)
    await CommonElementUtils.validateTextProps(config);

    // Validate calendar type
    validateCalendarType(config.calendarType);

    // Validate offset days
    validateOffsetDays(config.offsetDays);

    // Validate date format
    validateDateFormat(config.format);

    // Validate transformation (if provided)
    if (config.transformation !== undefined && config.transformation !== null) {
      validateTransformation(config.transformation);
    }

    // Validate data source
    await validateDataSource(config);
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
  const validateTransformation = (transformation: DateTransformation): void => {
    const validTypes = Object.values(DateTransformationType);
    if (!validTypes.includes(transformation.type)) {
      throw new Error(
        `Invalid transformation type: ${transformation.type}. Must be one of: ${validTypes.join(", ")}`
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
    config: DateElementConfigInput
  ): Promise<void> => {
    const dataSource = config.dataSource;
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
        await validateTemplateVariable(dataSource.variableId);
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
    variableId: number
  ): Promise<void> => {
    await ElementRepository.validateTemplateVariableId(variableId);
  };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for DATE element creation
   */
  export const validateCreateInput = async (
    input: DateElementCreateInput
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
   * Validate all fields for DATE element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: DateElementUpdateInput,
    existing?: CertificateElementEntity
  ): Promise<void> => {
    // Cache existing element if not provideda
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
