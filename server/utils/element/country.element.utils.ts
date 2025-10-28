import {
  CountryElementConfigInput,
  CountryDataSourceType,
  CountryRepresentation,
  CountryElementCreateInput,
  CountryElementUpdateInput,
  CertificateElementEntity,
} from "@/server/types/element";
import { ElementUtils } from "./element.utils";
import { CommonElementUtils } from "./common.element.utils";

/**
 * Validation utilities for COUNTRY elements
 * Contains all COUNTRY-specific validation logic
 */
export namespace CountryElementUtils {
  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate complete COUNTRY element config
   * Validates font reference, representation, and data source
   */
  export const validateConfig = async (
    config: CountryElementConfigInput
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
  const validateDataSource = (config: CountryElementConfigInput): void => {
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
   * Validate all fields for COUNTRY element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: CountryElementUpdateInput,
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
