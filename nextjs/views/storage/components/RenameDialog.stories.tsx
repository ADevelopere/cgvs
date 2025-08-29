import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import RenameDialog from "./RenameDialog";

const meta: Meta<typeof RenameDialog> = {
    title: "Storage/Components/RenameDialog",
    component: RenameDialog,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A dialog component for renaming files and folders with validation and error handling.",
            },
        },
    },
    argTypes: {
        open: {
            control: { type: "boolean" },
            description: "Whether the dialog is open",
            table: { category: "State" },
        },
        currentPath: {
            control: { type: "text" },
            description: "Current file/folder path",
            table: { category: "Data" },
        },
        currentName: {
            control: { type: "text" },
            description: "Current file/folder name",
            table: { category: "Data" },
        },
        onClose: {
            action: "close",
            description: "Callback when dialog is closed",
            table: { category: "Events" },
        },
        onRename: {
            action: "rename",
            description: "Callback when rename operation is performed",
            table: { category: "Events" },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper to control dialog state
const RenameDialogWrapper: React.FC<{
    currentPath: string;
    currentName: string;
    onRename: (path: string, newName: string) => Promise<boolean>;
    simulateSuccess?: boolean;
    simulateDelay?: boolean;
}> = ({
    currentPath,
    currentName,
    onRename,
    simulateSuccess = true,
    simulateDelay = false,
}) => {
    const [open, setOpen] = useState(false);

    const handleRename = async (path: string, newName: string) => {
        action("rename")(path, newName);

        if (simulateDelay) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const result = await onRename(path, newName);
        return simulateSuccess ? true : result;
    };

    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
                Rename Dialog Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                File: {currentName} (Path: {currentPath})
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Open Rename Dialog
            </Button>

            <RenameDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    action("close")();
                }}
                currentPath={currentPath}
                currentName={currentName}
                onRename={handleRename}
            />
        </Box>
    );
};

export const Default: Story = {
    render: () => (
        <RenameDialogWrapper
            currentPath="/documents/report.pdf"
            currentName="report.pdf"
            onRename={async (path, newName) => {
                action("rename")(path, newName);
                return true;
            }}
        />
    ),
};

export const FolderRename: Story = {
    render: () => (
        <RenameDialogWrapper
            currentPath="/documents/ProjectFiles"
            currentName="ProjectFiles"
            onRename={async (path, newName) => {
                action("rename")(path, newName);
                return true;
            }}
        />
    ),
};

export const WithDelay: Story = {
    render: () => (
        <RenameDialogWrapper
            currentPath="/images/photo.jpg"
            currentName="photo.jpg"
            onRename={async (path, newName) => {
                action("rename")(path, newName);
                return true;
            }}
            simulateDelay={true}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Simulates a slow rename operation to test loading states.",
            },
        },
    },
};

export const FailureScenario: Story = {
    render: () => (
        <RenameDialogWrapper
            currentPath="/readonly/system.cfg"
            currentName="system.cfg"
            onRename={async (path, newName) => {
                action("rename")(path, newName);
                return false; // Simulate failure
            }}
            simulateSuccess={false}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Simulates a failed rename operation to test error handling.",
            },
        },
    },
};

export const LongFileName: Story = {
    render: () => (
        <RenameDialogWrapper
            currentPath="/documents/very-long-file-name-that-might-cause-display-issues.docx"
            currentName="very-long-file-name-that-might-cause-display-issues.docx"
            onRename={async (path, newName) => {
                action("rename")(path, newName);
                return true;
            }}
        />
    ),
    parameters: {
        docs: {
            description: {
                story: "Tests the dialog with a long filename to verify text handling.",
            },
        },
    },
};

// Direct prop testing (dialog always open)
export const AlwaysOpen: Story = {
    args: {
        open: true,
        currentPath: "/test/example.txt",
        currentName: "example.txt",
        onClose: action("close"),
        onRename: async (path: string, newName: string) => {
            action("rename")(path, newName);
            return true;
        },
    },
};
