import type {
  DateDataSourceInput,
  DateProps,
} from "@/client/graphql/generated/gql/graphql";
import type { DateDataSourceFormErrors } from "./types";
import { ValidateFieldFn } from "../../types";

/**
 * Validates DateDataSourceInput (OneOf type)
 * Checks each variant and validates the active one
 */
export const validateDateDataSource = (
  dataSource: DateDataSourceInput
): DateDataSourceFormErrors => {
  const errors: DateDataSourceFormErrors = {};

  if (dataSource.static) {
    if (
      !dataSource.static.value ||
      dataSource.static.value.trim().length === 0
    ) {
      errors.static = "Static date value is required";
    }
  } else if (dataSource.studentField) {
    if (!dataSource.studentField.field) {
      errors.studentField = "Student date field is required";
    }
  } else if (dataSource.certificateField) {
    if (!dataSource.certificateField.field) {
      errors.certificateField = "Certificate date field is required";
    }
  } else if (dataSource.templateVariable) {
    if (
      !dataSource.templateVariable.variableId ||
      dataSource.templateVariable.variableId <= 0
    ) {
      errors.templateVariable = "Template date variable is required";
    }
  }

  return errors;
};

/**
 * Field-level validation for date-specific properties
 */
export const validateDatePropsField: ValidateFieldFn<DateProps> = (
  key,
  value
) => {
  switch (key) {
    case "format":
      const formatValue = value as string;
      if (!formatValue || formatValue.trim().length === 0) {
        return "Date format is required";
      }
      return undefined;

    case "calendarType":
      if (!value) {
        return "Calendar type is required";
      }
      return undefined;

    case "offsetDays":
      const offsetValue = value as number;
      if (offsetValue === undefined || offsetValue === null) {
        return "Offset days is required";
      }
      if (!Number.isInteger(offsetValue)) {
        return "Offset days must be an integer";
      }
      return undefined;

    default:
      return undefined;
  }
};
