import { TemplateVariable } from "@/client/graphql/generated/gql/graphql";

export const validateVariableValue = (
  variable: TemplateVariable,
  value: unknown,
  existingValues?: Set<string>
): { isValid: boolean; error?: string } => {
  // Handle empty values

  const isKey = false;

  if (!value || (typeof value === "string" && value.trim() === "")) {
    if (isKey || variable.required) {
      return {
        isValid: false,
        error: isKey
          ? `${variable.name} is required as it's a key identifier`
          : `${variable.name} is required`,
      };
    }
    return { isValid: true }; // Empty is ok for non-required fields
  }

  // Key uniqueness check
  if (isKey && existingValues) {
    let uniqueKey: string;
    if (typeof value === "object" && value !== null) {
      try {
        uniqueKey = JSON.stringify(value);
      } catch {
        uniqueKey = "[Unserializable Object]";
      }
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint" ||
      typeof value === "symbol" ||
      typeof value === "undefined"
    ) {
      uniqueKey = String(value);
    } else {
      uniqueKey = "[Unknown Type]";
    }
    if (existingValues.has(uniqueKey)) {
      // Use the same stringification for the error message
      let displayValue: string;
      if (typeof value === "object" && value !== null) {
        try {
          displayValue = JSON.stringify(value);
        } catch {
          displayValue = "[Unserializable Object]";
        }
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        typeof value === "bigint" ||
        typeof value === "symbol" ||
        typeof value === "undefined"
      ) {
        displayValue = String(value);
      } else {
        displayValue = "[Unknown Type]";
      }
      return {
        isValid: false,
        error: `${variable.name} must be unique. "${displayValue}" is already used`,
      };
    }
  }

  // Type validation
  switch (variable.type) {
    case "NUMBER":
      if (isNaN(Number(value))) {
        return {
          isValid: false,
          error: `${variable.name} must be a number`,
        };
      }
      break;
    case "DATE":
      if (typeof value !== "string" || isNaN(Date.parse(value))) {
        return {
          isValid: false,
          error: `${variable.name} must be a valid date`,
        };
      }
      break;
  }

  return { isValid: true };
};
