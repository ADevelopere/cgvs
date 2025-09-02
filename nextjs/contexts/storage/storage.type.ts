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
    fetchList: (
        params: StorageQueryParams,
    ) => Promise<{ items: StorageItem[]; pagination: PaginationInfo } | null>;
    fetchDirectoryChildren: (
        path?: string,
    ) => Promise<DirectoryTreeNode[] | null>;
    fetchStats: (path?: string) => Promise<Graphql.StorageStats | null>;

    // File Operations
    rename: (path: string, newName: string) => Promise<boolean>;
    remove: (paths: string[]) => Promise<boolean>;
    move: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
    copy: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
    createFolder: (path: string, name: string) => Promise<boolean>;

    // Search
    search: (
        query: string,
        path?: string,
    ) => Promise<{ items: StorageItem[]; totalCount: number } | null>;
};

// UI context types for the StorageManagementUIContext
export type ViewMode = "grid" | "list";
export type ClipboardOperation = "copy" | "cut";

export type Clipboard = {
    operation: ClipboardOperation;
    items: StorageItem[];
};

export type LoadingStates = {
    fetchList: boolean;
    rename: boolean;
    delete: boolean;
    move: boolean;
    copy: boolean;
    createFolder: boolean;
    search: boolean;
    expandingNode: string | null;
    prefetchingNode: string | null;
};

export type OperationErrors = {
    fetchList?: string;
    rename?: string;
    delete?: string;
    move?: string;
    copy?: string;
    createFolder?: string;
    search?: string;
};

export type StorageManagementUIContextType = {
    // Data State
    items: StorageItem[];
    pagination: PaginationInfo | null;
    directoryTree: DirectoryTreeNode[];
    expandedNodes: Set<string>;
    prefetchedNodes: Set<string>;

    // Query Parameters
    params: StorageQueryParams;

    // Selection State
    selectedItems: string[];
    lastSelectedItem: string | null;
    focusedItem: string | null;

    // UI Interaction State
    viewMode: ViewMode;
    searchMode: boolean;
    searchResults: StorageItem[];
    clipboard: Clipboard | null;

    // Local UI State
    sortBy: string;
    sortDirection: Graphql.SortDirection;

    // Operation States
    loading: LoadingStates;
    operationErrors: OperationErrors;

    // Navigation Functions
    navigateTo: (path: string) => Promise<void>;
    goUp: () => Promise<void>;
    refresh: () => Promise<void>;
    expandDirectoryNode: (path: string) => Promise<void>;
    collapseDirectoryNode: (path: string) => void;
    prefetchDirectoryChildren: (path: string) => Promise<void>;

    // Selection Management
    toggleSelect: (path: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
    selectRange: (fromPath: string, toPath: string) => void;

    // Parameter Management
    setParams: (partial: Partial<StorageQueryParams>) => void;
    search: (term: string) => Promise<void>;
    setFilterType: (type?: Graphql.FileType) => void;
    setSortField: (field?: Graphql.FileSortField) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;

    // Local Sorting
    setSortBy: (field: string) => void;
    setSortDirection: (direction: Graphql.SortDirection) => void;
    getSortedItems: () => StorageItem[];

    // Clipboard Operations
    copyItems: (items: StorageItem[]) => void;
    cutItems: (items: StorageItem[]) => void;
    pasteItems: () => Promise<boolean>;

    // File Operations (UI Layer)
    renameItem: (path: string, newName: string) => Promise<boolean>;
    deleteItems: (paths: string[]) => Promise<boolean>;
    moveItems: (
        sourcePaths: string[],
        destinationPath: string,
    ) => Promise<boolean>;
    copyItemsTo: (
        sourcePaths: string[],
        destinationPath: string,
    ) => Promise<boolean>;

    // Utility Functions
    setViewMode: (mode: ViewMode) => void;
    setFocusedItem: (path: string | null) => void;
    exitSearchMode: () => void;
};

// Re-export GraphQL types for convenience
export type StorageStats = Graphql.StorageStats;
export type FileEntity = Graphql.FileEntity;
export type DirectoryEntity = Graphql.DirectoryEntity;
