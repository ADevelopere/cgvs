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
} from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";
import { ElementUtils } from "./element.utils";
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
      templateId: input.templateId,
      name: input.name,
      description: input.description,
      positionX: input.positionX,
      positionY: input.positionY,
      width: input.width,
      height: input.height,
      alignment: input.alignment,
      renderOrder: input.renderOrder,
      config: mapGenderElementConfigGraphqlToInput(input.config),
    };
  };

  /**
   * Map GraphQL GenderElement update input to repository GenderElement update input
   */
  export const mapGenderElementUpdateGraphqlToInput = (
    input: GenderElementUpdateInputGraphql
  ): GenderElementUpdateInput => {
    const result: GenderElementUpdateInput = {
      id: input.id,
    };

    if (input.name !== undefined) result.name = input.name;
    if (input.description !== undefined) result.description = input.description;
    if (input.positionX !== undefined) result.positionX = input.positionX;
    if (input.positionY !== undefined) result.positionY = input.positionY;
    if (input.width !== undefined) result.width = input.width;
    if (input.height !== undefined) result.height = input.height;
    if (input.alignment !== undefined) result.alignment = input.alignment;
    if (input.renderOrder !== undefined) result.renderOrder = input.renderOrder;

    if (input.config !== undefined) {
      result.config = mapGenderElementConfigUpdateGraphqlToInput(input.config);
    }

    return result;
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
   * Validate all fields for GENDER element update (partial)
   * Caches existing element to avoid multiple DB queries
   */
  export const validateUpdateInput = async (
    input: GenderElementUpdateInput,
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
