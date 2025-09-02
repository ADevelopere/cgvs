import * as Graphql from "@/graphql/generated/types";

export type StorageQueryParams = {
    path: string; // This will be relative to 'public/' (e.g., "templateCover" instead of "public/templateCover")
    limit: number;
    offset: number;
    searchTerm?: string;
    fileType?: Graphql.FileType;
    sortField?: Graphql.FileSortField;
};

// Union type for storage items (files and folders)
export type StorageItem = Graphql.FileEntity | Graphql.DirectoryEntity;

// Pagination information
export type PaginationInfo = {
    hasMore: boolean;
    limit: number;
    offset: number;
    totalCount: number;
};

// Directory tree node for lazy loading
export type DirectoryTreeNode = {
    id: string;
    name: string;
    path: string;
    children?: DirectoryTreeNode[]; // undefined = not loaded, [] = loaded but empty, [...] = loaded with content
    hasChildren: boolean; // server indicates if this node has subdirectories
    isExpanded: boolean; // client-side expansion state
    isLoading: boolean; // loading state for this specific node
    isPrefetched: boolean; // whether children have been pre-fetched
};

// Core context type for the StorageManagementCoreContext
export type StorageManagementCoreContextType = {
    // State
    stats: Graphql.StorageStats | null;

    // Data Fetching
    fetchList: (params: StorageQueryParams) => Promise<{ items: StorageItem[], pagination: PaginationInfo } | null>;
    fetchDirectoryChildren: (path?: string) => Promise<DirectoryTreeNode[] | null>;
    fetchStats: (path?: string) => Promise<Graphql.StorageStats | null>;

    // File Operations
    rename: (path: string, newName: string) => Promise<boolean>;
    remove: (paths: string[]) => Promise<boolean>;
    move: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
    copy: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
    createFolder: (path: string, name: string) => Promise<boolean>;

    // Search
    search: (query: string, path?: string) => Promise<{ items: StorageItem[], totalCount: number } | null>;
};

// Re-export GraphQL types for convenience
export type StorageStats = Graphql.StorageStats;
export type FileEntity = Graphql.FileEntity;
export type DirectoryEntity = Graphql.DirectoryEntity;