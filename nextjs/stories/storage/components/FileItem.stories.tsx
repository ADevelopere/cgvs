import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Alert, List } from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import * as Graphql from "@/graphql/generated/types";
import {
    createMockFileItem,
    createMockFolderItem,
} from "../MockStorageProvider";
import FileItem, { FileItemProps } from "@/views/storage/components/FileItem";

type FileItemStoryProps = CommonStoryArgTypesProps & {
    itemType: "file" | "folder";
    fileType: Graphql.FileType;
    fileName: string;
    fileSize: number;
    isSelected: boolean;
    hasUrl: boolean;
    simulateActions: boolean;
    contentType: string;
};

const MockFileItemWrapper: React.FC<{
    itemType: "file" | "folder";
    fileType: Graphql.FileType;
    fileName: string;
    fileSize: number;
    isSelected: boolean;
    hasUrl: boolean;
    simulateActions: boolean;
    contentType: string;
}> = ({
    itemType,
    fileType,
    fileName,
    fileSize,
    isSelected,
    hasUrl,
    simulateActions,
    contentType,
}) => {
    const [selectedState, setSelectedState] = useState(isSelected);
    const [actionLogs, setActionLogs] = useState<string[]>([]);

    const addLog = (action: string) => {
        setActionLogs((prev) => [
            ...prev.slice(-4),
            `${new Date().toLocaleTimeString()}: ${action}`,
        ]);
    };

    // Create mock item based on type
    const mockItem =
        itemType === "folder"
            ? createMockFolderItem({
                  name: fileName || "Sample Folder",
                  path: "sample-folder",
              })
            : createMockFileItem({
                  name: fileName || "sample-file.txt",
                  path: "sample-file.txt",
                  fileType,
                  size: fileSize,
                  contentType: contentType || "application/octet-stream",
                  url: hasUrl
                      ? "https://example.com/download/sample-file.txt"
                      : undefined,
              });

    const handleToggleSelect = (path: string) => {
        setSelectedState(!selectedState);
        addLog(`Toggle selection for: ${path}`);
    };

    const handleNavigateTo = (path: string) => {
        addLog(`Navigate to: ${path}`);
    };

    const handleDelete = async (paths: string[]) => {
        addLog(`Delete requested for: ${paths.join(", ")}`);
        if (simulateActions) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            addLog(`Delete completed for: ${paths.join(", ")}`);
            return true;
        }
        addLog(`Delete failed for: ${paths.join(", ")}`);
        return false;
    };

    const handleRename = (path: string, newName: string) => {
        addLog(`Rename: ${path} → ${newName}`);
    };

    const fileItemProps: FileItemProps = {
        item: mockItem,
        isSelected: selectedState,
        onToggleSelect: handleToggleSelect,
        onNavigateTo: handleNavigateTo,
        onDelete: handleDelete,
        onRename: handleRename,
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
                FileItem Component Demo
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Test the FileItem component with different configurations and
                interactions.
            </Typography>

            {/* Configuration Info */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Current Configuration:</strong>
                    <br />• Type: {itemType}{" "}
                    {itemType === "file" && `(${fileType})`}
                    <br />• Name: {mockItem.name}
                    <br />• Selected: {selectedState ? "Yes" : "No"}
                    <br />
                    {itemType === "file" && (
                        <>
                            • Size: {(mockItem as Graphql.FileInfo).size} bytes
                            <br />• Has URL: {hasUrl ? "Yes" : "No"}
                            <br />• Content Type: {contentType}
                            <br />
                        </>
                    )}
                    • Actions Simulation:{" "}
                    {simulateActions ? "Enabled" : "Disabled"}
                </Typography>
            </Alert>

            {/* The FileItem component in a List */}
            <Box
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 3,
                    backgroundColor: "background.paper",
                }}
            >
                <List sx={{ p: 0 }}>
                    <FileItem {...fileItemProps} />
                </List>
            </Box>

            {/* Action Logs */}
            <Box
                sx={{
                    p: 2,
                    backgroundColor: "grey.50",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                }}
            >
                <Typography variant="subtitle2" gutterBottom>
                    Action Logs:
                </Typography>
                {actionLogs.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No actions performed yet. Try clicking the item,
                        checkbox, or menu button.
                    </Typography>
                ) : (
                    actionLogs.map((log, idx) => (
                        <Typography
                            key={`${log}-${idx}`}
                            variant="caption"
                            display="block"
                            sx={{ fontFamily: "monospace" }}
                        >
                            {log}
                        </Typography>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default {
    title: "Storage/Components/FileItem",
    component: FileItem,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        itemType: {
            control: { type: "radio" },
            options: ["file", "folder"],
            description: "Type of storage item to display",
            table: {
                category: "Item Configuration",
                order: 1,
            },
        },
        fileType: {
            control: { type: "select" },
            options: ["DOCUMENT", "IMAGE", "VIDEO", "AUDIO", "OTHER"],
            description: "File type for file items",
            table: {
                category: "Item Configuration",
                order: 2,
            },
        },
        fileName: {
            control: { type: "text" },
            description: "Name of the file/folder",
            table: {
                category: "Item Configuration",
                order: 3,
            },
        },
        fileSize: {
            control: { type: "number", min: 0, max: 100000000 },
            description: "Size of the file in bytes",
            table: {
                category: "Item Configuration",
                order: 4,
            },
        },
        contentType: {
            control: { type: "text" },
            description: "MIME content type",
            table: {
                category: "Item Configuration",
                order: 5,
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
        hasUrl: {
            control: { type: "boolean" },
            description: "Whether file has a download URL",
            table: {
                category: "State",
                order: 2,
            },
        },
        simulateActions: {
            control: { type: "boolean" },
            description: "Whether actions should succeed or fail",
            table: {
                category: "Behavior",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays individual storage items (files and folders) in a list format with selection, navigation, and action menu capabilities. Now uses props for better testability.",
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
                fileType={args.fileType}
                fileName={args.fileName}
                fileSize={args.fileSize}
                isSelected={args.isSelected}
                hasUrl={args.hasUrl}
                simulateActions={args.simulateActions}
                contentType={args.contentType}
            />
        </AppRouterCacheProvider>
    );
};

export const FolderItem = Template.bind({});
FolderItem.args = {
    ...defaultStoryArgs,
    itemType: "folder",
    fileType: "DOCUMENT", // Not used for folders
    fileName: "Project Documents",
    fileSize: 0, // Not used for folders
    contentType: "", // Not used for folders
    isSelected: false,
    hasUrl: false, // Not used for folders
    simulateActions: true,
};

export const DocumentFile = Template.bind({});
DocumentFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "DOCUMENT",
    fileName: "Annual Report 2024.pdf",
    fileSize: 2458624, // ~2.4 MB
    contentType: "application/pdf",
    isSelected: false,
    hasUrl: true,
    simulateActions: true,
};

export const ImageFile = Template.bind({});
ImageFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "IMAGE",
    fileName: "vacation-photo.jpg",
    fileSize: 5242880, // 5 MB
    contentType: "image/jpeg",
    isSelected: false,
    hasUrl: true,
    simulateActions: true,
};

export const SelectedImageFile = Template.bind({});
SelectedImageFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "IMAGE",
    fileName: "profile-photo.png",
    fileSize: 512 * 1024, // 512KB
    contentType: "image/png",
    isSelected: true,
    hasUrl: true,
    simulateActions: true,
};

export const VideoFile = Template.bind({});
VideoFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "VIDEO",
    fileName: "presentation.mp4",
    fileSize: 157286400, // ~150 MB
    contentType: "video/mp4",
    isSelected: false,
    hasUrl: true,
    simulateActions: true,
};

export const AudioFile = Template.bind({});
AudioFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "AUDIO",
    fileName: "podcast-episode-01.mp3",
    fileSize: 52428800, // ~50 MB
    contentType: "audio/mpeg",
    isSelected: false,
    hasUrl: true,
    simulateActions: true,
};

export const FileWithoutUrl = Template.bind({});
FileWithoutUrl.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "OTHER",
    fileName: "corrupted-file.bin",
    fileSize: 1024,
    contentType: "application/octet-stream",
    isSelected: false,
    hasUrl: false,
    simulateActions: true,
};

export const LargeFile = Template.bind({});
LargeFile.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileName: "very-long-filename-that-might-wrap-to-multiple-lines.zip",
    fileType: "OTHER",
    fileSize: 1024 * 1024 * 1024, // 1GB
    contentType: "application/zip",
    isSelected: false,
    hasUrl: true,
    simulateActions: true,
};

export const ActionFailures = Template.bind({});
ActionFailures.args = {
    ...defaultStoryArgs,
    itemType: "file",
    fileType: "DOCUMENT",
    fileName: "locked-document.pdf",
    fileSize: 2097152, // 2 MB
    contentType: "application/pdf",
    isSelected: false,
    hasUrl: true,
    simulateActions: false, // Actions will fail
};
