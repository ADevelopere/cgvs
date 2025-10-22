import * as Graphql from "@/client/graphql/generated/gql/graphql";

export type StorageItemUnion = Graphql.DirectoryInfo | Graphql.FileInfo;

// Storage directory node compatible with ReactiveTreeNode
export type StorageDirectoryNode = Graphql.DirectoryInfo & {
  id: string; // Same as path for ReactiveTreeNode compatibility
};

// UI context types for the StorageManagementUIContext
export type ViewMode = "grid" | "list";
export type StorageClipboardOperation = "copy" | "cut";

export type StorageClipboardState = {
  operation: StorageClipboardOperation;
  items: StorageItemUnion[];
};

export type LoadingStates = {
  fetchList: boolean;
  rename: boolean;
  delete: boolean;
  move: boolean;
  copy: boolean;
  createFolder: boolean;
  search: boolean;
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


export type StorageActions = {
  // Data actions
  setItems: (items: StorageItemUnion[]) => void;
  setPagination: (pagination: Graphql.PageInfo | null) => void;
  setParams: (params: Graphql.FilesListInput) => void;
  updateParams: (partial: Partial<Graphql.FilesListInput>) => void;
  setStats: (stats: Graphql.StorageStats | null) => void;
  navigateToDirectory: (data: {
    params: Graphql.FilesListInput;
    items: StorageItemUnion[];
    pagination: Graphql.PageInfo;
  }) => void;

  // Selection actions
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (fromPath: string, toPath: string, items: StorageItemUnion[]) => void;
  setLastSelectedItem: (path: string | null) => void;
  setFocusedItem: (path: string | null) => void;

  // UI interaction actions
  setViewMode: (mode: ViewMode) => void;
  setSearchMode: (mode: boolean) => void;
  setSearchResults: (results: StorageItemUnion[]) => void;
  copyItems: (items: StorageItemUnion[]) => void;
  cutItems: (items: StorageItemUnion[]) => void;
  clearClipboard: () => void;

  // Sorting actions
  setSortBy: (field: string) => void;
  setSortDirection: (direction: Graphql.OrderSortDirection) => void;
  getSortedItems: () => StorageItemUnion[];

  // Loading and error actions
  updateLoading: (
    key: keyof LoadingStates,
    value: boolean | string | null
  ) => void;
  updateError: (key: keyof OperationErrors, error?: string) => void;
  clearErrors: () => void;
  clearNavigationState: () => void;

  // Reset actions
  resetData: () => void;
  resetUI: () => void;
  resetAll: () => void;
};