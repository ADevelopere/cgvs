import { Column } from "@/types/table.type"
import type { FilterClause } from "@/types/filters"
import {
  TextFilterOperation,
  DateFilterOperation,
  NumberFilterOperation,
  isTextFilterOperation,
  isNumberFilterOperation,
  isDateFilterOperation,
} from "@/types/filters"

export function applyFilters(
  dataset: any[],
  filters: Record<string, FilterClause<any, any>>,
  columns: Column[],
): any[] {
  if (Object.keys(filters).length === 0) {
    return dataset
  }

  return dataset.filter((row) => {
    // Check if row matches all active filters
    return Object.entries(filters).every(([columnId, filterClause]) => {
      // Handle legacy string filters
      if (typeof filterClause === "string") {
        const column = columns.find((col) => col.id === columnId)
        if (!column) return true

        let cellValue
        if (typeof column.accessor === "function") {
          cellValue = column.accessor(row)
        } else {
          cellValue = row[column.accessor]
        }

        if (cellValue === null || cellValue === undefined) return false
        return String(cellValue).toLowerCase().includes(filterClause.toLowerCase())
      }

      // Handle new filter clause structure
      const column = columns.find((col) => col.id === columnId)
      if (!column) return true

      let cellValue
      if (typeof column.accessor === "function") {
        cellValue = column.accessor(row)
      } else {
        cellValue = row[column.accessor]
      }

      // Handle null/undefined values for all filter types
      if (cellValue === null || cellValue === undefined) {
        // Handle IS_NULL, IS_EMPTY operations
        if (
          (isNumberFilterOperation(filterClause.operation) &&
            filterClause.operation === NumberFilterOperation.IS_NULL) ||
          (isTextFilterOperation(filterClause.operation) && filterClause.operation === TextFilterOperation.IS_EMPTY) ||
          (isDateFilterOperation(filterClause.operation) && filterClause.operation === DateFilterOperation.IS_EMPTY)
        ) {
          return true
        }
        // Handle IS_NOT_NULL, IS_NOT_EMPTY operations
        if (
          (isNumberFilterOperation(filterClause.operation) &&
            filterClause.operation === NumberFilterOperation.IS_NOT_NULL) ||
          (isTextFilterOperation(filterClause.operation) &&
            filterClause.operation === TextFilterOperation.IS_NOT_EMPTY) ||
          (isDateFilterOperation(filterClause.operation) && filterClause.operation === DateFilterOperation.IS_NOT_EMPTY)
        ) {
          return false
        }
        return false
      } else {
        // Handle IS_NULL, IS_EMPTY operations
        if (
          (isNumberFilterOperation(filterClause.operation) &&
            filterClause.operation === NumberFilterOperation.IS_NULL) ||
          (isTextFilterOperation(filterClause.operation) && filterClause.operation === TextFilterOperation.IS_EMPTY) ||
          (isDateFilterOperation(filterClause.operation) && filterClause.operation === DateFilterOperation.IS_EMPTY)
        ) {
          return false
        }
        // Handle IS_NOT_NULL, IS_NOT_EMPTY operations
        if (
          (isNumberFilterOperation(filterClause.operation) &&
            filterClause.operation === NumberFilterOperation.IS_NOT_NULL) ||
          (isTextFilterOperation(filterClause.operation) &&
            filterClause.operation === TextFilterOperation.IS_NOT_EMPTY) ||
          (isDateFilterOperation(filterClause.operation) && filterClause.operation === DateFilterOperation.IS_NOT_EMPTY)
        ) {
          return true
        }
      }

      // Handle different operations based on column type
      if (column.type === "text" && isTextFilterOperation(filterClause.operation)) {
        const stringValue = String(cellValue).toLowerCase()
        const filterValue = String(filterClause.value || "").toLowerCase()

        switch (filterClause.operation) {
          case TextFilterOperation.CONTAINS:
            return stringValue.includes(filterValue)
          case TextFilterOperation.NOT_CONTAINS:
            return !stringValue.includes(filterValue)
          case TextFilterOperation.EQUALS:
            return stringValue === filterValue
          case TextFilterOperation.NOT_EQUALS:
            return stringValue !== filterValue
          case TextFilterOperation.STARTS_WITH:
            return stringValue.startsWith(filterValue)
          case TextFilterOperation.ENDS_WITH:
            return stringValue.endsWith(filterValue)
          default:
            return true
        }
      } else if (column.type === "number" && isNumberFilterOperation(filterClause.operation)) {
        const numValue = Number(cellValue)
        const filterValue = Number(filterClause.value)

        if (isNaN(numValue)) return false

        switch (filterClause.operation) {
          case NumberFilterOperation.EQUALS:
            return numValue === filterValue
          case NumberFilterOperation.NOT_EQUALS:
            return numValue !== filterValue
          case NumberFilterOperation.GREATER_THAN:
            return numValue > filterValue
          case NumberFilterOperation.GREATER_THAN_OR_EQUAL:
            return numValue >= filterValue
          case NumberFilterOperation.LESS_THAN:
            return numValue < filterValue
          case NumberFilterOperation.LESS_THAN_OR_EQUAL:
            return numValue <= filterValue
          default:
            return true
        }
      } else if (column.type === "date" && isDateFilterOperation(filterClause.operation)) {
        // Parse the cell value to a Date object
        const dateValue = new Date(cellValue)
        if (isNaN(dateValue.getTime())) return false

        // Get filter values
        const filterValue = filterClause.value as any

        // Parse from/to dates if they exist
        const fromDate = filterValue?.from ? new Date(filterValue.from) : null
        const toDate = filterValue?.to ? new Date(filterValue.to) : null

        switch (filterClause.operation) {
          case DateFilterOperation.IS:
            return fromDate && dateValue.toDateString() === fromDate.toDateString()
          case DateFilterOperation.IS_NOT:
            return fromDate && dateValue.toDateString() !== fromDate.toDateString()
          case DateFilterOperation.IS_AFTER:
            return fromDate && dateValue > fromDate
          case DateFilterOperation.IS_BEFORE:
            return fromDate && dateValue < fromDate
          case DateFilterOperation.IS_ON_OR_AFTER:
            return fromDate && dateValue >= fromDate
          case DateFilterOperation.IS_ON_OR_BEFORE:
            return fromDate && dateValue <= fromDate
          case DateFilterOperation.BETWEEN:
            if (fromDate && toDate) {
              return dateValue >= fromDate && dateValue <= toDate
            } else if (fromDate) {
              return dateValue >= fromDate
            } else if (toDate) {
              return dateValue <= toDate
            }
            return true
          default:
            return true
        }
      } else {
        // Default to simple contains for other types or unrecognized operations
        if (filterClause.value) {
          return String(cellValue).toLowerCase().includes(String(filterClause.value).toLowerCase())
        }
        return true
      }
    })
  })
}
