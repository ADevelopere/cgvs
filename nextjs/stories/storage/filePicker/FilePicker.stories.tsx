import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import FilePicker from "@/views/storage/filePicker/FilePicker";
import * as Graphql from "@/graphql/generated/types";
import FilePickerWrapper from "./FilePickerWrapper";
import withGlobalStyles from "@/stories/Decorators";

const meta: Meta<typeof FilePicker> = {
    title: "Storage/FilePicker/FilePicker",
    component: FilePicker,
    decorators: [withGlobalStyles],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A comprehensive file picker component with location selection, view modes, upload capabilities, and file selection functionality.",
            },
        },
    },
    argTypes: {
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
        disabled: {
            control: { type: "boolean" },
            description: "Disable all interactions",
            table: { category: "State" },
        },
        viewMode: {
            control: { type: "select" },
            options: ["grid", "list"],
            description: "Display mode for files",
            table: { category: "Display" },
        },
        compact: {
            control: { type: "boolean" },
            description: "Use compact layout",
            table: { category: "Display" },
        },
        showLocationSelector: {
            control: { type: "boolean" },
            description: "Show location selector component",
            table: { category: "Features" },
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
        onViewModeChange: {
            action: "viewModeChange",
            description: "Callback when view mode changes",
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
        path: "/documents/presentation.pptx",
        name: "presentation.pptx",
        size: 5242880,
        created: "2024-01-15T16:45:00Z",
        lastModified: "2024-01-15T16:45:00Z",
        contentType:
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        fileType: "DOCUMENT",
        isPublic: false,
        url: "/api/storage/files/presentation.pptx",
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

// Interactive wrapper component using the shared FilePickerWrapper
const FilePickerStoryWrapper: React.FC<{
    initialLocation?: Graphql.UploadLocation;
    initialFiles?: Graphql.FileInfo[];
    initialViewMode?: "grid" | "list";
    multiple?: boolean;
    allowUpload?: boolean;
    maxSelection?: number;
    disabled?: boolean;
    compact?: boolean;
    showLocationSelector?: boolean;
    loading?: boolean;
    error?: string;
}> = (props) => {
    return (
        <FilePickerWrapper
            initialLocation={props.initialLocation}
            initialFiles={props.initialFiles || mockFiles}
            initialViewMode={props.initialViewMode}
            loading={props.loading}
            error={props.error}
        >
            {(wrapperState) => (
                <FilePicker
                    multiple={props.multiple || false}
                    allowUpload={props.allowUpload ?? true}
                    maxSelection={props.maxSelection}
                    disabled={props.disabled || false}
                    viewMode={wrapperState.viewMode}
                    onViewModeChange={(mode) => {
                        wrapperState.setViewMode(mode);
                        action("viewModeChange")(mode);
                    }}
                    compact={props.compact || false}
                    showLocationSelector={props.showLocationSelector ?? true}
                    location={wrapperState.location}
                    changeLocation={wrapperState.changeLocation}
                    files={wrapperState.files}
                    loading={wrapperState.loading}
                    error={wrapperState.error}
                    selectedFiles={wrapperState.selectedFiles}
                    setSelectedFiles={wrapperState.setSelectedFiles}
                    clearSelection={wrapperState.clearSelection}
                    isFileProhibited={wrapperState.isFileProhibited}
                    refreshFiles={wrapperState.refreshFiles}
                    uploadToLocation={wrapperState.uploadToLocation}
                    uploadFiles={wrapperState.uploadFiles}
                    isUploading={wrapperState.isUploading}
                    clearUploads={wrapperState.clearUploads}
                    cancelUpload={wrapperState.cancelUpload}
                    retryFile={wrapperState.retryFile}
                />
            )}
        </FilePickerWrapper>
    );
};

export const Default: Story = {
    render: () => <FilePickerStoryWrapper />,
};

export const MultipleSelection: Story = {
    render: () => <FilePickerStoryWrapper multiple={true} maxSelection={3} />,
    parameters: {
        docs: {
            description: {
                story: "Allows multiple file selection with a maximum limit.",
            },
        },
    },
};

export const ListView: Story = {
    render: () => <FilePickerStoryWrapper initialViewMode="list" multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "Displays files in list format instead of grid.",
            },
        },
    },
};

export const Compact: Story = {
    render: () => <FilePickerStoryWrapper compact={true} multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "Compact mode for use in dialogs or constrained spaces.",
            },
        },
    },
};

export const NoUpload: Story = {
    render: () => <FilePickerStoryWrapper allowUpload={false} multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "File picker without upload functionality.",
            },
        },
    },
};

export const NoLocationSelector: Story = {
    render: () => (
        <FilePickerStoryWrapper showLocationSelector={false} multiple={true} />
    ),
    parameters: {
        docs: {
            description: {
                story: "File picker without location selector (location pre-selected).",
            },
        },
    },
};

export const Loading: Story = {
    render: () => <FilePickerStoryWrapper loading={true} />,
    parameters: {
        docs: {
            description: {
                story: "Loading state while files are being fetched.",
            },
        },
    },
};

export const WithError: Story = {
    render: () => (
        <FilePickerStoryWrapper error="Failed to load files. Please try again." />
    ),
    parameters: {
        docs: {
            description: {
                story: "Error state when file loading fails.",
            },
        },
    },
};

export const EmptyLocation: Story = {
    render: () => <FilePickerStoryWrapper initialFiles={[]} />,
    parameters: {
        docs: {
            description: {
                story: "Empty state when no files are available in selected location.",
            },
        },
    },
};

export const NoLocationSelected: Story = {
    render: () => <FilePickerStoryWrapper initialLocation={undefined} />,
    parameters: {
        docs: {
            description: {
                story: "Initial state when no location is selected.",
            },
        },
    },
};

export const Disabled: Story = {
    render: () => <FilePickerStoryWrapper disabled={true} multiple={true} />,
    parameters: {
        docs: {
            description: {
                story: "Disabled state - all interactions are prevented.",
            },
        },
    },
};

export const SingleSelectionOnly: Story = {
    render: () => <FilePickerStoryWrapper multiple={false} />,
    parameters: {
        docs: {
            description: {
                story: "Single file selection mode.",
            },
        },
    },
};

export const ManyFiles: Story = {
    render: () => (
        <FilePickerStoryWrapper
            initialFiles={[
                ...mockFiles,
                ...Array.from({ length: 20 }, (_, i) => ({
                    __typename: "FileInfo" as const,
                    path: `/documents/file-${i + 1}.txt`,
                    name: `file-${i + 1}.txt`,
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
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "File picker with many files to test scrolling and performance.",
            },
        },
    },
};
