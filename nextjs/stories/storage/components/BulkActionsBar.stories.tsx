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
import {
    MockStorageProvider,
    createMockFileItem,
    createMockFolderItem,
    MOCK_DATA_SETS,
} from "../MockStorageProvider";
import BulkActionsBar from "@/views/storage/components/BulkActionsBar";

type BulkActionsBarStoryProps = CommonStoryArgTypesProps & {
    selectedCount: number;
    showDialog: boolean;
};

const MockBulkActionsBarWrapper: React.FC<{
    selectedCount: number;
}> = ({ selectedCount }) => {
    const mockItems = [
        createMockFileItem({ name: "image1.jpg", path: "images/image1.jpg" }),
        createMockFileItem({ name: "document.pdf", path: "docs/document.pdf" }),
        createMockFolderItem({ name: "Folder1", path: "folders/folder1" }),
        createMockFileItem({ name: "video.mp4", path: "videos/video.mp4" }),
        createMockFileItem({ name: "audio.mp3", path: "audio/audio.mp3" }),
    ];

    const selectedPaths = mockItems
        .slice(0, selectedCount)
        .map((item) => item.path);

    const mockContextValue = {
        ...MOCK_DATA_SETS.withFiles,
        items: mockItems,
        selectedPaths,
        clearSelection: () => {
            // eslint-disable-next-line no-console
            console.log("Clear selection");
        },
        remove: async (paths: string[]) => {
            // eslint-disable-next-line no-console
            console.log("Remove items:", paths);
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
                        Select items below to see the bulk actions bar appear at
                        the bottom. Currently {selectedCount} item
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
                                        secondary={`Type: ${item.__typename} | Path: ${item.path}`}
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
                                💡 Tip: Increase the &quot;selectedCount&quot;
                                in the controls to see the bulk actions bar
                                appear.
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* The BulkActionsBar component */}
                <BulkActionsBar />
            </Box>
        </MockStorageProvider>
    );
};

export default {
    title: "Storage/Components/BulkActionsBar",
    component: MockBulkActionsBarWrapper,
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
        showDialog: {
            control: { type: "boolean" },
            description:
                "Whether to show delete confirmation dialog (for demo purposes)",
            table: {
                category: "Dialog",
                order: 1,
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    "A floating action bar that appears when items are selected, providing bulk operations like delete, download, and copy links.",
            },
        },
    },
} as Meta;

const Template: StoryFn<BulkActionsBarStoryProps> = (args) => {
    useStoryTheme(args);

    return (
        <AppRouterCacheProvider>
            <MockBulkActionsBarWrapper selectedCount={args.selectedCount} />
        </AppRouterCacheProvider>
    );
};

export const Hidden = Template.bind({});
Hidden.args = {
    ...defaultStoryArgs,
    selectedCount: 0,
    showDialog: false,
};

export const SingleSelection = Template.bind({});
SingleSelection.args = {
    ...defaultStoryArgs,
    selectedCount: 1,
    showDialog: false,
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
    ...defaultStoryArgs,
    selectedCount: 3,
    showDialog: false,
};

export const AllSelected = Template.bind({});
AllSelected.args = {
    ...defaultStoryArgs,
    selectedCount: 5,
    showDialog: false,
};

export const ManySelected = Template.bind({});
ManySelected.args = {
    ...defaultStoryArgs,
    selectedCount: 4,
    showDialog: false,
};
