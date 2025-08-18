import { PaginationInfo } from "@/graphql/generated/types"

export function calculatePaginationInfo(totalRows: number, currentPage: number, rowsPerPage: number): PaginationInfo {
  const total = totalRows
  const lastPage = Math.ceil(total / rowsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, lastPage))

  const startIndex = (validCurrentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, total)

  return {
    count: endIndex - startIndex, // Number of items in the current page
    currentPage: validCurrentPage,
    firstItem: startIndex + 1,
    hasMorePages: validCurrentPage < lastPage,
    lastItem: endIndex,
    lastPage,
    perPage: rowsPerPage,
    total,
  }
}
