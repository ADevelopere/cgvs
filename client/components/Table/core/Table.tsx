"use client";

import type React from "react";
import { useRef, useMemo, useState } from "react";
import {
  TableContext,
  TableColumnsProvider,
  TableDataProvider,
  TableRowsProvider,
  type TableContextType,
} from "../contexts";
import { AnyColumn, PageInfo, PinPosition } from "../types";
import { TableRenderer } from "./TableRenderer";

export interface TableProps<TRowData, TRowId extends string | number = string | number> {
  // Table data and configuration
  data: TRowData[];
  isLoading?: boolean;
  columns: readonly AnyColumn<TRowData, TRowId>[];

  // Pagination
  pageInfo?: PageInfo | null;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  initialPageSize?: number;

  // Custom footer content
  footerStartContent?: React.ReactNode;
  footerEndContent?: React.ReactNode;
  hideRowsPerPage?: boolean;
  compact?: boolean;

  // Selection state management
  selectedRowIds?: TRowId[];
  onSelectionChange?: (selectedIds: TRowId[]) => void;

  // Column props
  initialWidths: Record<string, number>;
  onResizeColumn?: (columnId: string, newWidth: number) => void;
  onPinColumn?: (columnId: string, position: PinPosition) => void;
  onHideColumn?: (columnId: string) => void;
  onShowColumn?: (columnId: string) => void;
  onAutosizeColumn?: (columnId: string) => void;

  // Row props
  getRowId: (row: TRowData) => TRowId;
  getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;
  onRowResize?: (rowId: TRowId, newHeight: number) => void;
  rowSelectionEnabled?: boolean;
  enableRowResizing?: boolean;
  onLoadMoreRows?: (params: { visibleStartIndex: number; visibleStopIndex: number }) => Promise<void>;

  // Rendering
  style?: React.CSSProperties;
  creationRow?: React.ReactNode;
}

export const Table = <TRowData, TRowId extends string | number = string | number>({
  // Data and columns
  data,
  isLoading = false,
  columns,

  // Pagination
  pageInfo,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100, 200],
  initialPageSize = 50,

  // Footer
  footerStartContent,
  footerEndContent,
  hideRowsPerPage = false,
  compact = false,

  // Selection
  selectedRowIds,
  onSelectionChange,

  // Column props
  initialWidths,
  onResizeColumn,
  onPinColumn,
  onHideColumn,
  onShowColumn,
  onAutosizeColumn,

  // Row props
  getRowId,
  getRowStyle,
  onRowResize,
  rowSelectionEnabled = false,
  enableRowResizing = true,
  onLoadMoreRows,

  // Rendering
  style,
  creationRow,
}: TableProps<TRowData, TRowId>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Create the table context value
  const tableContextValue = useMemo<TableContextType<TRowData, TRowId>>(() => {
    return {
      data,
      isLoading,
      columns,
      pageInfo,
      pageSize,
      setPageSize,
      rowsPerPageOptions,
      onPageChange,
      onRowsPerPageChange,
      footerStartContent,
      footerEndContent,
      hideRowsPerPage,
      compact,
    };
  }, [
    data,
    isLoading,
    columns,
    pageInfo,
    rowsPerPageOptions,
    pageSize,
    onPageChange,
    onRowsPerPageChange,
    footerStartContent,
    footerEndContent,
    hideRowsPerPage,
    compact,
  ]);

  return (
    <div
      ref={tableContainerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <TableContext.Provider value={tableContextValue}>
        <TableRowsProvider
          getRowId={getRowId}
          getRowStyle={getRowStyle}
          onRowResize={onRowResize}
          rowSelectionEnabled={rowSelectionEnabled}
          enableRowResizing={enableRowResizing}
          onLoadMoreRows={onLoadMoreRows}
          pageInfo={pageInfo}
          totalRows={pageInfo?.total}
          pageSize={pageSize}
          selectedRowIds={selectedRowIds}
          onSelectionChange={onSelectionChange}
        >
          <TableColumnsProvider
            initialWidths={initialWidths}
            containerRef={tableContainerRef as React.RefObject<HTMLDivElement>}
            rowSelectionEnabled={rowSelectionEnabled}
            onResizeColumnAction={onResizeColumn}
            onPinColumnAction={onPinColumn}
            onHideColumnAction={onHideColumn}
            onShowColumnAction={onShowColumn}
            onAutosizeColumnAction={onAutosizeColumn}
          >
            <TableDataProvider>
              <TableRenderer style={style} creationRow={creationRow} />
            </TableDataProvider>
          </TableColumnsProvider>
        </TableRowsProvider>
      </TableContext.Provider>
    </div>
  );
};
