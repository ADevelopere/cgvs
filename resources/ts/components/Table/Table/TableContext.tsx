import { createContext, useContext, ReactNode, useMemo, useState } from "react";
import {
  TableColumnsProvider,
  TableColumnsProviderProps,
} from "./TableColumnContext";
import { TableDataProvider, TableDataProviderProps } from "./TableDataContext";
import { TableRowsProvider, TableRowsProviderProps } from "./TableRowsContext";
import { Column } from "@/types/table.type";
import { PaginatorInfo } from "@/graphql/generated/types";

export type TableContextType = {
  data: any[];
  isLoading?: boolean;
  columns: Column[];

  paginatorInfo?: PaginatorInfo | null;
  pageSize: number;
  setPageSize: (newPageSize: number) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
};

const TableContext = createContext<TableContextType | null>(null);

type TableProviderProps = {
  children: ReactNode;

  data: any[];
  isLoading?: boolean;
  columns: Column[];

  dataProps: Omit<
    TableDataProviderProps,
    "children" | "data" | "isLoading" | "columns"
  >;
  columnProps: Omit<TableColumnsProviderProps, "children" | "data">;
  rowsProps: Omit<TableRowsProviderProps, "children" | "data" | "isLoading">;

  // Pagination
  paginatorInfo?: PaginatorInfo | null;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  initialPageSize?: number;
};

export const TableProvider = ({
  children,
  data,
  columns,
  columnProps,
  dataProps,
  rowsProps,
  isLoading = false,
  paginatorInfo,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialPageSize = 50,
}: TableProviderProps) => {
  console.log("TableProvider", "data length", data.length);

  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const value = useMemo(() => {
    return {
      data,
      isLoading,
      columns,
      paginatorInfo,
      pageSize,
      setPageSize,
      rowsPerPageOptions,
      onPageChange,
      onRowsPerPageChange,
    };
  }, [
    data,
    isLoading,
    columns,
    paginatorInfo,
    rowsPerPageOptions,
    pageSize,

    onPageChange,
    onRowsPerPageChange,
  ]);
  return (
    <TableContext.Provider value={value}>
      <TableColumnsProvider {...columnProps}>
        <TableDataProvider {...dataProps}>
          <TableRowsProvider {...rowsProps}>{children}</TableRowsProvider>
        </TableDataProvider>
      </TableColumnsProvider>
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

export default TableContext;
