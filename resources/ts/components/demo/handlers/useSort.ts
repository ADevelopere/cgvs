"use client"

import { useCallback } from "react"
import { useDemoTableContext } from "../DemoTableContext"
import { SIMULATED_NETWORK_DELAY } from "@/constants/tableConstants"

export function useSort() {
  const {
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    setIsLoading,
    usePagination,
    setCurrentPage,
    sortedAndFilteredDataset,
    setLoadedRows,
  } = useDemoTableContext()

  // Function to handle sorting
  const handleSort = useCallback(
    (columnId: string) => {
      if (sortBy === columnId) {
        // Toggle sort direction
        if (sortDirection === "asc") {
          setSortDirection("desc")
        } else if (sortDirection === "desc") {
          setSortBy(null)
          setSortDirection(null)
        } else {
          setSortDirection("asc")
        }
      } else {
        // Set new sort column
        setSortBy(columnId)
        setSortDirection("asc")
      }

      // Reset to first page when sort changes
      setIsLoading(true)

      if (usePagination) {
        setCurrentPage(1)
      } else {
        setTimeout(() => {
          setLoadedRows(sortedAndFilteredDataset.slice(0, 50))
          setIsLoading(false)
        }, SIMULATED_NETWORK_DELAY)
      }

      setTimeout(() => {
        setIsLoading(false)
      }, SIMULATED_NETWORK_DELAY)
    },
    [
      sortBy,
      sortDirection,
      usePagination,
      sortedAndFilteredDataset,
      setSortBy,
      setSortDirection,
      setIsLoading,
      setCurrentPage,
      setLoadedRows,
    ],
  )

  return { handleSort }
}
