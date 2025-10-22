import { useCallback } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  StorageItemUnion,
  ViewMode,
  LoadingStates,
  OperationErrors,
  DirectoryTreeNode,
  StorageActions,
} from "../core/storage.type";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageTreeStore } from "../stores/useStorageTreeStore";

// ============================================================================
// ACTIONS HOOK
// ============================================================================

/**
 * Hook that provides all storage actions.
 * Uses the three Zustand stores (data, UI, tree) and returns the same
 * action interface as the original StorageStateContext for easy migration.
 */
export const useStorageActions = (): StorageActions => {
  // ============================================================================
  // DATA ACTIONS
  // ============================================================================

  const setItems = useCallback((items: StorageItemUnion[]) => {
    useStorageDataStore.getState().setItems(items);
  }, []);

  const setPagination = useCallback((pagination: Graphql.PageInfo | null) => {
    useStorageDataStore.getState().setPagination(pagination);
  }, []);

  const setParams = useCallback((params: Graphql.FilesListInput) => {
    useStorageDataStore.getState().setParams(params);
  }, []);

  const updateParams = useCallback(
    (partial: Partial<Graphql.FilesListInput>) => {
      const currentParams = useStorageDataStore.getState().params;
      useStorageDataStore
        .getState()
        .setParams({ ...currentParams, ...partial });
    },
    []
  );

  const setStats = useCallback((stats: Graphql.StorageStats | null) => {
    useStorageDataStore.getState().setStats(stats);
  }, []);

  const navigateToDirectory = useCallback(
    (data: {
      params: Graphql.FilesListInput;
      items: StorageItemUnion[];
      pagination: Graphql.PageInfo;
    }) => {
      const dataStore = useStorageDataStore.getState();
      dataStore.setParams(data.params);
      dataStore.setItems(data.items);
      dataStore.setPagination(data.pagination);
    },
    []
  );

  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================

  const toggleSelect = useCallback((path: string) => {
    const { selectedItems, setSelectedItems, setLastSelectedItem } =
      useStorageUIStore.getState();

    const isSelected = selectedItems.includes(path);
    const newSelection = isSelected
      ? selectedItems.filter(p => p !== path)
      : [...selectedItems, path];

    setSelectedItems(newSelection);
    setLastSelectedItem(path);
  }, []);

  const selectAll = useCallback(() => {
    const items = useStorageDataStore.getState().items;
    const { setSelectedItems } = useStorageUIStore.getState();
    setSelectedItems(items.map(item => item.path));
  }, []);

  const clearSelection = useCallback(() => {
    const { setSelectedItems, setLastSelectedItem } =
      useStorageUIStore.getState();
    setSelectedItems([]);
    setLastSelectedItem(null);
  }, []);

  const selectRange = useCallback(
    (fromPath: string, toPath: string, items: StorageItemUnion[]) => {
      const fromIndex = items.findIndex(item => item.path === fromPath);
      const toIndex = items.findIndex(item => item.path === toPath);

      if (fromIndex === -1 || toIndex === -1) return;

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);
      const rangePaths = items.slice(start, end + 1).map(item => item.path);

      const { selectedItems, setSelectedItems } = useStorageUIStore.getState();
      const newSelection = new Set([...selectedItems, ...rangePaths]);
      setSelectedItems(Array.from(newSelection));
    },
    []
  );

  const setLastSelectedItem = useCallback((path: string | null) => {
    useStorageUIStore.getState().setLastSelectedItem(path);
  }, []);

  const setFocusedItem = useCallback((path: string | null) => {
    useStorageUIStore.getState().setFocusedItem(path);
  }, []);

  // ============================================================================
  // UI INTERACTION ACTIONS
  // ============================================================================

  const setViewMode = useCallback((mode: ViewMode) => {
    useStorageUIStore.getState().setViewMode(mode);
  }, []);

  const setSearchMode = useCallback((mode: boolean) => {
    useStorageUIStore.getState().setSearchMode(mode);
  }, []);

  const setSearchResults = useCallback((results: StorageItemUnion[]) => {
    useStorageUIStore.getState().setSearchResults(results);
  }, []);

  const copyItems = useCallback((items: StorageItemUnion[]) => {
    useStorageUIStore.getState().setClipboard({ operation: "copy", items });
  }, []);

  const cutItems = useCallback((items: StorageItemUnion[]) => {
    useStorageUIStore.getState().setClipboard({ operation: "cut", items });
  }, []);

  const clearClipboard = useCallback(() => {
    useStorageUIStore.getState().setClipboard(null);
  }, []);

  // ============================================================================
  // SORTING ACTIONS
  // ============================================================================

  const setSortBy = useCallback((field: string) => {
    useStorageUIStore.getState().setSortBy(field);
  }, []);

  const setSortDirection = useCallback(
    (direction: Graphql.OrderSortDirection) => {
      useStorageUIStore.getState().setSortDirection(direction);
    },
    []
  );

  const getSortedItems = useCallback((): StorageItemUnion[] => {
    const { searchMode, searchResults, sortBy, sortDirection } =
      useStorageUIStore.getState();
    const { items } = useStorageDataStore.getState();

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
  }, []);

  // ============================================================================
  // LOADING AND ERROR ACTIONS
  // ============================================================================

  const updateLoading = useCallback(
    (key: keyof LoadingStates, value: boolean | string | null) => {
      const { loading, setLoading } = useStorageUIStore.getState();
      setLoading({ ...loading, [key]: value });
    },
    []
  );

  const updateError = useCallback(
    (key: keyof OperationErrors, error?: string) => {
      const { operationErrors, setOperationErrors } =
        useStorageUIStore.getState();
      setOperationErrors({ ...operationErrors, [key]: error });
    },
    []
  );

  const clearErrors = useCallback(() => {
    useStorageUIStore.getState().setOperationErrors({});
  }, []);

  const clearNavigationState = useCallback(() => {
    const uiStore = useStorageUIStore.getState();
    uiStore.setSelectedItems([]);
    uiStore.setLastSelectedItem(null);
    uiStore.setSearchMode(false);
    uiStore.setSearchResults([]);
  }, []);

  // ============================================================================
  // TREE MANAGEMENT ACTIONS
  // ============================================================================

  const setDirectoryTree = useCallback((tree: DirectoryTreeNode[]) => {
    useStorageTreeStore.getState().setDirectoryTree(tree);
  }, []);

  const updateTreeNode = useCallback(
    (path: string, updater: (node: DirectoryTreeNode) => DirectoryTreeNode) => {
      const { directoryTree, setDirectoryTree } =
        useStorageTreeStore.getState();

      const updateNode = (nodes: DirectoryTreeNode[]): DirectoryTreeNode[] => {
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

      setDirectoryTree(updateNode(directoryTree));
    },
    []
  );

  const addChildToNode = useCallback(
    (parentPath: string, children: DirectoryTreeNode[]) => {
      const { directoryTree, setDirectoryTree } =
        useStorageTreeStore.getState();

      const updateNode = (nodes: DirectoryTreeNode[]): DirectoryTreeNode[] => {
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

      setDirectoryTree(updateNode(directoryTree));
    },
    []
  );

  // ============================================================================
  // NODE STATE ACTIONS
  // ============================================================================

  const expandNode = useCallback((path: string) => {
    const { expandedNodes, setExpandedNodes } = useStorageTreeStore.getState();
    setExpandedNodes(new Set([...expandedNodes, path]));
  }, []);

  const collapseNode = useCallback((path: string) => {
    const { expandedNodes, setExpandedNodes } = useStorageTreeStore.getState();
    const newSet = new Set(expandedNodes);
    newSet.delete(path);
    setExpandedNodes(newSet);
  }, []);

  const setPrefetchedNode = useCallback(
    (path: string, isPrefetched: boolean) => {
      const { prefetchedNodes, setPrefetchedNodes } =
        useStorageTreeStore.getState();
      const newSet = new Set(prefetchedNodes);
      if (isPrefetched) {
        newSet.add(path);
      } else {
        newSet.delete(path);
      }
      setPrefetchedNodes(newSet);
    },
    []
  );

  // ============================================================================
  // QUEUE MANAGEMENT ACTIONS
  // ============================================================================

  const addToFetchQueue = useCallback((path: string) => {
    const { queueStates, setQueueStates } = useStorageTreeStore.getState();
    setQueueStates({
      ...queueStates,
      fetchQueue: new Set([...queueStates.fetchQueue, path]),
    });
  }, []);

  const removeFromFetchQueue = useCallback((path: string) => {
    const { queueStates, setQueueStates } = useStorageTreeStore.getState();
    setQueueStates({
      ...queueStates,
      fetchQueue: new Set([...queueStates.fetchQueue].filter(p => p !== path)),
    });
  }, []);

  const addToExpansionQueue = useCallback((path: string) => {
    const { queueStates, setQueueStates } = useStorageTreeStore.getState();
    setQueueStates({
      ...queueStates,
      expansionQueue: new Set([...queueStates.expansionQueue, path]),
    });
  }, []);

  const removeFromExpansionQueue = useCallback((path: string) => {
    const { queueStates, setQueueStates } = useStorageTreeStore.getState();
    setQueueStates({
      ...queueStates,
      expansionQueue: new Set(
        [...queueStates.expansionQueue].filter(p => p !== path)
      ),
    });
  }, []);

  const setCurrentlyFetching = useCallback(
    (path: string, isFetching: boolean) => {
      const { queueStates, setQueueStates } = useStorageTreeStore.getState();
      const newSet = new Set(queueStates.currentlyFetching);
      if (isFetching) {
        newSet.add(path);
      } else {
        newSet.delete(path);
      }
      setQueueStates({
        ...queueStates,
        currentlyFetching: newSet,
      });
    },
    []
  );

  const clearQueues = useCallback(() => {
    const { queueStates, setQueueStates } = useStorageTreeStore.getState();
    setQueueStates({
      ...queueStates,
      fetchQueue: new Set(),
      expansionQueue: new Set(),
      currentlyFetching: new Set(),
    });
  }, []);

  // ============================================================================
  // RESET ACTIONS
  // ============================================================================

  const resetData = useCallback(() => {
    useStorageDataStore.getState().reset();
  }, []);

  const resetUI = useCallback(() => {
    useStorageUIStore.getState().reset();
  }, []);

  const resetTree = useCallback(() => {
    useStorageTreeStore.getState().reset();
  }, []);

  const resetAll = useCallback(() => {
    resetData();
    resetUI();
    resetTree();
  }, [resetData, resetUI, resetTree]);

  // ============================================================================
  // RETURN ACTIONS
  // ============================================================================

  return {
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
  };
};
