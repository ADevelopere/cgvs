import React, { useEffect } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import { Box, Button } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import withGlobalStyles from "@/stories/Decorators";
import useStoryTheme from "@/stories/useStoryTheme";
import UploadProgress from "@/views/storage/uploading/UploadProgress";
import {
    UploadProgressUIProvider,
    useUploadProgressUI,
} from "@/views/storage/uploading/UploadProgressUIContext";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";

const UploadSimulator: React.FC = () => {
    const { addFile, updateFileProgress, completeFile, errorFile } = useUploadProgressUI();

    const startSimulation = () => {
        const file1 = { fileKey: "file-1", fileName: "document.pdf", fileType: "document" };
        const file2 = { fileKey: "file-2", fileName: "image.jpg", fileType: "image" };
        const file3 = { fileKey: "file-3", fileName: "archive.zip", fileType: "archive" };

        addFile(file1.fileKey, file1.fileName, file1.fileType);
        addFile(file2.fileKey, file2.fileName, file2.fileType);
        addFile(file3.fileKey, file3.fileName, file3.fileType);

        // Simulate progress for file 1
        const interval1 = setInterval(() => {
            updateFileProgress(file1.fileKey, (p) => {
                const newProgress = p + 10;
                if (newProgress >= 100) {
                    clearInterval(interval1);
                    completeFile(file1.fileKey);
                }
                return newProgress;
            });
        }, 500);

        // Simulate progress for file 2
        const interval2 = setInterval(() => {
            updateFileProgress(file2.fileKey, (p) => {
                const newProgress = p + 5;
                if (newProgress >= 70) {
                    clearInterval(interval2);
                    errorFile(file2.fileKey, "Network error");
                }
                return newProgress;
            });
        }, 300);
    };

    return (
        <Box>
            <Button variant="contained" onClick={startSimulation}>
                Start Upload Simulation
            </Button>
            <UploadProgress />
        </Box>
    );
};

export default {
    title: "Storage/Uploading/UploadProgress In Action",
    component: UploadSimulator,
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

type UploadProgressInActionStoryProps = CommonStoryArgTypesProps;

const Template: StoryFn<UploadProgressInActionStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <UploadSimulator />
        </AppRouterCacheProvider>
    );
};

export const InAction = Template.bind({});
InAction.args = {
    ...defaultStoryArgs,
};
