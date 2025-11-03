import type { ValidateQRCodePropsFn, QRCodePropsFormErrors } from "./types";

/**
 * Field-level validation for QR code-specific properties
 */
export const validateQRCodeProps = (): ValidateQRCodePropsFn => {
  const validate: ValidateQRCodePropsFn = ({ value: qrCodeProps }) => {
    const errors: QRCodePropsFormErrors = { qrCodeProps: {} };

    if (!qrCodeProps.foregroundColor) {
      errors.qrCodeProps.foregroundColor = "Foreground color is required";
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(qrCodeProps.foregroundColor)) {
      if (errors.qrCodeProps)
        errors.qrCodeProps.foregroundColor =
          "Invalid hex color format (e.g., #000000)";
    }

    if (!qrCodeProps.backgroundColor) {
      errors.qrCodeProps.backgroundColor = "Background color is required";
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(qrCodeProps.backgroundColor)) {
      if (errors.qrCodeProps)
        errors.qrCodeProps.backgroundColor =
          "Invalid hex color format (e.g., #FFFFFF)";
    }

    if (!qrCodeProps.errorCorrection) {
      errors.qrCodeProps.errorCorrection = "Error correction level is required";
    }

    if (Object.keys(errors.qrCodeProps ?? {}).length === 0) {
      return undefined;
    }

    return errors;
  };
  return validate;
};
