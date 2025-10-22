import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  StorageItemUnion,
  ViewMode,
  LoadingStates,
  OperationErrors,
  StorageActions,
} from "../core/storage.type";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";

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
  // RESET ACTIONS
  // ============================================================================

  const resetData = useCallback(() => {
    useStorageDataStore.getState().reset();
  }, []);

  const resetUI = useCallback(() => {
    useStorageUIStore.getState().reset();
  }, []);

  const resetAll = useCallback(() => {
    resetData();
    resetUI();
  }, [resetData, resetUI]);

  // ============================================================================
  // RETURN ACTIONS
  // ============================================================================

  return useMemo(
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

      // Reset actions
      resetData,
      resetUI,
      resetAll,
    }),
    [
      clearClipboard,
      clearErrors,
      clearNavigationState,
      clearSelection,
      copyItems,
      cutItems,
      getSortedItems,
      navigateToDirectory,
      resetAll,
      resetData,
      resetUI,
      selectAll,
      selectRange,
      setFocusedItem,
      setItems,
      setLastSelectedItem,
      setPagination,
      setParams,
      setSearchMode,
      setSearchResults,
      setSortBy,
      setSortDirection,
      setStats,
      setViewMode,
      toggleSelect,
      updateError,
      updateLoading,
      updateParams,
    ]
  );
};
