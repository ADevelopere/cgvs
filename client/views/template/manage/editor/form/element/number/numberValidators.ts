import { NumberDataSourceInput } from "@/client/graphql/generated/gql/graphql";
import {
  DataSourceFormErrors,
  MappingFormErrors,
  NumberElementSpecPropsValidateFn,
} from "./types";

/**
 * Validate NumberDataSourceInput
 * NUMBER elements only have one data source type: TEMPLATE_NUMBER_VARIABLE
 */
export const validateNumberDataSource = (
  dataSource: NumberDataSourceInput
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  if (!dataSource.variableId || dataSource.variableId <= 0) {
    errors.variableId = "Template number variable is required";
  }

  return errors;
};

/**
 * Validate mapping (locale to decimal places)
 * Ensures all values are valid non-negative integers
 */
const validateMapping = (
  mapping: Record<string, string>
): MappingFormErrors => {
  const errors: MappingFormErrors = {};

  Object.entries(mapping).forEach(([locale, value]) => {
    const decimalPlaces = parseInt(value, 10);
    if (isNaN(decimalPlaces) || decimalPlaces < 0) {
      errors[locale] = "Decimal places must be a non-negative number";
    }
  });

  return errors;
};

export const validateNumberElementSpecProps = () => {
  const validate: NumberElementSpecPropsValidateFn = ({ key, value }) => {
    switch (key) {
      case "mapping":
        return JSON.stringify(validateMapping(value));
    }
  };

  return validate;
};
