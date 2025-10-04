"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import useAppTranslation from "@/client/locale/useAppTranslation";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { DirectoryTreeNode, StorageManagementCoreContextType } from "./storage.type";

const StorageManagementCoreContext = createContext<
    StorageManagementCoreContextType | undefined
>(undefined);

export const useStorageManagementCore = () => {
    const context = useContext(StorageManagementCoreContext);
    if (!context) {
        throw new Error(
            "useStorageManagementCore must be used within a StorageManagementCoreProvider",
        );
    }
    return context;
};

export const StorageManagementCoreProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const storageGraphQL = useStorageGraphQL();
    const notifications = useNotifications();
    const { management: translations } = useAppTranslation(
        "storageTranslations",
    );
    const [stats, setStats] = useState<Graphql.StorageStats | null>(null);

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
        [],
    );

    // Helper function to show notifications
    const showNotification = useCallback(
        (
            message: string,
            severity: "success" | "error" | "info" | "warning" = "info",
        ) => {
            notifications.show(message, { severity });
        },
        [notifications],
    );

    // Data Fetching Functions
    const fetchList = useCallback(
        async (
            params: Graphql.FilesListInput,
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

                const result = await storageGraphQL.listFiles({ input });

                if (!result.listFiles) {
                    return null;
                }

                const pagination: Graphql.PageInfo = {
                    hasMorePages: result.listFiles.hasMore,
                    total: result.listFiles.totalCount,
                    perPage: result.listFiles.limit,
                    firstItem: result.listFiles.offset,
                };

                // Transform StorageEntity[] to StorageItem[]
                const items: Graphql.StorageObject[] = result.listFiles
                    .items as Graphql.StorageObject[];

                return { items, pagination };
            } catch {
                return null;
            }
        },
        [storageGraphQL],
    );

    const fetchDirectoryChildren = useCallback(
        async (path?: string): Promise<DirectoryTreeNode[] | null> => {
            try {
                const result = await storageGraphQL.fetchDirectoryChildren({
                    path: path || "",
                });

                if (!result.directoryChildren) {
                    return [];
                }

                return result.directoryChildren.map(
                    transformDirectoryToTreeNode,
                );
            } catch {
                return null;
            }
        },
        [storageGraphQL, transformDirectoryToTreeNode],
    );

    const fetchStats = useCallback(
        async (path?: string): Promise<Graphql.StorageStats | null> => {
            try {
                const result = await storageGraphQL.getStorageStats({ path });

                if (!result.storageStats) {
                    return null;
                }

                const statsData = result.storageStats;
                setStats(statsData);
                return statsData;
            } catch {
                showNotification(
                    translations.failedToFetchStorageStatistics,
                    "error",
                );
                return null;
            }
        },
        [
            storageGraphQL,
            showNotification,
            translations.failedToFetchStorageStatistics,
        ],
    );

    // File Operations
    const rename = useCallback(
        async (path: string, newName: string): Promise<boolean> => {
            try {
                const result = await storageGraphQL.renameFile({
                    input: {
                        currentPath: path,
                        newName,
                    },
                });

                if (result.renameFile?.success) {
                    showNotification(
                        translations.successfullyRenamedTo.replace(
                            "%{newName}",
                            newName,
                        ),
                        "success",
                    );
                    return true;
                } else {
                    showNotification(
                        result.renameFile?.message ||
                            translations.failedToRenameFile,
                        "error",
                    );
                    return false;
                }
            } catch {
                showNotification(translations.failedToRenameFile, "error");
                return false;
            }
        },
        [
            storageGraphQL,
            showNotification,
            translations.successfullyRenamedTo,
            translations.failedToRenameFile,
        ],
    );

    const remove = useCallback(
        async (paths: string[]): Promise<boolean> => {
            try {
                const result = await storageGraphQL.deleteStorageItems({
                    input: {
                        paths,
                        force: false, // Default to false, could be made configurable
                    },
                });

                if (result.deleteStorageItems) {
                    const { successCount, failureCount, failures } =
                        result.deleteStorageItems;

                    const safeSuccessCount = successCount ?? 0;
                    const safeFailureCount = failureCount ?? 0;
                    const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

                    if (safeFailureCount === 0) {
                        showNotification(
                            translations.successfullyDeleted.replace(
                                "%{count}",
                                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.deletedPartial
                                .replace(
                                    "%{successCount}",
                                    safeSuccessCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    safeFailureCount.toString(),
                                )
                                .replace("%{errors}", errorMessages.join(", ")),
                            "warning",
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
            storageGraphQL,
            showNotification,
            translations.successfullyDeleted,
            translations.item,
            translations.items,
            translations.deletedPartial,
            translations.failedToDeleteItems,
        ],
    );

    const move = useCallback(
        async (
            sourcePaths: string[],
            destinationPath: string,
        ): Promise<boolean> => {
            try {
                const result = await storageGraphQL.moveStorageItems({
                    input: {
                        sourcePaths,
                        destinationPath,
                    },
                });

                if (result.moveStorageItems) {
                    const { successCount, failureCount, failures } =
                        result.moveStorageItems;

                    const safeSuccessCount = successCount ?? 0;
                    const safeFailureCount = failureCount ?? 0;
                    const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

                    if (safeFailureCount === 0) {
                        showNotification(
                            translations.successfullyMoved.replace(
                                "%{count}",
                                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.movedPartial
                                .replace(
                                    "%{successCount}",
                                    safeSuccessCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    safeFailureCount.toString(),
                                )
                                .replace("%{errors}", errorMessages.join(", ")),
                            "warning",
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
            storageGraphQL,
            showNotification,
            translations.successfullyMoved,
            translations.item,
            translations.items,
            translations.movedPartial,
            translations.failedToMoveItems,
        ],
    );

    const copy = useCallback(
        async (
            sourcePaths: string[],
            destinationPath: string,
        ): Promise<boolean> => {
            try {
                const result = await storageGraphQL.copyStorageItems({
                    input: {
                        sourcePaths,
                        destinationPath,
                    },
                });

                if (result.copyStorageItems) {
                    const { successCount, failureCount, failures } =
                        result.copyStorageItems;

                    const safeSuccessCount = successCount ?? 0;
                    const safeFailureCount = failureCount ?? 0;
                    const errorMessages = failures?.map(f => f.error).filter(Boolean) ?? [];

                    if (safeFailureCount === 0) {
                        showNotification(
                            translations.successfullyCopied.replace(
                                "%{count}",
                                `${safeSuccessCount} ${safeSuccessCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.copiedPartial
                                .replace(
                                    "%{successCount}",
                                    safeSuccessCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    safeFailureCount.toString(),
                                )
                                .replace("%{errors}", errorMessages.join(", ")),
                            "warning",
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
            storageGraphQL,
            showNotification,
            translations.successfullyCopied,
            translations.item,
            translations.items,
            translations.copiedPartial,
            translations.failedToCopyItems,
        ],
    );

    const createFolder = useCallback(
        async (path: string, name: string): Promise<boolean> => {
            try {
                const result = await storageGraphQL.createFolder({
                    input: { path: path + "/" + name },
                });

                if (result.createFolder?.success) {
                    showNotification(
                        translations.successfullyCreatedFolder.replace(
                            "%{name}",
                            name,
                        ),
                        "success",
                    );
                    return true;
                } else {
                    showNotification(
                        result.createFolder?.message ||
                            translations.failedToCreateFolder,
                        "error",
                    );
                    return false;
                }
            } catch {
                showNotification(translations.failedToCreateFolder, "error");
                return false;
            }
        },
        [
            storageGraphQL,
            showNotification,
            translations.successfullyCreatedFolder,
            translations.failedToCreateFolder,
        ],
    );

    // Search Function
    const search = useCallback(
        async (
            query: string,
            path?: string,
        ): Promise<{
            items: Graphql.StorageObject[];
            totalCount: number;
        } | null> => {
            try {
                const result = await storageGraphQL.searchFiles({
                    searchTerm: query,
                    folder: path,
                    limit: 100, // Default search limit
                });

                if (!result.searchFiles) {
                    return null;
                }

                // Transform search results to StorageItem[]
                const items: Graphql.StorageObject[] = result.searchFiles
                    .items as Graphql.StorageObject[];

                return {
                    items,
                    totalCount: result.searchFiles.totalCount,
                };
            } catch {
                showNotification(translations.failedToSearchFiles, "error");
                return null;
            }
        },
        [storageGraphQL, showNotification, translations.failedToSearchFiles],
    );

    const contextValue: StorageManagementCoreContextType = useMemo(
        () => ({
            // State
            stats,

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
        }),
        [
            stats,
            fetchList,
            fetchDirectoryChildren,
            fetchStats,
            rename,
            remove,
            move,
            copy,
            createFolder,
            search,
        ],
    );

    return (
        <StorageManagementCoreContext.Provider value={contextValue}>
            {children}
        </StorageManagementCoreContext.Provider>
    );
};
