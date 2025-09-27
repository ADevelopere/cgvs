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
import { FilterClause } from "@/types/filters";

export default {
    title: "Components/Table/Filtering",
    component: Table,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        rowCount: {
            control: { type: "number", min: 20, max: 200 },
            description: "Number of rows to generate",
        },
        enableFiltering: {
            control: "boolean",
            description: "Enable column filtering",
        },
    },
} as Meta;

type FilteringStoryProps = {
    rowCount: number;
    enableFiltering: boolean;
} & CommonStoryArgTypesProps;

const Template: StoryFn<FilteringStoryProps> = (args: FilteringStoryProps) => {
    useStoryTheme(args);

    const { rowCount, enableFiltering } = args;

    const [filters, setFilters] = useState<
        Record<string, FilterClause<unknown, unknown> | null>
    >({});

    const data = React.useMemo(() => generateMixedData(rowCount), [rowCount]);
    const columns = React.useMemo(
        () =>
            createMixedColumns().map((col) => ({
                ...col,
                filterable: enableFiltering,
            })),
        [enableFiltering],
    );

    // Simple client-side filtering for demo purposes
    const filteredData = React.useMemo(() => {
        if (!enableFiltering) return data;

        return data.filter((row) => {
            return Object.entries(filters).every(([columnId, filter]) => {
                if (!filter) return true;

                const column = columns.find((col) => col.id === columnId);
                if (!column) return true;

                const cellValue =
                    typeof column.accessor === "function"
                        ? column.accessor(row)
                        : row[column.accessor];

                if (cellValue == null) return false;

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
            });
        });
    }, [data, filters, columns, enableFiltering]);

    const handleFilterChange = React.useCallback(
        (
            filterClause: FilterClause<unknown, unknown> | null,
            columnId: string,
        ) => {
            setFilters((prev) => ({
                ...prev,
                [columnId]: filterClause,
            }));
            action("filterChange")(filterClause, columnId);
        },
        [],
    );

    const TableWithContexts = React.useMemo(() => {
        const tableConfig: TableDecoratorConfig = {
            data: filteredData,
            columns,
            isLoading: false,
            rowSelectionEnabled: true,
            containerHeight: "700px",
            onFilterChange: handleFilterChange,
            onSort: action("sort"),
        };

        const decorator = withTableContexts(tableConfig);
        const Component = () => decorator(() => <Table />, {});
        return Component;
    }, [filteredData, columns, handleFilterChange]);

    return <TableWithContexts />;
};

export const WithFiltering = Template.bind({});
WithFiltering.args = {
    ...defaultStoryArgs,
    rowCount: 100,
    enableFiltering: true,
};

export const WithoutFiltering = Template.bind({});
WithoutFiltering.args = {
    ...defaultStoryArgs,
    rowCount: 100,
    enableFiltering: false,
};

export const SmallDatasetWithFiltering = Template.bind({});
SmallDatasetWithFiltering.args = {
    ...defaultStoryArgs,
    rowCount: 50,
    enableFiltering: true,
};
