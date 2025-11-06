import {
  GenderElementInput,
  GenderElementUpdateInput,
  GenderElementInputGraphql,
  GenderElementUpdateInputGraphql,
} from "@/server/types/element";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for GENDER elements
 * Contains all GENDER-specific validation logic
 */
export namespace GenderElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL GenderElement create input to repository GenderElement create input
   */
  export const mapGenderElementCreateGraphqlToInput = (input: GenderElementInputGraphql): GenderElementInput => {
    if (!input || !input.base || !input.textProps) {
      throw new Error("GenderElementInputGraphql must include base, textProps");
    }
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps)!,
    };
  };

  /**
   * Map GraphQL GenderElement update input to repository GenderElement update input
   */
  export const mapGenderElementUpdateGraphqlToInput = (
    input: GenderElementUpdateInputGraphql
  ): GenderElementUpdateInput => {
    if (!input || !input.base || !input.textProps) {
      throw new Error("GenderElementUpdateInputGraphql must include base, textProps");
    }
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps)!,
    };
  };
  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for GENDER element (create/update)
   */
  export const validateInput = async (input: GenderElementInput): Promise<void> => {
    if (!input.base || !input.textProps) {
      throw new Error("GenderElementInput must include base, textProps");
    }

    // Validate base element properties
    await CommonElementUtils.checkBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.checkTextProps(input.textProps);
  };
}
