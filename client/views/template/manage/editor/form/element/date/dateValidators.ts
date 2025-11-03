import type {
  ValidateDateDataSourceFn,
  ValidateDatePropsFieldFn,
} from "./types";

/**
 * Validates DateDataSourceInput (OneOf type)
 * Checks each variant and validates the active one
 */
export const validateDateDataSource = (): ValidateDateDataSourceFn => {
  const validate: ValidateDateDataSourceFn = ({ value: source }) => {
    if (source.static && !source.static.value?.trim()) {
      return { dataSource: { static: "Static date value is required" } };
    }

    if (source.studentField && !source.studentField.field) {
      return {
        dataSource: { studentField: "Student date field is required" },
      };
    }

    if (source.certificateField && !source.certificateField.field) {
      return {
        dataSource: { certificateField: "Certificate date field is required" },
      };
    }

    if (source.templateVariable && !source.templateVariable.variableId) {
      return {
        dataSource: { templateVariable: "Template date variable is required" },
      };
    }

    return undefined;
  };
  return validate;
};

/**
 * Field-level validation for date-specific properties
 */
export const validateDateProps = () => {
  const validate: ValidateDatePropsFieldFn = action => {
    if (!action) return undefined;
    const { key, value } = action;
    switch (key) {
      case "format": {
        const formatValue = value;
        if (!formatValue || formatValue.trim().length === 0) {
          return "Date format is required";
        }
        return undefined;
      }

      case "calendarType":
        if (!value) {
          return "Calendar type is required";
        }
        return undefined;

      case "offsetDays": {
        const offsetValue = value as number;
        if (offsetValue === undefined || offsetValue === null) {
          return "Offset days is required";
        }
        if (!Number.isInteger(offsetValue)) {
          return "Offset days must be an integer";
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };
  return validate;
};
