import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { Box } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import withGlobalStyles from "@/stories/Decorators";
import useStoryTheme from "@/stories/useStoryTheme";
import UploadProgressHeader, {
    UploadProgressHeaderProps,
} from "@/views/storage/uploading/UploadProgressHeader";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/UploadProgressHeader",
    component: UploadProgressHeader,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        totalCount: {
            control: "number",
            description: "Total number of files being uploaded.",
        },
        isCollapsed: {
            control: "boolean",
            description: "If true, the header is in a collapsed state.",
        },
        onToggleCollapse: {
            action: "toggled",
            description: "Callback when the toggle collapse button is clicked.",
        },
        onClose: {
            action: "closed",
            description: "Callback when the close button is clicked.",
        },
    },
} as Meta;

type UploadProgressHeaderStoryProps = UploadProgressHeaderProps &
    CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressHeaderStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 2,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                }}
            >
                <UploadProgressHeader {...args} />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    totalCount: 5,
    isCollapsed: false,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
    ...defaultStoryArgs,
    totalCount: 5,
    isCollapsed: true,
};

export const SingleItem = Template.bind({});
SingleItem.args = {
    ...defaultStoryArgs,
    totalCount: 1,
    isCollapsed: false,
};

export const NoItems = Template.bind({});
NoItems.args = {
    ...defaultStoryArgs,
    totalCount: 0,
    isCollapsed: false,
};
