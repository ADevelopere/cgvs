import type {
  QrCodeElementSpecPropsValidateFn,
} from "./types";

/**
 * Field-level validation for QR code-specific properties
 */
export const validateQrCodePropsField = () => {
  const validate: QrCodeElementSpecPropsValidateFn = ({ key, value }) => {
    switch (key) {
      case "foregroundColor":
        if (!value) return "Foreground color is required";
        if (!/^#[0-9A-Fa-f]{6}$/.test(value as string)) {
          return "Invalid hex color format (e.g., #000000)";
        }
        return undefined;

      case "backgroundColor":
        if (!value) return "Background color is required";
        if (!/^#[0-9A-Fa-f]{6}$/.test(value as string)) {
          return "Invalid hex color format (e.g., #FFFFFF)";
        }
        return undefined;

      case "errorCorrection":
        if (!value) return "Error correction level is required";
        return undefined;

      default:
        return undefined;
    }
  };
  return validate;
};
