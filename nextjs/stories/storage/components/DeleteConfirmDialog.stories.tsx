import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Typography, Button } from "@mui/material";
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
import DeleteConfirmDialog, {
    DeleteConfirmDialogProps,
} from "@/views/storage/components/DeleteConfirmDialog";
import logger from "@/utils/logger";

type DeleteConfirmDialogStoryProps = CommonStoryArgTypesProps & {
    files: number;
    folders: number;
    showSingleFile: boolean;
    showSingleFolder: boolean;
    showMixed: boolean;
    simulateDelete: boolean;
    deleteDelay: number;
};

const MockDeleteConfirmDialogWrapper: React.FC<{
    files: number;
    folders: number;
    showSingleFile: boolean;
    showSingleFolder: boolean;
    showMixed: boolean;
    simulateDelete: boolean;
    deleteDelay: number;
}> = ({
    files,
    folders,
    showSingleFile,
    showSingleFolder,
    showMixed,
    simulateDelete,
    deleteDelay,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
    const [items, setItems] = useState<
        Array<Graphql.FileInfo | Graphql.FolderInfo>
    >([]);

    // Create mock items
    const mockItems = React.useMemo(() => {
        const allItems: Array<Graphql.FileInfo | Graphql.FolderInfo> = [];

        // Add folders
        for (let i = 0; i < folders; i++) {
            allItems.push(
                createMockFolderItem({
                    name: `Important Folder ${i + 1}`,
                    path: `folder-${i + 1}`,
                }),
            );
        }

        // Add files
        for (let i = 0; i < files; i++) {
            allItems.push(
                createMockFileItem({
                    name: `Document ${i + 1}.pdf`,
                    path: `document-${i + 1}.pdf`,
                    fileType: "DOCUMENT" as Graphql.FileType,
                    size: Math.floor(Math.random() * 10000000),
                }),
            );
        }

        return allItems;
    }, [files, folders]);

    // Determine which scenario to show
    const getScenarioItems = () => {
        if (showSingleFile) {
            return [
                createMockFileItem({
                    name: "Important Document.pdf",
                    path: "important-document.pdf",
                    fileType: "DOCUMENT" as Graphql.FileType,
                }),
            ];
        }

        if (showSingleFolder) {
            return [
                createMockFolderItem({
                    name: "Important Folder",
                    path: "important-folder",
                }),
            ];
        }

        if (showMixed) {
            return [
                createMockFolderItem({ name: "Projects", path: "projects" }),
                createMockFileItem({
                    name: "Report.pdf",
                    path: "report.pdf",
                    fileType: "DOCUMENT" as Graphql.FileType,
                }),
                createMockFileItem({
                    name: "Image.jpg",
                    path: "image.jpg",
                    fileType: "IMAGE" as Graphql.FileType,
                }),
            ];
        }

        return mockItems;
    };

    const currentItems = getScenarioItems();
    const currentPaths = currentItems.map((item) => item.path);

    const handleOpenDialog = () => {
        setItems(currentItems);
        setSelectedPaths(currentPaths);
        setDialogOpen(true);
    };

    const handleDelete = async (paths: string[]) => {
        // Simulate deletion with delay
        if (simulateDelete) {
            await new Promise((resolve) => setTimeout(resolve, deleteDelay));
            // Remove deleted items from our mock data
            setItems((prev) =>
                prev.filter((item) => !paths.includes(item.path)),
            );
        }
        return simulateDelete; // Return success/failure based on setting
    };

    const handleConfirm = () => {
        logger.log("Delete confirmed for paths:", selectedPaths);
    };

    const deleteConfirmDialogProps: DeleteConfirmDialogProps = {
        open: dialogOpen,
        onClose: () => setDialogOpen(false),
        paths: selectedPaths,
        items: items,
        onDelete: handleDelete,
        onConfirm: handleConfirm,
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
                Delete Confirmation Dialog Demo
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Test the delete confirmation dialog with different scenarios.
            </Typography>

            {/* Scenario Info */}
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                }}
            >
                <Typography variant="subtitle2" gutterBottom>
                    Current Scenario:
                </Typography>
                <Typography variant="body2">
                    {showSingleFile && "Single file deletion"}
                    {showSingleFolder && "Single folder deletion"}
                    {showMixed && "Mixed items deletion (folder + files)"}
                    {!showSingleFile &&
                        !showSingleFolder &&
                        !showMixed &&
                        `Multiple items: ${folders} folders, ${files} files`}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    • Delete simulation:{" "}
                    {simulateDelete
                        ? `Enabled (${deleteDelay}ms delay)`
                        : "Disabled (fails)"}
                </Typography>
            </Box>

            {/* Trigger Button */}
            <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleOpenDialog}
                sx={{ mb: 3 }}
            >
                Open Delete Dialog ({currentItems.length} items)
            </Button>

            {/* Mock Selected Items List */}
            <Box
                sx={{
                    p: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                }}
            >
                <Typography variant="subtitle2" gutterBottom>
                    Items that will be selected for deletion:
                </Typography>
                {currentItems.map((item, index) => (
                    <Typography
                        key={item.path}
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                    >
                        {index + 1}.{" "}
                        {item.__typename === "FolderInfo" ? "📁" : "📄"}{" "}
                        {item.name} ({item.path})
                    </Typography>
                ))}
            </Box>

            {/* The DeleteConfirmDialog component */}
            <DeleteConfirmDialog {...deleteConfirmDialogProps} />
        </Box>
    );
};

export default {
    title: "Storage/Components/DeleteConfirmDialog",
    component: DeleteConfirmDialog,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        files: {
            control: { type: "number", min: 0, max: 20 },
            description: "Number of files to include in deletion",
            table: {
                category: "Multiple Items Scenario",
                order: 1,
            },
        },
        folders: {
            control: { type: "number", min: 0, max: 10 },
            description: "Number of folders to include in deletion",
            table: {
                category: "Multiple Items Scenario",
                order: 2,
            },
        },
        showSingleFile: {
            control: { type: "boolean" },
            description: "Show single file deletion scenario",
            table: {
                category: "Scenarios",
                order: 1,
            },
        },
        showSingleFolder: {
            control: { type: "boolean" },
            description: "Show single folder deletion scenario",
            table: {
                category: "Scenarios",
                order: 2,
            },
        },
        showMixed: {
            control: { type: "boolean" },
            description: "Show mixed items deletion scenario",
            table: {
                category: "Scenarios",
                order: 3,
            },
        },
        simulateDelete: {
            control: { type: "boolean" },
            description: "Whether to simulate successful deletion",
            table: {
                category: "Behavior",
                order: 1,
            },
        },
        deleteDelay: {
            control: { type: "number", min: 0, max: 5000, step: 500 },
            description: "Delay in milliseconds for delete operation",
            table: {
                category: "Behavior",
                order: 2,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Displays a confirmation dialog before deleting storage items. Shows detailed information about items to be deleted and handles both single and bulk deletion scenarios. Now uses props for better testability.",
            },
        },
    },
} as Meta;

const Template: StoryFn<DeleteConfirmDialogStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockDeleteConfirmDialogWrapper
                files={args.files}
                folders={args.folders}
                showSingleFile={args.showSingleFile}
                showSingleFolder={args.showSingleFolder}
                showMixed={args.showMixed}
                simulateDelete={args.simulateDelete}
                deleteDelay={args.deleteDelay}
            />
        </AppRouterCacheProvider>
    );
};

export const SingleFile = Template.bind({});
SingleFile.args = {
    ...defaultStoryArgs,
    files: 0,
    folders: 0,
    showSingleFile: true,
    showSingleFolder: false,
    showMixed: false,
    simulateDelete: true,
    deleteDelay: 1000,
};

export const SingleFolder = Template.bind({});
SingleFolder.args = {
    ...defaultStoryArgs,
    files: 0,
    folders: 0,
    showSingleFile: false,
    showSingleFolder: true,
    showMixed: false,
    simulateDelete: true,
    deleteDelay: 1500,
};

export const MixedItems = Template.bind({});
MixedItems.args = {
    ...defaultStoryArgs,
    files: 0,
    folders: 0,
    showSingleFile: false,
    showSingleFolder: false,
    showMixed: true,
    simulateDelete: true,
    deleteDelay: 2000,
};

export const BulkDeletion = Template.bind({});
BulkDeletion.args = {
    ...defaultStoryArgs,
    files: 8,
    folders: 3,
    showSingleFile: false,
    showSingleFolder: false,
    showMixed: false,
    simulateDelete: true,
    deleteDelay: 2500,
};

export const LargeBulk = Template.bind({});
LargeBulk.args = {
    ...defaultStoryArgs,
    files: 15,
    folders: 5,
    showSingleFile: false,
    showSingleFolder: false,
    showMixed: false,
    simulateDelete: true,
    deleteDelay: 3000,
};

export const DeleteFailure = Template.bind({});
DeleteFailure.args = {
    ...defaultStoryArgs,
    files: 3,
    folders: 1,
    showSingleFile: false,
    showSingleFolder: false,
    showMixed: false,
    simulateDelete: false, // This will cause deletion to fail
    deleteDelay: 1000,
};
