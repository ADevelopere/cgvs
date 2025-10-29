import {
  CountryDataSourceType,
  CountryRepresentation,
  CountryElementCreateInput,
  CountryElementUpdateInput,
  CertificateElementEntity,
  CountryDataSourceInput,
  CountryDataSourceInputGraphql,
  CountryElementCreateInputGraphql,
  CountryElementUpdateInputGraphql,
} from "@/server/types/element";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for COUNTRY elements
 * Contains all COUNTRY-specific validation logic
 */
export namespace CountryElementUtils {
  // ============================================================================
  // GraphQL Input Mappers
  // ============================================================================

  /**
   * Map GraphQL CountryDataSource input to repository CountryDataSource input
   * Note: COUNTRY has only one data source variant (studentNationality)
   */
  export const mapCountryDataSourceGraphqlToInput = (
    input?: CountryDataSourceInputGraphql | null
  ): CountryDataSourceInput | null | undefined => {
    if (!input) {
      return input;
    }
    if (input.studentNationality !== undefined) {
      return {
        type: CountryDataSourceType.STUDENT_NATIONALITY,
      };
    }
    throw new Error(
      "Invalid CountryDataSource input: must specify studentNationality"
    );
  };

  /**
   * Map GraphQL CountryElement create input to repository CountryElement create input
   */
  export const mapCountryElementCreateGraphqlToInput = (
    input: CountryElementCreateInputGraphql
  ): CountryElementCreateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
    };
  };

  /**
   * Map GraphQL CountryElement update input to repository CountryElement update input
   */
  export const mapCountryElementUpdateGraphqlToInput = (
    input: CountryElementUpdateInputGraphql
  ): CountryElementUpdateInput => {
    return {
      ...input,
      textProps: CommonElementUtils.mapTextPropsUpdateGraphqlToInput(
        input.textProps
      ),
    };
  };
  // ============================================================================
  // Representation Validation
  // ============================================================================

  /**
   * Validate country representation enum
   */
  const validateRepresentation = (
    representation: CountryRepresentation
  ): void => {
    const validRepresentations = Object.values(CountryRepresentation);
    if (!validRepresentations.includes(representation)) {
      throw new Error(
        `Invalid country representation: ${representation}. Must be one of: ${validRepresentations.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Data Source Validation
  // ============================================================================

  /**
   * Validate country data source
   * COUNTRY elements only support STUDENT_NATIONALITY
   */
  // const validateDataSource = (dataSource: CountryDataSourceInput): void => {
  //   if (dataSource.type !== CountryDataSourceType.STUDENT_NATIONALITY) {
  //     throw new Error(
  //       `Invalid country data source type. Must be STUDENT_NATIONALITY`
  //     );
  //   }
  // };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for COUNTRY element creation
   */
  export const validateCreateInput = async (
    input: CountryElementCreateInput
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseCreateInput(input);

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // Validate representation
    validateRepresentation(input.representation);

    // COUNTRY has fixed data source (STUDENT_NATIONALITY), no validation needed
  };

  // ============================================================================
  // Update Input Validation
  // ============================================================================

  /**
   * Validate all fields for COUNTRY element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: CountryElementUpdateInput,
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseUpdateInput(input, existing);

    // Validate textProps (if provided)
    if (input.textProps) {
      await CommonElementUtils.validateTextProps(input.textProps);
    }

    // Validate representation (if provided)
    if (input.representation !== undefined && input.representation !== null) {
      validateRepresentation(input.representation);
    }
  };
}
