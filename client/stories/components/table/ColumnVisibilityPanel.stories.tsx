import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";

import withGlobalStyles from "@/client/stories/Decorators";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/client/stories/argTypes";
import useStoryTheme from "@/client/stories/useStoryTheme";

import ColumnVisibilityPanel from "@/client/components/Table/Table/ColumnVisibilityPanel";
import withTableContexts, { TableDecoratorConfig } from "./tableDecorator";
import { generatePersonData, createPersonColumns } from "./mockData";

export default {
    title: "Components/Table/ColumnVisibilityPanel",
    component: ColumnVisibilityPanel,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        rowCount: {
            control: { type: "number", min: 10, max: 100 },
            description: "Number of rows to generate",
        },
    },
} as Meta;

type ColumnVisibilityStoryProps = {
    rowCount: number;
} & CommonStoryArgTypesProps;

const Template: StoryFn<ColumnVisibilityStoryProps> = (
    args: ColumnVisibilityStoryProps,
) => {
    useStoryTheme(args);

    const { rowCount } = args;

    const data = React.useMemo(() => generatePersonData(rowCount), [rowCount]);
    const columns = React.useMemo(() => createPersonColumns(), []);

    const TableWithContexts = React.useMemo(() => {
        const tableConfig: TableDecoratorConfig = {
            data,
            columns,
            isLoading: false,
            rowSelectionEnabled: false,
            containerHeight: "600px",
            onFilterChange: action("filterChange"),
            onSort: action("sort"),
        };

        const decorator = withTableContexts(tableConfig);
        const Component = () =>
            decorator(
                () => <ColumnVisibilityPanel onClose={action("close")} />,
                {},
            );
        return Component;
    }, [data, columns]);

    return <TableWithContexts />;
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    rowCount: 50,
};
