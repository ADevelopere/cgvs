"use client"

import { useCallback } from "react"
import { useDemoTableContext } from "../DemoTableContext"
import { SIMULATED_NETWORK_DELAY } from "@/constants/tableConstants"
import type { FilterClause } from "@/types/filters"

export function useFilter() {
  const { setIsLoading, setFilters, usePagination, setCurrentPage, sortedAndFilteredDataset, setLoadedRows } =
    useDemoTableContext()

  // Function to handle filtering with the new FilterClause structure
  const handleFilter = useCallback(
    (filterClause: FilterClause<any, any> | null, columnId: string) => {
      setIsLoading(true)

      // Update filters
      setFilters((prev) => {
        if (!filterClause) {
          // Remove filter if null is passed
          const newFilters = { ...prev }
          delete newFilters[columnId]
          return newFilters
        } else {
          // Add or update filter
          return { ...prev, [columnId]: filterClause }
        }
      })

      // Reset to first page when filter changes
      if (usePagination) {
        setCurrentPage(1)
      }

      setTimeout(() => {
        if (!usePagination) {
          setLoadedRows(sortedAndFilteredDataset.slice(0, 50))
        }
        setIsLoading(false)
      }, SIMULATED_NETWORK_DELAY)
    },
    [usePagination, sortedAndFilteredDataset, setIsLoading, setFilters, setCurrentPage, setLoadedRows],
  )

  return { handleFilter }
}
