import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import * as Graphql from "@/graphql/generated/types";
import {
    MockStorageProvider,
    createMockStorageStats,
    createMockFileItem,
    createMockFolderItem,
} from "../MockStorageProvider";
import StorageStatsBar from "@/views/storage/components/StorageStatsBar";

type StorageStatsBarStoryProps = CommonStoryArgTypesProps & {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    currentFiles: number;
    currentFolders: number;
    imageFiles: number;
    documentFiles: number;
    videoFiles: number;
    audioFiles: number;
    archiveFiles: number;
    otherFiles: number;
};

const MockStorageStatsBarWrapper: React.FC<{
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    currentFiles: number;
    currentFolders: number;
    imageFiles: number;
    documentFiles: number;
    videoFiles: number;
    audioFiles: number;
    archiveFiles: number;
    otherFiles: number;
}> = ({
    totalFiles,
    totalFolders,
    totalSize,
    currentFiles,
    currentFolders,
    imageFiles,
    documentFiles,
    videoFiles,
    audioFiles,
    archiveFiles,
    otherFiles,
}) => {
    // Create mock items for current directory
    const mockItems = [
        ...Array.from({ length: currentFolders }, (_, i) =>
            createMockFolderItem({
                name: `Folder ${i + 1}`,
                path: `current/folder-${i + 1}`,
            }),
        ),
        ...Array.from({ length: currentFiles }, (_, i) => {
            const fileTypes: Graphql.FileType[] = [
                ...Array(imageFiles).fill("IMAGE"),
                ...Array(documentFiles).fill("DOCUMENT"),
                ...Array(videoFiles).fill("VIDEO"),
                ...Array(audioFiles).fill("AUDIO"),
                ...Array(archiveFiles).fill("ARCHIVE"),
                ...Array(otherFiles).fill("OTHER"),
            ];
            const fileType = fileTypes[i % fileTypes.length] || "OTHER";
            return createMockFileItem({
                name: `file-${i + 1}.ext`,
                path: `current/file-${i + 1}.ext`,
                fileType,
            });
        }),
    ];

    const mockStats = createMockStorageStats({
        totalFiles,
        totalFolders,
        totalSize,
        fileTypeBreakdown: [
            {
                __typename: "FileTypeCount" as const,
                type: "IMAGE" as Graphql.FileType,
                count: imageFiles,
            },
            {
                __typename: "FileTypeCount" as const,
                type: "DOCUMENT" as Graphql.FileType,
                count: documentFiles,
            },
            {
                __typename: "FileTypeCount" as const,
                type: "VIDEO" as Graphql.FileType,
                count: videoFiles,
            },
            {
                __typename: "FileTypeCount" as const,
                type: "AUDIO" as Graphql.FileType,
                count: audioFiles,
            },
            {
                __typename: "FileTypeCount" as const,
                type: "ARCHIVE" as Graphql.FileType,
                count: archiveFiles,
            },
            {
                __typename: "FileTypeCount" as const,
                type: "OTHER" as Graphql.FileType,
                count: otherFiles,
            },
        ].filter((item) => item.count > 0),
    });

    const mockContextValue = {
        items: mockItems,
        stats: mockStats,
        loading: false,
        error: undefined,
    };

    return (
        <MockStorageProvider mockValue={mockContextValue}>
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "background.default",
                    color: "text.primary",
                    p: 3,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Storage Statistics
                </Typography>

                <StorageStatsBar />

                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: "action.hover",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Configuration:
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Total:</strong> {totalFiles} files,{" "}
                        {totalFolders} folders,{" "}
                        {(totalSize / (1024 * 1024)).toFixed(1)} MB
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Current Directory:</strong> {currentFiles}{" "}
                        files, {currentFolders} folders
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>File Types:</strong> Images({imageFiles}),
                        Documents({documentFiles}), Videos({videoFiles}), Audio(
                        {audioFiles}), Archives({archiveFiles}), Other(
                        {otherFiles})
                    </Typography>
                </Box>
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/StorageStatsBar",
    component: MockStorageStatsBarWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        totalFiles: {
            control: { type: "number", min: 0, max: 10000 },
            description: "Total number of files across all storage",
            table: {
                category: "Total Stats",
                order: 1,
            },
        },
        totalFolders: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Total number of folders across all storage",
            table: {
                category: "Total Stats",
                order: 2,
            },
        },
        totalSize: {
            control: { type: "number", min: 0, max: 10000000000 },
            description: "Total storage size in bytes",
            table: {
                category: "Total Stats",
                order: 3,
            },
        },
        currentFiles: {
            control: { type: "number", min: 0, max: 100 },
            description: "Number of files in current directory",
            table: {
                category: "Current Directory",
                order: 1,
            },
        },
        currentFolders: {
            control: { type: "number", min: 0, max: 50 },
            description: "Number of folders in current directory",
            table: {
                category: "Current Directory",
                order: 2,
            },
        },
        imageFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of image files",
            table: {
                category: "File Types",
                order: 1,
            },
        },
        documentFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of document files",
            table: {
                category: "File Types",
                order: 2,
            },
        },
        videoFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of video files",
            table: {
                category: "File Types",
                order: 3,
            },
        },
        audioFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of audio files",
            table: {
                category: "File Types",
                order: 4,
            },
        },
        archiveFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of archive files",
            table: {
                category: "File Types",
                order: 5,
            },
        },
        otherFiles: {
            control: { type: "number", min: 0, max: 1000 },
            description: "Number of other type files",
            table: {
                category: "File Types",
                order: 6,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays storage statistics including total usage, current directory counts, and file type breakdown.",
            },
        },
    },
} as Meta;

const Template: StoryFn<StorageStatsBarStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockStorageStatsBarWrapper
                totalFiles={args.totalFiles}
                totalFolders={args.totalFolders}
                totalSize={args.totalSize}
                currentFiles={args.currentFiles}
                currentFolders={args.currentFolders}
                imageFiles={args.imageFiles}
                documentFiles={args.documentFiles}
                videoFiles={args.videoFiles}
                audioFiles={args.audioFiles}
                archiveFiles={args.archiveFiles}
                otherFiles={args.otherFiles}
            />
        </AppRouterCacheProvider>
    );
};

export const Typical = Template.bind({});
Typical.args = {
    ...defaultStoryArgs,
    totalFiles: 1247,
    totalFolders: 28,
    totalSize: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
    currentFiles: 12,
    currentFolders: 3,
    imageFiles: 850,
    documentFiles: 180,
    videoFiles: 45,
    audioFiles: 32,
    archiveFiles: 15,
    otherFiles: 125,
};

export const Empty = Template.bind({});
Empty.args = {
    ...defaultStoryArgs,
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
    currentFiles: 0,
    currentFolders: 0,
    imageFiles: 0,
    documentFiles: 0,
    videoFiles: 0,
    audioFiles: 0,
    archiveFiles: 0,
    otherFiles: 0,
};

export const ImagesOnly = Template.bind({});
ImagesOnly.args = {
    ...defaultStoryArgs,
    totalFiles: 500,
    totalFolders: 10,
    totalSize: 800 * 1024 * 1024, // 800 MB
    currentFiles: 25,
    currentFolders: 2,
    imageFiles: 500,
    documentFiles: 0,
    videoFiles: 0,
    audioFiles: 0,
    archiveFiles: 0,
    otherFiles: 0,
};

export const LargeStorage = Template.bind({});
LargeStorage.args = {
    ...defaultStoryArgs,
    totalFiles: 50000,
    totalFolders: 1500,
    totalSize: 500 * 1024 * 1024 * 1024, // 500 GB
    currentFiles: 150,
    currentFolders: 25,
    imageFiles: 30000,
    documentFiles: 12000,
    videoFiles: 5000,
    audioFiles: 2500,
    archiveFiles: 300,
    otherFiles: 200,
};

export const SingleFileType = Template.bind({});
SingleFileType.args = {
    ...defaultStoryArgs,
    totalFiles: 100,
    totalFolders: 5,
    totalSize: 50 * 1024 * 1024, // 50 MB
    currentFiles: 8,
    currentFolders: 1,
    imageFiles: 0,
    documentFiles: 100,
    videoFiles: 0,
    audioFiles: 0,
    archiveFiles: 0,
    otherFiles: 0,
};

export const ManyFileTypes = Template.bind({});
ManyFileTypes.args = {
    ...defaultStoryArgs,
    totalFiles: 1000,
    totalFolders: 50,
    totalSize: 5 * 1024 * 1024 * 1024, // 5 GB
    currentFiles: 35,
    currentFolders: 8,
    imageFiles: 200,
    documentFiles: 200,
    videoFiles: 200,
    audioFiles: 200,
    archiveFiles: 100,
    otherFiles: 100,
};
