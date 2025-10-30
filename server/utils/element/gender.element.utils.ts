import {
  GenderDataSourceType,
  GenderElementInput,
  GenderElementUpdateInput,
  GenderDataSourceInput,
  GenderDataSourceInputGraphql,
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
   * Map GraphQL GenderDataSource input to repository GenderDataSource input
   * Note: GENDER has only one data source variant (studentGender)
   */
  export const mapGenderDataSourceGraphqlToInput = (
    input: GenderDataSourceInputGraphql
  ): GenderDataSourceInput => {
    if (!input || input.studentGender === undefined) {
      throw new Error(
        "Invalid GenderDataSource input: must specify studentGender"
      );
    }
    return {
      type: GenderDataSourceType.STUDENT_GENDER,
    };
  };

  /**
   * Map GraphQL GenderElement create input to repository GenderElement create input
   */
  export const mapGenderElementCreateGraphqlToInput = (
    input: GenderElementInputGraphql
  ): GenderElementInput => {
    if (!input || !input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "GenderElementInputGraphql must include base, textProps, and dataSource"
      );
    }
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapGenderDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL GenderElement update input to repository GenderElement update input
   */
  export const mapGenderElementUpdateGraphqlToInput = (
    input: GenderElementUpdateInputGraphql
  ): GenderElementUpdateInput => {
    if (!input || !input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "GenderElementUpdateInputGraphql must include base, textProps, and dataSource"
      );
    }
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapGenderDataSourceGraphqlToInput(input.dataSource),
    };
  };
  // ============================================================================
  // Input Validation
  // ============================================================================

  /**
   * Validate all fields for GENDER element (create/update)
   */
  export const validateInput = async (
    input: GenderElementInput
  ): Promise<void> => {
    if (!input.base || !input.textProps || !input.dataSource) {
      throw new Error(
        "GenderElementInput must include base, textProps, and dataSource"
      );
    }

    // Validate base element properties
    await CommonElementUtils.validateBaseInput(input.base);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // GENDER has fixed data source (STUDENT_GENDER), no validation needed
  };
}
