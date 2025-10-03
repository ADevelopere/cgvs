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

import Table from "@/client/components/Table/Table/Table";
import withTableContexts, { TableDecoratorConfig } from "./tableDecorator";
import { generatePersonData, createPersonColumns } from "./mockData";
import { SortDirection } from "@/graphql/generated/types";

export default {
    title: "Components/Table/Sorting",
    component: Table,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        rowCount: {
            control: { type: "number", min: 20, max: 200 },
            description: "Number of rows to generate",
        },
        enableSorting: {
            control: "boolean",
            description: "Enable column sorting",
        },
        multiSort: {
            control: "boolean",
            description: "Enable multi-column sorting",
        },
    },
} as Meta;

type SortingStoryProps = {
    rowCount: number;
    enableSorting: boolean;
    multiSort: boolean;
} & CommonStoryArgTypesProps;

const Template: StoryFn<SortingStoryProps> = (args: SortingStoryProps) => {
    useStoryTheme(args);

    const { rowCount, enableSorting, multiSort } = args;

    const [sortOrder, setSortOrder] = useState<
        { column: string; order: SortDirection }[]
    >([]);

    const baseData = React.useMemo(
        () => generatePersonData(rowCount),
        [rowCount],
    );
    const columns = React.useMemo(
        () =>
            createPersonColumns().map((col) => ({
                ...col,
                sortable: enableSorting,
            })),
        [enableSorting],
    );

    // Simple client-side sorting for demo purposes
    const sortedData = React.useMemo(() => {
        if (!enableSorting || sortOrder.length === 0) return baseData;

        return [...baseData].sort((a, b) => {
            for (const { column, order } of sortOrder) {
                const columnDef = columns.find((col) => col.id === column);
                if (!columnDef) continue;

                const aValue =
                    typeof columnDef.accessor === "function"
                        ? columnDef.accessor(a)
                        : a[columnDef.accessor];
                const bValue =
                    typeof columnDef.accessor === "function"
                        ? columnDef.accessor(b)
                        : b[columnDef.accessor];

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
    }, [baseData, sortOrder, columns, enableSorting]);

    const handleSort = React.useCallback(
        (orderByClause: { column: string; order: SortDirection }[]) => {
            if (!multiSort && orderByClause.length > 1) {
                // Keep only the last sort if multi-sort is disabled
                setSortOrder([orderByClause[orderByClause.length - 1]]);
            } else {
                setSortOrder(orderByClause);
            }
            action("sort")(orderByClause);
        },
        [multiSort],
    );

    const TableWithContexts = React.useMemo(() => {
        const tableConfig: TableDecoratorConfig = {
            data: sortedData,
            columns,
            isLoading: false,
            rowSelectionEnabled: true,
            containerHeight: "700px",
            onSort: handleSort,
            onFilterChange: action("filterChange"),
        };

        const decorator = withTableContexts(tableConfig);
        const Component = () => decorator(() => <Table />, {});
        return Component;
    }, [sortedData, columns, handleSort]);

    return (
        <div>
            {enableSorting && sortOrder.length > 0 && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: 8,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 4,
                    }}
                >
                    <strong>Current Sort Order:</strong>
                    {sortOrder.map(({ column, order }, index) => (
                        <span key={column} style={{ marginLeft: 8 }}>
                            {index > 0 && " → "}
                            {columns.find((col) => col.id === column)?.label} (
                            {order})
                        </span>
                    ))}
                </div>
            )}
            <TableWithContexts />
        </div>
    );
};

export const WithSorting = Template.bind({});
WithSorting.args = {
    ...defaultStoryArgs,
    rowCount: 100,
    enableSorting: true,
    multiSort: false,
};

export const MultiColumnSorting = Template.bind({});
MultiColumnSorting.args = {
    ...defaultStoryArgs,
    rowCount: 100,
    enableSorting: true,
    multiSort: true,
};

export const WithoutSorting = Template.bind({});
WithoutSorting.args = {
    ...defaultStoryArgs,
    rowCount: 100,
    enableSorting: false,
    multiSort: false,
};

export const LargeDatasetSorting = Template.bind({});
LargeDatasetSorting.args = {
    ...defaultStoryArgs,
    rowCount: 200,
    enableSorting: true,
    multiSort: true,
};
