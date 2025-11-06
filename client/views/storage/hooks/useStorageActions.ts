import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { StorageItemUnion, ViewMode, StorageActions } from "../core/storage.type";
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

  const setParams = useCallback((params: Graphql.FilesListInput) => {
    useStorageDataStore.getState().setParams(params);
  }, []);

  const updateParams = useCallback((partial: Partial<Graphql.FilesListInput>) => {
    const currentParams = useStorageDataStore.getState().params;
    useStorageDataStore.getState().setParams({ ...currentParams, ...partial });
  }, []);

  // ============================================================================
  // SELECTION ACTIONS
  // ============================================================================

  const toggleSelect = useCallback((path: string) => {
    const { selectedItems, setSelectedItems, setLastSelectedItem } = useStorageUIStore.getState();

    const isSelected = selectedItems.includes(path);
    const newSelection = isSelected ? selectedItems.filter(p => p !== path) : [...selectedItems, path];

    setSelectedItems(newSelection);
    setLastSelectedItem(path);
  }, []);

  const setSelectedItems = useCallback((items: string[]) => {
    useStorageUIStore.getState().setSelectedItems(items);
  }, []);

  const selectAll = useCallback(() => {
    // This is a placeholder - components with access to items should handle selection
    // by calling setSelectedItems directly with mapped item paths
  }, []);

  const clearSelection = useCallback(() => {
    const { setSelectedItems, setLastSelectedItem } = useStorageUIStore.getState();
    setSelectedItems([]);
    setLastSelectedItem(null);
  }, []);

  const selectRange = useCallback((fromPath: string, toPath: string, items: StorageItemUnion[]) => {
    const fromIndex = items.findIndex(item => item.path === fromPath);
    const toIndex = items.findIndex(item => item.path === toPath);

    if (fromIndex === -1 || toIndex === -1) return;

    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    const rangePaths = items.slice(start, end + 1).map(item => item.path);

    const { selectedItems, setSelectedItems } = useStorageUIStore.getState();
    const newSelection = new Set([...selectedItems, ...rangePaths]);
    setSelectedItems(Array.from(newSelection));
  }, []);

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

  const setSortDirection = useCallback((direction: Graphql.OrderSortDirection) => {
    useStorageUIStore.getState().setSortDirection(direction);
  }, []);

  const getSortedItems = useCallback((items: StorageItemUnion[]): StorageItemUnion[] => {
    const { searchMode, searchResults, sortBy, sortDirection } = useStorageUIStore.getState();

    const currentItems = searchMode ? searchResults : items;

    return [...currentItems].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name ?? a.path.split("/").pop() ?? "";
          bValue = b.name ?? b.path.split("/").pop() ?? "";
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
          aValue = (a as unknown as { lastModified?: number }).lastModified ?? 0;
          bValue = (b as unknown as { lastModified?: number }).lastModified ?? 0;
          break;
        case "created":
          aValue = (a as unknown as { created?: number }).created ?? 0;
          bValue = (b as unknown as { created?: number }).created ?? 0;
          break;
        default:
          aValue = a.name ?? a.path.split("/").pop() ?? "";
          bValue = b.name ?? b.path.split("/").pop() ?? "";
      }

      if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;
      return 0;
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
      setParams,
      updateParams,

      // Selection actions
      setSelectedItems,
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

      // Reset actions
      resetData,
      resetUI,
      resetAll,
    }),
    [
      clearClipboard,
      clearSelection,
      copyItems,
      cutItems,
      getSortedItems,
      resetAll,
      resetData,
      resetUI,
      selectAll,
      selectRange,
      setFocusedItem,
      setLastSelectedItem,
      setParams,
      setSearchMode,
      setSearchResults,
      setSelectedItems,
      setSortBy,
      setSortDirection,
      setViewMode,
      toggleSelect,
      updateParams,
    ]
  );
};
