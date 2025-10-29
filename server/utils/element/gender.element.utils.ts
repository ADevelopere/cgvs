import {
  GenderElementConfigInput,
  GenderDataSourceType,
  GenderElementCreateInput,
  GenderElementUpdateInput,
  CertificateElementEntity,
  GenderDataSourceInput,
  GenderDataSourceInputGraphql,
  GenderElementConfigInputGraphql,
  GenderElementConfigUpdateInputGraphql,
  GenderElementCreateInputGraphql,
  GenderElementUpdateInputGraphql,
  ElementType,
} from "@/server/types/element/output";
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
   * Map GraphQL GenderElementConfig input to repository GenderElementConfig input
   */
  export const mapGenderElementConfigGraphqlToInput = (
    input: GenderElementConfigInputGraphql
  ): GenderElementConfigInput => {
    return {
      type: ElementType.GENDER,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(input.textProps),
      dataSource: mapGenderDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL GenderElementConfig update input (partial) to repository GenderElementConfig input (partial)
   */
  export const mapGenderElementConfigUpdateGraphqlToInput = (
    input: GenderElementConfigUpdateInputGraphql
  ): Partial<GenderElementConfigInput> => {
    const result: Partial<GenderElementConfigInput> = {};

    if (input.textProps !== undefined) {
      const textPropsUpdate = CommonElementUtils.mapTextPropsUpdateGraphqlToInput(
        input.textProps
      );
      if (Object.keys(textPropsUpdate).length > 0) {
        result.textProps = textPropsUpdate as Types.TextPropsInput;
      }
    }
    if (input.dataSource !== undefined) {
      result.dataSource = mapGenderDataSourceGraphqlToInput(input.dataSource);
    }

    return result;
  };

  /**
   * Map GraphQL GenderElement create input to repository GenderElement create input
   */
  export const mapGenderElementCreateGraphqlToInput = (
    input: GenderElementCreateInputGraphql
  ): GenderElementCreateInput => {
    return {
      ...input,
      config: mapGenderElementConfigGraphqlToInput(input.config),
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
      config: input.config !== undefined ? mapGenderElementConfigUpdateGraphqlToInput(input.config) : undefined,
    };
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete GENDER element config
   * Validates font reference and data source
   */
  export const validateConfig = async (
    config: GenderElementConfigInput
  ): Promise<void> => {
    // Validate textProps
    await CommonElementUtils.validateTextProps(config);

    // Validate data source
    await validateDataSource(config);
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate gender data source
   * GENDER elements only support STUDENT_GENDER data source type
   */
  const validateDataSource = async (
    config: GenderElementConfigInput
  ): Promise<void> => {
    const dataSource = config.dataSource;

    // GENDER elements only have one data source type
    if (dataSource.type !== GenderDataSourceType.STUDENT_GENDER) {
      throw new Error(
        `Invalid gender data source type: ${dataSource.type}. Must be ${GenderDataSourceType.STUDENT_GENDER}`
      );
    }
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

    // Config validation
    await validateConfig(input.config);
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

    // Config validation (if provided) - handled separately with deep merge
  };
}
