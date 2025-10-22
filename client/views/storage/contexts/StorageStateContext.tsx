"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  StorageItem,
  ViewMode,
  StorageClipboardState,
  LoadingStates,
  OperationErrors,
  DirectoryTreeNode,
  QueueStates,
} from "../core/storage.type";

// ============================================================================
// STATE INTERFACES
// ============================================================================

// Data State (from useStorageDataStore)
type DataState = {
  items: StorageItem[];
  pagination: Graphql.PageInfo | null;
  params: Graphql.FilesListInput;
  stats: Graphql.StorageStats | null;
};

// UI State (from useStorageUIStore)
type UIState = {
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;
  viewMode: ViewMode;
  searchMode: boolean;
  searchResults: StorageItem[];
  clipboard: StorageClipboardState | null;
  sortBy: string;
  sortDirection: Graphql.OrderSortDirection;
  loading: LoadingStates;
  operationErrors: OperationErrors;
};

// Tree State (from useStorageTreeStore)
type TreeState = {
  directoryTree: DirectoryTreeNode[];
  expandedNodes: Set<string>;
  prefetchedNodes: Set<string>;
  queueStates: QueueStates;
};

// ============================================================================
// CONTEXT VALUE INTERFACE
// ============================================================================

export type StorageStateContextValueState = {
  // Data state
  items: StorageItem[];
  pagination: Graphql.PageInfo | null;
  params: Graphql.FilesListInput;
  stats: Graphql.StorageStats | null;

  // UI state
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;
  viewMode: ViewMode;
  searchMode: boolean;
  searchResults: StorageItem[];
  clipboard: StorageClipboardState | null;
  sortBy: string;
  sortDirection: Graphql.OrderSortDirection;
  loading: LoadingStates;
  operationErrors: OperationErrors;

  // Tree state
  directoryTree: DirectoryTreeNode[];
  expandedNodes: Set<string>;
  prefetchedNodes: Set<string>;
  queueStates: QueueStates;
};

export type StorageStateContextValueActions = {
  // Data actions
  setItems: (items: StorageItem[]) => void;
  setPagination: (pagination: Graphql.PageInfo | null) => void;
  setParams: (params: Graphql.FilesListInput) => void;
  updateParams: (partial: Partial<Graphql.FilesListInput>) => void;
  setStats: (stats: Graphql.StorageStats | null) => void;
  navigateToDirectory: (data: {
    params: Graphql.FilesListInput;
    items: StorageItem[];
    pagination: Graphql.PageInfo;
  }) => void;

  // Selection actions
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (fromPath: string, toPath: string, items: StorageItem[]) => void;
  setLastSelectedItem: (path: string | null) => void;
  setFocusedItem: (path: string | null) => void;

  // UI interaction actions
  setViewMode: (mode: ViewMode) => void;
  setSearchMode: (mode: boolean) => void;
  setSearchResults: (results: StorageItem[]) => void;
  copyItems: (items: StorageItem[]) => void;
  cutItems: (items: StorageItem[]) => void;
  clearClipboard: () => void;

  // Sorting actions
  setSortBy: (field: string) => void;
  setSortDirection: (direction: Graphql.OrderSortDirection) => void;
  getSortedItems: () => StorageItem[];

  // Loading and error actions
  updateLoading: (
    key: keyof LoadingStates,
    value: boolean | string | null
  ) => void;
  updateError: (key: keyof OperationErrors, error?: string) => void;
  clearErrors: () => void;
  clearNavigationState: () => void;

  // Tree management actions
  setDirectoryTree: (tree: DirectoryTreeNode[]) => void;
  updateTreeNode: (
    path: string,
    updater: (node: DirectoryTreeNode) => DirectoryTreeNode
  ) => void;
  addChildToNode: (parentPath: string, children: DirectoryTreeNode[]) => void;

  // Node state actions
  expandNode: (path: string) => void;
  collapseNode: (path: string) => void;
  setPrefetchedNode: (path: string, isPrefetched: boolean) => void;

  // Queue management actions
  addToFetchQueue: (path: string) => void;
  removeFromFetchQueue: (path: string) => void;
  addToExpansionQueue: (path: string) => void;
  removeFromExpansionQueue: (path: string) => void;
  setCurrentlyFetching: (path: string, isFetching: boolean) => void;
  clearQueues: () => void;

  // Reset actions
  resetData: () => void;
  resetUI: () => void;
  resetTree: () => void;
  resetAll: () => void;
};

type StorageStateContextValue = {
  state: StorageStateContextValueState;
  actions: StorageStateContextValueActions;
};

// ============================================================================
// CONTEXT
// ============================================================================

const StorageStateContext = createContext<StorageStateContextValue | null>(
  null
);

// ============================================================================
// INITIAL STATES
// ============================================================================

const initialDataState: DataState = {
  items: [],
  pagination: null,
  params: {
    path: "",
    limit: 50,
    offset: 0,
  },
  stats: null,
};

const initialLoadingState: LoadingStates = {
  fetchList: false,
  rename: false,
  delete: false,
  move: false,
  copy: false,
  createFolder: false,
  search: false,
  expandingNode: null,
  prefetchingNode: null,
};

const initialUIState: UIState = {
  selectedItems: [],
  lastSelectedItem: null,
  focusedItem: null,
  viewMode: "grid",
  searchMode: false,
  searchResults: [],
  clipboard: null,
  sortBy: "name",
  sortDirection: "ASC",
  loading: initialLoadingState,
  operationErrors: {},
};

const initialQueueStates: QueueStates = {
  fetchQueue: new Set(),
  expansionQueue: new Set(),
  currentlyFetching: new Set(),
};

const initialTreeState: TreeState = {
  directoryTree: [],
  expandedNodes: new Set(),
  prefetchedNodes: new Set(),
  queueStates: initialQueueStates,
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const StorageStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ============================================================================
  // DATA STATE (from useStorageDataStore)
  // ============================================================================
  const [items, setItems] = useState<StorageItem[]>(initialDataState.items);
  const [pagination, setPagination] = useState<Graphql.PageInfo | null>(
    initialDataState.pagination
  );
  const [params, setParams] = useState<Graphql.FilesListInput>(
    initialDataState.params
  );
  const [stats, setStats] = useState<Graphql.StorageStats | null>(
    initialDataState.stats
  );

  // ============================================================================
  // UI STATE (from useStorageUIStore)
  // ============================================================================
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialUIState.selectedItems
  );
  const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(
    initialUIState.lastSelectedItem
  );
  const [focusedItem, setFocusedItem] = useState<string | null>(
    initialUIState.focusedItem
  );
  const [viewMode, setViewMode] = useState<ViewMode>(initialUIState.viewMode);
  const [searchMode, setSearchMode] = useState<boolean>(
    initialUIState.searchMode
  );
  const [searchResults, setSearchResults] = useState<StorageItem[]>(
    initialUIState.searchResults
  );
  const [clipboard, setClipboard] = useState<StorageClipboardState | null>(
    initialUIState.clipboard
  );
  const [sortBy, setSortBy] = useState<string>(initialUIState.sortBy);
  const [sortDirection, setSortDirection] =
    useState<Graphql.OrderSortDirection>(initialUIState.sortDirection);
  const [loading, setLoading] = useState<LoadingStates>(initialUIState.loading);
  const [operationErrors, setOperationErrors] = useState<OperationErrors>(
    initialUIState.operationErrors
  );

  // ============================================================================
  // TREE STATE (from useStorageTreeStore)
  // ============================================================================
  const [directoryTree, setDirectoryTree] = useState<DirectoryTreeNode[]>(
    initialTreeState.directoryTree
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    initialTreeState.expandedNodes
  );
  const [prefetchedNodes, setPrefetchedNodes] = useState<Set<string>>(
    initialTreeState.prefetchedNodes
  );
  const [queueStates, setQueueStates] = useState<QueueStates>(
    initialTreeState.queueStates
  );

  // ============================================================================
  // DATA ACTIONS
  // ============================================================================

  const updateParams = useCallback(
    (partial: Partial<Graphql.FilesListInput>) => {
      setParams(prev => ({ ...prev, ...partial }));
    },
    []
  );

  const navigateToDirectory = useCallback(
    (data: {
      params: Graphql.FilesListInput;
      items: StorageItem[];
      pagination: Graphql.PageInfo;
    }) => {
      setParams(data.params);
      setItems(data.items);
      setPagination(data.pagination);
    },
    []
  );

  // ============================================================================
  // SELECTION ACTIONS (from useStorageUIStore + useStorageSelection)
  // ============================================================================

  const toggleSelect = useCallback((path: string) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(path);
      const newSelection = isSelected
        ? prev.filter(p => p !== path)
        : [...prev, path];
      return newSelection;
    });
    setLastSelectedItem(path);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(items.map(item => item.path));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setLastSelectedItem(null);
  }, []);

  const selectRange = useCallback(
    (fromPath: string, toPath: string, itemsList: StorageItem[]) => {
      const fromIndex = itemsList.findIndex(item => item.path === fromPath);
      const toIndex = itemsList.findIndex(item => item.path === toPath);

      if (fromIndex === -1 || toIndex === -1) return;

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);
      const rangePaths = itemsList.slice(start, end + 1).map(item => item.path);

      setSelectedItems(prev => {
        const newSelection = new Set([...prev, ...rangePaths]);
        return Array.from(newSelection);
      });
    },
    []
  );

  // ============================================================================
  // CLIPBOARD ACTIONS
  // ============================================================================

  const copyItems = useCallback((itemsList: StorageItem[]) => {
    setClipboard({ operation: "copy", items: itemsList });
  }, []);

  const cutItems = useCallback((itemsList: StorageItem[]) => {
    setClipboard({ operation: "cut", items: itemsList });
  }, []);

  const clearClipboard = useCallback(() => {
    setClipboard(null);
  }, []);

  // ============================================================================
  // SORTING ACTIONS (from useStorageUIStore + useStorageSorting)
  // ============================================================================

  const getSortedItems = useCallback((): StorageItem[] => {
    const currentItems = searchMode ? searchResults : items;

    return [...currentItems].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "size":
          // FileInfo has size, DirectoryInfo has totalSize
          if (a.__typename === "FileInfo") {
            aValue = a.size;
          } else if (a.__typename === "DirectoryInfo") {
            aValue = a.totalSize || 0;
          } else {
            aValue = 0;
          }

          if (b.__typename === "FileInfo") {
            bValue = b.size;
          } else if (b.__typename === "DirectoryInfo") {
            bValue = b.totalSize || 0;
          } else {
            bValue = 0;
          }
          break;
        case "lastModified":
          aValue =
            (a as unknown as { lastModified?: number }).lastModified ?? 0;
          bValue =
            (b as unknown as { lastModified?: number }).lastModified ?? 0;
          break;
        case "created":
          aValue = (a as unknown as { created?: number }).created ?? 0;
          bValue = (b as unknown as { created?: number }).created ?? 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;
      return 0;
    });
  }, [searchMode, searchResults, items, sortBy, sortDirection]);

  // ============================================================================
  // LOADING AND ERROR ACTIONS
  // ============================================================================

  const updateLoading = useCallback(
    (key: keyof LoadingStates, value: boolean | string | null) => {
      setLoading(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateError = useCallback(
    (key: keyof OperationErrors, error?: string) => {
      setOperationErrors(prev => ({ ...prev, [key]: error }));
    },
    []
  );

  const clearErrors = useCallback(() => {
    setOperationErrors({});
  }, []);

  const clearNavigationState = useCallback(() => {
    setSelectedItems([]);
    setLastSelectedItem(null);
    setSearchMode(false);
    setSearchResults([]);
  }, []);

  // ============================================================================
  // TREE MANAGEMENT ACTIONS
  // ============================================================================

  const updateTreeNode = useCallback(
    (path: string, updater: (node: DirectoryTreeNode) => DirectoryTreeNode) => {
      setDirectoryTree(prevTree => {
        const updateNode = (
          nodes: DirectoryTreeNode[]
        ): DirectoryTreeNode[] => {
          return nodes.map(node => {
            if (node.path === path) {
              return updater(node);
            }
            if (node.children) {
              return {
                ...node,
                children: updateNode(node.children),
              };
            }
            return node;
          });
        };

        return updateNode(prevTree);
      });
    },
    []
  );

  const addChildToNode = useCallback(
    (parentPath: string, children: DirectoryTreeNode[]) => {
      setDirectoryTree(prevTree => {
        const updateNode = (
          nodes: DirectoryTreeNode[]
        ): DirectoryTreeNode[] => {
          return nodes.map(node => {
            if (node.path === parentPath) {
              return {
                ...node,
                children,
                isPrefetched: true,
              };
            }
            if (node.children) {
              return {
                ...node,
                children: updateNode(node.children),
              };
            }
            return node;
          });
        };

        return updateNode(prevTree);
      });
    },
    []
  );

  // ============================================================================
  // NODE STATE ACTIONS
  // ============================================================================

  const expandNode = useCallback((path: string) => {
    setExpandedNodes(prev => new Set([...prev, path]));
  }, []);

  const collapseNode = useCallback((path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(path);
      return newSet;
    });
  }, []);

  const setPrefetchedNode = useCallback(
    (path: string, isPrefetched: boolean) => {
      setPrefetchedNodes(prev => {
        const newSet = new Set(prev);
        if (isPrefetched) {
          newSet.add(path);
        } else {
          newSet.delete(path);
        }
        return newSet;
      });
    },
    []
  );

  // ============================================================================
  // QUEUE MANAGEMENT ACTIONS
  // ============================================================================

  const addToFetchQueue = useCallback((path: string) => {
    setQueueStates(prev => ({
      ...prev,
      fetchQueue: new Set([...prev.fetchQueue, path]),
    }));
  }, []);

  const removeFromFetchQueue = useCallback((path: string) => {
    setQueueStates(prev => ({
      ...prev,
      fetchQueue: new Set([...prev.fetchQueue].filter(p => p !== path)),
    }));
  }, []);

  const addToExpansionQueue = useCallback((path: string) => {
    setQueueStates(prev => ({
      ...prev,
      expansionQueue: new Set([...prev.expansionQueue, path]),
    }));
  }, []);

  const removeFromExpansionQueue = useCallback((path: string) => {
    setQueueStates(prev => ({
      ...prev,
      expansionQueue: new Set([...prev.expansionQueue].filter(p => p !== path)),
    }));
  }, []);

  const setCurrentlyFetching = useCallback(
    (path: string, isFetching: boolean) => {
      setQueueStates(prev => {
        const newSet = new Set(prev.currentlyFetching);
        if (isFetching) {
          newSet.add(path);
        } else {
          newSet.delete(path);
        }
        return {
          ...prev,
          currentlyFetching: newSet,
        };
      });
    },
    []
  );

  const clearQueues = useCallback(() => {
    setQueueStates(prev => ({
      ...prev,
      fetchQueue: new Set(),
      expansionQueue: new Set(),
      currentlyFetching: new Set(),
    }));
  }, []);

  // ============================================================================
  // RESET ACTIONS
  // ============================================================================

  const resetData = useCallback(() => {
    setItems(initialDataState.items);
    setPagination(initialDataState.pagination);
    setParams(initialDataState.params);
    setStats(initialDataState.stats);
  }, []);

  const resetUI = useCallback(() => {
    setSelectedItems(initialUIState.selectedItems);
    setLastSelectedItem(initialUIState.lastSelectedItem);
    setFocusedItem(initialUIState.focusedItem);
    setViewMode(initialUIState.viewMode);
    setSearchMode(initialUIState.searchMode);
    setSearchResults(initialUIState.searchResults);
    setClipboard(initialUIState.clipboard);
    setSortBy(initialUIState.sortBy);
    setSortDirection(initialUIState.sortDirection);
    setLoading(initialUIState.loading);
    setOperationErrors(initialUIState.operationErrors);
  }, []);

  const resetTree = useCallback(() => {
    setDirectoryTree(initialTreeState.directoryTree);
    setExpandedNodes(initialTreeState.expandedNodes);
    setPrefetchedNodes(initialTreeState.prefetchedNodes);
    setQueueStates(initialTreeState.queueStates);
  }, []);

  const resetAll = useCallback(() => {
    resetData();
    resetUI();
    resetTree();
  }, [resetData, resetUI, resetTree]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  // Memoize actions separately - these are stable and won't change
  const actions = useMemo<StorageStateContextValueActions>(
    () => ({
      // Data actions
      setItems,
      setPagination,
      setParams,
      updateParams,
      setStats,
      navigateToDirectory,

      // Selection actions
      toggleSelect,
      selectAll,
      clearSelection,
      selectRange,
      setLastSelectedItem,
      setFocusedItem,

      // UI interaction actions
      setViewMode,
      setSearchMode,
      setSearchResults,
      copyItems,
      cutItems,
      clearClipboard,

      // Sorting actions
      setSortBy,
      setSortDirection,
      getSortedItems,

      // Loading and error actions
      updateLoading,
      updateError,
      clearErrors,
      clearNavigationState,

      // Tree management actions
      setDirectoryTree,
      updateTreeNode,
      addChildToNode,

      // Node state actions
      expandNode,
      collapseNode,
      setPrefetchedNode,

      // Queue management actions
      addToFetchQueue,
      removeFromFetchQueue,
      addToExpansionQueue,
      removeFromExpansionQueue,
      setCurrentlyFetching,
      clearQueues,

      // Reset actions
      resetData,
      resetUI,
      resetTree,
      resetAll,
    }),
    [
      updateParams,
      navigateToDirectory,
      toggleSelect,
      selectAll,
      clearSelection,
      selectRange,
      copyItems,
      cutItems,
      clearClipboard,
      getSortedItems,
      updateLoading,
      updateError,
      clearErrors,
      clearNavigationState,
      updateTreeNode,
      addChildToNode,
      expandNode,
      collapseNode,
      setPrefetchedNode,
      addToFetchQueue,
      removeFromFetchQueue,
      addToExpansionQueue,
      removeFromExpansionQueue,
      setCurrentlyFetching,
      clearQueues,
      resetData,
      resetUI,
      resetTree,
      resetAll,
    ]
  );

  // Memoize states separately - these change frequently
  const state = useMemo<StorageStateContextValueState>(
    () => ({
      // Data state
      items,
      pagination,
      params,
      stats,

      // UI state
      selectedItems,
      lastSelectedItem,
      focusedItem,
      viewMode,
      searchMode,
      searchResults,
      clipboard,
      sortBy,
      sortDirection,
      loading,
      operationErrors,

      // Tree state
      directoryTree,
      expandedNodes,
      prefetchedNodes,
      queueStates,
    }),
    [
      items,
      pagination,
      params,
      stats,
      selectedItems,
      lastSelectedItem,
      focusedItem,
      viewMode,
      searchMode,
      searchResults,
      clipboard,
      sortBy,
      sortDirection,
      loading,
      operationErrors,
      directoryTree,
      expandedNodes,
      prefetchedNodes,
      queueStates,
    ]
  );

  // Combine states and actions for the full context value
  const value = useMemo<StorageStateContextValue>(
    () => ({ state: state, actions: actions }),
    [state, actions]
  );

  return (
    <StorageStateContext.Provider value={value}>
      {children}
    </StorageStateContext.Provider>
  );
};

// ============================================================================
// HOOKS TO USE THE CONTEXT
// ============================================================================

/**
 * Hook to access only the storage state values (without actions).
 * Use this when you only need to read state values and don't need actions.
 * This will cause re-renders whenever any state value changes.
 */
export const useStorageState = (): StorageStateContextValueState => {
  const context = useContext(StorageStateContext);
  if (!context) {
    throw new Error(
      "useStorageStateValues must be used within a StorageStateProvider"
    );
  }

  // Extract only the state values from the context
  return useMemo<StorageStateContextValueState>(
    () => context.state,
    [context.state]
  );
};

/**
 * Hook to access only the storage state actions (setters).
 * Use this when you only need to call actions and don't need to read state values.
 * This will NOT cause re-renders when state values change, only when actions change
 * (which should be stable/never).
 */
export const useStorageStateActions = (): StorageStateContextValueActions => {
  const context = useContext(StorageStateContext);
  if (!context) {
    throw new Error(
      "useStorageStateActions must be used within a StorageStateProvider"
    );
  }

  // Extract only the actions from the context
  return useMemo<StorageStateContextValueActions>(
    () => context.actions,
    [context.actions]
  );
};
