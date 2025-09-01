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
import UploadProgressSummary, {
    UploadProgressSummaryProps,
} from "@/views/storage/uploading/UploadProgressSummary";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/UploadProgressSummary",
    component: UploadProgressSummary,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        timeRemaining: {
            control: "number",
            description: "Estimated time remaining for all uploads in seconds.",
        },
        isCollapsed: {
            control: "boolean",
            description: "If true, the summary is collapsed.",
        },
        onCancelAll: {
            action: "cancelled all",
            description: "Callback when the cancel all button is clicked.",
        },
    },
} as Meta;

type UploadProgressSummaryStoryProps = UploadProgressSummaryProps &
    CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressSummaryStoryProps> = (args) => {
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
                <UploadProgressSummary {...args} />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    timeRemaining: 125,
    isCollapsed: false,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
    ...defaultStoryArgs,
    timeRemaining: 125,
    isCollapsed: true,
};

export const LongTimeRemaining = Template.bind({});
LongTimeRemaining.args = {
    ...defaultStoryArgs,
    timeRemaining: 86400,
    isCollapsed: false,
};

export const NoTimeRemaining = Template.bind({});
NoTimeRemaining.args = {
    ...defaultStoryArgs,
    timeRemaining: 0,
    isCollapsed: false,
};
