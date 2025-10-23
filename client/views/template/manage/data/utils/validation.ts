import * as Graphql from "@/client/graphql/generated/gql/graphql";

/**
 * Validation utilities for template variable values
 */

/**
 * Validate text variable value
 */
export const validateTextVariable = (
  value: string | null | undefined,
  variable: Graphql.TemplateTextVariable
): string | null => {
  // Handle null/undefined/empty values
  if (!value || value.trim() === "") {
    return variable.required ? "requiredField" : null;
  }

  const trimmedValue = value.trim();

  // Check minimum length
  if (variable.minLength && trimmedValue.length < variable.minLength) {
    return `textTooShort:${variable.minLength}`;
  }

  // Check maximum length
  if (variable.maxLength && trimmedValue.length > variable.maxLength) {
    return `textTooLong:${variable.maxLength}`;
  }

  // Check pattern if provided
  if (variable.pattern) {
    const regex = new RegExp(variable.pattern);
    if (!regex.test(trimmedValue)) {
      return "patternMismatch";
    }
  }

  return null;
};

/**
 * Validate number variable value
 */
export const validateNumberVariable = (
  value: number | string | null | undefined,
  variable: Graphql.TemplateNumberVariable
): string | null => {
  // Handle null/undefined/empty values
  if (value === null || value === undefined || value === "") {
    return variable.required ? "requiredField" : null;
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return "invalidNumber";
  }

  // Check minimum value
  if (
    variable.minValue !== null &&
    variable.minValue !== undefined &&
    numValue < variable.minValue
  ) {
    return `numberTooLow:${variable.minValue}`;
  }

  // Check maximum value
  if (
    variable.maxValue !== null &&
    variable.maxValue !== undefined &&
    numValue > variable.maxValue
  ) {
    return `numberTooHigh:${variable.maxValue}`;
  }

  // Check decimal places
  if (variable.decimalPlaces !== null && variable.decimalPlaces !== undefined) {
    const decimalPlaces = (numValue.toString().split(".")[1] || "").length;
    if (decimalPlaces > variable.decimalPlaces) {
      return `tooManyDecimalPlaces:${variable.decimalPlaces}`;
    }
  }

  return null;
};

/**
 * Validate date variable value
 */
export const validateDateVariable = (
  value: string | Date | null | undefined,
  variable: Graphql.TemplateDateVariable
): string | null => {
  // Handle null/undefined/empty values
  if (!value) {
    return variable.required ? "requiredField" : null;
  }

  const dateValue = value instanceof Date ? value : new Date(value);

  // Check if it's a valid date
  if (isNaN(dateValue.getTime())) {
    return "invalidDate";
  }

  // Check minimum date
  if (variable.minDate) {
    const minDate = new Date(variable.minDate);
    if (dateValue < minDate) {
      return `dateTooEarly:${minDate.toLocaleDateString()}`;
    }
  }

  // Check maximum date
  if (variable.maxDate) {
    const maxDate = new Date(variable.maxDate);
    if (dateValue > maxDate) {
      return `dateTooLate:${maxDate.toLocaleDateString()}`;
    }
  }

  return null;
};

/**
 * Validate select variable value
 */
export const validateSelectVariable = (
  value: string | string[] | null | undefined,
  variable: Graphql.TemplateSelectVariable
): string | null => {
  // Handle null/undefined/empty values
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return variable.required ? "requiredField" : null;
  }

  const values = Array.isArray(value) ? value : [value];
  const options = variable.options || [];

  // Check if all selected values are valid options
  for (const selectedValue of values) {
    if (!options.includes(selectedValue)) {
      return "invalidSelection";
    }
  }

  // Check if multiple selection is allowed
  if (!variable.multiple && values.length > 1) {
    return "multipleSelectionNotAllowed";
  }

  return null;
};

/**
 * Check if a recipient is ready (all required variables have valid values)
 */
export const isRecipientReady = (
  variableValues: Record<string, unknown>,
  variables: Graphql.TemplateVariable[]
): boolean => {
  // Get all required variables
  const requiredVariables = variables.filter(variable => variable.required);

  // Check if all required variables have valid values
  for (const variable of requiredVariables) {
    const value = variableValues[variable.id?.toString() || ""];

    // Check if value exists and is not empty
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return false;
    }

    // Check if value passes validation
    let validationError: string | null = null;

    switch (variable.type) {
      case "TEXT":
        validationError = validateTextVariable(
          value as string,
          variable as Graphql.TemplateTextVariable
        );
        break;
      case "NUMBER":
        validationError = validateNumberVariable(
          value as number | string,
          variable as Graphql.TemplateNumberVariable
        );
        break;
      case "DATE":
        validationError = validateDateVariable(
          value as string | Date,
          variable as Graphql.TemplateDateVariable
        );
        break;
      case "SELECT":
        validationError = validateSelectVariable(
          value as string | string[],
          variable as Graphql.TemplateSelectVariable
        );
        break;
    }

    if (validationError) {
      return false;
    }
  }

  return true;
};

/**
 * Get validation error for a specific variable value
 */
export const getValidationError = (
  value: unknown,
  variable: Graphql.TemplateVariable
): string | null => {
  switch (variable.type) {
    case "TEXT":
      return validateTextVariable(
        value as string,
        variable as Graphql.TemplateTextVariable
      );
    case "NUMBER":
      return validateNumberVariable(
        value as number | string,
        variable as Graphql.TemplateNumberVariable
      );
    case "DATE":
      return validateDateVariable(
        value as string | Date,
        variable as Graphql.TemplateDateVariable
      );
    case "SELECT":
      return validateSelectVariable(
        value as string | string[],
        variable as Graphql.TemplateSelectVariable
      );
    default:
      return null;
  }
};
