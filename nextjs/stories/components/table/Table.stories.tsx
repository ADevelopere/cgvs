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
import {
    generatePersonData,
    generateProductData,
    generateOrderData,
    generateMixedData,
    createPersonColumns,
    createProductColumns,
    createOrderColumns,
    createMixedColumns,
} from "./mockData";
import { PaginationInfo } from "@/graphql/generated/types";
import { FilterClause } from "@/types/filters";
import { LoadMoreParams } from "@/types/table.type";

export default {
    title: "Components/Table/Table",
    component: Table,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        dataType: {
            control: { type: "select" },
            options: ["person", "product", "order", "mixed"],
            description: "Type of mock data to display",
        },
        rowCount: {
            control: { type: "number", min: 10, max: 1000, step: 10 },
            description: "Number of rows to generate",
        },
        rowSelectionEnabled: {
            control: "boolean",
            description: "Enable row selection with checkboxes",
        },
        enableRowResizing: {
            control: "boolean",
            description: "Enable row height resizing",
        },
        isLoading: {
            control: "boolean",
            description: "Show loading state",
        },
        containerHeight: {
            control: "text",
            description: "Height of the table container",
        },
        showPagination: {
            control: "boolean",
            description: "Enable pagination",
        },
        pageSize: {
            control: { type: "number", min: 5, max: 100 },
            description: "Initial page size",
        },
    },
} as Meta;

type TableStoryProps = {
    dataType: "person" | "product" | "order" | "mixed";
    rowCount: number;
    rowSelectionEnabled: boolean;
    enableRowResizing: boolean;
    isLoading: boolean;
    containerHeight: string;
    showPagination: boolean;
    pageSize: number;
} & CommonStoryArgTypesProps;

const TableTemplate: StoryFn<TableStoryProps> = (args: TableStoryProps) => {
    useStoryTheme(args);

    const {
        dataType,
        rowCount,
        rowSelectionEnabled,
        enableRowResizing,
        isLoading,
        containerHeight,
        showPagination,
        pageSize,
    } = args;

    // Generate data and columns based on type
    const { data, columns } = React.useMemo(() => {
        switch (dataType) {
            case "person":
                return {
                    data: generatePersonData(rowCount),
                    columns: createPersonColumns(),
                };
            case "product":
                return {
                    data: generateProductData(rowCount),
                    columns: createProductColumns(),
                };
            case "order":
                return {
                    data: generateOrderData(rowCount),
                    columns: createOrderColumns(),
                };
            case "mixed":
            default:
                return {
                    data: generateMixedData(rowCount),
                    columns: createMixedColumns(),
                };
        }
    }, [dataType, rowCount]);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    // Action handlers
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        action("pageChange")(newPage);
    };

    const handleRowsPerPageChange = (newPageSize: number) => {
        setCurrentPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page
        action("rowsPerPageChange")(newPageSize);
    };

    const handleFilterChange = (
        filterClause: FilterClause<unknown, unknown> | null,
        columnId: string,
    ) => {
        action("filterChange")(filterClause, columnId);
    };

    const handleSort = (
        orderByClause: { column: string; order: "ASC" | "DESC" }[],
    ) => {
        action("sort")(orderByClause);
    };

    const handleLoadMoreRows = async (params: LoadMoreParams) => {
        action("loadMoreRows")(params);
        // Simulate async loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const TableWithContexts = React.useMemo(() => {
        // Get paginated data if pagination is enabled
        const displayData = showPagination
            ? data.slice(
                  (currentPage - 1) * currentPageSize,
                  currentPage * currentPageSize,
              )
            : data;

        // Create pagination info if enabled
        const paginationInfo: PaginationInfo | null = showPagination
            ? {
                  currentPage,
                  perPage: currentPageSize,
                  total: data.length,
                  lastPage: Math.ceil(data.length / currentPageSize),
                  hasMorePages:
                      currentPage < Math.ceil(data.length / currentPageSize),
                  count: displayData.length,
                  firstItem:
                      displayData.length > 0
                          ? (currentPage - 1) * currentPageSize + 1
                          : null,
                  lastItem:
                      displayData.length > 0
                          ? Math.min(currentPage * currentPageSize, data.length)
                          : null,
              }
            : null;

        const tableConfig: TableDecoratorConfig = {
            data: displayData,
            columns,
            isLoading,
            paginationInfo,
            rowSelectionEnabled,
            enableRowResizing,
            containerHeight,
            onPageChange: handlePageChange,
            onRowsPerPageChange: handleRowsPerPageChange,
            onFilterChange: handleFilterChange,
            onSort: handleSort,
            onLoadMoreRows: handleLoadMoreRows,
            initialPageSize: currentPageSize,
        };

        const decorator = withTableContexts(tableConfig);

        // Create a proper React component that uses the decorator
        const TableComponent = () => decorator(() => <Table />, {});

        return TableComponent;
    }, [
        data,
        columns,
        isLoading,
        rowSelectionEnabled,
        enableRowResizing,
        containerHeight,
        showPagination,
        currentPage,
        currentPageSize,
    ]);

    return <TableWithContexts />;
};

export const Default = TableTemplate.bind({});
Default.args = {
    ...defaultStoryArgs,
    dataType: "person",
    rowCount: 50,
    rowSelectionEnabled: false,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "600px",
    showPagination: false,
    pageSize: 25,
};

export const WithRowSelection = TableTemplate.bind({});
WithRowSelection.args = {
    ...defaultStoryArgs,
    dataType: "person",
    rowCount: 30,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "600px",
    showPagination: false,
    pageSize: 25,
};

export const WithPagination = TableTemplate.bind({});
WithPagination.args = {
    ...defaultStoryArgs,
    dataType: "product",
    rowCount: 200,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "600px",
    showPagination: true,
    pageSize: 20,
};

export const LoadingState = TableTemplate.bind({});
LoadingState.args = {
    ...defaultStoryArgs,
    dataType: "order",
    rowCount: 25,
    rowSelectionEnabled: false,
    enableRowResizing: true,
    isLoading: true,
    containerHeight: "600px",
    showPagination: false,
    pageSize: 25,
};

export const LargeDataset = TableTemplate.bind({});
LargeDataset.args = {
    ...defaultStoryArgs,
    dataType: "mixed",
    rowCount: 500,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "800px",
    showPagination: true,
    pageSize: 50,
};

export const ProductCatalog = TableTemplate.bind({});
ProductCatalog.args = {
    ...defaultStoryArgs,
    dataType: "product",
    rowCount: 100,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "700px",
    showPagination: true,
    pageSize: 25,
};

export const OrderManagement = TableTemplate.bind({});
OrderManagement.args = {
    ...defaultStoryArgs,
    dataType: "order",
    rowCount: 150,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "600px",
    showPagination: true,
    pageSize: 30,
};

export const SmallDataset = TableTemplate.bind({});
SmallDataset.args = {
    ...defaultStoryArgs,
    dataType: "person",
    rowCount: 15,
    rowSelectionEnabled: false,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "400px",
    showPagination: false,
    pageSize: 25,
};

export const AllColumnTypes = TableTemplate.bind({});
AllColumnTypes.args = {
    ...defaultStoryArgs,
    dataType: "mixed",
    rowCount: 75,
    rowSelectionEnabled: true,
    enableRowResizing: true,
    isLoading: false,
    containerHeight: "650px",
    showPagination: true,
    pageSize: 25,
};
