import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import FilePickerDialog from "@/views/storage/filePicker/FilePickerDialog";
import * as Graphql from "@/graphql/generated/types";
import withGlobalStyles from "@/stories/Decorators";

const meta: Meta<typeof FilePickerDialog> = {
    title: "Storage/FilePicker/FilePickerDialog",
    component: FilePickerDialog,
    decorators: [withGlobalStyles],
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A modal dialog containing the FilePicker component with additional dialog-specific controls and actions.",
            },
        },
    },
    argTypes: {
        open: {
            control: { type: "boolean" },
            description: "Whether the dialog is open",
            table: { category: "State" },
        },
        multiple: {
            control: { type: "boolean" },
            description: "Allow multiple file selection",
            table: { category: "Selection" },
        },
        allowUpload: {
            control: { type: "boolean" },
            description: "Show upload functionality",
            table: { category: "Features" },
        },
        maxSelection: {
            control: { type: "number", min: 1, max: 20 },
            description: "Maximum number of files that can be selected",
            table: { category: "Selection" },
        },
        title: {
            control: { type: "text" },
            description: "Custom dialog title",
            table: { category: "Content" },
        },
        confirmText: {
            control: { type: "text" },
            description: "Custom confirm button text",
            table: { category: "Content" },
        },
        cancelText: {
            control: { type: "text" },
            description: "Custom cancel button text",
            table: { category: "Content" },
        },
        loading: {
            control: { type: "boolean" },
            description: "Show loading state",
            table: { category: "State" },
        },
        error: {
            control: { type: "text" },
            description: "Error message to display",
            table: { category: "State" },
        },
        onClose: {
            action: "close",
            description: "Callback when dialog is closed",
            table: { category: "Events" },
        },
        changeLocation: {
            action: "changeLocation",
            description: "Callback when location changes",
            table: { category: "Events" },
        },
        setSelectedFiles: {
            action: "setSelectedFiles",
            description: "Callback when selected files change",
            table: { category: "Events" },
        },
        clearSelection: {
            action: "clearSelection",
            description: "Callback to clear selection",
            table: { category: "Events" },
        },
        refreshFiles: {
            action: "refreshFiles",
            description: "Callback to refresh file list",
            table: { category: "Events" },
        },
        startUpload: {
            action: "startUpload",
            description: "Callback when files are uploaded",
            table: { category: "Events" },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockFiles: Graphql.FileInfo[] = [
    {
        __typename: "FileInfo",
        path: "/documents/report.pdf",
        name: "report.pdf",
        size: 2048576,
        created: "2024-01-16T09:15:00Z",
        lastModified: "2024-01-16T09:15:00Z",
        contentType: "application/pdf",
        fileType: "DOCUMENT",
        isPublic: false,
        url: "/api/storage/files/report.pdf",
    },
    {
        __typename: "FileInfo",
        path: "/images/photo1.jpg",
        name: "photo1.jpg",
        size: 1024000,
        created: "2024-01-13T11:30:00Z",
        lastModified: "2024-01-13T11:30:00Z",
        contentType: "image/jpeg",
        fileType: "IMAGE",
        isPublic: true,
        url: "https://picsum.photos/400/300?random=1",
        mediaLink: "https://picsum.photos/400/300?random=1",
    },
    {
        __typename: "FileInfo",
        path: "/images/photo2.jpg",
        name: "photo2.jpg",
        size: 1536000,
        created: "2024-01-12T14:20:00Z",
        lastModified: "2024-01-12T14:20:00Z",
        contentType: "image/jpeg",
        fileType: "IMAGE",
        isPublic: true,
        url: "https://picsum.photos/400/300?random=2",
        mediaLink: "https://picsum.photos/400/300?random=2",
    },
];

// Interactive wrapper component
const FilePickerDialogWrapper: React.FC<{
    multiple?: boolean;
    allowUpload?: boolean;
    maxSelection?: number;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    error?: string;
    initialFiles?: Graphql.FileInfo[];
    preSelected?: Graphql.FileInfo[];
}> = ({
    multiple = false,
    allowUpload = true,
    maxSelection,
    title,
    confirmText,
    cancelText,
    loading = false,
    error,
    initialFiles = mockFiles,
    preSelected = [],
}) => {
    const [open, setOpen] = useState(false);
    const [location, setLocation] =
        useState<Graphql.UploadLocation>("TEMPLATE_COVER");
    const [selectedFiles, setSelectedFiles] =
        useState<Graphql.FileInfo[]>(preSelected);

    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
                File Picker Dialog Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {multiple ? "Multiple selection" : "Single selection"} •
                {allowUpload ? " Upload enabled" : " Upload disabled"}
                {maxSelection && ` • Max ${maxSelection} files`}
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Open File Picker Dialog
            </Button>

            <FilePickerDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    action("close")();
                }}
                selectedFiles={selectedFiles}
                startUpload={async (files, targetPath) => {
                    action("startUpload")(files, targetPath);
                }}
                location={location}
                multiple={multiple}
                allowUpload={allowUpload}
                maxSelection={maxSelection}
                title={title}
                confirmText={confirmText}
                cancelText={cancelText}
                changeLocation={(newLocation) => {
                    setLocation(newLocation);
                    action("changeLocation")(newLocation);
                }}
                files={initialFiles}
                loading={loading}
                error={error}
                setSelectedFiles={(files) => {
                    setSelectedFiles(files);
                    action("setSelectedFiles")(files);
                }}
                clearSelection={() => {
                    setSelectedFiles([]);
                    action("clearSelection")();
                }}
                isFileProhibited={(file) => {
                    return file.name.includes("prohibited");
                }}
                refreshFiles={async () => {
                    action("refreshFiles")();
                }}
            />
        </Box>
    );
};

export const Default: Story = {
    render: () => <FilePickerDialogWrapper />,
};

export const MultipleSelection: Story = {
    render: () => <FilePickerDialogWrapper multiple={true} maxSelection={3} />,
    parameters: {
        docs: {
            description: {
                story: "Dialog allowing multiple file selection with a maximum limit.",
            },
        },
    },
};

export const CustomTitle: Story = {
    render: () => (
        <FilePickerDialogWrapper
            multiple={true}
            title="Choose Your Images"
            confirmText="Add Selected"
            cancelText="Close"
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Dialog with custom title and button text.",
            },
        },
    },
};

export const NoUpload: Story = {
    render: () => (
        <FilePickerDialogWrapper allowUpload={false} multiple={true} />
    ),
    parameters: {
        docs: {
            description: {
                story: "Dialog without upload functionality.",
            },
        },
    },
};

export const WithPreselection: Story = {
    render: () => (
        <FilePickerDialogWrapper
            multiple={true}
            preSelected={[mockFiles[0], mockFiles[1]]}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Dialog with files already pre-selected.",
            },
        },
    },
};

export const Loading: Story = {
    render: () => <FilePickerDialogWrapper loading={true} multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "Dialog showing loading state while files are being fetched.",
            },
        },
    },
};

export const WithError: Story = {
    render: () => (
        <FilePickerDialogWrapper
            error="Failed to load files. Please try again."
            multiple={true}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Dialog showing error state when file loading fails.",
            },
        },
    },
};

export const EmptyLocation: Story = {
    render: () => <FilePickerDialogWrapper initialFiles={[]} multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "Dialog when selected location has no files.",
            },
        },
    },
};

export const SingleSelectionOnly: Story = {
    render: () => <FilePickerDialogWrapper multiple={false} />,
    parameters: {
        docs: {
            description: {
                story: "Dialog for single file selection only.",
            },
        },
    },
};

export const LargeFileSet: Story = {
    render: () => (
        <FilePickerDialogWrapper
            initialFiles={[
                ...mockFiles,
                ...Array.from({ length: 25 }, (_, i) => ({
                    __typename: "FileInfo" as const,
                    path: `/documents/file-${i + 1}.txt`,
                    name: `document-${i + 1}.txt`,
                    size: Math.floor(Math.random() * 5000000),
                    created: new Date(2024, 0, i + 1).toISOString(),
                    lastModified: new Date(2024, 0, i + 1).toISOString(),
                    contentType: "text/plain",
                    fileType: "DOCUMENT" as const,
                    isPublic: false,
                    url: `/api/storage/files/file-${i + 1}.txt`,
                })),
            ]}
            multiple={true}
            maxSelection={10}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Dialog with many files to test scrolling and performance in modal context.",
            },
        },
    },
};

// Direct prop testing (always open)
export const AlwaysOpen: Story = {
    args: {
        open: true,
        selectedFiles: [],
        location: "TEMPLATE_COVER",
        multiple: true,
        allowUpload: true,
        files: mockFiles,
        loading: false,
        onClose: action("close"),
        changeLocation: action("changeLocation"),
        setSelectedFiles: action("setSelectedFiles"),
        clearSelection: action("clearSelection"),
        refreshFiles: async () => action("refreshFiles")(),
        startUpload: async (files, targetPath) =>
            action("startUpload")(files, targetPath),
        isFileProhibited: () => false,
    },
};
