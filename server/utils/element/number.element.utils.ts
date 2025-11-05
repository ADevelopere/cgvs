import {
  NumberDataSourceType,
  NumberElementInput,
  NumberElementUpdateInput,
  NumberDataSourceInput,
  NumberDataSourceInputGraphql,
  NumberElementInputGraphql,
  NumberElementUpdateInputGraphql,
  NumberDataSource,
  NumberElementDataSourceStandaloneUpdateInputGraphql,
  NumberElementDataSourceStandaloneUpdateInput,
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { TemplateVariableType } from "@/server/types";
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
  export const mapNumberDataSourceGraphqlToInput = (input: NumberDataSourceInputGraphql): NumberDataSourceInput => {
    return {
      type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE,
      variableId: input.variableId,
    };
  };

  export const mapNumberElementDataSourceStandaloneUpdateGraphqlToInput = (
    input: NumberElementDataSourceStandaloneUpdateInputGraphql
  ): NumberElementDataSourceStandaloneUpdateInput => {
    return {
      ...input,
      dataSource: mapNumberDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL NumberElement create input to repository NumberElement create input
   */
  export const mapNumberElementCreateGraphqlToInput = (input: NumberElementInputGraphql): NumberElementInput => {
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps)!,
      numberProps: input.numberProps,
      dataSource: mapNumberDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL NumberElement update input to repository NumberElement update input
   */
  export const mapNumberElementUpdateGraphqlToInput = (
    input: NumberElementUpdateInputGraphql
  ): NumberElementUpdateInput => {
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps)!,
      numberProps: input.numberProps,
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
  const validateDataSource = async (dataSource: NumberDataSourceInput): Promise<void> => {
    if (dataSource.type !== NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE) {
      throw new Error(`Invalid number data source type: ${dataSource.type}. Must be TEMPLATE_NUMBER_VARIABLE`);
    }

    // Validate template variable exists
    await ElementRepository.checkTemplateVariableId(dataSource.variableId, TemplateVariableType.NUMBER);
  };

  // ============================================================================
  // Mapping Validation
  // ============================================================================

  /**
   * Validate breakpoint mapping
   * Validates format, ranges, and display values
   */
  const validateMapping = (mapping?: Record<string, string> | null): void => {
    if (!mapping) {
      return;
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
    const rangeMatch = trimmedKey.match(/^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/);
    const singleMatch = trimmedKey.match(/^-?\d+(?:\.\d+)?$/);

    if (!rangeMatch && !singleMatch) {
      throw new Error(`Invalid breakpoint format: "${key}". Use "X-Y" for ranges or "X" for single values`);
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
        throw new Error(`Invalid range "${key}": start (${start}) must be less than end (${end})`);
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
  const validateNoOverlappingRanges = (mapping: Record<string, string>): void => {
    const ranges: Array<{ start: number; end: number; key: string }> = [];

    for (const key of Object.keys(mapping)) {
      const trimmedKey = key.trim();
      const rangeMatch = trimmedKey.match(/^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/);
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
          throw new Error(`Overlapping breakpoint ranges: "${range1.key}" and "${range2.key}"`);
        }
      }
    }
  };

  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for NUMBER element (create/update)
   */
  export const validateInput = async (input: NumberElementInput): Promise<void> => {
    if (!input.base || !input.textProps || !input.numberProps || !input.dataSource) {
      throw new Error("NumberElementInput must include base, textProps, numberProps, and dataSource");
    }

    // Validate base element properties
    await CommonElementUtils.checkBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.checkTextProps(input.textProps);

    // Validate data source
    await validateDataSource(input.dataSource);

    // Validate mapping
    validateMapping(input.numberProps.mapping);
  };

  // ============================================================================
  // Data Source Conversion
  // ============================================================================

  /**
   * Convert input data source format to output format
   */
  export const convertInputDataSourceToOutput = (input: NumberDataSourceInput): NumberDataSource => {
    return {
      type: input.type,
      numberVariableId: input.variableId,
    };
  };

  /**
   * Extract variableId from number data source (inline in repository)
   */
  export const extractVariableIdFromDataSource = (dataSource: NumberDataSourceInput): number | null => {
    switch (dataSource.type) {
      case NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE:
        return dataSource.variableId;
      default:
        return null;
    }
  };
}
