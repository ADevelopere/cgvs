import type { QrCodePropsFormErrors, QrCodePropsState } from "./types";
import { ValidateFieldFn } from "../types";

/**
 * Field-level validation for QR code-specific properties
 */
export const validateQrCodePropsField: ValidateFieldFn<QrCodePropsState> = (
  key,
  value
) => {
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

/**
 * Validate all QR code props at once
 */
export const validateQrCodeProps = (
  qrCodeProps: QrCodePropsState
): QrCodePropsFormErrors => {
  const errors: QrCodePropsFormErrors = {};

  const foregroundColorError = validateQrCodePropsField(
    "foregroundColor",
    qrCodeProps.foregroundColor
  );
  if (foregroundColorError) errors.foregroundColor = foregroundColorError;

  const backgroundColorError = validateQrCodePropsField(
    "backgroundColor",
    qrCodeProps.backgroundColor
  );
  if (backgroundColorError) errors.backgroundColor = backgroundColorError;

  const errorCorrectionError = validateQrCodePropsField(
    "errorCorrection",
    qrCodeProps.errorCorrection
  );
  if (errorCorrectionError) errors.errorCorrection = errorCorrectionError;

  return errors;
};
