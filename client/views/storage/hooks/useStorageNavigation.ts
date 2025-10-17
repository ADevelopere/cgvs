"use client";

import { useCallback } from "react";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";

export const useStorageNavigation = () => {
  const { params, setParams, setItems, setPagination } = useStorageDataStore();
  const { 
    clearSelection, 
    setLastSelectedItem, 
    setSearchMode, 
    setSearchResults,
    setFocusedItem,
    updateLoading,
    updateError
  } = useStorageUIStore();
  const { fetchList } = useStorageDataOperations();
  const { ui: translations } = useAppTranslation("storageTranslations");

  const navigateTo = useCallback(
    async (path: string) => {
      // Avoid unnecessary navigation to the same path
      if (params.path === path) {
        return;
      }

      // Only update query params - the useEffect will handle fetching the data
      const newParams = { ...params, path, offset: 0 };
      setParams(newParams);

      // Clear selection and search state immediately
      clearSelection();
      setLastSelectedItem(null);

      // Exit search mode if navigating
      setSearchMode(false);
      setSearchResults([]);

      // Fetch new data
      updateLoading("fetchList", true);
      updateError("fetchList");

      try {
        const result = await fetchList(newParams);
        if (result) {
          setItems(result.items);
          setPagination(result.pagination);
          // Set focus to first item if no item is currently focused
          // or if the currently focused item no longer exists
          if (result.items.length > 0) {
            if (
              !result.items.some((item) => item.path === params.path)
            ) {
              setFocusedItem(result.items[0].path);
            }
          } else {
            setFocusedItem(null);
          }
        } else {
          updateError("fetchList", translations.failedToNavigateToDirectory);
        }
      } catch {
        updateError("fetchList", translations.failedToNavigateToDirectory);
      } finally {
        updateLoading("fetchList", false);
      }
    },
    [
      params,
      setParams,
      clearSelection,
      setLastSelectedItem,
      setSearchMode,
      setSearchResults,
      setFocusedItem,
      updateLoading,
      updateError,
      fetchList,
      setItems,
      setPagination,
      translations.failedToNavigateToDirectory,
    ],
  );

  const goUp = useCallback(async () => {
    const currentPath = params.path;

    // Handle edge cases for path calculation
    if (!currentPath || currentPath === "") {
      // Already at root, can't go up further
      return;
    }

    // Remove trailing slashes and calculate parent path
    const cleanPath = currentPath.replace(/\/+$/, "");
    const pathSegments = cleanPath
      .split("/")
      .filter((segment) => segment !== "");

    // Calculate parent path
    const parentPath =
      pathSegments.length > 1 ? pathSegments.slice(0, -1).join("/") : ""; // Go to root if only one segment

    await navigateTo(parentPath);
  }, [params.path, navigateTo]);

  const refresh = useCallback(async () => {
    updateLoading("fetchList", true);
    updateError("fetchList");

    try {
      const result = await fetchList(params);
      if (result) {
        setItems(result.items);
        setPagination(result.pagination);
      }
    } catch {
      updateError("fetchList", translations.failedToRefreshDirectory);
    } finally {
      updateLoading("fetchList", false);
    }
  }, [
    params,
    updateLoading,
    updateError,
    fetchList,
    setItems,
    setPagination,
    translations.failedToRefreshDirectory,
  ]);

  return {
    navigateTo,
    goUp,
    refresh,
  };
};
