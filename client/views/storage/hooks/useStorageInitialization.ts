"use client";

import { useEffect, useRef } from "react";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageTreeStore } from "../stores/useStorageTreeStore";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

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

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Initialize directory tree and root items on mount only
  useEffect(() => {
    logger.info("useStorageInitialization effect triggered", {
      isInitialMount: isInitialMount.current,
      currentPath: params.path,
    });

    // Only run on initial mount
    if (!isInitialMount.current) {
      logger.info("Skipping initialization - not initial mount");
      return;
    }

    let isMounted = true;

    const initializeStorageData = async () => {
      logger.info("Starting storage initialization", {
        path: params.path,
        limit: params.limit,
        offset: params.offset,
      });

      // Wait for hydration to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check if the component is still mounted
      if (!isMounted) {
        logger.warn("Component unmounted before initialization started");
        return;
      }

      try {
        // Initial mount: Initialize both directory tree and root items
        logger.info("Setting loading states for initialization");
        updateLoading("prefetchingNode", "");
        updateLoading("fetchList", true);

        logger.info(
          "Fetching root directory tree and initial items in parallel"
        );
        const [rootDirectories, rootItems] = await Promise.all([
          fetchDirectoryChildren(),
          fetchList(params),
        ]);

        logger.info("Parallel fetch completed", {
          hasDirectories: !!rootDirectories,
          hasItems: !!rootItems,
          directoryCount: rootDirectories?.length || 0,
          itemCount: rootItems?.items.length || 0,
        });

        // Check again if component is still mounted before updating the state
        if (isMounted) {
          if (rootDirectories) {
            logger.info("Setting directory tree", {
              count: rootDirectories.length,
            });
            setDirectoryTree(rootDirectories);
          } else {
            logger.warn("No root directories returned");
          }

          if (rootItems) {
            logger.info("Setting items and pagination", {
              itemCount: rootItems.items.length,
              totalCount: rootItems.pagination.total,
              hasMorePages: rootItems.pagination.hasMorePages,
            });
            setItems(rootItems.items);
            setPagination(rootItems.pagination);

            // Set focus to first item if no focused item
            if (rootItems.items.length > 0 && !focusedItem) {
              logger.info("Setting focus to first item", {
                itemPath: rootItems.items[0].path,
              });
              setUIFocusedItem(rootItems.items[0].path);
            } else if (rootItems.items.length === 0) {
              logger.info("No items to focus - directory is empty");
            } else {
              logger.info("Focus already set", { focusedItem });
            }
          } else {
            logger.warn("No root items returned");
          }
        } else {
          logger.warn("Component unmounted before state update");
        }

        // Mark that initial mount is complete
        logger.info("Initial mount completed successfully");
        isInitialMount.current = false;
      } catch (error) {
        // Only log if not an abort error during unmount
        if (isMounted) {
          logger.error("Error during storage initialization", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            path: params.path,
          });
          updateError("fetchList", translations.failedToNavigateToDirectory);
        } else {
          logger.info("Error during initialization but component unmounted", {
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      } finally {
        if (isMounted) {
          logger.info("Clearing loading states");
          updateLoading("prefetchingNode", null);
          updateLoading("fetchList", false);
        }
      }
    };

    // Use setTimeout to ensure this runs after hydration
    logger.info("Scheduling initialization with 100ms delay for hydration");
    const timeoutId = setTimeout(initializeStorageData, 100);

    return () => {
      logger.info("useStorageInitialization cleanup", {
        isMounted,
        isInitialMount: isInitialMount.current,
      });
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount
};
