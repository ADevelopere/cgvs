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
import UploadProgress from "@/views/storage/uploading/UploadProgress";
import { UploadProgressUIProvider } from "@/views/storage/uploading/UploadProgressUIContext";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/UploadProgress",
    component: UploadProgress,
    decorators: [
        withGlobalStyles,
        (Story) => (
            <UploadProgressUIProvider>
                <Story />
            </UploadProgressUIProvider>
        ),
    ],
    argTypes: {
        ...commonStoryArgTypes,
    },
} as Meta;

type UploadProgressStoryProps = CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <Box sx={{ height: "200px" }}>
                <UploadProgress />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
};
