import type {
  BaseElementState,
  TextPropsState,
  TextDataSourceState,
  FontReferenceState,
  DataSourceFormErrors,
  ValidateFieldFn,
} from "./types";

// ============================================================================
// BASE ELEMENT VALIDATORS
// ============================================================================

export const validateBaseElementField: ValidateFieldFn<BaseElementState> = (
  key,
  value
) => {
  switch (key) {
    case "templateId":
      return (value as number) > 0 ? undefined : "Template ID required";

    case "name": {
      const nameValue = value as string;
      if (!nameValue || nameValue.trim().length === 0)
        return "Name is required";
      if (nameValue.length < 2) return "Name must be at least 2 characters";
      return undefined;
    }

    case "description": {
      const descValue = value as string;
      return !descValue || descValue.trim().length === 0
        ? "Description is required"
        : undefined;
    }

    case "positionX":
    case "positionY":
      return (value as number) < 0
        ? "Position must be non-negative"
        : undefined;

    case "width":
    case "height":
      return (value as number) <= 0 ? "Dimension must be positive" : undefined;

    case "renderOrder":
      return (value as number) < 0
        ? "Render order must be non-negative"
        : undefined;

    case "alignment":
      return !value ? "Alignment is required" : undefined;

    default:
      return undefined;
  }
};

// ============================================================================
// TEXT PROPS VALIDATORS
// ============================================================================

export const validateTextPropsField: ValidateFieldFn<TextPropsState> = (
  key,
  value
) => {
  switch (key) {
    case "color": {
      const colorValue = value as string;
      if (!colorValue) return "Color is required";
      if (!/^#[0-9A-Fa-f]{6}$/.test(colorValue))
        return "Invalid color format";
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
      return validateFontReference(value as FontReferenceState);

    default:
      return undefined;
  }
};

// Font reference validator (matches backend logic)
export const validateFontReference = (
  fontRef: FontReferenceState
): string | undefined => {
  switch (fontRef.type) {
    case "GOOGLE":
      if (!fontRef.identifier || fontRef.identifier.trim().length === 0) {
        return "Google font identifier is required";
      }
      if (!/^[a-zA-Z0-9\s\-+]+$/.test(fontRef.identifier)) {
        return "Invalid characters in font identifier";
      }
      return undefined;

    case "SELF_HOSTED":
      if (!fontRef.fontId || fontRef.fontId <= 0) {
        return "Font selection is required";
      }
      return undefined;
  }
};

// ============================================================================
// DATA SOURCE VALIDATORS (matches backend switch pattern)
// ============================================================================

export const validateDataSource = (
  dataSource: TextDataSourceState
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  switch (dataSource.type) {
    case "STATIC":
      if (!dataSource.value || dataSource.value.trim().length === 0) {
        errors.value = "Static value is required";
      }
      break;

    case "STUDENT_TEXT_FIELD":
      if (!dataSource.field) {
        errors.field = "Student field is required";
      }
      break;

    case "CERTIFICATE_TEXT_FIELD":
      if (!dataSource.field) {
        errors.field = "Certificate field is required";
      }
      break;

    case "TEMPLATE_TEXT_VARIABLE":
    case "TEMPLATE_SELECT_VARIABLE":
      if (!dataSource.variableId || dataSource.variableId <= 0) {
        errors.variableId = "Variable selection is required";
      }
      break;
  }

  return errors;
};

