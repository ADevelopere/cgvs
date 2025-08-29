import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
} from "@mui/material";
import {
    commonStoryArgTypes,
    CommonStoryArgTypesProps,
    defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import BulkActionsBar, {
    BulkActionsBarProps,
} from "@/views/storage/components/BulkActionsBar";

type BulkActionsBarStoryProps = CommonStoryArgTypesProps & {
    selectedCount: number;
    simulateDeleteError: boolean;
};

const MockBulkActionsBarWrapper: React.FC<{
    selectedCount: number;
    simulateDeleteError: boolean;
}> = ({ selectedCount, simulateDeleteError }) => {
    // Mock file data for display
    const mockItems = [
        { name: "image1.jpg", path: "images/image1.jpg", type: "FileInfo" },
        { name: "document.pdf", path: "docs/document.pdf", type: "FileInfo" },
        { name: "Folder1", path: "folders/folder1", type: "FolderInfo" },
        { name: "video.mp4", path: "videos/video.mp4", type: "FileInfo" },
        { name: "audio.mp3", path: "audio/audio.mp3", type: "FileInfo" },
    ];

    const selectedPaths = mockItems
        .slice(0, selectedCount)
        .map((item) => item.path);

    // Mock handlers
    const handleClearSelection = () => {
        // eslint-disable-next-line no-console
        console.log("Clear selection called");
    };

    const handleDelete = async (paths: string[]): Promise<boolean> => {
        // eslint-disable-next-line no-console
        console.log("Delete called with paths:", paths);

        if (simulateDeleteError) {
            // eslint-disable-next-line no-console
            console.error("Simulated delete error");
            return false;
        }

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
    };

    const handleDownload = (paths: string[]) => {
        // eslint-disable-next-line no-console
        console.log("Download called with paths:", paths);
    };

    const handleCopyLinks = (paths: string[]) => {
        // eslint-disable-next-line no-console
        console.log("Copy links called with paths:", paths);
    };

    const bulkActionsProps: BulkActionsBarProps = {
        selectedPaths,
        onClearSelection: handleClearSelection,
        onDelete: handleDelete,
        onDownload: handleDownload,
        onCopyLinks: handleCopyLinks,
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                color: "text.primary",
                position: "relative",
                pb: selectedCount > 0 ? 10 : 0, // Add bottom padding when actions bar is visible
            }}
        >
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Storage Items with Bulk Actions
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Select items below to see the bulk actions bar appear at the
                    bottom. Currently {selectedCount} item
                    {selectedCount !== 1 ? "s" : ""} selected.
                </Typography>

                {/* Mock file list to show selection */}
                <List
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {mockItems.map((item, index) => {
                        const isSelected = index < selectedCount;
                        return (
                            <ListItem
                                key={item.path}
                                sx={{
                                    backgroundColor: isSelected
                                        ? "action.selected"
                                        : "transparent",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={isSelected}
                                        readOnly
                                        size="small"
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Type: ${item.type} | Path: ${item.path}`}
                                />
                            </ListItem>
                        );
                    })}
                </List>

                {selectedCount === 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            backgroundColor: "action.hover",
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            💡 Tip: Increase the &quot;selectedCount&quot; in
                            the controls to see the bulk actions bar appear.
                        </Typography>
                    </Box>
                )}

                {simulateDeleteError && selectedCount > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            backgroundColor: "error.main",
                            color: "error.contrastText",
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body2">
                            ⚠️ Delete Error Mode: Delete operations will fail
                            for testing.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* The BulkActionsBar component with props */}
            <BulkActionsBar {...bulkActionsProps} />
        </Box>
    );
};

export default {
    title: "Storage/Components/BulkActionsBar",
    component: BulkActionsBar,
    decorators: [withGlobalStyles],
    argTypes: {
        ...commonStoryArgTypes,
        selectedCount: {
            control: { type: "number", min: 0, max: 5 },
            description:
                "Number of items selected (controls visibility of bulk actions bar)",
            table: {
                category: "Selection",
                order: 1,
            },
        },
        simulateDeleteError: {
            control: { type: "boolean" },
            description:
                "Whether to simulate delete errors for testing error scenarios",
            table: {
                category: "Testing",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "A floating action bar that appears when items are selected, providing bulk operations like delete, download, and copy links. Now uses props instead of context for better testability.",
            },
        },
    },
} as Meta;

const Template: StoryFn<BulkActionsBarStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockBulkActionsBarWrapper
                selectedCount={args.selectedCount}
                simulateDeleteError={args.simulateDeleteError}
            />
        </AppRouterCacheProvider>
    );
};

export const Hidden = Template.bind({});
Hidden.args = {
    ...defaultStoryArgs,
    selectedCount: 0,
    simulateDeleteError: false,
};

export const SingleSelection = Template.bind({});
SingleSelection.args = {
    ...defaultStoryArgs,
    selectedCount: 1,
    simulateDeleteError: false,
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
    ...defaultStoryArgs,
    selectedCount: 3,
    simulateDeleteError: false,
};

export const AllSelected = Template.bind({});
AllSelected.args = {
    ...defaultStoryArgs,
    selectedCount: 5,
    simulateDeleteError: false,
};

export const WithDeleteError = Template.bind({});
WithDeleteError.args = {
    ...defaultStoryArgs,
    selectedCount: 2,
    simulateDeleteError: true,
};
