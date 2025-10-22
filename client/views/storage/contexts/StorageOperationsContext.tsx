"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { DirectoryTreeNode, StorageItem } from "../core/storage.type";
import logger from "@/client/lib/logger";
import { useStorageApollo } from "./StorageApolloContext";
import { useStorageState, useStorageStateActions } from "./StorageStateContext";

// ============================================================================
// CONTEXT VALUE INTERFACE
// ============================================================================

interface StorageOperationsContextValue {
  // Data Fetching Operations
  fetchList: (params: Graphql.FilesListInput) => Promise<{
    items: StorageItem[];
    pagination: Graphql.PageInfo;
  } | null>;
  fetchDirectoryChildren: (
    path?: string
  ) => Promise<DirectoryTreeNode[] | null>;
  fetchStats: (path?: string) => Promise<Graphql.StorageStats | null>;

  // Basic File Operations (without loading states)
  rename: (path: string, newName: string) => Promise<boolean>;
  remove: (paths: string[]) => Promise<boolean>;
  move: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  copy: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  createFolder: (path: string, name: string) => Promise<boolean>;
  search: (
    query: string,
    path?: string
  ) => Promise<{ items: StorageItem[]; totalCount: number } | null>;

  // File Operations (with loading states + refresh)
  renameItem: (path: string, newName: string) => Promise<boolean>;
  deleteItems: (paths: string[]) => Promise<boolean>;
  moveItems: (
    sourcePaths: string[],
    destinationPath: string
  ) => Promise<boolean>;
  copyItemsTo: (
    sourcePaths: string[],
    destinationPath: string
  ) => Promise<boolean>;

  // Navigation Operations
  navigateTo: (
    path: string,
    currentParams: Graphql.FilesListInput
  ) => Promise<void>;
  goUp: () => Promise<void>;
  refresh: () => Promise<void>;

  // Tree Operations
  prefetchDirectoryChildren: (path: string, refresh?: boolean) => Promise<void>;
  expandDirectoryNode: (path: string) => void;
  collapseDirectoryNode: (path: string) => void;
  processExpansionQueue: (path: string) => void;

  // Clipboard Operations
  pasteItems: () => Promise<boolean>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const StorageOperationsContext =
  createContext<StorageOperationsContextValue | null>(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const StorageOperationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get Apollo operations
  const apollo = useStorageApollo();
  const apolloRef = useRef(apollo);
  apolloRef.current = apollo;

  // Get state and state actionsRef.current
  const actions = useStorageStateActions();
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const state = useStorageState();
  const stateRef = useRef(state);
  stateRef.current = state;

  // Get notifications and translations
  const notifications = useNotifications();
  const { management: managementTranslations, ui: uiTranslations } =
    useAppTranslation("storageTranslations");

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  // Helper function to transform GraphQL DirectoryInfo to DirectoryTreeNode
  const transformDirectoryToTreeNode = useCallback(
    (directory: Graphql.DirectoryInfo): DirectoryTreeNode => {
      return {
        id: directory.path,
        name: directory.name,
        path: directory.path,
        children: undefined, // Not loaded initially
        hasChildren: true, // Assume directories have children until proven otherwise
        isExpanded: false,
        isLoading: false,
        isPrefetched: false,
      };
    },
    []
  );

  // Helper function to show notifications
  const showNotification = useCallback(
    (
      message: string,
      severity: "success" | "error" | "info" | "warning" = "info"
    ) => {
      notifications.show(message, { severity });
    },
    [notifications]
  );

  // ============================================================================
  // DATA FETCHING OPERATIONS (from useStorageDataOperations)
  // ============================================================================

  const fetchList = useCallback(
    async (
      params: Graphql.FilesListInput
    ): Promise<{
      items: StorageItem[];
      pagination: Graphql.PageInfo;
    } | null> => {
      logger.info("Starting fetchList operation", {
        path: params.path,
        limit: params.limit,
        offset: params.offset,
        searchTerm: params.searchTerm,
        fileType: params.fileType,
      });

      try {
        const input: Graphql.FilesListInput = {
          path: params.path,
          limit: params.limit,
          offset: params.offset,
          searchTerm: params.searchTerm,
          fileType: params.fileType?.toString(),
        };

        logger.info("Calling GraphQL listFiles query", { input });
        const result = await apolloRef.current.listFiles({ input });
        logger.info("GraphQL listFiles query completed", {
          hasData: !!result.data?.listFiles,
          hasErrors: !!result.error,
          errorCount: result.error ? 1 : 0,
        });

        if (!result.data?.listFiles) {
          logger.warn("No data returned from listFiles query", {
            path: params.path,
            error: result.error,
          });
          return null;
        }

        const pagination: Graphql.PageInfo = {
          hasMorePages: result.data?.listFiles.hasMore,
          total: result.data?.listFiles.totalCount,
          count: result.data?.listFiles.totalCount,
          perPage: result.data?.listFiles.limit,
          firstItem: result.data?.listFiles.offset,
          currentPage:
            Math.floor(
              result.data?.listFiles.totalCount / result.data?.listFiles.limit
            ) + 1,
          lastPage: Math.ceil(
            result.data?.listFiles.totalCount / result.data?.listFiles.limit
          ),
        };

        // Transform StorageEntity[] to StorageItem[]
        const items: StorageItem[] = result.data?.listFiles
          .items as StorageItem[];

        logger.info("fetchList operation completed successfully", {
          path: params.path,
          itemCount: items.length,
          totalCount: pagination.total,
          hasMorePages: pagination.hasMorePages,
          folders: items.filter(item => item.__typename === "DirectoryInfo")
            .length,
          files: items.filter(item => item.__typename === "FileInfo").length,
        });

        return { items, pagination };
      } catch (error) {
        logger.error("Error in fetchList operation", {
          path: params.path,
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        return null;
      }
    },
    []
  );

  const fetchDirectoryChildren = useCallback(
    async (path?: string): Promise<DirectoryTreeNode[] | null> => {
      try {
        const result = await apolloRef.current.fetchDirectoryChildren({
          path: path || "",
        });

        if (!result.data?.directoryChildren) {
          return [];
        }

        return result.data?.directoryChildren.map(transformDirectoryToTreeNode);
      } catch {
        return null;
      }
    },
    [transformDirectoryToTreeNode]
  );

  const fetchStats = useCallback(
    async (path?: string): Promise<Graphql.StorageStats | null> => {
      try {
        const result = await apolloRef.current.getStorageStats({ path });

        if (!result.data?.storageStats) {
          return null;
        }

        const statsData = result.data?.storageStats as Graphql.StorageStats;
        actionsRef.current.setStats(statsData);
        return statsData;
      } catch {
        showNotification(
          managementTranslations.failedToFetchStorageStatistics,
          "error"
        );
        return null;
      }
    },
    [showNotification, managementTranslations]
  );

  const refresh = useCallback(async () => {
    const currentParams = paramsRef.current;
    logger.info("refresh called", {
      path: currentParams.path,
      limit: currentParams.limit,
      offset: currentParams.offset,
    });

    actionsRef.current.updateLoading("fetchList", true);
    actionsRef.current.updateError("fetchList");

    try {
      logger.info("Starting fetchList for refresh");
      const result = await fetchList(currentParams);

      if (result) {
        logger.info("Refresh fetchList completed successfully", {
          path: currentParams.path,
          itemCount: result.items.length,
          totalCount: result.pagination.total,
          hasMorePages: result.pagination.hasMorePages,
        });
        actionsRef.current.setItems(result.items);
        actionsRef.current.setPagination(result.pagination);
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
      actionsRef.current.updateError(
        "fetchList",
        uiTranslations.failedToRefreshDirectory
      );
    } finally {
      logger.info("Refresh fetchList completed, clearing loading state");
      actionsRef.current.updateLoading("fetchList", false);
    }
  }, [fetchList, uiTranslations.failedToRefreshDirectory]);

  // ============================================================================
  // FILE OPERATIONS (from useStorageDataOperations)
  // ============================================================================

  const rename = useCallback(
    async (path: string, newName: string): Promise<boolean> => {
      try {
        const result = await apolloRef.current.renameFile({
          input: {
            currentPath: path,
            newName,
          },
        });

        if (result.data?.renameFile?.success) {
          showNotification(
            managementTranslations.successfullyRenamedTo.replace(
              "%{newName}",
              newName
            ),
            "success"
          );
          return true;
        } else {
          showNotification(
            result.data?.renameFile?.message ||
              managementTranslations.failedToRenameFile,
            "error"
          );
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToRenameFile, "error");
        return false;
      }
    },
    [showNotification, managementTranslations]
  );

  const remove = useCallback(
    async (paths: string[]): Promise<boolean> => {
      try {
        const result = await apolloRef.current.deleteStorageItems({
          input: {
            paths,
            force: false, // Default to false, could be made configurable
          },
        });

        if (result.data?.deleteStorageItems) {
          const { successCount, failureCount, failures } =
            result.data?.deleteStorageItems;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages =
            failures?.map(f => f.error).filter(Boolean) ?? [];

          if (safeFailureCount === 0) {
            showNotification(
              managementTranslations.successfullyDeleted.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? managementTranslations.item : managementTranslations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              managementTranslations.deletedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(managementTranslations.failedToDeleteItems, "error");
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToDeleteItems, "error");
        return false;
      }
    },
    [showNotification, managementTranslations]
  );

  const move = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      try {
        const result = await apolloRef.current.moveStorageItems({
          input: {
            sourcePaths,
            destinationPath,
          },
        });

        if (result.data?.moveStorageItems) {
          const { successCount, failureCount, failures } =
            result.data?.moveStorageItems;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages =
            failures?.map(f => f.error).filter(Boolean) ?? [];

          if (safeFailureCount === 0) {
            showNotification(
              managementTranslations.successfullyMoved.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? managementTranslations.item : managementTranslations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              managementTranslations.movedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(managementTranslations.failedToMoveItems, "error");
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToMoveItems, "error");
        return false;
      }
    },
    [showNotification, managementTranslations]
  );

  const copy = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      try {
        const result = await apolloRef.current.copyStorageItems({
          input: {
            sourcePaths,
            destinationPath,
          },
        });

        if (result.data?.copyStorageItems) {
          const { successCount, failureCount, failures } =
            result.data?.copyStorageItems;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages =
            failures?.map(f => f.error).filter(Boolean) ?? [];

          if (safeFailureCount === 0) {
            showNotification(
              managementTranslations.successfullyCopied.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? managementTranslations.item : managementTranslations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              managementTranslations.copiedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(managementTranslations.failedToCopyItems, "error");
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToCopyItems, "error");
        return false;
      }
    },
    [showNotification, managementTranslations]
  );

  const createFolder = useCallback(
    async (path: string, name: string): Promise<boolean> => {
      try {
        const result = await apolloRef.current.createFolder({
          input: { path: path + "/" + name },
        });

        if (result.data?.createFolder?.success) {
          showNotification(
            managementTranslations.successfullyCreatedFolder.replace(
              "%{name}",
              name
            ),
            "success"
          );
          return true;
        } else {
          showNotification(
            result.data?.createFolder?.message ||
              managementTranslations.failedToCreateFolder,
            "error"
          );
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToCreateFolder, "error");
        return false;
      }
    },
    [showNotification, managementTranslations]
  );

  const search = useCallback(
    async (
      query: string,
      path?: string
    ): Promise<{
      items: StorageItem[];
      totalCount: number;
    } | null> => {
      try {
        const result = await apolloRef.current.searchFiles({
          searchTerm: query,
          folder: path,
          limit: 100, // Default search limit
        });

        if (!result.data?.searchFiles) {
          return null;
        }

        // Transform search results to StorageItem[]
        const items: StorageItem[] = result.data?.searchFiles
          .items as StorageItem[];

        return {
          items,
          totalCount: result.data?.searchFiles.totalCount,
        };
      } catch {
        showNotification(managementTranslations.failedToSearchFiles, "error");
        return null;
      }
    },
    [showNotification, managementTranslations]
  );

  // ============================================================================
  // FILE OPERATIONS WITH LOADING STATES (from useStorageFileOperations)
  // ============================================================================

  const renameItem = useCallback(
    async (path: string, newName: string): Promise<boolean> => {
      actionsRef.current.updateLoading("rename", true);
      const success = await rename(path, newName);
      actionsRef.current.updateLoading("rename", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [refresh, rename]
  );

  const deleteItems = useCallback(
    async (paths: string[]): Promise<boolean> => {
      actionsRef.current.updateLoading("delete", true);
      const success = await remove(paths);
      actionsRef.current.updateLoading("delete", false);

      if (success) {
        // Clear selection of deleted items
        actionsRef.current.clearSelection();
        await refresh();
      }
      return success;
    },
    [refresh, remove]
  );

  const moveItems = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      actionsRef.current.updateLoading("move", true);
      const success = await move(sourcePaths, destinationPath);
      actionsRef.current.updateLoading("move", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [move, refresh]
  );

  const copyItemsTo = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      actionsRef.current.updateLoading("copy", true);
      const success = await copy(sourcePaths, destinationPath);
      actionsRef.current.updateLoading("copy", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [copy, refresh]
  );

  // ============================================================================
  // NAVIGATION OPERATIONS (from useStorageNavigation)
  // ============================================================================

  // Use refs to avoid dependencies and prevent re-creation of functions
  const paramsRef = useRef(state.params);

  // Update refs when values/functions change
  useEffect(() => {
    paramsRef.current = state.params;
  }, [state.params]);

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
      actionsRef.current.updateLoading("fetchList", true);
      actionsRef.current.updateError("fetchList");

      try {
        const result = await fetchList(newParams);

        if (result) {
          logger.info("Navigation fetchList completed successfully", {
            path,
            itemCount: result.items.length,
            totalCount: result.pagination.total,
            hasMorePages: result.pagination.hasMorePages,
          });

          // ATOMIC UPDATE: Single store update for all navigation data
          logger.info("Performing atomic navigation state update");
          actionsRef.current.navigateToDirectory({
            params: newParams,
            items: result.items,
            pagination: result.pagination,
          });

          // ATOMIC UPDATE: Single store update for all UI state
          actionsRef.current.clearNavigationState();

          // Set focus to first item
          if (result.items.length > 0) {
            logger.info("Setting focus to first item after navigation", {
              itemPath: result.items[0].path,
            });
            actionsRef.current.setFocusedItem(result.items[0].path);
          } else {
            logger.info("No items in directory - clearing focus", { path });
            actionsRef.current.setFocusedItem(null);
          }
        } else {
          // Navigation failed - stay in current directory
          // No store updates, UI stays frozen at current state
          logger.error("Navigation fetchList returned null", { path });
          actionsRef.current.updateError(
            "fetchList",
            uiTranslations.failedToNavigateToDirectory
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
        actionsRef.current.updateError(
          "fetchList",
          uiTranslations.failedToNavigateToDirectory
        );
      } finally {
        logger.info("Navigation fetchList completed, clearing loading state");
        actionsRef.current.updateLoading("fetchList", false);
      }
    },
    [fetchList, uiTranslations.failedToNavigateToDirectory] // NO DEPENDENCIES - completely stable, never recreated
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

  // ============================================================================
  // TREE OPERATIONS (from useStorageTreeOperations)
  // ============================================================================

  // Function to process expansion queue
  const processExpansionQueue = useCallback(
    (path: string) => {
      if (state.queueStates.expansionQueue.has(path)) {
        // Check if children are available in the tree
        const hasChildrenInTree = (
          nodes: DirectoryTreeNode[],
          targetPath: string
        ): boolean => {
          for (const node of nodes) {
            if (node.path === targetPath && node.children !== undefined) {
              return true;
            }
            if (node.children && hasChildrenInTree(node.children, targetPath)) {
              return true;
            }
          }
          return false;
        };

        if (hasChildrenInTree(state.directoryTree, path)) {
          // Children are available, expand immediately
          actionsRef.current.expandNode(path);
          actionsRef.current.removeFromExpansionQueue(path);
        }
      }
    },
    [state.directoryTree, state.queueStates.expansionQueue]
  );

  const prefetchDirectoryChildren = useCallback(
    async (path: string, refreshParam?: boolean) => {
      if (
        (!refreshParam && state.prefetchedNodes.has(path)) ||
        state.expandedNodes.has(path) ||
        state.queueStates.currentlyFetching.has(path)
      )
        return;

      // Add to fetch queue and mark as currently fetching
      actionsRef.current.addToFetchQueue(path);
      actionsRef.current.setCurrentlyFetching(path, true);
      actionsRef.current.setPrefetchedNode(path, true);

      try {
        const children = await fetchDirectoryChildren(path);
        if (children) {
          // Cache the children for instant expansion later
          if (state.directoryTree.length === 0 && path === "") {
            // If nodes array is empty and this is the root path, return the children directly
            actionsRef.current.setDirectoryTree(
              children.map(child => ({
                ...child,
                isPrefetched: true,
              }))
            );
          } else {
            actionsRef.current.addChildToNode(path, children);
          }

          // Process expansion queue for this path after successful fetch
          processExpansionQueue(path);
        }
      } finally {
        // Remove from queues and update loading state
        actionsRef.current.removeFromFetchQueue(path);
        actionsRef.current.setCurrentlyFetching(path, false);
      }
    },
    [
      state.prefetchedNodes,
      state.expandedNodes,
      state.queueStates.currentlyFetching,
      state.directoryTree.length,
      fetchDirectoryChildren,
      processExpansionQueue,
    ]
  );

  const expandDirectoryNode = useCallback(
    (path: string) => {
      if (state.expandedNodes.has(path)) return; // Already expanded

      // Check if children are already available in the tree
      const findNodeInTree = (
        nodes: DirectoryTreeNode[],
        targetPath: string
      ): DirectoryTreeNode | null => {
        for (const node of nodes) {
          if (node.path === targetPath) {
            return node;
          }
          if (node.children) {
            const found = findNodeInTree(node.children, targetPath);
            if (found) return found;
          }
        }
        return null;
      };

      const targetNode = findNodeInTree(state.directoryTree, path);

      if (targetNode?.children !== undefined) {
        // Children are already available, expand immediately
        actionsRef.current.expandNode(path);
      } else if (targetNode?.hasChildren) {
        // Children are not available but node has children
        // Add to expansion queue and trigger fetch if not already fetching
        actionsRef.current.addToExpansionQueue(path);

        if (
          !state.queueStates.currentlyFetching.has(path) &&
          !state.queueStates.fetchQueue.has(path)
        ) {
          // Not currently fetching and not in fetch queue, trigger prefetch
          prefetchDirectoryChildren(path);
        }
      }
      // If node doesn't have children, do nothing
    },
    [
      state.expandedNodes,
      state.directoryTree,
      state.queueStates.currentlyFetching,
      state.queueStates.fetchQueue,
      prefetchDirectoryChildren,
    ]
  );

  const collapseDirectoryNode = useCallback((path: string) => {
    actionsRef.current.collapseNode(path);
  }, []);

  // ============================================================================
  // CLIPBOARD OPERATIONS (from useStorageClipboard)
  // ============================================================================

  const pasteItems = useCallback(async (): Promise<boolean> => {
    if (!state.clipboard) return false;

    const sourcePaths = state.clipboard.items.map(item => item.path);
    const destinationPath = state.params.path || "";

    if (state.clipboard.operation === "copy") {
      const success = await copy(sourcePaths, destinationPath);
      if (success) {
        await refresh();
      }
      return success;
    } else if (state.clipboard.operation === "cut") {
      const success = await move(sourcePaths, destinationPath);
      if (success) {
        actionsRef.current.clearClipboard(); // Clear clipboard after successful cut/paste
        await refresh();
      }
      return success;
    }

    return false;
  }, [state.clipboard, state.params.path, copy, refresh, move]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<StorageOperationsContextValue>(
    () => ({
      // Data Fetching
      fetchList,
      fetchDirectoryChildren,
      fetchStats,

      // Basic File Operations
      rename,
      remove,
      move,
      copy,
      createFolder,
      search,

      // File Operations with loading
      renameItem,
      deleteItems,
      moveItems,
      copyItemsTo,

      // Navigation
      navigateTo,
      goUp,
      refresh,

      // Tree Operations
      prefetchDirectoryChildren,
      expandDirectoryNode,
      collapseDirectoryNode,
      processExpansionQueue,

      // Clipboard
      pasteItems,
    }),
    [
      fetchList,
      fetchDirectoryChildren,
      fetchStats,
      rename,
      remove,
      move,
      copy,
      createFolder,
      search,
      renameItem,
      deleteItems,
      moveItems,
      copyItemsTo,
      navigateTo,
      goUp,
      refresh,
      prefetchDirectoryChildren,
      expandDirectoryNode,
      collapseDirectoryNode,
      processExpansionQueue,
      pasteItems,
    ]
  );

  return (
    <StorageOperationsContext.Provider value={value}>
      {children}
    </StorageOperationsContext.Provider>
  );
};

// ============================================================================
// HOOK TO USE THE CONTEXT
// ============================================================================

export const useStorageOperations = (): StorageOperationsContextValue => {
  const context = useContext(StorageOperationsContext);
  if (!context) {
    throw new Error(
      "useStorageOperations must be used within a StorageOperationsProvider"
    );
  }
  return context;
};
