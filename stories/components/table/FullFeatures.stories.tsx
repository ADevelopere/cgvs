import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";

import withGlobalStyles from "@/stories/Decorators";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import useStoryTheme from "@/stories/useStoryTheme";

import Table from "@/components/Table/Table/Table";
import withTableContexts, { TableDecoratorConfig } from "./tableDecorator";
import { generateMixedData, createMixedColumns } from "./mockData";
import { PaginationInfo, SortDirection } from "@/graphql/generated/types";
import { FilterClause } from "@/types/filters";

export default {
    title: "Components/Table/FullFeatures",
    component: Table,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        totalRows: {
            control: { type: "number", min: 100, max: 1000 },
            description: "Total number of rows in dataset",
        },
        pageSize: {
            control: { type: "number", min: 10, max: 100 },
            description: "Number of rows per page",
        },
        enablePagination: {
            control: "boolean",
            description: "Enable pagination",
        },
        enableSorting: {
            control: "boolean",
            description: "Enable sorting",
        },
        enableFiltering: {
            control: "boolean",
            description: "Enable filtering",
        },
        enableRowSelection: {
            control: "boolean",
            description: "Enable row selection",
        },
        isLoading: {
            control: "boolean",
            description: "Show loading state",
        },
    },
} as Meta;

type FullFeaturesStoryProps = {
    totalRows: number;
    pageSize: number;
    enablePagination: boolean;
    enableSorting: boolean;
    enableFiltering: boolean;
    enableRowSelection: boolean;
    isLoading: boolean;
} & CommonStoryArgTypesProps;

const Template: StoryFn<FullFeaturesStoryProps> = (
    args: FullFeaturesStoryProps,
) => {
    useStoryTheme(args);

    const {
        totalRows,
        pageSize,
        enablePagination,
        enableSorting,
        enableFiltering,
        enableRowSelection,
        isLoading,
    } = args;

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [sortOrder, setSortOrder] = useState<
        { column: string; order: SortDirection }[]
    >([]);
    const [filters, setFilters] = useState<
        Record<string, FilterClause<unknown, unknown> | null>
    >({});

    const allData = React.useMemo(
        () => generateMixedData(totalRows),
        [totalRows],
    );
    const columns = React.useMemo(
        () =>
            createMixedColumns().map((col) => ({
                ...col,
                sortable: enableSorting,
                filterable: enableFiltering,
            })),
        [enableSorting, enableFiltering],
    );

    // Apply filtering
    const filteredData = React.useMemo(() => {
        if (!enableFiltering) return allData;

        return allData.filter((row) => {
            return Object.entries(filters).every(([columnId, filter]) => {
                if (!filter) return true;

                const column = columns.find((col) => col.id === columnId);
                if (!column) return true;

                const cellValue =
                    typeof column.accessor === "function"
                        ? column.accessor(row)
                        : row[column.accessor];

                if (cellValue == null) return false;

                // Handle different filter operations based on column type
                if (column.type === "number") {
                    const numValue = Number(cellValue);
                    const filterValue = Number(filter.value);
                    switch (filter.operation) {
                        case "equals":
                            return numValue === filterValue;
                        case "greaterThan":
                            return numValue > filterValue;
                        case "lessThan":
                            return numValue < filterValue;
                        default:
                            return numValue === filterValue;
                    }
                } else if (column.type === "boolean") {
                    return cellValue === filter.value;
                } else {
                    const value = String(cellValue).toLowerCase();
                    const filterValue =
                        typeof filter.value === "string" ||
                        typeof filter.value === "number"
                            ? String(filter.value).toLowerCase()
                            : "";
                    switch (filter.operation) {
                        case "contains":
                            return value.includes(filterValue);
                        case "equals":
                            return value === filterValue;
                        case "startsWith":
                            return value.startsWith(filterValue);
                        case "endsWith":
                            return value.endsWith(filterValue);
                        default:
                            return value.includes(filterValue);
                    }
                }
            });
        });
    }, [allData, filters, columns, enableFiltering]);

    // Apply sorting
    const sortedData = React.useMemo(() => {
        if (!enableSorting || sortOrder.length === 0) return filteredData;

        return [...filteredData].sort((a, b) => {
            for (const { column, order } of sortOrder) {
                const columnDef = columns.find((col) => col.id === column);
                if (!columnDef) continue;

                const aValue =
                    typeof columnDef.accessor === "function"
                        ? columnDef.accessor(a)
                        : a[columnDef.accessor as string];
                const bValue =
                    typeof columnDef.accessor === "function"
                        ? columnDef.accessor(b)
                        : b[columnDef.accessor as string];

                let comparison = 0;

                if (columnDef.type === "number") {
                    comparison = (Number(aValue) || 0) - (Number(bValue) || 0);
                } else if (columnDef.type === "date") {
                    comparison =
                        new Date(aValue || 0).getTime() -
                        new Date(bValue || 0).getTime();
                } else if (columnDef.type === "boolean") {
                    comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
                } else {
                    comparison = String(aValue || "").localeCompare(
                        String(bValue || ""),
                    );
                }

                if (comparison !== 0) {
                    return order === "DESC" ? -comparison : comparison;
                }
            }
            return 0;
        });
    }, [filteredData, sortOrder, columns, enableSorting]);

    // Apply pagination
    const displayData = React.useMemo(() => {
        if (!enablePagination) return sortedData;

        const startIndex = (currentPage - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, currentPageSize, enablePagination]);

    // Create pagination info
    const paginationInfo: PaginationInfo | null = React.useMemo(() => {
        if (!enablePagination) return null;
        return {
            currentPage,
            perPage: currentPageSize,
            total: sortedData.length,
            lastPage: Math.ceil(sortedData.length / currentPageSize),
            hasMorePages:
                currentPage < Math.ceil(sortedData.length / currentPageSize),
            count: displayData.length,
            firstItem:
                displayData.length > 0
                    ? (currentPage - 1) * currentPageSize + 1
                    : null,
            lastItem:
                displayData.length > 0
                    ? Math.min(currentPage * currentPageSize, sortedData.length)
                    : null,
        };
    }, [
        enablePagination,
        currentPage,
        currentPageSize,
        sortedData.length,
        displayData.length,
    ]);

    // Event handlers
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        action("pageChange")(newPage);
    };

    const handleRowsPerPageChange = (newPageSize: number) => {
        setCurrentPageSize(newPageSize);
        setCurrentPage(1);
        action("rowsPerPageChange")(newPageSize);
    };

    const handleSort = (
        orderByClause: { column: string; order: SortDirection }[],
    ) => {
        setSortOrder(orderByClause);
        action("sort")(orderByClause);
    };

    const handleFilterChange = (
        filterClause: FilterClause<unknown, unknown> | null,
        columnId: string,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [columnId]: filterClause,
        }));
        action("filterChange")(filterClause, columnId);
    };

    const TableWithContexts = React.useMemo(() => {
        const tableConfig: TableDecoratorConfig = {
            data: displayData,
            columns,
            isLoading,
            paginationInfo,
            rowSelectionEnabled: enableRowSelection,
            containerHeight: "750px",
            onPageChange: handlePageChange,
            onRowsPerPageChange: handleRowsPerPageChange,
            onSort: handleSort,
            onFilterChange: handleFilterChange,
            rowsPerPageOptions: [10, 25, 50, 100],
            initialPageSize: currentPageSize,
        };

        const decorator = withTableContexts(tableConfig);
        const Component = () => decorator(() => <Table />, {});
        return Component;
    }, [
        displayData,
        columns,
        isLoading,
        paginationInfo,
        enableRowSelection,
        currentPageSize,
    ]);

    return (
        <div>
            {/* Status display */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 12,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 8,
                    fontSize: 14,
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <strong>Total Rows:</strong> {allData.length}
                </div>
                <div>
                    <strong>Filtered:</strong> {sortedData.length}
                </div>
                <div>
                    <strong>Displayed:</strong> {displayData.length}
                </div>
                {enablePagination && (
                    <div>
                        <strong>Page:</strong> {currentPage} of{" "}
                        {Math.ceil(sortedData.length / currentPageSize)}
                    </div>
                )}
                {enableSorting && sortOrder.length > 0 && (
                    <div>
                        <strong>Sort:</strong>
                        {sortOrder.map(({ column, order }, index) => (
                            <span key={column}>
                                {index > 0 && " → "}
                                {" " +
                                    columns.find((col) => col.id === column)
                                        ?.label}{" "}
                                ({order})
                            </span>
                        ))}
                    </div>
                )}
                {enableFiltering &&
                    Object.keys(filters).some((key) => filters[key]) && (
                        <div>
                            <strong>Filters:</strong>
                            {Object.entries(filters)
                                .filter(([, filter]) => filter)
                                .map(([columnId, filter]) => (
                                    <span key={columnId}>
                                        {" " +
                                            columns.find(
                                                (col) => col.id === columnId,
                                            )?.label}
                                        : {String(filter?.value)}
                                    </span>
                                ))}
                        </div>
                    )}
            </div>

            <TableWithContexts />
        </div>
    );
};

export const AllFeatures = Template.bind({});
AllFeatures.args = {
    ...defaultStoryArgs,
    totalRows: 500,
    pageSize: 25,
    enablePagination: true,
    enableSorting: true,
    enableFiltering: true,
    enableRowSelection: true,
    isLoading: false,
};

export const BasicFeatures = Template.bind({});
BasicFeatures.args = {
    ...defaultStoryArgs,
    totalRows: 200,
    pageSize: 30,
    enablePagination: true,
    enableSorting: true,
    enableFiltering: false,
    enableRowSelection: false,
    isLoading: false,
};

export const MinimalTable = Template.bind({});
MinimalTable.args = {
    ...defaultStoryArgs,
    totalRows: 100,
    pageSize: 50,
    enablePagination: false,
    enableSorting: false,
    enableFiltering: false,
    enableRowSelection: false,
    isLoading: false,
};

export const LoadingWithFeatures = Template.bind({});
LoadingWithFeatures.args = {
    ...defaultStoryArgs,
    totalRows: 300,
    pageSize: 20,
    enablePagination: true,
    enableSorting: true,
    enableFiltering: true,
    enableRowSelection: true,
    isLoading: true,
};
