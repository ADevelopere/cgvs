import { ElementConfigUnion, ElementType, FontSource } from "../../types";

/**
 * Element utility functions for validation and business logic
 * Following the pattern from templateVariable.utils.ts
 */
export namespace ElementUtils {
  /**
   * Validate element name
   * @returns null if valid, error message if invalid
   */
  export const validateName = (name: string): Promise<string | null> => {
    if (!name || name.trim().length === 0) {
      return Promise.resolve("Element name cannot be empty.");
    }
    if (name.length < 3) {
      return Promise.resolve(
        "Element name must be at least 3 characters long."
      );
    }
    if (name.length > 255) {
      return Promise.resolve("Element name cannot exceed 255 characters.");
    }
    return Promise.resolve(null);
  };

  /**
   * Validate element dimensions
   * @returns null if valid, error message if invalid
   */
  export const validateDimensions = (
    width: number,
    height: number
  ): Promise<string | null> => {
    if (width <= 0) {
      return Promise.resolve("Element width must be greater than 0.");
    }
    if (height <= 0) {
      return Promise.resolve("Element height must be greater than 0.");
    }
    return Promise.resolve(null);
  };

  /**
   * Validate element position
   * @returns null if valid, error message if invalid
   */
  export const validatePosition = (
    x: number,
    y: number
  ): Promise<string | null> => {
    if (x < 0) {
      return Promise.resolve(
        "Element position X must be greater than or equal to 0."
      );
    }
    if (y < 0) {
      return Promise.resolve(
        "Element position Y must be greater than or equal to 0."
      );
    }
    return Promise.resolve(null);
  };

  /**
   * Validate render order
   * @returns null if valid, error message if invalid
   */
  export const validateRenderOrder = (
    renderOrder: number
  ): Promise<string | null> => {
    if (renderOrder < 0) {
      return Promise.resolve(
        "Render order must be greater than or equal to 0."
      );
    }
    return Promise.resolve(null);
  };

  // ============================================================================
  // FK Extraction Helpers
  // ============================================================================
  // These helpers extract foreign key IDs from the JSONB config
  // Used by type-specific repositories to maintain config-column sync
  // See docs/certificate/element/config-column-sync.md

  /**
   * Extract fontId from config
   * Returns fontId if element has textProps and uses SELF_HOSTED font
   * Applies to: TEXT, DATE, NUMBER, COUNTRY, GENDER
   */
  export const extractFontId = (config: ElementConfigUnion): number | null => {
    // Only TEXT, DATE, NUMBER, COUNTRY, GENDER have textProps
    if (!("textProps" in config)) return null;

    const { textProps } = config;
    if (textProps.fontRef.type === FontSource.SELF_HOSTED) {
      return textProps.fontRef.fontId;
    }
    return null;
  };

  /**
   * Extract templateVariableId from config
   * Returns variableId from dataSource if present
   * Applies to:
   * - TEXT: when using TEMPLATE_TEXT_VARIABLE or TEMPLATE_SELECT_VARIABLE
   * - DATE: when using TEMPLATE_DATE_VARIABLE
   * - NUMBER: ALWAYS (always uses TEMPLATE_NUMBER_VARIABLE)
   */
  export const extractTemplateVariableId = (
    config: ElementConfigUnion
  ): number | null => {
    if (!("dataSource" in config)) return null;

    const { dataSource } = config;

    // Check if dataSource has variableId property
    if ("variableId" in dataSource) {
      return dataSource.variableId;
    }
    return null;
  };

  /**
   * Extract storageFileId from config
   * Returns storageFileId for IMAGE elements only
   * Applies to: IMAGE only
   */
  export const extractStorageFileId = (
    config: ElementConfigUnion
  ): number | null => {
    // Only IMAGE elements have storageFileId
    if (config.type !== ElementType.IMAGE) return null;

    return config.dataSource.storageFileId;
  };
}
