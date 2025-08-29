import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Alert } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import * as Graphql from "@/graphql/generated/types";
import {
    createMockStorageStats,
    createMockFileItem,
    createMockFolderItem,
} from "../MockStorageProvider";
import StorageStatsBar, {
    StorageStatsBarProps,
} from "@/views/storage/components/StorageStatsBar";

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
    showStats: boolean;
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
    showStats: boolean;
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
    showStats,
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
            ];
            const fileType = fileTypes[i % fileTypes.length] || "OTHER";
            return createMockFileItem({
                name: `file-${i + 1}.ext`,
                path: `current/file-${i + 1}.ext`,
                fileType,
            });
        }),
    ];

    const mockStats = showStats
        ? createMockStorageStats({
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
              ].filter((item) => item.count > 0),
          })
        : undefined;

    const storageStatsBarProps: StorageStatsBarProps = {
        stats: mockStats,
        items: mockItems,
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                color: "text.primary",
                p: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Storage Statistics Demo
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Testing storage statistics display with different data
                scenarios.
            </Typography>

            {/* Config Info */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Current Configuration:</strong>
                    <br />• Total Storage: {totalFiles} files, {totalFolders}{" "}
                    folders, {(totalSize / (1024 * 1024)).toFixed(1)} MB
                    <br />• Current Directory: {currentFiles} files,{" "}
                    {currentFolders} folders
                    <br />• File Types: Images({imageFiles}), Documents(
                    {documentFiles}), Videos({videoFiles}), Audio({audioFiles})
                    <br />• Stats Available:{" "}
                    {showStats ? "Yes" : "No (undefined stats)"}
                </Typography>
            </Alert>

            {/* The StorageStatsBar component */}
            <StorageStatsBar {...storageStatsBarProps} />

            {!showStats && (
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: "success.light",
                        color: "success.contrastText",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2">
                        ✅ No stats available - StorageStatsBar is hidden when
                        stats is undefined
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default {
    title: "Storage/Components/StorageStatsBar",
    component: StorageStatsBar,
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
        showStats: {
            control: { type: "boolean" },
            description:
                "Whether to show stats (false simulates undefined stats)",
            table: {
                category: "State",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays storage statistics including total usage, current directory counts, and file type breakdown. Now uses props for better testability.",
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
                showStats={args.showStats}
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
    showStats: true,
};

export const NoStats = Template.bind({});
NoStats.args = {
    ...defaultStoryArgs,
    totalFiles: 100,
    totalFolders: 5,
    totalSize: 100 * 1024 * 1024,
    currentFiles: 10,
    currentFolders: 2,
    imageFiles: 50,
    documentFiles: 30,
    videoFiles: 15,
    audioFiles: 5,
    showStats: false,
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
    showStats: true,
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
    showStats: true,
};

export const EmptyDirectory = Template.bind({});
EmptyDirectory.args = {
    ...defaultStoryArgs,
    totalFiles: 1000,
    totalFolders: 50,
    totalSize: 2 * 1024 * 1024 * 1024, // 2 GB
    currentFiles: 0,
    currentFolders: 0,
    imageFiles: 400,
    documentFiles: 300,
    videoFiles: 200,
    audioFiles: 100,
    showStats: true,
};
