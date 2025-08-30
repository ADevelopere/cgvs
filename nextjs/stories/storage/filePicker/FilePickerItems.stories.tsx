import React from "react";
import type { Meta, StoryFn } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { Box, Typography, Grid, List } from "@mui/material";
import FilePickerItems from "@/views/storage/filePicker/FilePickerItems";
import * as Graphql from "@/graphql/generated/types";
import withGlobalStyles from "@/stories/Decorators";
import { 
    commonStoryArgTypes, 
    defaultStoryArgs, 
    CommonStoryArgTypesProps 
} from "@/stories/argTypes";
import useStoryTheme from "@/stories/useStoryTheme";

// Props interface for story controls
type FilePickerItemsStoryProps = CommonStoryArgTypesProps & {
    file: Graphql.FileInfo;
    selected: boolean;
    disabled?: boolean;
    viewMode?: "grid" | "list";
    onToggleSelect: (file: Graphql.FileInfo) => void;
};

const meta: Meta<typeof FilePickerItems> = {
    title: "Storage/FilePicker/FilePickerItems",
    component: FilePickerItems,
    decorators: [withGlobalStyles],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "Individual file item component for the file picker with selection, preview, and download functionality. Supports both grid and list view modes.",
            },
        },
    },
    argTypes: {
        ...commonStoryArgTypes,
        file: {
            control: { type: "object" },
            description: "File information object",
            table: { category: "Data" },
        },
        selected: {
            control: { type: "boolean" },
            description: "Whether the file is selected",
            table: { category: "State" },
        },
        disabled: {
            control: { type: "boolean" },
            description: "Whether the file item is disabled",
            table: { category: "State" },
        },
        viewMode: {
            control: { type: "select" },
            options: ["grid", "list"],
            description: "Display mode for the file item",
            table: { category: "Appearance" },
        },
        onToggleSelect: {
            action: "toggleSelect",
            description: "Callback when file selection is toggled",
            table: { category: "Events" },
        },
    },
    args: {
        ...defaultStoryArgs,
        file: {
            __typename: "FileInfo",
            path: "/example/file.txt",
            name: "example-file.txt",
            size: 1024,
            created: "2024-01-16T10:00:00Z",
            lastModified: "2024-01-16T10:00:00Z",
            contentType: "text/plain",
            fileType: "DOCUMENT",
            isPublic: false,
            url: "/api/storage/files/example.txt",
        },
        selected: false,
        disabled: false,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
};

export default meta;
type Story = StoryFn<FilePickerItemsStoryProps>;

const Template: StoryFn<FilePickerItemsStoryProps> = (args) => {
    useStoryTheme(args);
    
    return <FilePickerItems {...args} />;
};

// Mock files
const mockImageFile: Graphql.FileInfo = {
    __typename: "FileInfo",
    path: "/images/photo.jpg",
    name: "beautiful-landscape.jpg",
    size: 2048576,
    created: "2024-01-16T09:15:00Z",
    lastModified: "2024-01-16T09:15:00Z",
    contentType: "image/jpeg",
    fileType: "IMAGE",
    isPublic: true,
    url: "https://picsum.photos/400/300?random=1",
    mediaLink: "https://picsum.photos/400/300?random=1",
};

const mockDocumentFile: Graphql.FileInfo = {
    __typename: "FileInfo",
    path: "/documents/report.pdf",
    name: "annual-report-2024.pdf",
    size: 5242880,
    created: "2024-01-15T16:45:00Z",
    lastModified: "2024-01-15T16:45:00Z",
    contentType: "application/pdf",
    fileType: "DOCUMENT",
    isPublic: false,
    url: "/api/storage/files/report.pdf",
};

const mockTextFile: Graphql.FileInfo = {
    __typename: "FileInfo",
    path: "/documents/notes.txt",
    name: "meeting-notes.txt",
    size: 12345,
    created: "2024-01-14T14:20:00Z",
    lastModified: "2024-01-14T14:20:00Z",
    contentType: "text/plain",
    fileType: "DOCUMENT",
    isPublic: false,
    url: "/api/storage/files/notes.txt",
};

const mockLargeFile: Graphql.FileInfo = {
    __typename: "FileInfo",
    path: "/videos/presentation.mp4",
    name: "company-presentation-very-long-filename-that-might-wrap.mp4",
    size: 104857600, // 100MB
    created: "2024-01-13T11:30:00Z",
    lastModified: "2024-01-13T11:30:00Z",
    contentType: "video/mp4",
    fileType: "VIDEO",
    isPublic: false,
    url: "/api/storage/files/presentation.mp4",
};

export const ImageFileGrid: Story = Template.bind({});
ImageFileGrid.args = {
    file: mockImageFile,
    selected: false,
    disabled: false,
    viewMode: "grid",
    onToggleSelect: action("toggleSelect"),
};

export const ImageFileSelected: Story = Template.bind({});
ImageFileSelected.args = {
    file: mockImageFile,
    selected: true,
    disabled: false,
    viewMode: "grid",
    onToggleSelect: action("toggleSelect"),
};

export const DocumentFileGrid: Story = Template.bind({});
DocumentFileGrid.args = {
    file: mockDocumentFile,
    selected: false,
    disabled: false,
    viewMode: "grid",
    onToggleSelect: action("toggleSelect"),
};

export const FileDisabled: Story = Template.bind({});
FileDisabled.args = {
    file: mockTextFile,
    selected: false,
    disabled: true,
    viewMode: "grid",
    onToggleSelect: action("toggleSelect"),
};
FileDisabled.parameters = {
    docs: {
        description: {
            story: "Disabled file item (cannot be selected).",
        },
    },
};

export const ImageFileList: Story = Template.bind({});
ImageFileList.args = {
    file: mockImageFile,
    selected: false,
    disabled: false,
    viewMode: "list",
    onToggleSelect: action("toggleSelect"),
};

export const DocumentFileList: Story = Template.bind({});
DocumentFileList.args = {
    file: mockDocumentFile,
    selected: true,
    disabled: false,
    viewMode: "list",
    onToggleSelect: action("toggleSelect"),
};

export const LongFilenameGrid: Story = Template.bind({});
LongFilenameGrid.args = {
    file: mockLargeFile,
    selected: false,
    disabled: false,
    viewMode: "grid",
    onToggleSelect: action("toggleSelect"),
};
LongFilenameGrid.parameters = {
    docs: {
        description: {
            story: "File with a very long filename to test text truncation in grid view.",
        },
    },
};

export const LongFilenameList: Story = Template.bind({});
LongFilenameList.args = {
    file: mockLargeFile,
    selected: false,
    disabled: false,
    viewMode: "list",
    onToggleSelect: action("toggleSelect"),
};
LongFilenameList.parameters = {
    docs: {
        description: {
            story: "File with a very long filename to test text truncation in list view.",
        },
    },
};

// Comparison views with multiple items
// Wrapper components for complex stories
const GridComparisonWrapper: React.FC<FilePickerItemsStoryProps> = (props) => {
    useStoryTheme(props);
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Grid View Comparison
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FilePickerItems
                        file={mockImageFile}
                        selected={false}
                        viewMode="grid"
                        onToggleSelect={action("toggleSelect")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FilePickerItems
                        file={mockImageFile}
                        selected={true}
                        viewMode="grid"
                        onToggleSelect={action("toggleSelect")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FilePickerItems
                        file={mockDocumentFile}
                        selected={false}
                        viewMode="grid"
                        onToggleSelect={action("toggleSelect")}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FilePickerItems
                        file={mockLargeFile}
                        selected={false}
                        disabled={true}
                        viewMode="grid"
                        onToggleSelect={action("toggleSelect")}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

const ListComparisonWrapper: React.FC<FilePickerItemsStoryProps> = (props) => {
    useStoryTheme(props);
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                List View Comparison
            </Typography>
            <List>
                <FilePickerItems
                    file={mockImageFile}
                    selected={false}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockDocumentFile}
                    selected={true}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockLargeFile}
                    selected={false}
                    disabled={true}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockTextFile}
                    selected={false}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
            </List>
        </Box>
    );
};

const MixedFileTypesWrapper: React.FC<FilePickerItemsStoryProps> = (props) => {
    useStoryTheme(props);
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Mixed File Types
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ p: 1 }}>
                        <FilePickerItems
                            file={mockImageFile}
                            selected={false}
                            viewMode="grid"
                            onToggleSelect={action("toggleSelect")}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ p: 1 }}>
                        <FilePickerItems
                            file={mockDocumentFile}
                            selected={true}
                            viewMode="grid"
                            onToggleSelect={action("toggleSelect")}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ p: 1 }}>
                        <FilePickerItems
                            file={mockTextFile}
                            selected={false}
                            viewMode="grid"
                            onToggleSelect={action("toggleSelect")}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ p: 1 }}>
                        <FilePickerItems
                            file={mockLargeFile}
                            selected={false}
                            disabled={true}
                            viewMode="grid"
                            onToggleSelect={action("toggleSelect")}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export const GridComparison = Template.bind({});
GridComparison.render = (args) => <GridComparisonWrapper {...args} />;
GridComparison.parameters = {
    docs: {
        description: {
            story: "Grid view comparison showing different file types and states.",
        },
    },
};

export const ListComparison = Template.bind({});
ListComparison.render = (args) => <ListComparisonWrapper {...args} />;
ListComparison.parameters = {
    docs: {
        description: {
            story: "List view comparison showing different file types and states.",
        },
    },
};

export const MixedFileTypes = Template.bind({});
MixedFileTypes.render = (args) => <MixedFileTypesWrapper {...args} />;
MixedFileTypes.parameters = {
    docs: {
        description: {
            story: "Mixed file types in grid view with different states and selection.",
        },
    },
};