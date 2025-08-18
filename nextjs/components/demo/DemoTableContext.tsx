"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo, useEffect } from "react"
import type { DemoTableContextType } from "./types"
import { generateDemoData } from "../../utils/demoData"
import { TABLE_COLUMNS, TOTAL_ROWS, PAGE_SIZE, DEFAULT_ROWS_PER_PAGE } from "../../constants/tableConstants"
import { useAppTheme } from "../../hooks/useAppTheme"
import { applyFilters } from "./utils/filterUtils"
import { applySorting } from "./utils/sortUtils"
import { calculatePaginationInfo } from "./utils/paginationUtils"
import type { FilterClause } from "../../types/filters"

// Generate the dataset once
const originalDataset = generateDemoData(TOTAL_ROWS)

const DemoTableContext = createContext<DemoTableContextType | undefined>(undefined)

export const DemoTableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, isRtl } = useAppTheme()

  // Update HTML dir and lang attributes when language changes
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRtl ? "rtl" : "ltr"
  }, [language, isRtl])

  // Sort state
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter state
  const [filters, setFilters] = useState<Record<string, FilterClause<any, any>>>({})

  // Row styling toggle
  const [useCustomRowStyle, setUseCustomRowStyle] = useState(true)

  // Pagination state
  const [usePagination, setUsePagination] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  // Server operation mode state
  const [serverOperationMode, setServerOperationMode] = useState(false)
  const [serverSortedData, setServerSortedData] = useState<any[]>([])
  const [serverFilters, setServerFilters] = useState<FilterClause<any, any>[]>([])
  const [serverFilteredData, setServerFilteredData] = useState<any[]>([])

  // State to track loaded rows for infinite scroll mode
  const [loadedRows, setLoadedRows] = useState<any[]>(originalDataset.slice(0, PAGE_SIZE))

  // Add state for server filter UI mode - Make sure it's initialized to "popover"
  const [serverFilterUi, setServerFilterUi] = useState<"popover" | "inlineHeaderRow">("popover")

  // Apply filters to the dataset
  const filteredDataset = useMemo(() => {
    // If we're in server mode and have server-filtered data, use that
    if (serverOperationMode && serverFilteredData.length > 0) {
      return serverFilteredData
    }

    // If we're in server mode and have server-sorted data but no filters, use the sorted data
    if (serverOperationMode && serverSortedData.length > 0 && serverFilters.length === 0) {
      return serverSortedData
    }

    return applyFilters(originalDataset, filters, TABLE_COLUMNS)
  }, [filters, serverOperationMode, serverSortedData, serverFilteredData, serverFilters])

  // Sort the filtered dataset based on current sort state
  const sortedAndFilteredDataset = useMemo(() => {
    // If we're in server mode, the data is already sorted by the server
    if (serverOperationMode) {
      return filteredDataset
    }

    return applySorting(filteredDataset, sortBy, sortDirection, TABLE_COLUMNS)
  }, [sortBy, sortDirection, filteredDataset, serverOperationMode])

  // Get the total number of rows after filtering
  const filteredTotalRows = sortedAndFilteredDataset.length

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    if (!usePagination) return null

    return calculatePaginationInfo(filteredTotalRows, currentPage, rowsPerPage)
  }, [usePagination, currentPage, rowsPerPage, filteredTotalRows])

  // Get the data for the current page or for infinite scroll
  const displayData = useMemo(() => {
    if (usePagination && paginationInfo) {
      // For pagination: get just the current page of data
      const startIndex = (paginationInfo.currentPage - 1) * paginationInfo.perPage
      const endIndex = Math.min(startIndex + paginationInfo.perPage, filteredTotalRows)
      return sortedAndFilteredDataset.slice(startIndex, endIndex)
    } else {
      // For infinite scroll: get the loaded rows (or initial set)
      return loadedRows.length > 0 ? loadedRows : sortedAndFilteredDataset.slice(0, PAGE_SIZE)
    }
  }, [usePagination, paginationInfo, sortedAndFilteredDataset, filteredTotalRows, loadedRows])

  // Update loaded rows when sort or filters change (for infinite scroll mode)
  useEffect(() => {
    if (!usePagination) {
      setLoadedRows(sortedAndFilteredDataset.slice(0, PAGE_SIZE))
    }
  }, [sortedAndFilteredDataset, usePagination])

  const contextValue: DemoTableContextType = useMemo(
    () => ({
      // State
      sortBy,
      sortDirection,
      isLoading,
      filters,
      useCustomRowStyle,
      usePagination,
      currentPage,
      rowsPerPage,
      loadedRows,
      serverOperationMode,
      serverSortedData,
      serverFilters,
      serverFilteredData,
      serverFilterUi,

      // Setters
      setSortBy,
      setSortDirection,
      setIsLoading,
      setFilters,
      setUseCustomRowStyle,
      setUsePagination,
      setCurrentPage,
      setRowsPerPage,
      setLoadedRows,
      setServerOperationMode,
      setServerSortedData,
      setServerFilters,
      setServerFilteredData,
      setServerFilterUi,

      // Computed values
      filteredDataset,
      sortedAndFilteredDataset,
      filteredTotalRows,
      paginationInfo,
      displayData,

      // Original data
      originalDataset,
      columns: TABLE_COLUMNS,
    }),
    [
      sortBy,
      sortDirection,
      isLoading,
      filters,
      useCustomRowStyle,
      usePagination,
      currentPage,
      rowsPerPage,
      loadedRows,
      serverOperationMode,
      serverSortedData,
      serverFilters,
      serverFilteredData,
      serverFilterUi,
      filteredDataset,
      sortedAndFilteredDataset,
      filteredTotalRows,
      paginationInfo,
      displayData,
    ],
  )

  return <DemoTableContext.Provider value={contextValue}>{children}</DemoTableContext.Provider>
}

export const useDemoTableContext = () => {
  const context = useContext(DemoTableContext)
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider")
  }
  return context
}
