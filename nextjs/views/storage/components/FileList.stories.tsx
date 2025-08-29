import type { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "@storybook/addon-actions";
import FileList from "./FileList";
import { StorageItem } from "@/contexts/storage/storage.type";

const meta: Meta<typeof FileList> = {
    title: "Storage/Components/FileList",
    component: FileList,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "A list component that displays files and folders with actions for selection, navigation, deletion, and renaming.",
            },
        },
    },
    argTypes: {
        items: {
            control: { type: "object" },
            description:
                "Array of storage items (files and folders) to display",
            table: { category: "Data" },
        },
        loading: {
            control: { type: "boolean" },
            description: "Whether the list is in loading state",
            table: { category: "State" },
        },
        selectedPaths: {
            control: { type: "object" },
            description: "Array of selected item paths",
            table: { category: "State" },
        },
        error: {
            control: { type: "text" },
            description: "Error message to display",
            table: { category: "State" },
        },
        onToggleSelect: {
            action: "toggleSelect",
            description: "Callback when an item's selection is toggled",
            table: { category: "Events" },
        },
        onNavigateTo: {
            action: "navigateTo",
            description: "Callback when navigating to a folder",
            table: { category: "Events" },
        },
        onDelete: {
            action: "delete",
            description: "Callback when deleting items",
            table: { category: "Events" },
        },
        onRename: {
            action: "rename",
            description: "Callback when renaming an item",
            table: { category: "Events" },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockFolders: StorageItem[] = [
    {
        __typename: "FolderInfo",
        path: "/documents",
        name: "Documents",
        created: "2024-01-15T10:30:00Z",
        lastModified: "2024-01-15T10:30:00Z",
        fileCount: 5,
        folderCount: 2,
        totalSize: 10485760,
    },
    {
        __typename: "FolderInfo",
        path: "/images",
        name: "Images",
        created: "2024-01-14T14:20:00Z",
        lastModified: "2024-01-14T14:20:00Z",
        fileCount: 12,
        folderCount: 0,
        totalSize: 52428800,
    },
];

const mockFiles: StorageItem[] = [
    {
        __typename: "FileInfo",
        path: "/report.pdf",
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
        path: "/presentation.pptx",
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
        path: "/data.xlsx",
        name: "data.xlsx",
        size: 1024000,
        created: "2024-01-13T11:30:00Z",
        lastModified: "2024-01-13T11:30:00Z",
        contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileType: "DOCUMENT",
        isPublic: false,
        url: "/api/storage/files/data.xlsx",
    },
];

const mixedItems = [...mockFolders, ...mockFiles];

// Action handlers with logging
const actionHandlers = {
    onToggleSelect: action("toggleSelect"),
    onNavigateTo: action("navigateTo"),
    onDelete: async (paths: string[]) => {
        action("delete")(paths);
        return true;
    },
    onRename: action("rename"),
};

export const Default: Story = {
    args: {
        items: mixedItems,
        loading: false,
        selectedPaths: [],
        ...actionHandlers,
    },
};

export const Loading: Story = {
    args: {
        items: [],
        loading: true,
        selectedPaths: [],
        ...actionHandlers,
    },
};

export const Empty: Story = {
    args: {
        items: [],
        loading: false,
        selectedPaths: [],
        ...actionHandlers,
    },
};

export const WithError: Story = {
    args: {
        items: [],
        loading: false,
        selectedPaths: [],
        error: "Failed to load files. Please try again.",
        ...actionHandlers,
    },
};

export const OnlyFolders: Story = {
    args: {
        items: mockFolders,
        loading: false,
        selectedPaths: [],
        ...actionHandlers,
    },
};

export const OnlyFiles: Story = {
    args: {
        items: mockFiles,
        loading: false,
        selectedPaths: [],
        ...actionHandlers,
    },
};

export const WithSelections: Story = {
    args: {
        items: mixedItems,
        loading: false,
        selectedPaths: ["/documents", "/report.pdf"],
        ...actionHandlers,
    },
};

export const LargeList: Story = {
    args: {
        items: [
            ...Array.from({ length: 20 }, (_, i) => ({
                __typename: "FolderInfo" as const,
                path: `/folder-${i + 1}`,
                name: `Folder ${i + 1}`,
                created: new Date(2024, 0, i + 1).toISOString(),
                lastModified: new Date(2024, 0, i + 1).toISOString(),
                fileCount: Math.floor(Math.random() * 20),
                folderCount: Math.floor(Math.random() * 5),
                totalSize: Math.floor(Math.random() * 100000000),
            })),
            ...Array.from({ length: 30 }, (_, i) => ({
                __typename: "FileInfo" as const,
                path: `/file-${i + 1}.txt`,
                name: `file-${i + 1}.txt`,
                size: Math.floor(Math.random() * 10000000),
                created: new Date(2024, 0, i + 1).toISOString(),
                lastModified: new Date(2024, 0, i + 1).toISOString(),
                contentType: "text/plain",
                fileType: "DOCUMENT" as const,
                isPublic: false,
                url: `/api/storage/files/file-${i + 1}.txt`,
            })),
        ],
        loading: false,
        selectedPaths: [],
        ...actionHandlers,
    },
};
