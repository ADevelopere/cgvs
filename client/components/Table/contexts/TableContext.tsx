import { createContext, useContext, ReactNode } from "react";
import { AnyColumn, PageInfo } from "../types";

export type TableContextType<TRowData, TRowId extends string | number = string | number> = {
  data: TRowData[];
  isLoading?: boolean;
  columns: readonly AnyColumn<TRowData, TRowId>[];

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

export const useTableContext = <TRowData, TRowId extends string | number = string | number>(): TableContextType<
  TRowData,
  TRowId
> => {
  const context = useContext(TableContext as React.Context<TableContextType<TRowData, TRowId>>);
  if (!context) {
    throw new Error("useTableContext must be used within a Table component");
  }
  return context;
};

export default TableContext;
