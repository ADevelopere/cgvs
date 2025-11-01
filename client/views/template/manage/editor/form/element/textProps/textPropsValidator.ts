import {
  FontReferenceInput,
  TextPropsInput,
} from "@/client/graphql/generated/gql/graphql";
import { ValidateFieldFn } from "../../types";

// ============================================================================
// TEXT PROPS VALIDATORS
// ============================================================================

export const validateTextPropsField: ValidateFieldFn<TextPropsInput> = (
  key,
  value
) => {
  switch (key) {
    case "color": {
      const colorValue = value as string;
      if (!colorValue) return "Color is required";
      if (!/^#[0-9A-Fa-f]{6}$/.test(colorValue)) return "Invalid color format";
      return undefined;
    }

    case "fontSize": {
      const sizeValue = value as number;
      if (sizeValue <= 0) return "Font size must be positive";
      if (sizeValue > 1000) return "Font size cannot exceed 1000";
      return undefined;
    }

    case "overflow":
      return !value ? "Overflow is required" : undefined;

    case "fontRef":
      return validateFontReference(value as FontReferenceInput);

    default:
      return undefined;
  }
};

// Font reference validator (matches backend logic)
export const validateFontReference = (
  fontRef: FontReferenceInput
): string | undefined => {
  if (fontRef.google) {
    const identifier = fontRef.google.identifier;
    if (!identifier || identifier.trim().length === 0) {
      return "Google font identifier is required";
    }
    if (!/^[a-zA-Z0-9\s\-+]+$/.test(identifier)) {
      return "Invalid characters in font identifier";
    }
    return undefined;
  }

  if (fontRef.selfHosted) {
    const fontId = fontRef.selfHosted.fontId;
    if (!fontId || fontId <= 0) {
      return "Font selection is required";
    }
    return undefined;
  }

  return "Font reference is required";
};
