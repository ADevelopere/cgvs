import {
  NumberDataSourceType,
  NumberElementCreateInput,
  NumberElementUpdateInput,
  CertificateElementEntity,
  NumberDataSourceInput,
  NumberDataSourceInputGraphql,
  NumberElementCreateInputGraphql,
  NumberElementUpdateInputGraphql,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for NUMBER elements
 * Contains all NUMBER-specific validation logic
 */
export namespace NumberElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL NumberDataSource input to repository NumberDataSource input
   * Note: NUMBER has only one data source variant, so no isOneOf pattern needed
   */
  export const mapNumberDataSourceGraphqlToInput = (
    input?: NumberDataSourceInputGraphql | null
  ): NumberDataSourceInput | null | undefined => {
    if (!input) {
      return input;
    }

    return {
      type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE,
      variableId: input.variableId,
    };
  };

  /**
   * Map GraphQL NumberElement create input to repository NumberElement create input
   */
  export const mapNumberElementCreateGraphqlToInput = (
    input: NumberElementCreateInputGraphql
  ): NumberElementCreateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapNumberDataSourceGraphqlToInput(input.dataSource)!,
    };
  };

  /**
   * Map GraphQL NumberElement update input to repository NumberElement update input
   */
  export const mapNumberElementUpdateGraphqlToInput = (
    input: NumberElementUpdateInputGraphql
  ): NumberElementUpdateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsUpdateGraphqlToInput(
        input.textProps
      ),
      dataSource: mapNumberDataSourceGraphqlToInput(input.dataSource),
    };
  };
  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate number data source
   * NUMBER elements only support TEMPLATE_NUMBER_VARIABLE
   */
  const validateDataSource = async (
    dataSource: NumberDataSourceInput
  ): Promise<void> => {
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
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // Validate data source
    await validateDataSource(input.dataSource);

    // Validate mapping
    validateMapping(input.mapping);
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
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Validate textProps (if provided)
    if (input.textProps) {
      await CommonElementUtils.validateTextProps(input.textProps);
    }

    // Validate data source (if provided)
    if (input.dataSource) {
      await validateDataSource(input.dataSource);
    }

    // Validate mapping (if provided)
    if (input.mapping !== undefined && input.mapping !== null) {
      validateMapping(input.mapping);
    }
  };
}
