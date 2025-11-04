import type {
  DateDataSourceFormErrors,
  ValidateDateDataSourceFn,
  ValidateDatePropsFn,
} from "./types";

/**
 * Validates DateDataSourceInput (OneOf type)
 * Checks each variant and validates the active one
 */
export const validateDateDataSource = (): ValidateDateDataSourceFn => {
  const validate: ValidateDateDataSourceFn = ({
    value: source,
  }): DateDataSourceFormErrors => {
    if (source.static && !source.static.value?.trim()) {
      return { static: "Static date value is required" };
    }

    if (source.studentField && !source.studentField.field) {
      return {
        studentField: "Student date field is required",
      };
    }

    if (source.certificateField && !source.certificateField.field) {
      return {
        certificateField: "Certificate date field is required",
      };
    }

    if (source.templateVariable && !source.templateVariable.variableId) {
      return {
        templateVariable: "Template date variable is required",
      };
    }

    return {};
  };
  return validate;
};

/**
 * Field-level validation for date-specific properties
 */
export const validateDateProps = (): ValidateDatePropsFn => {
  const validate: ValidateDatePropsFn = ({
    key,
    value,
  }): string | undefined => {
    switch (key) {
      case "format":
        if (!value.trim()) {
          return "Date format is required";
        }
        break;
      case "calendarType":
        if (!value) {
          return "Calendar type is required";
        }
        break;
      case "offsetDays":
        if (value === undefined || value === null || !Number.isInteger(value)) {
          return "Offset days must be an integer";
        }
        break;

      default:
        return undefined;
    }
    return undefined;
  };
  return validate;
};
