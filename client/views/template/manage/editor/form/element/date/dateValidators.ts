import type {
  DatePropsFormErrors,
  ValidateDateDataSourceFn,
  ValidateDatePropsFn,
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
export const validateDateProps = (): ValidateDatePropsFn => {
  const validate: ValidateDatePropsFn = ({ value: dateProps}) => {
    const errors: DatePropsFormErrors = { dateProps: {} };

    if (!dateProps.format?.trim()) {
      if (errors.dateProps)
        errors.dateProps.format = "Date format is required";
    }

    if (!dateProps.calendarType) {
      if (errors.dateProps)
        errors.dateProps.calendarType = "Calendar type is required";
    }

    if (
      dateProps.offsetDays === undefined ||
      dateProps.offsetDays === null ||
      !Number.isInteger(dateProps.offsetDays)
    ) {
      if (errors.dateProps)
        errors.dateProps.offsetDays = "Offset days must be an integer";
    }

    if (Object.keys(errors.dateProps ?? {}).length === 0) {
      return undefined;
    }

    return errors;
  };
  return validate;
};
