import * as Graphql from "@/graphql/generated/types";

// Types for local state
export type StorageItem = Graphql.FileInfo | Graphql.FolderInfo;

export type StorageQueryParams = {
    path: string; // This will be relative to 'public/' (e.g., "templateCover" instead of "public/templateCover")
    limit: number;
    offset: number;
    searchTerm?: string;
    fileType?: Graphql.FileType;
    sortField?: Graphql.FileSortField;
};

export type StorageManagementContextType = {
    // Data
    items: StorageItem[];
    stats?: Graphql.StorageStats;
    pagination: {
        totalCount: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    } | null;

    // Selection
    selectedPaths: string[];

    // Query params
    params: StorageQueryParams;

    // Loading/error
    loading: boolean;
    error?: string;

    // Actions
    setParams: (partial: Partial<StorageQueryParams>) => void;
    navigateTo: (path: string) => void;
    goUp: () => void;
    refresh: () => Promise<void>;

    toggleSelect: (path: string) => void;
    selectAll: () => void;
    clearSelection: () => void;

    rename: (path: string, newName: string) => Promise<boolean>;
    remove: (paths: string[]) => Promise<boolean>;

    search: (term: string) => void;
    setFilterType: (type?: Graphql.FileType) => void;
    setSortField: (field?: Graphql.FileSortField) => void;
    setPage: (page: number) => void; // converts to offset
    setLimit: (limit: number) => void;
};

export type UploadFileState = {
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
    signedUrl?: string;
    xhr?: XMLHttpRequest;
};

export type UploadBatchState = {
    files: Map<string, UploadFileState>;
    location: Graphql.UploadLocation;
    targetPath: string;
    isUploading: boolean;
    completedCount: number;
    totalCount: number;
    totalProgress: number;
    timeRemaining: number | null; // in seconds
    totalSize: number;
    bytesUploaded: number;
};

export type StorageUploadContextType = {
    uploadBatch: UploadBatchState | undefined;
    startUpload: (
        files: File[],
        targetPath: string,
        callbacks?: { onComplete?: () => void },
    ) => Promise<void>;
    cancelUpload: (fileKey?: string) => void;
    retryFailedUploads: () => Promise<void>;
    retryFile: (fileKey: string) => Promise<void>;
    clearUploadBatch: () => void;
};
