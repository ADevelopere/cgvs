import {
  TextFilterOperation,
  NumberFilterOperation,
  DateFilterOperation,
  operationRequiresValue,
} from "@/client/types/filters";

// Labels for text filter operations
export const textFilterOperationLabels: Record<TextFilterOperation, string> = {
  [TextFilterOperation.contains]: "Contains",
  [TextFilterOperation.notContains]: "Does not contain",
  [TextFilterOperation.equals]: "Equals",
  [TextFilterOperation.notEquals]: "Does not equal",
  [TextFilterOperation.startsWith]: "Starts with",
  [TextFilterOperation.endsWith]: "Ends with",
  [TextFilterOperation.isEmpty]: "Is empty",
  [TextFilterOperation.isNotEmpty]: "Is not empty",
};

// Labels for number filter operations
export const numberFilterOperationLabels: Record<NumberFilterOperation, string> = {
  [NumberFilterOperation.equals]: "Equals",
  [NumberFilterOperation.notEquals]: "Does not equal",
  [NumberFilterOperation.greaterThan]: "Greater than",
  [NumberFilterOperation.greaterThanOrEqual]: "Greater than or equal to",
  [NumberFilterOperation.lessThan]: "Less than",
  [NumberFilterOperation.lessThanOrEqual]: "Less than or equal to",
  [NumberFilterOperation.isNull]: "Is empty",
  [NumberFilterOperation.isNotNull]: "Is not empty",
};

// Labels for date filter operations
export const dateFilterOperationLabels: Record<DateFilterOperation, string> = {
  [DateFilterOperation.between]: "Between",
  [DateFilterOperation.is]: "Is",
  [DateFilterOperation.isNot]: "Is not",
  [DateFilterOperation.isAfter]: "Is after",
  [DateFilterOperation.isBefore]: "Is before",
  [DateFilterOperation.isOnOrAfter]: "Is on or after",
  [DateFilterOperation.isOnOrBefore]: "Is on or before",
  [DateFilterOperation.isEmpty]: "Is empty",
  [DateFilterOperation.isNotEmpty]: "Is not empty",
};

// Re-export operationRequiresValue for convenience
export { operationRequiresValue };
