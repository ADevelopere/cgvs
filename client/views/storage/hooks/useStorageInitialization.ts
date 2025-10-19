"use client";

import { useEffect, useRef } from "react";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageTreeStore } from "../stores/useStorageTreeStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";

export const useStorageInitialization = () => {
  const { params, setItems, setPagination } = useStorageDataStore();
  const { setDirectoryTree } = useStorageTreeStore();
  const {
    updateLoading,
    updateError,
    setFocusedItem: setUIFocusedItem,
    focusedItem,
  } = useStorageUIStore();
  const { fetchDirectoryChildren, fetchList } = useStorageDataOperations();
  const { ui: translations } = useAppTranslation("storageTranslations");

  // Track if this is the initial mount or subsequent navigation
  const isInitialMount = useRef(true);
  const lastNavigationRequest = useRef<string | null>(null);
  const prevQueryParams = useRef(params);

  // Initialize directory tree and root items on mount with proper hydration handling
  useEffect(() => {
    if (
      !isInitialMount.current &&
      JSON.stringify(prevQueryParams.current) === JSON.stringify(params)
    ) {
      return;
    }
    let isMounted = true;

    const initializeStorageData = async () => {
      // Wait for hydration to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Check if the component is still mounted
      if (!isMounted) return;

      try {
        if (isInitialMount.current) {
          // Initial mount: Initialize both directory tree and root items
          updateLoading("prefetchingNode", "");
          updateLoading("fetchList", true);

          const [rootDirectories, rootItems] = await Promise.all([
            fetchDirectoryChildren(),
            fetchList(params),
          ]);

          // Check again if component is still mounted before updating the state
          if (isMounted) {
            if (rootDirectories) {
              setDirectoryTree(rootDirectories);
            }
            if (rootItems) {
              setItems(rootItems.items);
              setPagination(rootItems.pagination);
              // Set focus to first item if no focused item
              if (rootItems.items.length > 0 && !focusedItem) {
                setUIFocusedItem(rootItems.items[0].path);
              }
            }
          }

          // Mark that initial mount is complete
          isInitialMount.current = false;
        } else {
          // Navigation change: Only fetch items for the new path, keep directory tree intact
          const currentPath = params.path;
          lastNavigationRequest.current = currentPath;

          updateLoading("fetchList", true);
          updateError("fetchList"); // Clear any previous errors

          const result = await fetchList(params);

          // Check if this is still the most recent navigation request
          if (isMounted && lastNavigationRequest.current === currentPath) {
            if (result) {
              setItems(result.items);
              setPagination(result.pagination);
              // Only set focus to first item if no item is currently focused
              // or if the currently focused item no longer exists
              if (result.items.length > 0) {
                if (!result.items.some((item) => item.path === params.path)) {
                  setUIFocusedItem(result.items[0].path);
                }
              } else {
                setUIFocusedItem(null);
              }
            } else {
              // Handle null result - this shouldn't happen but prevents empty state
              updateError(
                "fetchList",
                translations.failedToNavigateToDirectory,
              );
            }
          }
        }
      } catch {
        // Only log if not an abort error during unmount
        if (isMounted) {
          updateError("fetchList", translations.failedToNavigateToDirectory);

          // If this was a navigation error (not initial mount), try to recover
          if (!isInitialMount.current) {
            // Don't change items/pagination on navigation errors to avoid empty state
            // User can retry or navigate manually
          }
        }
      } finally {
        if (isMounted) {
          updateLoading("prefetchingNode", null);
          updateLoading("fetchList", false);
        }
      }
    };

    // Use setTimeout to ensure this runs after hydration
    const timeoutId = setTimeout(initializeStorageData, 100);
    prevQueryParams.current = params;

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [
    params,
    fetchDirectoryChildren,
    fetchList,
    setDirectoryTree,
    setItems,
    setPagination,
    setUIFocusedItem,
    updateLoading,
    updateError,
    translations.failedToNavigateToDirectory,
    focusedItem,
  ]);
};
