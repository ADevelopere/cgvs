import {
  TextFilterOperation,
  NumberFilterOperation,
  DateFilterOperation,
  operationRequiresValue,
} from "@/types/filters"

// Labels for text filter operations
export const textFilterOperationLabels: Record<TextFilterOperation, string> = {
  [TextFilterOperation.CONTAINS]: "Contains",
  [TextFilterOperation.NOT_CONTAINS]: "Does not contain",
  [TextFilterOperation.EQUALS]: "Equals",
  [TextFilterOperation.NOT_EQUALS]: "Does not equal",
  [TextFilterOperation.STARTS_WITH]: "Starts with",
  [TextFilterOperation.ENDS_WITH]: "Ends with",
  [TextFilterOperation.IS_EMPTY]: "Is empty",
  [TextFilterOperation.IS_NOT_EMPTY]: "Is not empty",
}

// Labels for number filter operations
export const numberFilterOperationLabels: Record<NumberFilterOperation, string> = {
  [NumberFilterOperation.EQUALS]: "Equals",
  [NumberFilterOperation.NOT_EQUALS]: "Does not equal",
  [NumberFilterOperation.GREATER_THAN]: "Greater than",
  [NumberFilterOperation.GREATER_THAN_OR_EQUAL]: "Greater than or equal to",
  [NumberFilterOperation.LESS_THAN]: "Less than",
  [NumberFilterOperation.LESS_THAN_OR_EQUAL]: "Less than or equal to",
  [NumberFilterOperation.IS_NULL]: "Is empty",
  [NumberFilterOperation.IS_NOT_NULL]: "Is not empty",
}

// Labels for date filter operations
export const dateFilterOperationLabels: Record<DateFilterOperation, string> = {
  [DateFilterOperation.BETWEEN]: "Between",
  [DateFilterOperation.IS]: "Is",
  [DateFilterOperation.IS_NOT]: "Is not",
  [DateFilterOperation.IS_AFTER]: "Is after",
  [DateFilterOperation.IS_BEFORE]: "Is before",
  [DateFilterOperation.IS_ON_OR_AFTER]: "Is on or after",
  [DateFilterOperation.IS_ON_OR_BEFORE]: "Is on or before",
  [DateFilterOperation.IS_EMPTY]: "Is empty",
  [DateFilterOperation.IS_NOT_EMPTY]: "Is not empty",
}

// Re-export operationRequiresValue for convenience
export { operationRequiresValue }
