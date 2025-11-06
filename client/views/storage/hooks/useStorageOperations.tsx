"use client";

import { useCallback, useMemo, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";
import { useStorageActions } from "./useStorageActions";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageApollo } from "../contexts/StorageApolloContext";
import { useStorageMutations } from "./useStorageMutations";

// ============================================================================
// Operations Value Type
// ============================================================================

type StorageOperations = {
  // Basic File Operations (without loading states)
  rename: (path: string, newName: string) => Promise<boolean>;
  remove: (paths: string[]) => Promise<boolean>;
  move: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  copy: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  createFolder: (path: string, name: string) => Promise<boolean>;

  // File Operations (with loading states + refresh)
  renameItem: (path: string, newName: string) => Promise<boolean>;
  deleteItems: (paths: string[]) => Promise<boolean>;
  moveItems: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  copyItemsTo: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;

  // Navigation Operations (now async)
  navigateTo: (path: string) => Promise<void>;
  goUp: () => Promise<void>;
  refresh: () => Promise<void>;

  // Clipboard Operations
  pasteItems: () => Promise<boolean>;
};

export const useStorageOperations = (): StorageOperations => {
  // Get Apollo operations
  const apollo = useStorageApollo();
  const apolloRef = useRef(apollo);
  apolloRef.current = apollo;

  const apolloClient = useApolloClient();
  const apolloClientRef = useRef(apolloClient);
  apolloClientRef.current = apolloClient;

  const mutations = useStorageMutations();

  // Get state and state actionsRef.current
  const actions = useStorageActions();
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const uiStore = useStorageUIStore();
  const uiStoreRef = useRef(uiStore);
  uiStoreRef.current = uiStore;

  const dataStore = useStorageDataStore();
  const dataStoreRef = useRef(dataStore);
  dataStoreRef.current = dataStore;

  // Get notifications and translations
  const notifications = useNotifications();
  const {
    storageTranslations: { management: managementTranslations },
  } = useAppTranslation();

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  // Helper function to show notifications
  const showNotification = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
      notifications.show(message, { severity });
    },
    [notifications]
  );

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  const refresh = useCallback(async () => {
    const currentParams = dataStoreRef.current.params;

    logger.info("Manual refresh - evicting cache", {
      path: currentParams.path,
    });

    apolloClientRef.current.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "listFiles",
      args: { input: currentParams },
    });
    apolloClientRef.current.cache.gc();

    logger.info("Cache evicted, useQuery will refetch");
  }, []);

  // ============================================================================
  // FILE OPERATIONS (from useStorageDataOperations)
  // ============================================================================

  const rename = useCallback(
    async (path: string, newName: string): Promise<boolean> => {
      try {
        const result = await mutations.renameFile({
          input: {
            currentPath: path,
            newName,
          },
        });

        if (result.data?.renameFile?.success) {
          showNotification(managementTranslations.successfullyRenamedTo.replace("%{newName}", newName), "success");
          return true;
        } else {
          showNotification(result.data?.renameFile?.message || managementTranslations.failedToRenameFile, "error");
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToRenameFile, "error");
        return false;
      }
    },
    [showNotification, managementTranslations, mutations]
  );

  const remove = useCallback(
    async (paths: string[]): Promise<boolean> => {
      try {
        const result = await mutations.deleteStorageItems({
          input: {
            paths,
            force: false, // Default to false, could be made configurable
          },
        });

        const deleteResult = result.data?.deleteStorageItems;
        if (deleteResult) {
          const { successCount, failureCount, failures } = deleteResult;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

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
    [
      mutations,
      showNotification,
      managementTranslations.successfullyDeleted,
      managementTranslations.item,
      managementTranslations.items,
      managementTranslations.deletedPartial,
      managementTranslations.failedToDeleteItems,
    ]
  );

  const move = useCallback(
    async (sourcePaths: string[], destinationPath: string): Promise<boolean> => {
      try {
        const result = await mutations.moveStorageItems({
          input: {
            sourcePaths,
            destinationPath,
          },
        });

        const moveResult = result.data?.moveStorageItems;
        if (moveResult) {
          const { successCount, failureCount, failures } = moveResult;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

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
    [
      mutations,
      showNotification,
      managementTranslations.successfullyMoved,
      managementTranslations.item,
      managementTranslations.items,
      managementTranslations.movedPartial,
      managementTranslations.failedToMoveItems,
    ]
  );

  const copy = useCallback(
    async (sourcePaths: string[], destinationPath: string): Promise<boolean> => {
      try {
        const result = await mutations.copyStorageItems({
          input: {
            sourcePaths,
            destinationPath,
          },
        });

        const copyResult = result.data?.copyStorageItems;
        if (copyResult) {
          const { successCount, failureCount, failures } = copyResult;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

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
    [
      mutations,
      showNotification,
      managementTranslations.successfullyCopied,
      managementTranslations.item,
      managementTranslations.items,
      managementTranslations.copiedPartial,
      managementTranslations.failedToCopyItems,
    ]
  );

  const createFolder = useCallback(
    async (path: string, name: string): Promise<boolean> => {
      try {
        // Construct path correctly - don't add leading slash if at root
        const fullPath = path ? `${path}/${name}` : name;

        const result = await mutations.createFolder({
          input: { path: fullPath },
        });

        if (result.data?.createFolder?.success) {
          showNotification(managementTranslations.successfullyCreatedFolder.replace("%{name}", name), "success");
          return true;
        } else {
          showNotification(result.data?.createFolder?.message || managementTranslations.failedToCreateFolder, "error");
          return false;
        }
      } catch {
        showNotification(managementTranslations.failedToCreateFolder, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      managementTranslations.successfullyCreatedFolder,
      managementTranslations.failedToCreateFolder,
    ]
  );

  // ============================================================================
  // FILE OPERATIONS WITH LOADING STATES (from useStorageFileOperations)
  // ============================================================================

  const renameItem = useCallback(
    async (path: string, newName: string): Promise<boolean> => {
      const success = await rename(path, newName);
      return success;
    },
    [rename]
  );

  const deleteItems = useCallback(
    async (paths: string[]): Promise<boolean> => {
      const success = await remove(paths);

      if (success) {
        // Clear selection of deleted items
        actionsRef.current.clearSelection();
      }
      return success;
    },
    [remove]
  );

  const moveItems = useCallback(
    async (sourcePaths: string[], destinationPath: string): Promise<boolean> => {
      const success = await move(sourcePaths, destinationPath);
      return success;
    },
    [move]
  );

  const copyItemsTo = useCallback(
    async (sourcePaths: string[], destinationPath: string): Promise<boolean> => {
      const success = await copy(sourcePaths, destinationPath);
      return success;
    },
    [copy]
  );

  // ============================================================================
  // NAVIGATION OPERATIONS (from useStorageNavigation)
  // ============================================================================

  const navigateTo = useCallback(async (path: string) => {
    logger.info("navigateTo called", {
      fromPath: dataStoreRef.current.params.path,
      toPath: path,
    });

    if (dataStoreRef.current.params.path === path) {
      logger.info("Skipping navigation - already at target path", { path });
      return;
    }

    const newParams = {
      ...dataStoreRef.current.params,
      path,
      offset: 0,
    };

    actionsRef.current.setParams(newParams);
    logger.info("Params updated, useQuery will refetch", { newParams });
  }, []);

  const goUp = useCallback(async () => {
    const currentPath = dataStoreRef.current.params.path;

    if (!currentPath || currentPath === "") {
      logger.info("Already at root - cannot go up further");
      return;
    }

    const cleanPath = currentPath.replace(/\/+$/, "");
    const pathSegments = cleanPath.split("/").filter(segment => segment !== "");
    const parentPath = pathSegments.length > 1 ? pathSegments.slice(0, -1).join("/") : "";

    await navigateTo(parentPath);
  }, [navigateTo]);

  // ============================================================================
  // CLIPBOARD OPERATIONS (from useStorageClipboard)
  // ============================================================================

  const pasteItems = useCallback(async (): Promise<boolean> => {
    if (!uiStoreRef.current?.clipboard) return false;

    const sourcePaths = uiStoreRef.current.clipboard.items.map(item => item.path) || [];
    const destinationPath = dataStoreRef.current.params.path || "";

    if (uiStoreRef.current.clipboard.operation === "copy") {
      const success = await copy(sourcePaths, destinationPath);
      return success;
    } else if (uiStoreRef.current.clipboard.operation === "cut") {
      const success = await move(sourcePaths, destinationPath);
      if (success) {
        actionsRef.current.clearClipboard(); // Clear clipboard after successful cut/paste
      }
      return success;
    }

    return false;
  }, [copy, move]);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return useMemo<StorageOperations>(
    () => ({
      // Basic File Operations
      rename,
      remove,
      move,
      copy,
      createFolder,

      // File Operations with loading
      renameItem,
      deleteItems,
      moveItems,
      copyItemsTo,

      // Navigation
      navigateTo,
      goUp,
      refresh,

      // Clipboard
      pasteItems,
    }),
    [
      rename,
      remove,
      move,
      copy,
      createFolder,
      renameItem,
      deleteItems,
      moveItems,
      copyItemsTo,
      navigateTo,
      goUp,
      refresh,
      pasteItems,
    ]
  );
};
