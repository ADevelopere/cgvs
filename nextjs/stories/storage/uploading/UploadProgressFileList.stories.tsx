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
import UploadProgressFileList, {
    UploadProgressFileListProps,
} from "@/views/storage/uploading/UploadProgressFileList";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/UploadProgressFileList",
    component: UploadProgressFileList,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        files: {
            control: "object",
            description: "List of files to display.",
        },
        isCollapsed: {
            control: "boolean",
            description: "If true, the file list is collapsed.",
        },
        onCancelFile: {
            action: "cancelled",
            description: "Callback when the cancel button is clicked for a file.",
        },
    },
} as Meta;

type UploadProgressFileListStoryProps = UploadProgressFileListProps &
    CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressFileListStoryProps> = (args) => {
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
                <UploadProgressFileList {...args} />
            </Box>
        </AppRouterCacheProvider>
    );
};

const sampleFiles = [
    {
        fileKey: "file-1",
        fileName: "document.pdf",
        fileType: "document",
        progress: 65,
        status: "uploading",
    },
    {
        fileKey: "file-2",
        fileName: "presentation.pptx",
        fileType: "presentation",
        progress: 100,
        status: "success",
    },
    {
        fileKey: "file-3",
        fileName: "archive.zip",
        fileType: "archive",
        progress: 40,
        status: "error",
        error: "Upload failed: Network error",
    },
    {
        fileKey: "file-4",
        fileName: "image.jpg",
        fileType: "image",
        progress: 0,
        status: "pending",
    },
];

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    files: sampleFiles,
    isCollapsed: false,
};

export const Collapsed = Template.bind({});
Collapsed.args = {
    ...defaultStoryArgs,
    files: sampleFiles,
    isCollapsed: true,
};

export const Empty = Template.bind({});
Empty.args = {
    ...defaultStoryArgs,
    files: [],
    isCollapsed: false,
};
