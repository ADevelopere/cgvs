import {
  GenderDataSourceType,
  GenderElementCreateInput,
  GenderElementUpdateInput,
  CertificateElementEntity,
  GenderDataSourceInput,
  GenderDataSourceInputGraphql,
  GenderElementCreateInputGraphql,
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
    input?: GenderDataSourceInputGraphql | null
  ): GenderDataSourceInput | null | undefined => {
    if (!input) {
      return input;
    }
    if (input.studentGender !== undefined) {
      return {
        type: GenderDataSourceType.STUDENT_GENDER,
      };
    }
    throw new Error(
      "Invalid GenderDataSource input: must specify studentGender"
    );
  };

  /**
   * Map GraphQL GenderElement create input to repository GenderElement create input
   */
  export const mapGenderElementCreateGraphqlToInput = (
    input: GenderElementCreateInputGraphql
  ): GenderElementCreateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps)!,
    };
  };

  /**
   * Map GraphQL GenderElement update input to repository GenderElement update input
   */
  export const mapGenderElementUpdateGraphqlToInput = (
    input: GenderElementUpdateInputGraphql
  ): GenderElementUpdateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsUpdateGraphqlToInput(input.textProps),
    };
  };
  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for GENDER element creation
   */
  export const validateCreateInput = async (
    input: GenderElementCreateInput
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // GENDER has fixed data source (STUDENT_GENDER), no validation needed
  };

  // ============================================================================
  // Update Input Validation
  // ============================================================================

  /**
   * Validate all fields for GENDER element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: GenderElementUpdateInput,
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Validate textProps (if provided)
    if (input.textProps) {
      await CommonElementUtils.validateTextProps(input.textProps);
    }
  };
}
