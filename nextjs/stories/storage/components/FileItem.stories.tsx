import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, List, useTheme } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import * as Graphql from "@/graphql/generated/types";
import { StorageItem } from "@/contexts/storage/storage.type";
import {
    MockStorageProvider,
    createMockFileItem,
    createMockFolderItem,
} from "../MockStorageProvider";

// Import the component - need to mock the hook first
import FileItem from "@/views/storage/components/FileItem";
import logger from "@/utils/logger";

type FileItemStoryProps = CommonStoryArgTypesProps & {
    itemType: "file" | "folder";
    fileName: string;
    fileType: Graphql.FileType;
    isSelected: boolean;
    fileSize: number;
    contentType: string;
    hasUrl: boolean;
};

const MockFileItemWrapper: React.FC<{
    itemType: "file" | "folder";
    fileName: string;
    fileType: Graphql.FileType;
    isSelected: boolean;
    fileSize: number;
    contentType: string;
    hasUrl: boolean;
}> = ({
    itemType,
    fileName,
    fileType,
    isSelected,
    fileSize,
    contentType,
    hasUrl,
}) => {
    const theme = useTheme();

    const mockItem: StorageItem =
        itemType === "file"
            ? createMockFileItem({
                  name: fileName,
                  path: `examples/${fileName}`,
                  fileType,
                  size: fileSize,
                  contentType,
                  url: hasUrl ? `https://example.com/files/${fileName}` : null,
              })
            : createMockFolderItem({
                  name: fileName,
                  path: `examples/${fileName}`,
                  fileCount: 5,
                  folderCount: 2,
                  totalSize: fileSize,
              });

    const mockContextValue = {
        items: [mockItem],
        selectedPaths: isSelected ? [mockItem.path] : [],
        loading: false,
        error: undefined,
        toggleSelect: (path: string) => {
            logger.log("Toggle select:", path);
        },
        navigateTo: (path: string) => {
            logger.log("Navigate to:", path);
        },
        remove: async (paths: string[]) => {
            logger.log("Remove:", paths);
            return true;
        },
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
                <Box
                    sx={{
                        maxWidth: 800,
                        mx: "auto",
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <List disablePadding>
                        <FileItem item={mockItem} isSelected={isSelected} />
                    </List>
                </Box>
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/FileItem",
    component: MockFileItemWrapper,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        itemType: {
            control: { type: "select" },
            options: ["file", "folder"],
            description: "Type of storage item",
            table: {
                category: "Item",
                order: 1,
            },
        },
        fileName: {
            control: { type: "text" },
            description: "Name of the file or folder",
            table: {
                category: "Item",
                order: 2,
            },
        },
        fileType: {
            control: { type: "select" },
            options: [
                "IMAGE",
                "VIDEO",
                "AUDIO",
                "DOCUMENT",
                "ARCHIVE",
                "OTHER",
            ],
            description: "File type classification",
            table: {
                category: "Item",
                order: 3,
            },
        },
        isSelected: {
            control: { type: "boolean" },
            description: "Whether the item is selected",
            table: {
                category: "State",
                order: 1,
            },
        },
        fileSize: {
            control: { type: "number", min: 0 },
            description: "File size in bytes",
            table: {
                category: "Item",
                order: 4,
            },
        },
        contentType: {
            control: { type: "text" },
            description: "MIME content type",
            table: {
                category: "Item",
                order: 5,
            },
        },
        hasUrl: {
            control: { type: "boolean" },
            description: "Whether the file has a public URL",
            table: {
                category: "Item",
                order: 6,
            },
        },
    },
} as Meta;

const Template: StoryFn<FileItemStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockFileItemWrapper
                itemType={args.itemType}
                fileName={args.fileName}
                fileType={args.fileType}
                isSelected={args.isSelected}
                fileSize={args.fileSize}
                contentType={args.contentType}
                hasUrl={args.hasUrl}
            />
        </AppRouterCacheProvider>
    );
};

export const ImageFile = Template.bind({});
ImageFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "summer-vacation.jpg",
    fileType: "IMAGE",
    isSelected: false,
    fileSize: 2 * 1024 * 1024, // 2MB
    contentType: "image/jpeg",
    hasUrl: true,
};

export const SelectedImageFile = Template.bind({});
SelectedImageFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "profile-photo.png",
    fileType: "IMAGE",
    isSelected: true,
    fileSize: 512 * 1024, // 512KB
    contentType: "image/png",
    hasUrl: true,
};

export const DocumentFile = Template.bind({});
DocumentFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "resume.pdf",
    fileType: "DOCUMENT",
    isSelected: false,
    fileSize: 1.5 * 1024 * 1024, // 1.5MB
    contentType: "application/pdf",
    hasUrl: true,
};

export const VideoFile = Template.bind({});
VideoFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "presentation.mp4",
    fileType: "VIDEO",
    isSelected: false,
    fileSize: 25 * 1024 * 1024, // 25MB
    contentType: "video/mp4",
    hasUrl: false,
};

export const AudioFile = Template.bind({});
AudioFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "podcast.mp3",
    fileType: "AUDIO",
    isSelected: false,
    fileSize: 5 * 1024 * 1024, // 5MB
    contentType: "audio/mpeg",
    hasUrl: true,
};

export const Folder = Template.bind({});
Folder.args = {
    ...defaultStoryArgs,
    itemType: "folder",
    fileName: "Documents",
    fileType: "OTHER", // Not used for folders
    isSelected: false,
    fileSize: 100 * 1024 * 1024, // 100MB total
    contentType: "", // Not used for folders
    hasUrl: false,
};

export const SelectedFolder = Template.bind({});
SelectedFolder.args = {
    ...defaultStoryArgs,
    itemType: "folder",
    fileName: "Images",
    fileType: "OTHER", // Not used for folders
    isSelected: true,
    fileSize: 50 * 1024 * 1024, // 50MB total
    contentType: "", // Not used for folders
    hasUrl: false,
};

export const LargeFile = Template.bind({});
LargeFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "very-long-filename-that-might-wrap-to-multiple-lines.zip",
    fileType: "ARCHIVE",
    isSelected: false,
    fileSize: 1024 * 1024 * 1024, // 1GB
    contentType: "application/zip",
    hasUrl: true,
};
