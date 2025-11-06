import { FontSource } from "../../types";

type FontRefConfig = {
  textProps?: {
    fontRef?: {
      type: FontSource;
      fontId?: number | null;
    } | null;
  } | null;
};

type VariableDataSource = {
  dataSource?: {
    type: unknown;
    variableId?: number | null;
  } | null;
};

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
      return Promise.resolve("Element name must be at least 3 characters long.");
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
  export const validateDimensions = (width: number, height: number): Promise<string | null> => {
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
  export const validatePosition = (x: number, y: number): Promise<string | null> => {
    if (x < 0) {
      return Promise.resolve("Element position X must be greater than or equal to 0.");
    }
    if (y < 0) {
      return Promise.resolve("Element position Y must be greater than or equal to 0.");
    }
    return Promise.resolve(null);
  };

  /**
   * Validate render order
   * @returns null if valid, error message if invalid
   */
  export const checkZIndex = (zIndex: number): Promise<string | null> => {
    if (zIndex < 1) {
      return Promise.resolve("Render order must be greater than or equal to 0.");
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
  export const extractFontIdFromConfigTextProps = (config?: FontRefConfig | null): number | null | undefined => {
    if (!config) return config;

    const { textProps } = config;

    if (!textProps) return textProps;

    const fontRef = textProps.fontRef;
    if (!fontRef) return fontRef;

    if (fontRef.type === FontSource.SELF_HOSTED) {
      return fontRef.fontId;
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
  export const extractTemplateVariableIdFromConfigDataSource = (
    config?: VariableDataSource | null
  ): number | null | undefined => {
    if (!config) return config;

    const { dataSource } = config;
    if (!dataSource) return dataSource;

    if ("variableId" in dataSource) {
      return dataSource.variableId;
    }

    return null;
  };

  // to support partial updates, we return undefined when value is not present, so it will not be overwritten
  export const extractStorageFileIdFromConfigTextProps = (config?: FontRefConfig | null): number | null | undefined => {
    if (!config) return config;

    const { textProps } = config;
    if (!textProps) return textProps;

    const fontRef = textProps.fontRef;
    if (!fontRef) return fontRef;

    if (fontRef.type === "SELF_HOSTED") {
      if (!fontRef.fontId) {
        throw new Error("Font ID is required for SELF_HOSTED fonts");
      }
      return fontRef.fontId;
    }
    return null;
  };
}
