import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { Box, Card, Portal, useTheme } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import withGlobalStyles from "@/stories/Decorators";
import useStoryTheme from "@/stories/useStoryTheme";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import { UploadBatchState } from "@/contexts/storage/StorageUploadContext";
import UploadProgressHeader from "@/views/storage/uploading/UploadProgressHeader";
import UploadProgressSummary from "@/views/storage/uploading/UploadProgressSummary";
import UploadProgressFileList from "@/views/storage/uploading/UploadProgressFileList";
import CancelUploadDialog from "@/views/storage/uploading/CancelUploadDialog";
import { MockStorageUploadProvider, MockUploadProgressUIProvider, useMockUploadProgressUI } from "./MockUploadProgressUIProvider";

const MockedUploadProgress: React.FC = () => {
    const theme = useTheme();
    const {
        totalCount,
        timeRemaining,
        files,
        isCollapsed,
        showCancelDialog,
        cancelTarget,
        onToggleCollapse,
        onClose,
        onCancelAll,
        onCancelFile,
        onConfirmCancel,
        onDismissDialog,
    } = useMockUploadProgressUI();

    if (totalCount === 0) {
        return null;
    }

    return (
        <Portal>
            <Box
                sx={{
                    position: "fixed",
                    bottom: theme.spacing(3),
                    right: theme.spacing(3),
                    zIndex: theme.zIndex.snackbar,
                    maxWidth: "400px",
                    minWidth: "320px",
                }}
            >
                <Card
                    elevation={8}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1),
                        overflow: "hidden",
                        boxShadow: theme.shadows[8],
                    }}
                >
                    <UploadProgressHeader
                        totalCount={totalCount}
                        isCollapsed={isCollapsed}
                        onToggleCollapse={onToggleCollapse}
                        onClose={onClose}
                    />
                    <UploadProgressSummary
                        timeRemaining={timeRemaining}
                        isCollapsed={isCollapsed}
                        onCancelAll={onCancelAll}
                    />
                    <UploadProgressFileList
                        files={files}
                        isCollapsed={isCollapsed}
                        onCancelFile={onCancelFile}
                    />
                </Card>
            </Box>
            <CancelUploadDialog
                open={showCancelDialog}
                cancelTarget={cancelTarget}
                onConfirm={onConfirmCancel}
                onCancel={onDismissDialog}
            />
        </Portal>
    );
};

// --- Storybook Definition ---

export default {
    title: "Storage/Uploading/UploadProgress",
    component: MockedUploadProgress,
    decorators: [
        withGlobalStyles,
        (Story, { args }) => (
            <MockStorageUploadProvider initialBatchState={args.uploadBatch}>
                <MockUploadProgressUIProvider>
                    <Story />
                </MockUploadProgressUIProvider>
            </MockStorageUploadProvider>
        ),
    ],
    argTypes: {
        ...commonStoryArgTypes,
        uploadBatch: {
            control: "object",
            description: "The initial state of the upload batch.",
        },
    },
} as Meta;

type UploadProgressStoryProps = CommonStoryArgTypesProps & {
    uploadBatch?: UploadBatchState;
};

const Template: StoryFn<UploadProgressStoryProps> = (args) => {
    useStoryTheme(args);
    return (
        <AppRouterCacheProvider>
            <Box sx={{ height: "300px", position: "relative" }}>
                <MockedUploadProgress />
            </Box>
        </AppRouterCacheProvider>
    );
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
    uploadBatch: undefined,
};

const file1 = new File(["content"], "document.pdf", {
    type: "application/pdf",
});
const file2 = new File(["content2"], "presentation.pptx", {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
});
const file3 = new File([""], "archive.zip", { type: "application/zip" });
const file4 = new File([""], "image.jpg", { type: "image/jpeg" });

const sampleFiles = new Map();
sampleFiles.set("file-1", { file: file1, progress: 65, status: "uploading" });
sampleFiles.set("file-2", { file: file2, progress: 100, status: "success" });
sampleFiles.set("file-3", {
    file: file3,
    progress: 40,
    status: "error",
    error: "Upload failed: Network error",
});
sampleFiles.set("file-4", { file: file4, progress: 0, status: "pending" });

export const WithFiles = Template.bind({});
WithFiles.args = {
    ...defaultStoryArgs,
    uploadBatch: {
        files: sampleFiles,
        location: "TEMPLATE_COVER",
        targetPath: "templates/",
        isUploading: true,
        completedCount: 1,
        totalCount: 4,
        totalProgress: 51,
        timeRemaining: 120,
        totalSize: 4000,
        bytesUploaded: 2050,
    },
};
