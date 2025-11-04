import type { ValidateQRCodePropsFn } from "./types";

/**
 * Field-level validation for QR code-specific properties
 */
export const validateQRCodeProps = (): ValidateQRCodePropsFn => {
  const validate: ValidateQRCodePropsFn = ({
    key,
    value,
  }): string | undefined => {
    switch (key) {
      case "foregroundColor":
        if (!value) {
          return "Foreground color is required";
        } else if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return "Invalid hex color format (e.g., #000000)";
        }
        break;

      case "backgroundColor":
        if (!value) {
          return "Background color is required";
        } else if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          return "Invalid hex color format (e.g., #FFFFFF)";
        }
        break;
      case "errorCorrection":
        if (!value) {
          return "Error correction level is required";
        }
        break;
      default:
        break;
    }

    return undefined;
  };

  return validate;
};
