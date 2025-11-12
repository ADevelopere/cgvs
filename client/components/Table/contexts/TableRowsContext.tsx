import { createContext, useContext, ReactNode, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LoadMoreParams, PageInfo } from "../types";
import { useTableContext } from "./TableContext";

/**
 * Type definition for the Table Rows Context
 * Manages row selection, heights, and loading functionality
 */
export type TableRowsContextType<TRowData, TRowId extends string | number = string | number> = {
  // Row selection related props
  rowSelectionEnabled: boolean;
  isAllRowsSelected?: boolean;
  selectedRowIds: TRowId[];
  toggleAllRowsSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleRowSelection: (rowId: TRowId) => void;
  clearAllSelections: () => void;

  // Row height and styling
  rowHeights: Record<TRowId, number>;
  resizeRowHeight: (rowId: TRowId, newHeight: number) => void;
  getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;

  // Pagination and loading
  totalRows: number; // Total number of rows in the dataset
  loadMoreRowsIfNeeded: (visibleStartIndex: number, visibleStopIndex: number) => Promise<void>;

  // Configuration
  getRowId: (row: TRowData) => TRowId; // Function to extract row ID
  enableRowResizing: boolean;
};

const TableRowsContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<TableRowsContextType<any, any> | null>(null);

export type TableRowsProviderProps<TRowData, TRowId extends string | number = string | number> = {
  children: ReactNode;

  onLoadMoreRows?: (params: LoadMoreParams) => Promise<void>;
  getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;
  onRowResize?: (rowId: TRowId, newHeight: number) => void;

  getRowId: (row: TRowData) => TRowId;

  pageInfo?: PageInfo | null;
  totalRows?: number;
  pageSize?: number;

  rowSelectionEnabled?: boolean;
  enableRowResizing?: boolean;

  // External selection state management
  selectedRowIds?: TRowId[];
  onSelectionChange?: (selectedIds: TRowId[]) => void;
};

export const TableRowsProvider = <TRowData, TRowId extends string | number = string | number>({
  children,

  getRowStyle,
  onLoadMoreRows,
  getRowId,
  pageInfo = null,
  totalRows = 0,
  pageSize = 50,

  onRowResize,
  rowSelectionEnabled = false,
  enableRowResizing = true,

  // External selection state
  selectedRowIds: externalSelectedRowIds,
  onSelectionChange,
}: TableRowsProviderProps<TRowData, TRowId>) => {
  const { data, isLoading } = useTableContext<TRowData, string>();
  const [rowHeights, setRowHeights] = useState<Record<TRowId, number>>({} as Record<TRowId, number>);
  const loadingMoreRef = useRef(false);

  // Use external selection state if provided, otherwise use internal state
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<TRowId[]>([]);
  const selectedRowIds = externalSelectedRowIds ?? internalSelectedRowIds;

  // Use pageInfo.total if available, otherwise use provided totalRows or data.length
  const effectiveTotalRows = useMemo(() => {
    return pageInfo ? pageInfo.total : (totalRows ?? data.length);
  }, [pageInfo, totalRows, data.length]);

  // Effect to initialize row heights

  useEffect(() => {
    const initialRowHeights: Record<TRowId, number> = {} as Record<TRowId, number>;
    data.forEach(item => {
      initialRowHeights[getRowId(item)] = 50; // Default row height
    });
    setRowHeights(initialRowHeights);
  }, [data, getRowId]);

  const resizeRowHeight = useCallback(
    (rowId: TRowId, newHeight: number) => {
      setRowHeights(prevHeights => ({
        ...prevHeights,
        [rowId]: Math.max(newHeight, 30), // Ensure minimum height of 30px
      }));
      onRowResize?.(rowId, newHeight);
    },
    [onRowResize]
  );

  // Function to load more rows when scrolling near the end
  // Only used when pagination is not active
  // const loadMoreRowsIfNeeded = useCallback(
  //   async (visibleStartIndex: number, visibleStopIndex: number) => {
  //     console.log("loadMoreRowsIfNeeded", {
  //       visibleStartIndex,
  //       visibleStopIndex,
  //       data,
  //       isLoading,
  //       onLoadMoreRows,
  //       loadingMoreRef,
  //     });
  //     if (
  //       !onLoadMoreRows ||
  //       loadingMoreRef.current ||
  //       isLoading
  //       // || pageInfo
  //     )
  //       return;

  //     const effectiveTotalRows = pageInfo
  //       ? pageInfo.total
  //       : totalRows ?? data.length;

  //     const thresholdIndex = Math.min(data.length - 1, visibleStopIndex + 20);

  //     // if (
  //     //   thresholdIndex >= data.length - 1 &&
  //     //   data.length < effectiveTotalRows
  //     // ) {
  //       loadingMoreRef.current = true;
  //       try {
  //         await onLoadMoreRows({
  //           visibleStartIndex: data.length,
  //           visibleStopIndex: Math.min(
  //             data.length + pageSize - 1,
  //             effectiveTotalRows - 1
  //           ),
  //         });
  //       } finally {
  //         loadingMoreRef.current = false;
  //       }
  //     // }
  //   },
  //   [data.length, isLoading, onLoadMoreRows, pageSize, totalRows, pageInfo]
  // );

  const loadMoreRowsIfNeeded = useCallback(
    async (_visibleStartIndex: number, visibleStopIndex: number) => {
      // Skip if pagination is active
      if (pageInfo) return;

      if (!onLoadMoreRows || loadingMoreRef.current || isLoading) return;

      // If we're within 20 rows of the end of our loaded data and we haven't loaded all rows yet
      const thresholdIndex = Math.min(data.length - 1, visibleStopIndex + 20);

      if (
        thresholdIndex >=
        data.length - 1
        // && data.length < effectiveTotalRows
      ) {
        loadingMoreRef.current = true;

        try {
          await onLoadMoreRows({
            visibleStartIndex: data.length,
            visibleStopIndex: Math.min(data.length + pageSize - 1, effectiveTotalRows - 1),
          });
        } finally {
          loadingMoreRef.current = false;
        }
      }
    },
    [data.length, isLoading, onLoadMoreRows, pageSize, effectiveTotalRows, pageInfo]
  );

  // Rest of the component...
  // Handle select all checkbox change - only affects current page
  const toggleAllRowsSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!data) return;

      const currentPageIds = data.map(row => getRowId(row));

      if (event.target.checked) {
        // Select all rows in the current page, preserving selections from other pages
        const newSelections = [...selectedRowIds];
        currentPageIds.forEach(id => {
          if (!newSelections.includes(id)) {
            newSelections.push(id);
          }
        });

        if (onSelectionChange) {
          onSelectionChange(newSelections);
        } else {
          setInternalSelectedRowIds(newSelections);
        }
      } else {
        // Deselect only rows in the current page, keeping selections from other pages
        const newSelections = selectedRowIds.filter(id => !currentPageIds.includes(id));

        if (onSelectionChange) {
          onSelectionChange(newSelections);
        } else {
          setInternalSelectedRowIds(newSelections);
        }
      }
    },
    [data, getRowId, selectedRowIds, onSelectionChange]
  );

  const toggleRowSelection = useCallback(
    (rowId: TRowId) => {
      const newSelections = selectedRowIds.includes(rowId)
        ? selectedRowIds.filter(id => id !== rowId)
        : [...selectedRowIds, rowId];

      if (onSelectionChange) {
        onSelectionChange(newSelections);
      } else {
        setInternalSelectedRowIds(newSelections);
      }
    },
    [selectedRowIds, onSelectionChange]
  );

  // Clear all selections
  const clearAllSelections = useCallback(() => {
    if (onSelectionChange) {
      onSelectionChange([]);
    } else {
      setInternalSelectedRowIds([]);
    }
  }, [onSelectionChange]);

  const isAllRowsSelected = useMemo(() => {
    if (!data || data.length === 0) return false;
    const currentPageIds = data.map(row => getRowId(row));
    return currentPageIds.every(id => selectedRowIds.includes(id));
  }, [data, selectedRowIds, getRowId]);

  /**
   * Context value memoization to prevent unnecessary rerenders
   */
  const value: TableRowsContextType<TRowData, TRowId> = useMemo(
    () => ({
      // Row selection
      rowSelectionEnabled,
      isAllRowsSelected,
      selectedRowIds,
      toggleAllRowsSelection,
      toggleRowSelection,
      clearAllSelections,

      // Row styling and dimensions
      rowHeights,
      resizeRowHeight,
      ...(getRowStyle && { getRowStyle }),

      // Data loading and pagination
      totalRows,
      loadMoreRowsIfNeeded,

      // Configuration
      getRowId,
      enableRowResizing,
    }),
    [
      // Dependencies for memoization
      rowSelectionEnabled,
      isAllRowsSelected,
      selectedRowIds,
      toggleAllRowsSelection,
      toggleRowSelection,
      clearAllSelections,
      resizeRowHeight,
      getRowStyle,
      rowHeights,
      totalRows,
      loadMoreRowsIfNeeded,
      getRowId,
      enableRowResizing,
    ]
  );

  return <TableRowsContext.Provider value={value}>{children}</TableRowsContext.Provider>;
};

export const useTableRowsContext = <TRowData, TRowId extends string | number = string | number>(): TableRowsContextType<
  TRowData,
  TRowId
> => {
  const context = useContext(TableRowsContext);
  if (!context) {
    throw new Error("useTableRowsContext must be used within a TableProvider");
  }
  return context;
};

export default TableRowsContext;
