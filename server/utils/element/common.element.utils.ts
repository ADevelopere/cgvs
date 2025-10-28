import { FontSource, ElementOverflow } from "@/server/types/element";
import { ElementRepository } from "@/server/db/repo/element/element.repository";

/**
 * Common validation utilities shared across element types
 * Contains validation logic that is not specific to any element type
 */
export namespace CommonElementUtils {
  // ============================================================================
  // Text Props Validation
  // ============================================================================

  /**
   * Validate text properties (font, size, color, overflow)
   * Used by TEXT, DATE, NUMBER, COUNTRY, GENDER elements
   */
  export const validateTextProps = async (config: {
    textProps: {
      fontRef: { type: FontSource; fontId?: number; identifier?: string };
      fontSize: number;
      color: string;
      overflow: ElementOverflow;
    };
  }): Promise<void> => {
    const textProps = config.textProps;
    // Validate font reference
    await validateFontReference(config);

    // Validate font size
    validateFontSize(textProps.fontSize);

    // Validate color format
    validateColor(textProps.color);

    // Validate overflow enum
    validateOverflow(textProps.overflow);
  };

  /**
   * Validate font reference (Google or Self-Hosted)
   */
  export const validateFontReference = async (config: {
    textProps: {
      fontRef: { type: FontSource; fontId?: number; identifier?: string };
    };
  }): Promise<void> => {
    const fontRef = config.textProps.fontRef;
    if (fontRef.type === FontSource.SELF_HOSTED) {
      // Validate font ID exists in database
      await ElementRepository.validateFontId(fontRef.fontId!);
    } else if (fontRef.type === FontSource.GOOGLE) {
      // Validate Google font identifier is not empty
      if (!fontRef.identifier || fontRef.identifier.trim().length === 0) {
        throw new Error("Google font identifier cannot be empty");
      }
      // Validate identifier format (letters, numbers, spaces, hyphens)
      if (!/^[a-zA-Z0-9\s\-+]+$/.test(fontRef.identifier)) {
        throw new Error(
          "Google font identifier contains invalid characters. Only letters, numbers, spaces, hyphens, and plus signs are allowed"
        );
      }
    } else {
      throw new Error(`Invalid font source type}`);
    }
  };

  /**
   * Validate font size is within acceptable range
   */
  export const validateFontSize = (fontSize: number): void => {
    if (fontSize <= 0) {
      throw new Error("Font size must be greater than 0");
    }
    if (fontSize > 1000) {
      throw new Error("Font size cannot exceed 1000");
    }
    if (!Number.isFinite(fontSize)) {
      throw new Error("Font size must be a finite number");
    }
  };

  /**
   * Validate color format (hex or rgba)
   */
  export const validateColor = (color: string): void => {
    if (!color || color.trim().length === 0) {
      throw new Error("Color cannot be empty");
    }

    // Check for hex format (#RGB, #RRGGBB, #RRGGBBAA)
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

    // Check for rgb/rgba format
    const rgbRegex =
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;

    if (!hexRegex.test(color) && !rgbRegex.test(color)) {
      throw new Error(
        "Invalid color format. Use hex (#RGB, #RRGGBB, #RRGGBBAA) or rgb/rgba (rgb(r,g,b) or rgba(r,g,b,a))"
      );
    }

    // Additional validation for RGB values
    if (rgbRegex.test(color)) {
      const match = color.match(rgbRegex);
      if (match) {
        const [, r, g, b] = match;
        const red = parseInt(r, 10);
        const green = parseInt(g, 10);
        const blue = parseInt(b, 10);

        if (red > 255 || green > 255 || blue > 255) {
          throw new Error("RGB values must be between 0 and 255");
        }
      }
    }
  };

  /**
   * Validate overflow enum value
   */
  export const validateOverflow = (overflow: ElementOverflow): void => {
    const validOverflows = Object.values(ElementOverflow);
    if (!validOverflows.includes(overflow)) {
      throw new Error(
        `Invalid overflow value: ${overflow}. Must be one of: ${validOverflows.join(", ")}`
      );
    }
  };

  // ============================================================================
  // Description Validation
  // ============================================================================

  /**
   * Validate description is not empty
   */
  export const validateDescription = (description: string): void => {
    if (!description || description.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }
  };
}
