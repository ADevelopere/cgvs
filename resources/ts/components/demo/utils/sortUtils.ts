import { Column } from "@/types/table.type"

export function applySorting(
  dataset: any[],
  sortBy: string | null,
  sortDirection: "asc" | "desc" | null,
  columns: Column[],
): any[] {
  if (!sortBy || !sortDirection) {
    return dataset
  }

  return [...dataset].sort((a, b) => {
    const column = columns.find((col) => col.id === sortBy)
    if (!column) return 0

    let valueA, valueB

    if (typeof column.accessor === "function") {
      valueA = column.accessor(a)
      valueB = column.accessor(b)
    } else {
      valueA = a[column.accessor]
      valueB = b[column.accessor]
    }

    // Handle different data types
    if (column.type === "date") {
      valueA = new Date(valueA).getTime()
      valueB = new Date(valueB).getTime()
    } else if (column.type === "number") {
      valueA = Number(valueA)
      valueB = Number(valueB)
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Default numeric comparison
    return sortDirection === "asc" ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1
  })
}
