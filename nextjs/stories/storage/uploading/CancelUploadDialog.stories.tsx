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
import CancelUploadDialog, {
    CancelUploadDialogProps,
} from "@/views/storage/uploading/CancelUploadDialog";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

export default {
    title: "Storage/Uploading/CancelUploadDialog",
    component: CancelUploadDialog,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        open: {
            control: "boolean",
            description: "If true, the dialog is open.",
        },
        cancelTarget: {
            control: "object",
            description: "The target of the cancel action.",
        },
        onConfirm: {
            action: "confirmed",
            description: "Callback when the confirm button is clicked.",
        },
        onCancel: {
            action: "cancelled",
            description: "Callback when the cancel button is clicked.",
        },
    },
} as Meta;

type CancelUploadDialogStoryProps = CancelUploadDialogProps &
    CommonStoryArgTypesProps;

const Template: StoryFn<CancelUploadDialogStoryProps> = (args) => {
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
                <CancelUploadDialog {...args} />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const CancelSingle = Template.bind({});
CancelSingle.args = {
    ...defaultStoryArgs,
    open: true,
    cancelTarget: { type: "file", fileKey: "file-1", fileName: "document.pdf" },
};

export const CancelAll = Template.bind({});
CancelAll.args = {
    ...defaultStoryArgs,
    open: true,
    cancelTarget: { type: "all" },
};
