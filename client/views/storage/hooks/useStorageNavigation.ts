"use client";

import { useCallback, useMemo } from "react";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

export const useStorageNavigation = () => {
  const { params, setParams, setItems, setPagination } = useStorageDataStore();
  const {
    clearSelection,
    setLastSelectedItem,
    setSearchMode,
    setSearchResults,
    setFocusedItem,
    updateLoading,
    updateError,
  } = useStorageUIStore();
  const { fetchList } = useStorageDataOperations();
  const { ui: translations } = useAppTranslation("storageTranslations");

  const navigateTo = useCallback(
    async (path: string) => {
      logger.info("navigateTo called", {
        fromPath: params.path,
        toPath: path,
      });

      // Avoid unnecessary navigation to the same path
      if (params.path === path) {
        logger.info("Skipping navigation - already at target path", { path });
        return;
      }

      // Prepare new params but don't update store yet (to avoid re-renders during fetch)
      const newParams = { ...params, path, offset: 0 };

      // Fetch new data (before any store updates to prevent re-renders during fetch)
      logger.info("Starting fetchList for navigation", { path });
      updateLoading("fetchList", true);
      updateError("fetchList");

      try {
        const result = await fetchList(newParams);

        if (result) {
          logger.info("Navigation fetchList completed successfully", {
            path,
            itemCount: result.items.length,
            totalCount: result.pagination.total,
            hasMorePages: result.pagination.hasMorePages,
          });

          // Update all store state after successful fetch to avoid re-renders during fetch
          logger.info("Updating store state after successful fetch");

          // Clear selection and search state
          clearSelection();
          setLastSelectedItem(null);
          setSearchMode(false);
          setSearchResults([]);

          // Update params, items, and pagination
          setParams(newParams);
          setItems(result.items);
          setPagination(result.pagination);

          // Set focus to first item if no item is currently focused
          // or if the currently focused item no longer exists
          if (result.items.length > 0) {
            if (!result.items.some(item => item.path === params.path)) {
              logger.info("Setting focus to first item after navigation", {
                itemPath: result.items[0].path,
              });
              setFocusedItem(result.items[0].path);
            } else {
              logger.info("Keeping existing focus", {
                focusedItemPath: params.path,
              });
            }
          } else {
            logger.info("No items in directory - clearing focus", { path });
            setFocusedItem(null);
          }
        } else {
          // Navigation failed - stay in current directory
          // Don't update params, items, or any navigation state
          logger.error("Navigation fetchList returned null", { path });
          updateError("fetchList", translations.failedToNavigateToDirectory);
        }
      } catch (error) {
        // Navigation failed - stay in current directory
        // Don't update params, items, or any navigation state
        logger.error("Error during navigation fetchList", {
          path,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        updateError("fetchList", translations.failedToNavigateToDirectory);
      } finally {
        logger.info("Navigation fetchList completed, clearing loading state");
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
    ]
  );

  const goUp = useCallback(async () => {
    const currentPath = params.path;
    logger.info("goUp called", { currentPath });

    // Handle edge cases for path calculation
    if (!currentPath || currentPath === "") {
      logger.info("Already at root - cannot go up further");
      return;
    }

    // Remove trailing slashes and calculate parent path
    const cleanPath = currentPath.replace(/\/+$/, "");
    const pathSegments = cleanPath.split("/").filter(segment => segment !== "");

    // Calculate parent path
    const parentPath =
      pathSegments.length > 1 ? pathSegments.slice(0, -1).join("/") : ""; // Go to root if only one segment

    logger.info("Navigating to parent directory", {
      currentPath,
      parentPath,
      segments: pathSegments.length,
    });

    await navigateTo(parentPath);
  }, [params.path, navigateTo]);

  const refresh = useCallback(async () => {
    logger.info("refresh called", {
      path: params.path,
      limit: params.limit,
      offset: params.offset,
    });

    updateLoading("fetchList", true);
    updateError("fetchList");

    try {
      logger.info("Starting fetchList for refresh");
      const result = await fetchList(params);

      if (result) {
        logger.info("Refresh fetchList completed successfully", {
          path: params.path,
          itemCount: result.items.length,
          totalCount: result.pagination.total,
          hasMorePages: result.pagination.hasMorePages,
        });
        setItems(result.items);
        setPagination(result.pagination);
      } else {
        logger.error("Refresh fetchList returned null", {
          path: params.path,
        });
      }
    } catch (error) {
      logger.error("Error during refresh fetchList", {
        path: params.path,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      updateError("fetchList", translations.failedToRefreshDirectory);
    } finally {
      logger.info("Refresh fetchList completed, clearing loading state");
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

  return useMemo(
    () => ({
      navigateTo,
      goUp,
      refresh,
    }),
    [navigateTo, goUp, refresh]
  );
};
