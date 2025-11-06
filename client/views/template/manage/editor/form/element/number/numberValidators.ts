import { NumberMappingFormErrors, ValidateNumberDataSourceFn, ValidateNumberPropsFn } from "./types";

/**
 * Validate NumberDataSourceInput
 * NUMBER elements only have one data source type: TEMPLATE_NUMBER_VARIABLE
 */
export const validateNumberDataSource = (): ValidateNumberDataSourceFn => {
  const validate: ValidateNumberDataSourceFn = ({ value: source }) => {
    if (!source.variableId || source.variableId <= 0) {
      return {
        dataSource: { variableId: "Template number variable is required" },
      };
    }
    return { dataSource: {} };
  };
  return validate;
};

/**
 * Validate mapping (locale to decimal places)
 * Ensures all values are valid non-negative integers
 */
const validateMapping = (mapping: Record<string, string>): NumberMappingFormErrors => {
  const errors: NumberMappingFormErrors = {};

  for (const [locale, value] of Object.entries(mapping)) {
    const decimalPlaces = Number.parseInt(value, 10);
    if (Number.isNaN(decimalPlaces) || decimalPlaces < 0) {
      errors[locale] = "Decimal places must be a non-negative number";
    }
  }

  return errors;
};

export const validateNumberProps = (): ValidateNumberPropsFn => {
  const validate: ValidateNumberPropsFn = ({ key, value }) => {
    if (key === "mapping") {
      return validateMapping(value);
    }
    return undefined;
  };

  return validate;
};
