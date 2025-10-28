import {
  NumberElementConfigInput,
  NumberDataSourceType,
  NumberElementCreateInput,
  NumberElementUpdateInput,
  CertificateElementEntity,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for NUMBER elements
 * Contains all NUMBER-specific validation logic
 */
export namespace NumberElementUtils {
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete NUMBER element config
   * Validates font reference, data source, and mapping
   */
  export const validateConfig = async (
    config: NumberElementConfigInput
  ): Promise<void> => {
    // Validate textProps
    await CommonElementUtils.validateTextProps(config);

    // Validate data source
    await validateDataSource(config);

    // Validate mapping
    validateMapping(config.mapping);
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate number data source
   * NUMBER elements only support TEMPLATE_NUMBER_VARIABLE
   */
  const validateDataSource = async (
    config: NumberElementConfigInput
  ): Promise<void> => {
    const dataSource = config.dataSource;
    if (dataSource.type !== NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE) {
      throw new Error(
        `Invalid number data source type: ${dataSource.type}. Must be TEMPLATE_NUMBER_VARIABLE`
      );
    }

    // Validate template variable exists
    await ElementRepository.validateTemplateVariableId(dataSource.variableId);
  };

  // ============================================================================
  // Mapping Validation
  // ============================================================================

  /**
   * Validate breakpoint mapping
   * Validates format, ranges, and display values
   */
  const validateMapping = (mapping: Record<string, string>): void => {
    // Check mapping is not empty
    const keys = Object.keys(mapping);
    if (keys.length === 0) {
      throw new Error("Mapping cannot be empty");
    }

    // Validate each breakpoint rule
    for (const [key, value] of Object.entries(mapping)) {
      validateBreakpointKey(key);
      validateBreakpointValue(value);
    }

    // Optional: Validate for overlapping ranges
    validateNoOverlappingRanges(mapping);
  };

  /**
   * Validate breakpoint key format
   * Supports: "0-59", "60-79", "80" (single number)
   */
  const validateBreakpointKey = (key: string): void => {
    if (!key || key.trim().length === 0) {
      throw new Error("Breakpoint key cannot be empty");
    }

    const trimmedKey = key.trim();

    // Check for range format "X-Y" or single number "X"
    const rangeMatch = trimmedKey.match(
      /^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/
    );
    const singleMatch = trimmedKey.match(/^-?\d+(?:\.\d+)?$/);

    if (!rangeMatch && !singleMatch) {
      throw new Error(
        `Invalid breakpoint format: "${key}". Use "X-Y" for ranges or "X" for single values`
      );
    }

    // Validate range if it's a range format
    if (rangeMatch) {
      const [, startStr, endStr] = rangeMatch;
      const start = parseFloat(startStr);
      const end = parseFloat(endStr);

      // Check for valid numbers
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error(`Breakpoint numbers must be finite: "${key}"`);
      }

      // Check range order
      if (start >= end) {
        throw new Error(
          `Invalid range "${key}": start (${start}) must be less than end (${end})`
        );
      }
    } else if (singleMatch) {
      const value = parseFloat(trimmedKey);
      if (!Number.isFinite(value)) {
        throw new Error(`Breakpoint number must be finite: "${key}"`);
      }
    }
  };

  /**
   * Validate breakpoint display value
   */
  const validateBreakpointValue = (value: string): void => {
    if (!value || value.trim().length === 0) {
      throw new Error("Breakpoint display value cannot be empty");
    }
  };

  /**
   * Validate no overlapping ranges
   * Checks that ranges don't overlap with each other
   */
  const validateNoOverlappingRanges = (
    mapping: Record<string, string>
  ): void => {
    const ranges: Array<{ start: number; end: number; key: string }> = [];

    for (const key of Object.keys(mapping)) {
      const trimmedKey = key.trim();
      const rangeMatch = trimmedKey.match(
        /^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/
      );
      const singleMatch = trimmedKey.match(/^-?\d+(?:\.\d+)?$/);

      if (rangeMatch) {
        const [, startStr, endStr] = rangeMatch;
        ranges.push({
          start: parseFloat(startStr),
          end: parseFloat(endStr),
          key: trimmedKey,
        });
      } else if (singleMatch) {
        const value = parseFloat(trimmedKey);
        ranges.push({
          start: value,
          end: value,
          key: trimmedKey,
        });
      }
    }

    // Check for overlaps
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        const range1 = ranges[i];
        const range2 = ranges[j];

        // Check if ranges overlap
        const overlaps =
          (range1.start <= range2.start && range2.start <= range1.end) ||
          (range1.start <= range2.end && range2.end <= range1.end) ||
          (range2.start <= range1.start && range1.start <= range2.end) ||
          (range2.start <= range1.end && range1.end <= range2.end);

        if (overlaps) {
          throw new Error(
            `Overlapping breakpoint ranges: "${range1.key}" and "${range2.key}"`
          );
        }
      }
    }
  };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for NUMBER element creation
   */
  export const validateCreateInput = async (
    input: NumberElementCreateInput
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
   * Validate all fields for NUMBER element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: NumberElementUpdateInput,
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
