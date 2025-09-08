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
import useAppTranslation from "@/locale/useAppTranslation";
import * as Graphql from "@/graphql/generated/types";
import {
    StorageQueryParams,
    StorageItem,
    PaginationInfo,
    DirectoryTreeNode,
    StorageStats,
    StorageManagementCoreContextType,
} from "./storage.type";

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
    const [stats, setStats] = useState<StorageStats | null>(null);

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
            params: StorageQueryParams,
        ): Promise<{
            items: StorageItem[];
            pagination: PaginationInfo;
        } | null> => {
            try {
                const input: Graphql.ListFilesInput = {
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

                const pagination: PaginationInfo = {
                    hasMore: result.listFiles.hasMore,
                    limit: result.listFiles.limit,
                    offset: result.listFiles.offset,
                    totalCount: result.listFiles.totalCount,
                };

                // Transform StorageEntity[] to StorageItem[]
                const items: StorageItem[] = result.listFiles
                    .items as StorageItem[];

                return { items, pagination };
            } catch {
                showNotification(translations.failedToFetchFileList, "error");
                return null;
            }
        },
        [storageGraphQL, showNotification, translations.failedToFetchFileList],
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
                showNotification(
                    translations.failedToFetchDirectoryContents,
                    "error",
                );
                return null;
            }
        },
        [
            storageGraphQL,
            transformDirectoryToTreeNode,
            showNotification,
            translations.failedToFetchDirectoryContents,
        ],
    );

    const fetchStats = useCallback(
        async (path?: string): Promise<StorageStats | null> => {
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
                    const { successCount, failureCount, errors } =
                        result.deleteStorageItems;

                    if (failureCount === 0) {
                        showNotification(
                            translations.successfullyDeleted.replace(
                                "%{count}",
                                `${successCount} ${successCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.deletedPartial
                                .replace(
                                    "%{successCount}",
                                    successCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    failureCount.toString(),
                                )
                                .replace("%{errors}", errors.join(", ")),
                            "warning",
                        );
                        return successCount > 0; // Partial success
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
                    const { successCount, failureCount, errors } =
                        result.moveStorageItems;

                    if (failureCount === 0) {
                        showNotification(
                            translations.successfullyMoved.replace(
                                "%{count}",
                                `${successCount} ${successCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.movedPartial
                                .replace(
                                    "%{successCount}",
                                    successCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    failureCount.toString(),
                                )
                                .replace("%{errors}", errors.join(", ")),
                            "warning",
                        );
                        return successCount > 0; // Partial success
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
                    const { successCount, failureCount, errors } =
                        result.copyStorageItems;

                    if (failureCount === 0) {
                        showNotification(
                            translations.successfullyCopied.replace(
                                "%{count}",
                                `${successCount} ${successCount === 1 ? translations.item : translations.items}`,
                            ),
                            "success",
                        );
                        return true;
                    } else {
                        showNotification(
                            translations.copiedPartial
                                .replace(
                                    "%{successCount}",
                                    successCount.toString(),
                                )
                                .replace(
                                    "%{failureCount}",
                                    failureCount.toString(),
                                )
                                .replace("%{errors}", errors.join(", ")),
                            "warning",
                        );
                        return successCount > 0; // Partial success
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
            items: StorageItem[];
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
                const items: StorageItem[] = result.searchFiles
                    .items as StorageItem[];

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
