"use client";

import { useCallback } from "react";
import { useDemoTableContext } from "../DemoTableContext";
import {
  SIMULATED_NETWORK_DELAY,
  SIMULATED_LOAD_MORE_DELAY,
} from "@/constants/tableConstants";
import { LoadMoreParams } from "@/types/table.type";

export function usePaginationHandlers() {
  const {
    setIsLoading,
    setCurrentPage,
    setRowsPerPage,
    usePagination,
    isLoading,
    loadedRows,
    sortedAndFilteredDataset,
    setLoadedRows,
  } = useDemoTableContext();

  // Function to handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      setIsLoading(true);
      setCurrentPage(newPage);

      setTimeout(() => {
        setIsLoading(false);
      }, SIMULATED_NETWORK_DELAY);
    },
    [setIsLoading, setCurrentPage]
  );

  // Function to handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setIsLoading(true);
      setRowsPerPage(newRowsPerPage);
      setCurrentPage(1); // Reset to first page

      setTimeout(() => {
        setIsLoading(false);
      }, SIMULATED_NETWORK_DELAY);
    },
    [setIsLoading, setRowsPerPage, setCurrentPage]
  );

  // Simulate loading more rows with a delay (for infinite scroll mode)
  const loadMoreRows = useCallback(
    async ({ visibleStartIndex, visibleStopIndex }: LoadMoreParams) => {
      console.log("usePaginationHandlers loadMoreRows", {
        visibleStartIndex,
        visibleStopIndex,
        sortedAndFilteredDataset,
        loadedRows,
        usePagination,
        isLoading,
      });
      if (
        usePagination ||
        isLoading ||
        visibleStartIndex >= sortedAndFilteredDataset.length
      )
        return;

      setIsLoading(true);

      // Simulate network delay
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const newRows = sortedAndFilteredDataset
            .slice(visibleStartIndex, visibleStopIndex + 1)
            .filter((row) => {
              // Check if this row is already loaded
              return !loadedRows.some((r) => r.id === row.id);
            });

          setLoadedRows((prevRows) => [...prevRows, ...newRows]);
          setIsLoading(false);
          resolve();
        }, SIMULATED_LOAD_MORE_DELAY);
      });
    },
    [
      isLoading,
      loadedRows,
      sortedAndFilteredDataset,
      usePagination,
      setIsLoading,
      setLoadedRows,
    ]
  );

  return { handlePageChange, handleRowsPerPageChange, loadMoreRows };
}
