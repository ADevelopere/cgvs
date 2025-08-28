/* eslint-disable @typescript-eslint/no-explicit-any */
// Filter operation types for different column types

export enum TextFilterOperation {
  contains = "contains",
  notContains = "notContains",
  equals = "equals",
  notEquals = "notEquals",
  startsWith = "startsWith",
  endsWith = "endsWith",
  isEmpty = "isEmpty", // No value needed
  isNotEmpty = "isNotEmpty", // No value needed
}

export enum NumberFilterOperation {
  equals = "equals",
  notEquals = "notEquals",
  greaterThan = "gt",
  greaterThanOrEqual = "gte",
  lessThan = "lt",
  lessThanOrEqual = "lte",
  isNull = "isNull", // No value needed
  isNotNull = "isNotNull", // No value needed
}

export type DateFilterValue = {
  from?: string | Date | null
  to?: string | Date | null
}

export enum DateFilterOperation {
  between = "between", // Uses 'from' and 'to' from DateFilterValue
  is = "is", // Uses 'from' as the single date
  isNot = "isNot", // Uses 'from' as the single date
  isAfter = "isAfter", // Uses 'from'
  isBefore = "isBefore", // Uses 'from'
  isOnOrAfter = "isOnOrAfter", // Uses 'from'
  isOnOrBefore = "isOnOrBefore", // Uses 'from'
  isEmpty = "isEmpty", // No value needed
  isNotEmpty = "isNotEmpty", // No value needed
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