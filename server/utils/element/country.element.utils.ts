import {
  CountryDataSourceType,
  CountryRepresentation,
  CountryElementInput,
  CountryElementUpdateInput,
  CountryDataSourceInput,
  CountryDataSourceInputGraphql,
  CountryElementInputGraphql,
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
    input: CountryDataSourceInputGraphql
  ): CountryDataSourceInput => {
    if (!input || input.studentNationality === undefined) {
      throw new Error(
        "Invalid CountryDataSource input: must specify studentNationality"
      );
    }
    return {
      type: CountryDataSourceType.STUDENT_NATIONALITY,
    };
  };

  /**
   * Map GraphQL CountryElement create input to repository CountryElement create input
   */
  export const mapCountryElementCreateGraphqlToInput = (
    input: CountryElementInputGraphql
  ): CountryElementInput => {
    if (!input || !input.base || !input.textProps || !input.countryProps) {
      throw new Error(
        "CountryElementCreateInputGraphql must include base, textProps, and countrySpecProps"
      );
    }
    return {
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      countryProps: {
        representation: input.countryProps.representation,
      },
    };
  };

  /**
   * Map GraphQL CountryElement update input to repository CountryElement update input
   */
  export const mapCountryElementUpdateGraphqlToInput = (
    input: CountryElementUpdateInputGraphql
  ): CountryElementUpdateInput => {
    if (!input || !input.base || !input.textProps || !input.countryProps) {
      throw new Error(
        "CountryElementUpdateInputGraphql must include base, textProps, and countrySpecProps"
      );
    }
    return {
      id: input.id,
      base: input.base,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      countryProps: {
        representation: input.countryProps.representation,
      },
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
  export const validateInput = async (
    input: CountryElementInput
  ): Promise<void> => {
    // Validate base element properties
    await CommonElementUtils.validateBaseInput(input.base);

    if (!input.base || !input.textProps || !input.countryProps) {
      throw new Error(
        "CountryElementInput must include base, textProps, and countrySpecProps"
      );
    }

    // Validate textProps
    await CommonElementUtils.validateTextProps(input.textProps);

    // Validate representation
    validateRepresentation(input.countryProps.representation);

    // COUNTRY has fixed data source (STUDENT_NATIONALITY), no validation needed
  };
}
