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

export type StorageActions = {
  // Data actions
  setParams: (params: Graphql.FilesListInput) => void;
  updateParams: (partial: Partial<Graphql.FilesListInput>) => void;

  // Selection actions
  setSelectedItems: (items: string[]) => void;
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (
    fromPath: string,
    toPath: string,
    items: StorageItemUnion[]
  ) => void;
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
  getSortedItems: (items: StorageItemUnion[]) => StorageItemUnion[];

  // Reset actions
  resetData: () => void;
  resetUI: () => void;
  resetAll: () => void;
};
