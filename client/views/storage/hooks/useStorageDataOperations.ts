"use client";

import { useCallback } from "react";
import {
  useStorageApolloQueries,
  useStorageApolloMutations,
} from "./storage.operations";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { DirectoryTreeNode } from "./storage.type";

export const useStorageDataOperations = () => {
  const queries = useStorageApolloQueries();
  const mutations = useStorageApolloMutations();
  const notifications = useNotifications();
  const { management: translations } = useAppTranslation("storageTranslations");

  // Store actions
  const { setStats } = useStorageDataStore();

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

  // Data Fetching Functions
  const fetchList = useCallback(
    async (
      params: Graphql.FilesListInput
    ): Promise<{
      items: Graphql.StorageObject[];
      pagination: Graphql.PageInfo;
    } | null> => {
      try {
        const input: Graphql.FilesListInput = {
          path: params.path,
          limit: params.limit,
          offset: params.offset,
          searchTerm: params.searchTerm,
          fileType: params.fileType?.toString(),
        };

        const result = await queries.listFiles({ input });

        if (!result.data?.listFiles) {
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
        const items: Graphql.StorageObject[] = result.data?.listFiles
          .items as Graphql.StorageObject[];

        return { items, pagination };
      } catch {
        return null;
      }
    },
    [queries]
  );

  const fetchDirectoryChildren = useCallback(
    async (path?: string): Promise<DirectoryTreeNode[] | null> => {
      try {
        const result = await queries.fetchDirectoryChildren({
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
    [queries, transformDirectoryToTreeNode]
  );

  const fetchStats = useCallback(
    async (path?: string): Promise<Graphql.StorageStats | null> => {
      try {
        const result = await queries.getStorageStats({ path });

        if (!result.data?.storageStats) {
          return null;
        }

        const statsData = result.data?.storageStats as Graphql.StorageStats;
        setStats(statsData);
        return statsData;
      } catch {
        showNotification(translations.failedToFetchStorageStatistics, "error");
        return null;
      }
    },
    [
      queries,
      setStats,
      showNotification,
      translations.failedToFetchStorageStatistics,
    ]
  );

  // File Operations
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
          showNotification(
            translations.successfullyRenamedTo.replace("%{newName}", newName),
            "success"
          );
          return true;
        } else {
          showNotification(
            result.data?.renameFile?.message || translations.failedToRenameFile,
            "error"
          );
          return false;
        }
      } catch {
        showNotification(translations.failedToRenameFile, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      translations.successfullyRenamedTo,
      translations.failedToRenameFile,
    ]
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

        if (result.data?.deleteStorageItems) {
          const { successCount, failureCount, failures } =
            result.data?.deleteStorageItems;

          const safeSuccessCount = successCount ?? 0;
          const safeFailureCount = failureCount ?? 0;
          const errorMessages =
            failures?.map(f => f.error).filter(Boolean) ?? [];

          if (safeFailureCount === 0) {
            showNotification(
              translations.successfullyDeleted.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              translations.deletedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(translations.failedToDeleteItems, "error");
          return false;
        }
      } catch {
        showNotification(translations.failedToDeleteItems, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      translations.successfullyDeleted,
      translations.item,
      translations.items,
      translations.deletedPartial,
      translations.failedToDeleteItems,
    ]
  );

  const move = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      try {
        const result = await mutations.moveStorageItems({
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
              translations.successfullyMoved.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              translations.movedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(translations.failedToMoveItems, "error");
          return false;
        }
      } catch {
        showNotification(translations.failedToMoveItems, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      translations.successfullyMoved,
      translations.item,
      translations.items,
      translations.movedPartial,
      translations.failedToMoveItems,
    ]
  );

  const copy = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      try {
        const result = await mutations.copyStorageItems({
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
              translations.successfullyCopied.replace(
                "%{count}",
                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`
              ),
              "success"
            );
            return true;
          } else {
            showNotification(
              translations.copiedPartial
                .replace("%{successCount}", safeSuccessCount.toString())
                .replace("%{failureCount}", safeFailureCount.toString())
                .replace("%{errors}", errorMessages.join(", ")),
              "warning"
            );
            return safeSuccessCount > 0; // Partial success
          }
        } else {
          showNotification(translations.failedToCopyItems, "error");
          return false;
        }
      } catch {
        showNotification(translations.failedToCopyItems, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      translations.successfullyCopied,
      translations.item,
      translations.items,
      translations.copiedPartial,
      translations.failedToCopyItems,
    ]
  );

  const createFolder = useCallback(
    async (path: string, name: string): Promise<boolean> => {
      try {
        const result = await mutations.createFolder({
          input: { path: path + "/" + name },
        });

        if (result.data?.createFolder?.success) {
          showNotification(
            translations.successfullyCreatedFolder.replace("%{name}", name),
            "success"
          );
          return true;
        } else {
          showNotification(
            result.data?.createFolder?.message ||
              translations.failedToCreateFolder,
            "error"
          );
          return false;
        }
      } catch {
        showNotification(translations.failedToCreateFolder, "error");
        return false;
      }
    },
    [
      mutations,
      showNotification,
      translations.successfullyCreatedFolder,
      translations.failedToCreateFolder,
    ]
  );

  // Search Function
  const search = useCallback(
    async (
      query: string,
      path?: string
    ): Promise<{
      items: Graphql.StorageObject[];
      totalCount: number;
    } | null> => {
      try {
        const result = await queries.searchFiles({
          searchTerm: query,
          folder: path,
          limit: 100, // Default search limit
        });

        if (!result.data?.searchFiles) {
          return null;
        }

        // Transform search results to StorageItem[]
        const items: Graphql.StorageObject[] = result.data?.searchFiles
          .items as Graphql.StorageObject[];

        return {
          items,
          totalCount: result.data?.searchFiles.totalCount,
        };
      } catch {
        showNotification(translations.failedToSearchFiles, "error");
        return null;
      }
    },
    [queries, showNotification, translations.failedToSearchFiles]
  );

  return {
    // Data Fetching
    fetchList,
    fetchDirectoryChildren,
    fetchStats,

    // File Operations
    rename,
    remove,
    move,
    copy,
    createFolder,

    // Search
    search,
  };
};
