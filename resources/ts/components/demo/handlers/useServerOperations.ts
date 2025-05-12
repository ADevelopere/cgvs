"use client"

import type React from "react"

import { useCallback } from "react"
import { useDemoTableContext } from "../DemoTableContext"
import type { FilterClause } from "@/types/filters"
import { applyFilters } from "../utils/filterUtils"
import { applySorting } from "../utils/sortUtils"

export function useServerOperations() {
  const {
    setIsLoading,
    setSortBy,
    setSortDirection,
    setServerSortedData,
    setServerFilters,
    setServerFilteredData,
    serverFilters,
    serverFilteredData,
    originalDataset,
    usePagination,
    setCurrentPage,
    columns,
    setServerFilterUi,
  } = useDemoTableContext()

  // Handle server-side sorting
  const handleServerSortChange = useCallback(
    (sort: { columnId: string; direction: "asc" | "desc" } | undefined) => {
      console.log("Server sort changed:", sort)
      setIsLoading(true)

      // Update the UI sort state to match the server sort
      if (sort) {
        setSortBy(sort.columnId)
        setSortDirection(sort.direction)
      } else {
        setSortBy(null)
        setSortDirection(null)
      }

      // Simulate a server call with setTimeout
      setTimeout(() => {
        const dataToSort = serverFilteredData.length > 0 ? [...serverFilteredData] : [...originalDataset]

        if (sort) {
          // Sort the data based on the column type and sort direction
          const sortedData = applySorting(dataToSort, sort.columnId, sort.direction, columns)
          setServerSortedData(sortedData)

          // If we have active filters, update the filtered data too
          if (serverFilters.length > 0) {
            setServerFilteredData(sortedData)
          }
        } else {
          // Reset to original dataset order if no sort
          setServerSortedData([])

          // If we have active filters, reapply them without sorting
          if (serverFilters.length > 0) {
            handleServerFiltersChange(serverFilters)
          }
        }

        // Reset to first page when sort changes
        if (usePagination) {
          setCurrentPage(1)
        }

        setIsLoading(false)
      }, 600) // Simulate server delay
    },
    [
      usePagination,
      serverFilters,
      serverFilteredData,
      originalDataset,
      columns,
      setIsLoading,
      setSortBy,
      setSortDirection,
      setServerSortedData,
      setServerFilteredData,
      setCurrentPage,
    ],
  )

  // Handle server-side filtering
  const handleServerFiltersChange = useCallback(
    (filters: FilterClause<any, any>[]) => {
      console.log("Server filters changed:", filters)
      setIsLoading(true)
      setServerFilters(filters)

      // Simulate a server call
      setTimeout(() => {
        if (filters.length === 0) {
          // If no filters, use the server-sorted data if available, otherwise use original dataset
          setServerFilteredData([])
          setIsLoading(false)
          return
        }

        // Convert filters array to record format for applyFilters
        const filtersRecord: Record<string, FilterClause<any, any>> = {}
        filters.forEach((filter) => {
          filtersRecord[filter.columnId] = filter
        })

        // Apply all filters
        const filteredData = applyFilters(originalDataset, filtersRecord, columns)
        setServerFilteredData(filteredData)

        // Reset to first page when filters change
        if (usePagination) {
          setCurrentPage(1)
        }

        setIsLoading(false)
      }, 600)
    },
    [originalDataset, usePagination, columns, setIsLoading, setServerFilters, setServerFilteredData, setCurrentPage],
  )

  // Toggle server operation mode
  const handleToggleServerMode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMode = e.target.checked
      setIsLoading(true)

      setTimeout(() => {
        // Reset sort and filter state when toggling modes
        if (!newMode) {
          setServerSortedData([])
          setServerFilteredData([])
          setServerFilters([])
        }
        setIsLoading(false)
      }, 300)
    },
    [setIsLoading, setServerSortedData, setServerFilteredData, setServerFilters],
  )

  // Handle server filter UI mode change
  const handleServerFilterUiChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newMode = event.target.value as "popover" | "inlineHeaderRow"
      console.log("Server filter UI mode changed to:", newMode)
      setIsLoading(true)

      // Update the server filter UI mode
      setServerFilterUi(newMode)

      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    },
    [setIsLoading, setServerFilterUi],
  )

  return {
    handleServerSortChange,
    handleServerFiltersChange,
    handleToggleServerMode,
    handleServerFilterUiChange,
  }
}
