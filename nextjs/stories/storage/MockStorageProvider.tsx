import React, { createContext, useContext, useMemo } from "react";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import * as Graphql from "@/graphql/generated/types";
import {
    StorageManagementContextType,
    StorageItem,
    UploadBatchState,
    StorageQueryParams,
} from "@/contexts/storage/storage.type";

// Mock context type extending the original but making everything optional for easier testing
export type MockStorageContextType = Partial<StorageManagementContextType> & {
    // Ensure we at least have the essential parts
    items?: StorageItem[];
    loading?: boolean;
    error?: string;
};

const MockStorageContext = createContext<MockStorageContextType | undefined>(
    undefined,
);

export const useMockStorageManagement = () => {
    const ctx = useContext(MockStorageContext);
    if (!ctx)
        throw new Error(
            "useMockStorageManagement must be used within MockStorageProvider",
        );
    return ctx;
};

// Default mock functions to prevent errors
const defaultMockFunctions: Partial<StorageManagementContextType> = {
    setParams: () => {},
    navigateTo: () => {},
    goUp: () => {},
    refresh: async () => {},
    toggleSelect: () => {},
    selectAll: () => {},
    clearSelection: () => {},
    rename: async () => false,
    remove: async () => false,
    search: () => {},
    setFilterType: () => {},
    setSortField: () => {},
    setPage: () => {},
    setLimit: () => {},
    startUpload: async () => {},
    cancelUpload: () => {},
    retryFailedUploads: async () => {},
    retryFile: async () => {},
    clearUploadBatch: () => {},
};

interface MockStorageProviderProps {
    children: React.ReactNode;
    mockValue: Partial<StorageManagementContextType>;
}

export const MockStorageProvider: React.FC<MockStorageProviderProps> = ({
    children,
    mockValue,
}) => {
    const value: MockStorageContextType = useMemo(
        () => ({
            items: [],
            loading: false,
            error: undefined,
            ...defaultMockFunctions,
            ...mockValue,
        }),
        [mockValue],
    );

    return (
        <MockStorageContext.Provider value={value}>
            <NotificationsProvider>{children}</NotificationsProvider>
        </MockStorageContext.Provider>
    );
};

// Mock storage management hook that can be imported by components under test
export const mockUseStorageManagement = (
    mockValue: Partial<StorageManagementContextType>,
) => {
    return {
        ...defaultMockFunctions,
        ...mockValue,
    } as StorageManagementContextType;
};

// Mock data generators
export const createMockFileItem = (
    overrides: Partial<Graphql.FileInfo> = {},
): Graphql.FileInfo => ({
    __typename: "FileInfo" as const,
    name: "example-file.jpg",
    path: "public/examples/example-file.jpg",
    size: 1024 * 1024, // 1MB
    fileType: "IMAGE" as Graphql.FileType,
    contentType: "image/jpeg",
    lastModified: new Date().toISOString(),
    created: new Date().toISOString(),
    isPublic: true,
    url: "https://example.com/files/example-file.jpg",
    md5Hash: "abc123",
    mediaLink: null,
    ...overrides,
});

export const createMockFolderItem = (
    overrides: Partial<Graphql.FolderInfo> = {},
): Graphql.FolderInfo => ({
    __typename: "FolderInfo" as const,
    name: "Example Folder",
    path: "public/examples",
    lastModified: new Date().toISOString(),
    created: new Date().toISOString(),
    fileCount: 0,
    folderCount: 0,
    totalSize: 0,
    ...overrides,
});

export const createMockStorageStats = (
    overrides: Partial<Graphql.StorageStats> = {},
): Graphql.StorageStats => ({
    totalFiles: 42,
    totalFolders: 5,
    totalSize: 1024 * 1024 * 150, // 150MB
    fileTypeBreakdown: [
        {
            __typename: "FileTypeCount",
            type: "IMAGE" as Graphql.FileType,
            count: 25,
        },
        {
            __typename: "FileTypeCount",
            type: "DOCUMENT" as Graphql.FileType,
            count: 10,
        },
        {
            __typename: "FileTypeCount",
            type: "VIDEO" as Graphql.FileType,
            count: 5,
        },
        {
            __typename: "FileTypeCount",
            type: "AUDIO" as Graphql.FileType,
            count: 2,
        },
    ],
    ...overrides,
});

export const createMockUploadBatch = (
    overrides: Partial<UploadBatchState> = {},
): UploadBatchState => {
    const mockFile = new File(["mock content"], "test-file.jpg", {
        type: "image/jpeg",
    });

    return {
        files: new Map([
            [
                "test-file.jpg-12345",
                {
                    file: mockFile,
                    progress: 50,
                    status: "uploading" as const,
                },
            ],
        ]),
        location: "TEMPLATE_COVER" as Graphql.UploadLocation,
        isUploading: true,
        completedCount: 0,
        totalCount: 1,
        targetPath: "templateCovers",
        ...overrides,
    };
};

export const createMockQueryParams = (
    overrides: Partial<StorageQueryParams> = {},
): StorageQueryParams => ({
    path: "",
    limit: 20,
    offset: 0,
    searchTerm: "",
    fileType: undefined,
    sortField: undefined,
    ...overrides,
});

// Common mock data sets for different scenarios
export const MOCK_DATA_SETS = {
    empty: {
        items: [],
        loading: false,
        error: undefined,
        selectedPaths: [],
        params: createMockQueryParams(),
        pagination: null,
        stats: createMockStorageStats({
            totalFiles: 0,
            totalSize: 0,
            fileTypeBreakdown: [],
        }),
        uploadBatch: undefined,
    },

    loading: {
        items: [],
        loading: true,
        error: undefined,
        selectedPaths: [],
        params: createMockQueryParams(),
        pagination: null,
        stats: undefined,
        uploadBatch: undefined,
    },

    error: {
        items: [],
        loading: false,
        error: "Failed to load storage items",
        selectedPaths: [],
        params: createMockQueryParams(),
        pagination: null,
        stats: undefined,
        uploadBatch: undefined,
    },

    withFiles: {
        items: [
            createMockFolderItem({ name: "Images", path: "images" }),
            createMockFileItem({
                name: "profile.jpg",
                path: "images/profile.jpg",
                fileType: "IMAGE" as Graphql.FileType,
            }),
            createMockFileItem({
                name: "resume.pdf",
                path: "documents/resume.pdf",
                fileType: "DOCUMENT" as Graphql.FileType,
                contentType: "application/pdf",
            }),
            createMockFileItem({
                name: "video.mp4",
                path: "media/video.mp4",
                fileType: "VIDEO" as Graphql.FileType,
                size: 50 * 1024 * 1024,
            }),
        ],
        loading: false,
        error: undefined,
        selectedPaths: [],
        params: createMockQueryParams({ path: "public" }),
        pagination: {
            totalCount: 4,
            limit: 20,
            offset: 0,
            hasMore: false,
        },
        stats: createMockStorageStats(),
        uploadBatch: undefined,
    },

    withSelection: {
        items: [
            createMockFileItem({ name: "file1.jpg", path: "images/file1.jpg" }),
            createMockFileItem({ name: "file2.jpg", path: "images/file2.jpg" }),
            createMockFileItem({
                name: "file3.pdf",
                path: "documents/file3.pdf",
                fileType: "DOCUMENT" as Graphql.FileType,
            }),
        ],
        loading: false,
        error: undefined,
        selectedPaths: ["images/file1.jpg", "documents/file3.pdf"],
        params: createMockQueryParams(),
        pagination: {
            totalCount: 3,
            limit: 20,
            offset: 0,
            hasMore: false,
        },
        stats: createMockStorageStats(),
        uploadBatch: undefined,
    },
    uploading: {
        items: [
            createMockFileItem({
                name: "existing-file.jpg",
                path: "images/existing-file.jpg",
            }),
        ],
        loading: false,
        error: undefined,
        selectedPaths: [],
        params: createMockQueryParams(),
        pagination: {
            totalCount: 1,
            limit: 20,
            offset: 0,
            hasMore: false,
        },
        stats: createMockStorageStats(),
        uploadBatch: createMockUploadBatch(),
    },
};
