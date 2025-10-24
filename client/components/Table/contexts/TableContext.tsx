import { createContext, useContext, ReactNode, useMemo, useState } from "react";
import {
  TableColumnsProvider,
  TableColumnsProviderProps,
} from "./TableColumnContext";
import { TableDataProvider, TableDataProviderProps } from "./TableDataContext";
import { TableRowsProvider, TableRowsProviderProps } from "./TableRowsContext";
import { AnyColumn, PageInfo } from "@/client/components/Table/types/column.type";

export type TableContextType<TRowData, TColumnId extends string = string> = {
  data: TRowData[];
  isLoading?: boolean;
  columns: AnyColumn<TRowData, TColumnId>[];

  pageInfo?: PageInfo | null;
  pageSize: number;
  setPageSize: (newPageSize: number) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];

  footerStartContent?: ReactNode;
  footerEndContent?: ReactNode;
  hideRowsPerPage?: boolean;
  compact?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableContext = createContext<TableContextType<any, any> | null>(null);

type TableProviderProps<
  TRowData,
  TColumnId extends string = string,
  TRowId extends string | number = string | number,
> = {
  children: ReactNode;

  data: TRowData[];
  isLoading?: boolean;
  columns: AnyColumn<TRowData, TColumnId>[];

  dataProps: Omit<TableDataProviderProps<TColumnId>, "children">;
  columnProps: Omit<TableColumnsProviderProps<TColumnId>, "children">;
  rowsProps: Omit<
    TableRowsProviderProps<TRowData, TRowId>,
    "children" | "selectedRowIds" | "onSelectionChange"
  >;

  // Pagination
  pageInfo?: PageInfo | null;
  enableRowResizing?: boolean;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  initialPageSize?: number;

  // Custom footer content
  footerStartContent?: ReactNode;
  footerEndContent?: ReactNode;
  hideRowsPerPage?: boolean;
  compact?: boolean;

  // Selection state management
  selectedRowIds?: TRowId[];
  onSelectionChange?: (selectedIds: TRowId[]) => void;
};

export const TableProvider = <
  TRowData,
  TRowId extends string | number = string | number,
  TColumnId extends string = string,
>({
  children,
  data,
  columns,
  columnProps,
  dataProps,
  rowsProps,
  isLoading = false,
  pageInfo,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100, 200],
  initialPageSize = 50,
  footerStartContent,
  footerEndContent,
  hideRowsPerPage = false,
  compact = false,
  selectedRowIds,
  onSelectionChange,
}: TableProviderProps<TRowData, TColumnId, TRowId>) => {
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const value = useMemo<TableContextType<TRowData, TColumnId>>(() => {
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
    <TableContext.Provider value={value}>
      <TableRowsProvider
        {...rowsProps}
        selectedRowIds={selectedRowIds}
        onSelectionChange={onSelectionChange}
      >
        <TableColumnsProvider {...columnProps}>
          <TableDataProvider {...dataProps}>{children}</TableDataProvider>
        </TableColumnsProvider>
      </TableRowsProvider>
    </TableContext.Provider>
  );
};

export const useTableContext = <
  TRowData,
  TColumnId extends string = string,
>(): TableContextType<TRowData, TColumnId> => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

export default TableContext;
