import React from "react";
import { Box } from "@mui/material";
import { TableLocaleProvider } from "@/locale/table/TableLocaleContext";
import { TableProvider } from "@/components/Table/Table/TableContext";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import { EditableColumn, LoadMoreParams } from "@/types/table.type";
import { PaginationInfo } from "@/graphql/generated/types";
import { SupportedLocale } from "@/locale/table/tableLocale.types";
import { FilterClause } from "@/types/filters";

export interface TableDecoratorConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    columns: EditableColumn[];
    locale?: SupportedLocale;
    isLoading?: boolean;
    paginationInfo?: PaginationInfo | null;
    rowSelectionEnabled?: boolean;
    enableRowResizing?: boolean;
    onPageChange?: (newPage: number) => void;
    onRowsPerPageChange?: (newRowsPerPage: number) => void;
    onLoadMoreRows?: (params: LoadMoreParams) => Promise<void>;
    onFilterChange?: (
        filterClause: FilterClause<unknown, unknown> | null,
        columnId: string,
    ) => void;
    onSort?: (
        orderByClause: { column: string; order: "ASC" | "DESC" }[],
    ) => void;
    rowsPerPageOptions?: number[];
    initialPageSize?: number;
    containerHeight?: string;
    containerWidth?: string;
}

const withTableContexts = (config: TableDecoratorConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TableDecorator = (Story: any, context: any) => {
        const {
            data,
            columns,
            locale = "en",
            isLoading = false,
            paginationInfo,
            rowSelectionEnabled = false,
            enableRowResizing = true,
            onPageChange,
            onRowsPerPageChange,
            onLoadMoreRows,
            onFilterChange,
            onSort,
            rowsPerPageOptions = [10, 25, 50, 100],
            initialPageSize = 25,
            containerHeight = "80vh",
            containerWidth = "100%",
        } = config;

        // Create initial column widths
        const initialWidths = columns.reduce(
            (acc, column) => {
                acc[column.id] = column.initialWidth || 150;
                return acc;
            },
            {} as Record<string, number>,
        );

        return (
            <AppRouterCacheProvider>
                <TableLocaleProvider locale={locale}>
                    <TableProvider
                        data={data}
                        columns={columns}
                        isLoading={isLoading}
                        paginationInfo={paginationInfo}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        rowsPerPageOptions={rowsPerPageOptions}
                        initialPageSize={initialPageSize}
                        dataProps={{
                            onFilterChange,
                            onSort,
                        }}
                        columnProps={{
                            initialWidths,
                        }}
                        rowsProps={{
                            rowSelectionEnabled,
                            enableRowResizing,
                            onLoadMoreRows,
                            totalRows: paginationInfo?.total || data.length,
                        }}
                    >
                        <Box
                            sx={{
                                height: containerHeight,
                                width: containerWidth,
                                backgroundColor: "background.default",
                                color: "text.primary",
                                padding: 2,
                            }}
                        >
                            <Story {...context} />
                        </Box>
                    </TableProvider>
                </TableLocaleProvider>
            </AppRouterCacheProvider>
        );
    };

    return TableDecorator;
};

export default withTableContexts;
