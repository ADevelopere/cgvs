import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {  LoadMoreParams } from "@/types/table.type";
import { getSelectAllCheckboxState } from "../TableHeader/utils";
import { useTableContext } from "./TableContext";
import { PaginationInfo } from "@/graphql/generated/types";

/**
 * Type definition for the Table Rows Context
 * Manages row selection, heights, and loading functionality
 */
export type TableRowsContextType = {
  // Row selection related props
  rowSelectionEnabled: boolean;
  isAllRowsSelected?: boolean;
  selectedRowIds: (string | number)[];
  toggleAllRowsSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleRowSelection: (rowId: string | number) => void;

  // Row height and styling
  rowHeights: Record<string | number, number>;
  resizeRowHeight: (rowId: number | string, newHeight: number) => void;
  getRowStyle?: (rowData: any, rowIndex: number) => React.CSSProperties;

  // Pagination and loading
  totalRows: number; // Total number of rows in the dataset
  loadMoreRowsIfNeeded: (
    visibleStartIndex: number,
    visibleStopIndex: number
  ) => Promise<void>;

  // Configuration
  rowIdKey: string; // Key to identify unique rows
};

const TableRowsContext = createContext<TableRowsContextType | null>(null);

export type TableRowsProviderProps = {
  children: ReactNode;

  onLoadMoreRows?: (params: LoadMoreParams) => Promise<void>;
  getRowStyle?: (rowData: any, rowIndex: number) => React.CSSProperties;
  onRowResize?: (rowId: number | string, newHeight: number) => void;

  rowIdKey?: string;
  //todo getRowIdKey

  paginatorInfo?: PaginationInfo | null;
  totalRows?: number;
  pageSize?: number;

  rowSelectionEnabled?: boolean;
};

export const TableRowsProvider = ({
  children,

  getRowStyle,
  onLoadMoreRows,
  rowIdKey = "id",
  paginatorInfo = null,
  totalRows = 0,
  pageSize = 50,

  onRowResize,
  rowSelectionEnabled = false,
}: TableRowsProviderProps) => {
  const { data, isLoading } = useTableContext();
  const [rowHeights, setRowHeights] = useState<Record<string | number, number>>(
    {}
  );
  const loadingMoreRef = useRef(false);

  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);

  // Use paginatorInfo.total if available, otherwise use provided totalRows or data.length
  const effectiveTotalRows = useMemo(() => {
    return paginatorInfo ? paginatorInfo.total : totalRows ?? data.length;
  }, [paginatorInfo, totalRows, data.length]);

  // Effect to initialize row heights
  
  useEffect(() => {
    const initialRowHeights: Record<string | number, number> = {};
    data.forEach((item: any) => {
      initialRowHeights[item[rowIdKey]] = 50; // Default row height
    });
    setRowHeights(initialRowHeights);
  }, [data, rowIdKey]);

  const resizeRowHeight = useCallback(
    (rowId: number | string, newHeight: number) => {
      setRowHeights((prevHeights) => ({
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
  //       // || paginatorInfo
  //     )
  //       return;

  //     const effectiveTotalRows = paginatorInfo
  //       ? paginatorInfo.total
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
  //   [data.length, isLoading, onLoadMoreRows, pageSize, totalRows, paginatorInfo]
  // );

  const loadMoreRowsIfNeeded = useCallback(
    async (visibleStartIndex: number, visibleStopIndex: number) => {
      // Skip if pagination is active
      if (paginatorInfo) return;

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
            visibleStopIndex: Math.min(
              data.length + pageSize - 1,
              effectiveTotalRows - 1
            ),
          });
        } finally {
          loadingMoreRef.current = false;
        }
      }
    },
    [
      data.length,
      isLoading,
      onLoadMoreRows,
      pageSize,
      effectiveTotalRows,
      paginatorInfo,
    ]
  );

  // Rest of the component...
  // Handle select all checkbox change
  const toggleAllRowsSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!data) return;

      if (event.target.checked) {
        // Select all rows in the current data
        const allIds = data.map((row) => row[rowIdKey]);
        setSelectedRowIds(allIds);
      } else {
        // Deselect all rows
        setSelectedRowIds([]);
      }
    },
    [data, rowIdKey]
  );

  const toggleRowSelection = useCallback((rowId: string | number) => {
    setSelectedRowIds((prevSelectedRowIds) => {
      if (prevSelectedRowIds.includes(rowId)) {
        // Deselect the row
        return prevSelectedRowIds.filter((id) => id !== rowId);
      } else {
        // Select the row
        return [...prevSelectedRowIds, rowId];
      }
    });
  }, []);

  const isAllRowsSelected = useMemo(() => {
    return getSelectAllCheckboxState(data, selectedRowIds, rowIdKey) || false;
  }, [data, selectedRowIds, rowIdKey]);

  /**
   * Context value memoization to prevent unnecessary rerenders
   */
  const value: TableRowsContextType = useMemo(
    () => ({
      // Row selection
      rowSelectionEnabled,
      isAllRowsSelected,
      selectedRowIds,
      toggleAllRowsSelection,
      toggleRowSelection,

      // Row styling and dimensions
      rowHeights,
      resizeRowHeight,
      getRowStyle,

      // Data loading and pagination
      totalRows,
      loadMoreRowsIfNeeded,

      // Configuration
      rowIdKey,
    }),
    [
      // Dependencies for memoization
      rowSelectionEnabled,
      isAllRowsSelected,
      selectedRowIds,
      toggleAllRowsSelection,
      toggleRowSelection,
      resizeRowHeight,
      getRowStyle,
      rowHeights,
      totalRows,
      loadMoreRowsIfNeeded,
      rowIdKey,
    ]
  );

  return (
    <TableRowsContext.Provider value={value}>
      {children}
    </TableRowsContext.Provider>
  );
};

export const useTableRowsContext = () => {
  const context = useContext(TableRowsContext);
  if (!context) {
    throw new Error("useTableRowsContext must be used within a TableProvider");
  }
  return context;
};

export default TableRowsContext;
