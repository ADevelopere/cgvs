import { createContext, useContext, ReactNode, useMemo, useState } from "react";
import {
  TableColumnsProvider,
  TableColumnsProviderProps,
} from "./TableColumnContext";
import { TableDataProvider, TableDataProviderProps } from "./TableDataContext";
import { TableRowsProvider, TableRowsProviderProps } from "./TableRowsContext";
import { EditableColumn } from "@/client/types/table.type";
import { PageInfo } from "@/client/graphql/generated/gql/graphql";

export type TableContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading?: boolean;
  columns: EditableColumn[];

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

const TableContext = createContext<TableContextType | null>(null);

type TableProviderProps = {
  children: ReactNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading?: boolean;
  columns: EditableColumn[];

  dataProps: Omit<
    TableDataProviderProps,
    "children" | "data" | "isLoading" | "columns"
  >;
  columnProps: Omit<TableColumnsProviderProps, "children" | "data">;
  rowsProps: Omit<
    TableRowsProviderProps,
    "children" | "data" | "isLoading" | "selectedRowIds" | "onSelectionChange"
  >;

  // Pagination
  pageInfo?: PageInfo | null;
  enableRowResizing?: boolean;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  initialPageSize?: number;

  // Sorting
  initialOrderBy?: { column: string; order: "ASC" | "DESC" }[];

  // Custom footer content
  footerStartContent?: ReactNode;
  footerEndContent?: ReactNode;
  hideRowsPerPage?: boolean;
  compact?: boolean;

  // Selection state management
  selectedRowIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
};

export const TableProvider = ({
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
  initialOrderBy,
  footerStartContent,
  footerEndContent,
  hideRowsPerPage = false,
  compact = false,
  selectedRowIds,
  onSelectionChange,
}: TableProviderProps) => {
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const value = useMemo(() => {
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
          <TableDataProvider {...dataProps} initialOrderBy={initialOrderBy}>
            {children}
          </TableDataProvider>
        </TableColumnsProvider>
      </TableRowsProvider>
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
