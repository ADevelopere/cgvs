import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";

import withGlobalStyles from "@/client/stories/Decorators";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/client/stories/argTypes";
import useStoryTheme from "@/client/stories/useStoryTheme";

import Table from "@/client/components/Table/Table/Table";
import withTableContexts, { TableDecoratorConfig } from "./tableDecorator";
import { generateOrderData, createOrderColumns } from "./mockData";
import { PaginationInfo } from "@/graphql/generated/types";

export default {
    title: "Components/Table/Pagination",
    component: Table,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        totalRows: {
            control: { type: "number", min: 50, max: 1000 },
            description: "Total number of rows in dataset",
        },
        pageSize: {
            control: { type: "number", min: 5, max: 100 },
            description: "Number of rows per page",
        },
        showPagination: {
            control: "boolean",
            description: "Enable pagination",
        },
    },
} as Meta;

type PaginationStoryProps = {
    totalRows: number;
    pageSize: number;
    showPagination: boolean;
} & CommonStoryArgTypesProps;

const Template: StoryFn<PaginationStoryProps> = (
    args: PaginationStoryProps,
) => {
    useStoryTheme(args);

    const { totalRows, pageSize, showPagination } = args;

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    const allData = React.useMemo(
        () => generateOrderData(totalRows),
        [totalRows],
    );
    const columns = React.useMemo(() => createOrderColumns(), []);

    // Get current page data
    const currentData = React.useMemo(() => {
        if (!showPagination) return allData;

        const startIndex = (currentPage - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;
        return allData.slice(startIndex, endIndex);
    }, [allData, currentPage, currentPageSize, showPagination]);

    // Create pagination info
    const paginationInfo: PaginationInfo | null = React.useMemo(() => {
        if (!showPagination) return null;
        return {
            currentPage,
            perPage: currentPageSize,
            total: totalRows,
            lastPage: Math.ceil(totalRows / currentPageSize),
            hasMorePages: currentPage < Math.ceil(totalRows / currentPageSize),
            count: currentData.length,
            firstItem:
                currentData.length > 0
                    ? (currentPage - 1) * currentPageSize + 1
                    : null,
            lastItem:
                currentData.length > 0
                    ? Math.min(currentPage * currentPageSize, totalRows)
                    : null,
        };
    }, [
        showPagination,
        currentPage,
        currentPageSize,
        totalRows,
        currentData.length,
    ]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        action("pageChange")(newPage);
    };

    const handleRowsPerPageChange = (newPageSize: number) => {
        setCurrentPageSize(newPageSize);
        setCurrentPage(1);
        action("rowsPerPageChange")(newPageSize);
    };

    const TableWithContexts = React.useMemo(() => {
        const tableConfig: TableDecoratorConfig = {
            data: currentData,
            columns,
            isLoading: false,
            paginationInfo,
            rowSelectionEnabled: true,
            containerHeight: "700px",
            onPageChange: handlePageChange,
            onRowsPerPageChange: handleRowsPerPageChange,
            onFilterChange: action("filterChange"),
            onSort: action("sort"),
            rowsPerPageOptions: [5, 10, 25, 50, 100],
            initialPageSize: currentPageSize,
        };

        const decorator = withTableContexts(tableConfig);
        const Component = () => decorator(() => <Table />, {});
        return Component;
    }, [currentData, columns, paginationInfo, currentPageSize]);

    return <TableWithContexts />;
};

export const WithPagination = Template.bind({});
WithPagination.args = {
    ...defaultStoryArgs,
    totalRows: 500,
    pageSize: 25,
    showPagination: true,
};

export const LargePagination = Template.bind({});
LargePagination.args = {
    ...defaultStoryArgs,
    totalRows: 1000,
    pageSize: 50,
    showPagination: true,
};

export const SmallPageSize = Template.bind({});
SmallPageSize.args = {
    ...defaultStoryArgs,
    totalRows: 200,
    pageSize: 10,
    showPagination: true,
};

export const WithoutPagination = Template.bind({});
WithoutPagination.args = {
    ...defaultStoryArgs,
    totalRows: 100,
    pageSize: 25,
    showPagination: false,
};
