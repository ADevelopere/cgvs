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
import UploadProgressFileItem, {
    UploadProgressFileItemProps,
} from "@/views/storage/uploading/UploadProgressFileItem";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/UploadProgressFileItem",
    component: UploadProgressFileItem,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        fileKey: {
            control: "text",
            description: "Unique key for the file.",
        },
        fileName: {
            control: "text",
            description: "Name of the file.",
        },
        fileType: {
            control: "select",
            options: [
                "image",
                "document",
                "spreadsheet",
                "presentation",
                "archive",
                "code",
                "video",
                "audio",
                "file",
            ],
            description: "Type of the file to determine the icon.",
        },
        progress: {
            control: { type: "range", min: 0, max: 100, step: 1 },
            description: "Upload progress percentage.",
        },
        status: {
            control: "select",
            options: ["pending", "uploading", "success", "error"],
            description: "Upload status of the file.",
        },
        error: {
            control: "text",
            description: "Error message to display when status is 'error'.",
        },
        onCancel: {
            action: "cancelled",
            description: "Callback when the cancel button is clicked.",
        },
    },
} as Meta;

type UploadProgressFileItemStoryProps = UploadProgressFileItemProps &
    CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressFileItemStoryProps> = (args) => {
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
                <UploadProgressFileItem {...args} />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const Uploading = Template.bind({});
Uploading.args = {
    ...defaultStoryArgs,
    fileKey: "file-1",
    fileName: "document_with_a_very_long_name_to_check_truncation.pdf",
    fileType: "document",
    progress: 65,
    status: "uploading",
};

export const Success = Template.bind({});
Success.args = {
    ...defaultStoryArgs,
    fileKey: "file-2",
    fileName: "presentation.pptx",
    fileType: "presentation",
    progress: 100,
    status: "success",
};

export const ErrorState = Template.bind({});
ErrorState.args = {
    ...defaultStoryArgs,
    fileKey: "file-3",
    fileName: "archive.zip",
    fileType: "archive",
    progress: 40,
    status: "error",
    error: "Upload failed: Network error",
};


export const Pending = Template.bind({});
Pending.args = {
    ...defaultStoryArgs,
    fileKey: "file-4",
    fileName: "image.jpg",
    fileType: "image",
    progress: 0,
    status: "pending",
};