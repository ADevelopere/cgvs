import {
  DateElementConfigInput,
  DateDataSourceType,
  StudentDateField,
  CertificateDateField,
  CalendarType,
  DateElementCreateInput,
  DateElementUpdateInput,
  FontSource,
  ElementOverflow,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";

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
    await validateTextProps(config.textProps);

    // Validate calendar type
    validateCalendarType(config.calendarType);

    // Validate offset days
    validateOffsetDays(config.offsetDays);

    // Validate date format
    validateDateFormat(config.format);

    // Validate mapping (if provided)
    if (config.mapping !== undefined && config.mapping !== null) {
      validateMapping(config.mapping);
    }

    // Validate data source
    await validateDataSource(config.dataSource);
  };

  // ============================================================================
  // Text Props Validation
  // ============================================================================

  /**
   * Validate text properties (font, size, color, overflow)
   */
  const validateTextProps = async (
    textProps: DateElementConfigInput["textProps"]
  ): Promise<void> => {
    // Validate font reference
    await validateFontReference(textProps.fontRef);

    // Validate font size
    validateFontSize(textProps.fontSize);

    // Validate color format
    validateColor(textProps.color);

    // Validate overflow enum
    validateOverflow(textProps.overflow);
  };

  /**
   * Validate font reference (Google or Self-Hosted)
   */
  const validateFontReference = async (
    fontRef: DateElementConfigInput["textProps"]["fontRef"]
  ): Promise<void> => {
    if (fontRef.type === FontSource.SELF_HOSTED) {
      // Validate font ID exists in database
      await ElementRepository.validateFontId(fontRef.fontId);
    } else if (fontRef.type === FontSource.GOOGLE) {
      // Validate Google font identifier is not empty
      if (!fontRef.identifier || fontRef.identifier.trim().length === 0) {
        throw new Error("Google font identifier cannot be empty");
      }
      // Validate identifier format (letters, numbers, spaces, hyphens)
      if (!/^[a-zA-Z0-9\s\-+]+$/.test(fontRef.identifier)) {
        throw new Error(
          "Google font identifier contains invalid characters. Only letters, numbers, spaces, hyphens, and plus signs are allowed"
        );
      }
    } else {
      throw new Error(`Invalid font source type: ${(fontRef as any).type}`);
    }
  };

  /**
   * Validate font size is within acceptable range
   */
  const validateFontSize = (fontSize: number): void => {
    if (fontSize <= 0) {
      throw new Error("Font size must be greater than 0");
    }
    if (fontSize > 1000) {
      throw new Error("Font size cannot exceed 1000");
    }
    if (!Number.isFinite(fontSize)) {
      throw new Error("Font size must be a finite number");
    }
  };

  /**
   * Validate color format (hex or rgba)
   */
  const validateColor = (color: string): void => {
    if (!color || color.trim().length === 0) {
      throw new Error("Color cannot be empty");
    }

    // Check for hex format (#RGB, #RRGGBB, #RRGGBBAA)
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

    // Check for rgb/rgba format
    const rgbRegex =
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;

    if (!hexRegex.test(color) && !rgbRegex.test(color)) {
      throw new Error(
        "Invalid color format. Use hex (#RGB, #RRGGBB, #RRGGBBAA) or rgb/rgba (rgb(r,g,b) or rgba(r,g,b,a))"
      );
    }

    // Additional validation for RGB values
    if (rgbRegex.test(color)) {
      const match = color.match(rgbRegex);
      if (match) {
        const [, r, g, b] = match;
        const red = parseInt(r, 10);
        const green = parseInt(g, 10);
        const blue = parseInt(b, 10);

        if (red > 255 || green > 255 || blue > 255) {
          throw new Error("RGB values must be between 0 and 255");
        }
      }
    }
  };

  /**
   * Validate overflow enum value
   */
  const validateOverflow = (overflow: ElementOverflow): void => {
    const validOverflows = Object.values(ElementOverflow);
    if (!validOverflows.includes(overflow)) {
      throw new Error(
        `Invalid overflow value: ${overflow}. Must be one of: ${validOverflows.join(", ")}`
      );
    }
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
      throw new Error("Date format must contain at least one date component (Year, Month, or Day)");
    }
  };

  // ============================================================================
  // Mapping Validation
  // ============================================================================

  /**
   * Validate mapping object (custom date component mappings)
   */
  const validateMapping = (mapping: Record<string, string>): void => {
    if (typeof mapping !== "object" || mapping === null) {
      throw new Error("Mapping must be an object");
    }

    // Check that all keys and values are strings
    for (const [key, value] of Object.entries(mapping)) {
      if (typeof key !== "string" || key.trim().length === 0) {
        throw new Error("Mapping keys must be non-empty strings");
      }
      if (typeof value !== "string") {
        throw new Error("Mapping values must be strings");
      }
    }
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate date data source based on type
   */
  const validateDataSource = async (
    dataSource: DateElementConfigInput["dataSource"]
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
        await validateTemplateVariable(dataSource.variableId);
        break;

      default:
        throw new Error(
          `Invalid date data source type: ${(dataSource as any).type}`
        );
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
    validateDescription(input.description);

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
    existing?: any // CertificateElementEntity
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
      validateDescription(input.description);
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

  // ============================================================================
  // Helper: Description Validation
  // ============================================================================

  /**
   * Validate description is not empty
   */
  const validateDescription = (description: string): void => {
    if (!description || description.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }
  };
}
