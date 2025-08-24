import { createContext, useContext, ReactNode, useMemo, useState } from "react";
import {
    TableColumnsProvider,
    TableColumnsProviderProps,
} from "./TableColumnContext";
import { TableDataProvider, TableDataProviderProps } from "./TableDataContext";
import { TableRowsProvider, TableRowsProviderProps } from "./TableRowsContext";
import { EditableColumn } from "@/types/table.type";
import { PaginationInfo } from "@/graphql/generated/types";

export type TableContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    isLoading?: boolean;
    columns: EditableColumn[];

    paginationInfo?: PaginationInfo | null;
    pageSize: number;
    setPageSize: (newPageSize: number) => void;
    onPageChange?: (newPage: number) => void;
    onRowsPerPageChange?: (newRowsPerPage: number) => void;
    rowsPerPageOptions?: number[];
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
    rowsProps: Omit<TableRowsProviderProps, "children" | "data" | "isLoading">;

    // Pagination
    paginationInfo?: PaginationInfo | null;
    enableRowResizing?: boolean;
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
    paginationInfo,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [10, 25, 50, 100],
    initialPageSize = 50,
}: TableProviderProps) => {
    const [pageSize, setPageSize] = useState<number>(initialPageSize);
    const value = useMemo(() => {
        return {
            data,
            isLoading,
            columns,
            paginationInfo,
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
        paginationInfo,
        rowsPerPageOptions,
        pageSize,

        onPageChange,
        onRowsPerPageChange,
    ]);
    return (
        <TableContext.Provider value={value}>
            <TableRowsProvider {...rowsProps}>
                <TableColumnsProvider {...columnProps}>
                    <TableDataProvider {...dataProps}>
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
