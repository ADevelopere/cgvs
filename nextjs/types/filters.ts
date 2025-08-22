/* eslint-disable @typescript-eslint/no-explicit-any */
// Filter operation types for different column types

export enum TextFilterOperation {
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  IS_EMPTY = "is_empty", // No value needed
  IS_NOT_EMPTY = "is_not_empty", // No value needed
}

export enum NumberFilterOperation {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "gt",
  GREATER_THAN_OR_EQUAL = "gte",
  LESS_THAN = "lt",
  LESS_THAN_OR_EQUAL = "lte",
  IS_NULL = "is_null", // No value needed
  IS_NOT_NULL = "is_not_null", // No value needed
}

export type DateFilterValue = {
  from?: string | Date | null
  to?: string | Date | null
}

export enum DateFilterOperation {
  BETWEEN = "between", // Uses 'from' and 'to' from DateFilterValue
  IS = "is", // Uses 'from' as the single date
  IS_NOT = "is_not", // Uses 'from' as the single date
  IS_AFTER = "is_after", // Uses 'from'
  IS_BEFORE = "is_before", // Uses 'from'
  IS_ON_OR_AFTER = "is_on_or_after", // Uses 'from'
  IS_ON_OR_BEFORE = "is_on_or_before", // Uses 'from'
  IS_EMPTY = "is_empty", // No value needed
  IS_NOT_EMPTY = "is_not_empty", // No value needed
}

// General FilterClause Structure
export type FilterClause<TValue = any, TOperation = any> = {
  columnId: string
  operation: TOperation
  value?: TValue // Optional for operations like IS_EMPTY
}

// Type guard functions to check filter operation types
export function isTextFilterOperation(operation: any): operation is TextFilterOperation {
  return Object.values(TextFilterOperation).includes(operation)
}

export function isNumberFilterOperation(operation: any): operation is NumberFilterOperation {
  return Object.values(NumberFilterOperation).includes(operation)
}

export function isDateFilterOperation(operation: any): operation is DateFilterOperation {
  return Object.values(DateFilterOperation).includes(operation)
}

// Helper to check if an operation requires a value
export function operationRequiresValue(
  operation: TextFilterOperation | NumberFilterOperation | DateFilterOperation,
): boolean {
  return ![
    TextFilterOperation.IS_EMPTY,
    TextFilterOperation.IS_NOT_EMPTY,
    NumberFilterOperation.IS_NULL,
    NumberFilterOperation.IS_NOT_NULL,
    DateFilterOperation.IS_EMPTY,
    DateFilterOperation.IS_NOT_EMPTY,
  ].includes(operation as any)
}

// Helper to get human-readable operation labels
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
