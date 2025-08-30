import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { Box, Typography, Grid, List } from "@mui/material";
import FilePickerItems from "@/views/storage/filePicker/FilePickerItems";
import * as Graphql from "@/graphql/generated/types";
import withGlobalStyles from "@/stories/Decorators";

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
};

export default meta;
type Story = StoryObj<typeof meta>;

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

export const ImageFileGrid: Story = {
    args: {
        file: mockImageFile,
        selected: false,
        disabled: false,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
};

export const ImageFileSelected: Story = {
    args: {
        file: mockImageFile,
        selected: true,
        disabled: false,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
};

export const DocumentFileGrid: Story = {
    args: {
        file: mockDocumentFile,
        selected: false,
        disabled: false,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
};

export const FileDisabled: Story = {
    args: {
        file: mockTextFile,
        selected: false,
        disabled: true,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled file item (cannot be selected).",
            },
        },
    },
};

export const ImageFileList: Story = {
    args: {
        file: mockImageFile,
        selected: false,
        disabled: false,
        viewMode: "list",
        onToggleSelect: action("toggleSelect"),
    },
};

export const DocumentFileList: Story = {
    args: {
        file: mockDocumentFile,
        selected: true,
        disabled: false,
        viewMode: "list",
        onToggleSelect: action("toggleSelect"),
    },
};

export const LongFilenameGrid: Story = {
    args: {
        file: mockLargeFile,
        selected: false,
        disabled: false,
        viewMode: "grid",
        onToggleSelect: action("toggleSelect"),
    },
    parameters: {
        docs: {
            description: {
                story: "File with a very long filename to test text truncation in grid view.",
            },
        },
    },
};

export const LongFilenameList: Story = {
    args: {
        file: mockLargeFile,
        selected: false,
        disabled: false,
        viewMode: "list",
        onToggleSelect: action("toggleSelect"),
    },
    parameters: {
        docs: {
            description: {
                story: "File with a very long filename to test text truncation in list view.",
            },
        },
    },
};

// Comparison views
export const GridComparison: Story = {
    render: () => (
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
                        file={mockTextFile}
                        selected={false}
                        disabled={true}
                        viewMode="grid"
                        onToggleSelect={action("toggleSelect")}
                    />
                </Grid>
            </Grid>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: "Comparison of different file types and states in grid view.",
            },
        },
    },
};

export const ListComparison: Story = {
    render: () => (
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
                    file={mockImageFile}
                    selected={true}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockDocumentFile}
                    selected={false}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockTextFile}
                    selected={false}
                    disabled={true}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
                <FilePickerItems
                    file={mockLargeFile}
                    selected={false}
                    viewMode="list"
                    onToggleSelect={action("toggleSelect")}
                />
            </List>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: "Comparison of different file types and states in list view.",
            },
        },
    },
};

export const MixedFileTypes: Story = {
    render: () => (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Mixed File Types (Grid)
            </Typography>
            <Grid container spacing={2}>
                {[
                    mockImageFile,
                    mockDocumentFile,
                    mockTextFile,
                    mockLargeFile,
                ].map((file, index) => (
                    <Grid key={file.path} size={{ xs: 12, sm: 6, md: 3 }}>
                        <FilePickerItems
                            file={file}
                            selected={index % 2 === 0}
                            viewMode="grid"
                            onToggleSelect={action("toggleSelect")}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: "Showcase of different file types with alternating selection states.",
            },
        },
    },
};
