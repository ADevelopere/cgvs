import {
  CountryElementConfigCreateInput,
  CountryDataSourceType,
  CountryRepresentation,
  CountryElementCreateInput,
  CountryElementUpdateInput,
  CertificateElementEntity,
  CountryDataSourceInput,
  CountryDataSourceInputGraphql,
  CountryElementConfigCreateInputGraphql,
  CountryElementConfigUpdateInputGraphql,
  CountryElementCreateInputGraphql,
  CountryElementUpdateInputGraphql,
  ElementType,
  CountryElementConfigUpdateInput,
} from "@/server/types/element";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";
import { ElementRepository } from "@/server/db/repo/element/element.repository";

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
   * Map GraphQL CountryElementConfig input to repository CountryElementConfig input
   */
  export const mapCountryElementConfigCreateGraphqlToInput = (
    input: CountryElementConfigCreateInputGraphql
  ): CountryElementConfigCreateInput => {
    return {
      ...input,
      type: ElementType.COUNTRY,
      textProps: CommonElementUtils.mapTextPropsGraphqlCreateToInput(
        input.textProps
      )!,
      dataSource: mapCountryDataSourceGraphqlToInput(input.dataSource)!,
    };
  };

  /**
   * Map GraphQL CountryElementConfig update input (partial) to repository CountryElementConfig input (partial)
   */
  export const mapCountryElementConfigUpdateGraphqlToInput = (
    input?: CountryElementConfigUpdateInputGraphql | null
  ): CountryElementConfigUpdateInput | null | undefined => {
    if (!input) {
      return input;
    }

    return {
      ...input,
      type: ElementType.COUNTRY,
      textProps: CommonElementUtils.mapTextPropsUpdateGraphqlToInput(
        input.textProps
      ),
      dataSource: mapCountryDataSourceGraphqlToInput(input.dataSource),
    };
  };

  /**
   * Map GraphQL CountryElement create input to repository CountryElement create input
   */
  export const mapCountryElementCreateGraphqlToInput = (
    input: CountryElementCreateInputGraphql
  ): CountryElementCreateInput => {
    return {
      ...input,
      config: mapCountryElementConfigCreateGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL CountryElement update input to repository CountryElement update input
   */
  export const mapCountryElementUpdateGraphqlToInput = (
    input?: CountryElementUpdateInputGraphql | null
  ): CountryElementUpdateInput | null | undefined => {
    if (!input) {
      return input;
    }

    return {
      ...input,
      config: mapCountryElementConfigUpdateGraphqlToInput(input.config),
    };
  };
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete COUNTRY element config
   * Validates font reference, representation, and data source
   */
  export const validateConfig = async (
    config: CountryElementConfigCreateInput
  ): Promise<void> => {
    // Validate textProps
    await CommonElementUtils.validateTextProps(config);

    // Validate representation
    validateRepresentation(config.representation);

    // Validate data source
    validateDataSource(config);
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
  const validateDataSource = (
    config: CountryElementConfigCreateInput
  ): void => {
    const dataSource = config.dataSource;
    if (dataSource.type !== CountryDataSourceType.STUDENT_NATIONALITY) {
      throw new Error(
        `Invalid country data source type. Must be STUDENT_NATIONALITY`
      );
    }
  };

  // ============================================================================
  // Create Input Validation
  // ============================================================================

  /**
   * Validate all fields for COUNTRY element creation
   */
  export const validateCreateInput = async (
    input: CountryElementCreateInput
  ): Promise<void> => {
    // Template exists
    await ElementRepository.validateTemplateId(input.templateId);

    // Name validation
    const nameError = await ElementUtils.validateName(input.name);
    if (nameError) throw new Error(nameError);

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
   * Validate all fields for COUNTRY element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: CountryElementUpdateInput,
    existing: CertificateElementEntity
  ): Promise<void> => {
    // Name validation (if provided)
    if (input.name) {
      const nameError = await ElementUtils.validateName(input.name);
      if (nameError) throw new Error(nameError);
    }

    // Dimensions validation (if provided)
    if (input.width || input.height) {
      const width = input.width ?? existing.width;
      const height = input.height ?? existing.height;
      const dimError = await ElementUtils.validateDimensions(width, height);
      if (dimError) throw new Error(dimError);
    }

    // Position validation (if provided)
    if (input.positionX !== undefined || input.positionY !== undefined) {
      const x = input.positionX ?? existing.positionX;
      const y = input.positionY ?? existing.positionY;
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
