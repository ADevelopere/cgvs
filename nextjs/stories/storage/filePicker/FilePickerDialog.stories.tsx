import type { Meta, StoryFn } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import FilePickerDialog from "@/views/storage/filePicker/FilePickerDialog";
import * as Graphql from "@/graphql/generated/types";
import FilePickerWrapper from "./FilePickerWrapper";
import withGlobalStyles from "@/stories/Decorators";
import { 
    commonStoryArgTypes, 
    defaultStoryArgs, 
    CommonStoryArgTypesProps 
} from "@/stories/argTypes";
import useStoryTheme from "@/stories/useStoryTheme";

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
        ...commonStoryArgTypes,
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
        onClose: {
            action: "close",
            description: "Callback when dialog is closed",
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

type FilePickerDialogStoryProps = CommonStoryArgTypesProps & {
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
};

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

// Interactive wrapper component using the shared FilePickerWrapper
const FilePickerDialogWrapper: React.FC<CommonStoryArgTypesProps & {
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
    ...storyArgs
}) => {
    useStoryTheme(storyArgs);
    const [open, setOpen] = useState(false);

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

            <FilePickerWrapper
                initialFiles={initialFiles}
                preSelected={preSelected}
                loading={loading}
                error={error}
            >
                {(wrapperState) => (
                    <FilePickerDialog
                        open={open}
                        onClose={() => {
                            setOpen(false);
                            action("close")();
                        }}
                        selectedFiles={wrapperState.selectedFiles}
                        startUpload={async (files, targetPath) => {
                            action("startUpload")(files, targetPath);
                        }}
                        location={wrapperState.location}
                        multiple={multiple}
                        allowUpload={allowUpload}
                        maxSelection={maxSelection}
                        title={title}
                        confirmText={confirmText}
                        cancelText={cancelText}
                        changeLocation={wrapperState.changeLocation}
                        files={wrapperState.files}
                        loading={wrapperState.loading}
                        error={wrapperState.error}
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
        </Box>
    );
};

const Template: StoryFn<FilePickerDialogStoryProps> = (args) => {
    return <FilePickerDialogWrapper {...args} />;
};

export const Default = Template.bind({});
Default.args = {
    ...defaultStoryArgs,
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
    ...defaultStoryArgs,
    multiple: true,
    maxSelection: 3,
};
MultipleSelection.parameters = {
    docs: {
        description: {
            story: "Dialog allowing multiple file selection with a maximum limit.",
        },
    },
};

export const CustomTitle = Template.bind({});
CustomTitle.args = {
    ...defaultStoryArgs,
    multiple: true,
    title: "Choose Your Images",
    confirmText: "Add Selected",
    cancelText: "Close",
};
CustomTitle.parameters = {
    docs: {
        description: {
            story: "Dialog with custom title and button text.",
        },
    },
};

export const NoUpload = Template.bind({});
NoUpload.args = {
    ...defaultStoryArgs,
    allowUpload: false,
    multiple: true,
};
NoUpload.parameters = {
    docs: {
        description: {
            story: "Dialog without upload functionality.",
        },
    },
};

export const WithPreselection = Template.bind({});
WithPreselection.args = {
    ...defaultStoryArgs,
    multiple: true,
    preSelected: [mockFiles[0], mockFiles[1]],
};
WithPreselection.parameters = {
    docs: {
        description: {
            story: "Dialog with files already pre-selected.",
        },
    },
};

export const Loading = Template.bind({});
Loading.args = {
    ...defaultStoryArgs,
    loading: true,
    multiple: true,
};
Loading.parameters = {
    docs: {
        description: {
            story: "Dialog showing loading state while files are being fetched.",
        },
    },
};

export const WithError = Template.bind({});
WithError.args = {
    ...defaultStoryArgs,
    error: "Failed to load files. Please try again.",
    multiple: true,
};
WithError.parameters = {
    docs: {
        description: {
            story: "Dialog showing error state when file loading fails.",
        },
    },
};

export const EmptyLocation = Template.bind({});
EmptyLocation.args = {
    ...defaultStoryArgs,
    initialFiles: [],
    multiple: true,
};
EmptyLocation.parameters = {
    docs: {
        description: {
            story: "Dialog when selected location has no files.",
        },
    },
};

export const SingleSelectionOnly = Template.bind({});
SingleSelectionOnly.args = {
    ...defaultStoryArgs,
    multiple: false,
};
SingleSelectionOnly.parameters = {
    docs: {
        description: {
            story: "Dialog for single file selection only.",
        },
    },
};

export const LargeFileSet = Template.bind({});
LargeFileSet.args = {
    ...defaultStoryArgs,
    initialFiles: [
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
    ],
    multiple: true,
    maxSelection: 10,
};
LargeFileSet.parameters = {
    docs: {
        description: {
            story: "Dialog with many files to test scrolling and performance in modal context.",
        },
    },
};

// Direct prop testing (always open)
export const AlwaysOpen = Template.bind({});
AlwaysOpen.args = {
    ...defaultStoryArgs,
    initialFiles: mockFiles,
    multiple: true,
    allowUpload: true,
    // For the AlwaysOpen story, we need a special wrapper that doesn't use the button
    // This will need to be handled differently or as a special case
};
