"use client";

import { useCallback, useRef, useEffect, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

export const useStorageNavigation = () => {
  const { params, navigateToDirectory, setItems, setPagination } =
    useStorageDataStore();
  const { clearNavigationState, setFocusedItem, updateLoading, updateError } =
    useStorageUIStore();
  const { fetchList } = useStorageDataOperations();
  const { ui: translations } = useAppTranslation("storageTranslations");

  // Use refs to avoid dependencies and prevent re-creation of functions
  const paramsRef = useRef(params);
  const fetchListRef = useRef(fetchList);
  const navigateToDirectoryRef = useRef(navigateToDirectory);
  const clearNavigationStateRef = useRef(clearNavigationState);
  const updateLoadingRef = useRef(updateLoading);
  const updateErrorRef = useRef(updateError);
  const setFocusedItemRef = useRef(setFocusedItem);
  const setItemsRef = useRef(setItems);
  const setPaginationRef = useRef(setPagination);
  const translationsRef = useRef(translations);

  // Update refs when values/functions change
  useEffect(() => {
    paramsRef.current = params;
    fetchListRef.current = fetchList;
    navigateToDirectoryRef.current = navigateToDirectory;
    clearNavigationStateRef.current = clearNavigationState;
    updateLoadingRef.current = updateLoading;
    updateErrorRef.current = updateError;
    setFocusedItemRef.current = setFocusedItem;
    setItemsRef.current = setItems;
    setPaginationRef.current = setPagination;
    translationsRef.current = translations;
  }, [
    params,
    fetchList,
    navigateToDirectory,
    clearNavigationState,
    updateLoading,
    updateError,
    setFocusedItem,
    setItems,
    setPagination,
    translations,
  ]);

  const navigateTo = useCallback(
    async (path: string, currentParams: Graphql.FilesListInput) => {
      logger.info("navigateTo called", {
        fromPath: currentParams.path,
        toPath: path,
      });

      // Avoid unnecessary navigation to the same path
      if (currentParams.path === path) {
        logger.info("Skipping navigation - already at target path", { path });
        return;
      }

      // Prepare new params (no store update yet - stays frozen until success)
      const newParams = { ...currentParams, path, offset: 0 };

      // Fetch new data using refs to avoid re-renders
      logger.info("Starting fetchList for navigation", { path });
      updateLoadingRef.current("fetchList", true);
      updateErrorRef.current("fetchList");

      try {
        const result = await fetchListRef.current(newParams);

        if (result) {
          logger.info("Navigation fetchList completed successfully", {
            path,
            itemCount: result.items.length,
            totalCount: result.pagination.total,
            hasMorePages: result.pagination.hasMorePages,
          });

          // ATOMIC UPDATE: Single store update for all navigation data
          logger.info("Performing atomic navigation state update");
          navigateToDirectoryRef.current({
            params: newParams,
            items: result.items,
            pagination: result.pagination,
          });

          // ATOMIC UPDATE: Single store update for all UI state
          clearNavigationStateRef.current();

          // Set focus to first item
          if (result.items.length > 0) {
            logger.info("Setting focus to first item after navigation", {
              itemPath: result.items[0].path,
            });
            setFocusedItemRef.current(result.items[0].path);
          } else {
            logger.info("No items in directory - clearing focus", { path });
            setFocusedItemRef.current(null);
          }
        } else {
          // Navigation failed - stay in current directory
          // No store updates, UI stays frozen at current state
          logger.error("Navigation fetchList returned null", { path });
          updateErrorRef.current(
            "fetchList",
            translationsRef.current.failedToNavigateToDirectory
          );
        }
      } catch (error) {
        // Navigation failed - stay in current directory
        // No store updates, UI stays frozen at current state
        logger.error("Error during navigation fetchList", {
          path,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        updateErrorRef.current(
          "fetchList",
          translationsRef.current.failedToNavigateToDirectory
        );
      } finally {
        logger.info("Navigation fetchList completed, clearing loading state");
        updateLoadingRef.current("fetchList", false);
      }
    },
    [] // NO DEPENDENCIES - completely stable, never recreated
  );

  const goUp = useCallback(async () => {
    const currentParams = paramsRef.current;
    const currentPath = currentParams.path;
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

    await navigateTo(parentPath, currentParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // NO DEPENDENCIES - completely stable

  const refresh = useCallback(async () => {
    const currentParams = paramsRef.current;
    logger.info("refresh called", {
      path: currentParams.path,
      limit: currentParams.limit,
      offset: currentParams.offset,
    });

    updateLoadingRef.current("fetchList", true);
    updateErrorRef.current("fetchList");

    try {
      logger.info("Starting fetchList for refresh");
      const result = await fetchListRef.current(currentParams);

      if (result) {
        logger.info("Refresh fetchList completed successfully", {
          path: currentParams.path,
          itemCount: result.items.length,
          totalCount: result.pagination.total,
          hasMorePages: result.pagination.hasMorePages,
        });
        setItemsRef.current(result.items);
        setPaginationRef.current(result.pagination);
      } else {
        logger.error("Refresh fetchList returned null", {
          path: currentParams.path,
        });
      }
    } catch (error) {
      logger.error("Error during refresh fetchList", {
        path: currentParams.path,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      updateErrorRef.current(
        "fetchList",
        translationsRef.current.failedToRefreshDirectory
      );
    } finally {
      logger.info("Refresh fetchList completed, clearing loading state");
      updateLoadingRef.current("fetchList", false);
    }
  }, []); // NO DEPENDENCIES - completely stable

  return useMemo(
    () => ({
      navigateTo,
      goUp,
      refresh,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // All functions are stable with empty dependencies
  );
};
