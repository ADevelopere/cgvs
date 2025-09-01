"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import {
    StorageItem,
    StorageQueryParams,
    StorageManagementContextType,
} from "./storage.type";
import { STORAGE_DEFAULT_PARAMS } from "./storage.constant";
import { getStoragePath, getDisplayPath } from "./storage.location";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";
import { useNotifications } from "@toolpad/core/useNotifications";

const StorageManagementContext = createContext<
    StorageManagementContextType | undefined
>(undefined);

export const useStorageManagement = () => {
    const ctx = useContext(StorageManagementContext);
    if (!ctx)
        throw new Error(
            "useStorageManagement must be used within a StorageManagementProvider",
        );
    return ctx;
};

export const StorageManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const gql = useStorageGraphQL();
    const notifications = useNotifications();
    const translations = useAppTranslation("storageTranslations");
    const [items, setItems] = useState<StorageItem[]>([]);
    const [stats, setStats] = useState<Graphql.StorageStats | undefined>(
        undefined,
    );
    const [pagination, setPagination] =
        useState<StorageManagementContextType["pagination"]>(null);
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
    const [paramsState, setParamsState] = useState<StorageQueryParams>(
        STORAGE_DEFAULT_PARAMS,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    // Helpers
    const setParams = useCallback((partial: Partial<StorageQueryParams>) => {
        setParamsState((prev) => ({ ...prev, ...partial }));
    }, []);

    const navigateTo = useCallback(
        (path: string) => {
            setParams({ path, offset: 0 });
            setSelectedPaths([]);
        },
        [setParams],
    );

    const goUp = useCallback(() => {
        const parts = paramsState.path.split("/").filter(Boolean);
        parts.pop();
        const parent = parts.join("/");
        navigateTo(parent);
    }, [paramsState.path, navigateTo]);

    const toggleSelect = useCallback((path: string) => {
        setSelectedPaths((prev) =>
            prev.includes(path)
                ? prev.filter((p) => p !== path)
                : [...prev, path],
        );
    }, []);

    const selectAll = useCallback(() => {
        setSelectedPaths(items.map((i) => i.path));
    }, [items]);

    const clearSelection = useCallback(() => setSelectedPaths([]), []);

    const setPage = useCallback(
        (page: number) => {
            const newOffset = Math.max(0, (page - 1) * paramsState.limit);
            setParams({ offset: newOffset });
        },
        [paramsState.limit, setParams],
    );

    const setLimit = useCallback(
        (limit: number) => {
            setParams({ limit, offset: 0 });
        },
        [setParams],
    );

    const setFilterType = useCallback(
        (type?: Graphql.FileType) => setParams({ fileType: type }),
        [setParams],
    );
    const setSortField = useCallback(
        (field?: Graphql.FileSortField) => setParams({ sortField: field }),
        [setParams],
    );
    const search = useCallback(
        (term: string) => setParams({ searchTerm: term, offset: 0 }),
        [setParams],
    );

    // Data fetching
    const fetchList = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        try {
            // Convert display path to storage path for backend API calls
            const storagePath = getStoragePath(paramsState.path);

            const listRes = await gql.listFilesQuery({
                input: {
                    path: storagePath,
                    limit: paramsState.limit,
                    offset: paramsState.offset,
                    searchTerm: paramsState.searchTerm,
                    fileType: paramsState.fileType,
                    sortBy: paramsState.sortField,
                },
            });
            const list = listRes.listFiles;

            // Convert storage paths back to display paths
            const processedItems = list.items.map((item) => ({
                ...item,
                path: getDisplayPath(item.path),
            }));

            setItems(processedItems as StorageItem[]);
            setPagination({
                totalCount: list.totalCount,
                limit: list.limit,
                offset: list.offset,
                hasMore: list.hasMore,
            });
        } catch {
            logger.error(translations.failedListFiles);
            setError(translations.failedListFiles);
            notifications.show(translations.failedListFiles, {
                severity: "error",
                autoHideDuration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }, [
        gql,
        notifications,
        paramsState.fileType,
        paramsState.limit,
        paramsState.offset,
        paramsState.path,
        paramsState.searchTerm,
        paramsState.sortField,
        translations.failedListFiles,
    ]);

    const fetchStats = useCallback(async () => {
        try {
            // Convert display path to storage path for backend API calls
            const storagePath = getStoragePath(paramsState.path);
            const statsRes = await gql.getStorageStatsQuery({
                path: storagePath || undefined,
            });
            setStats(statsRes.getStorageStats);
        } catch (e) {
            logger.warn(translations.failedFetchStorageStats, e);
        }
    }, [gql, paramsState.path, translations.failedFetchStorageStats]);

    const refresh = useCallback(async () => {
        await Promise.all([fetchList(), fetchStats()]);
    }, [fetchList, fetchStats]);

    // Effects
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Mutations
    const rename = useCallback(
        async (path: string, newName: string): Promise<boolean> => {
            try {
                const res = await gql.renameFileMutation({
                    input: { currentPath: path, newName },
                });
                const ok = !!res.data?.renameFile.success;
                if (ok) {
                    notifications.show(translations.renameSuccess, {
                        severity: "success",
                        autoHideDuration: 2000,
                    });
                    await fetchList();
                    return true;
                }
            } catch (e) {
                logger.error("Rename failed", e);
            }
            notifications.show(translations.failedRename, {
                severity: "error",
                autoHideDuration: 3000,
            });
            return false;
        },
        [
            notifications,
            translations.failedRename,
            translations.renameSuccess,
            gql,
            fetchList,
        ],
    );

    const remove = useCallback(
        async (paths: string[]): Promise<boolean> => {
            if (paths.length === 0) return true;
            try {
                const results = await Promise.all(
                    paths.map((p) => gql.deleteFileMutation({ path: p })),
                );
                const allOk = results.every((r) => r.data?.deleteFile.success);
                if (allOk) {
                    notifications.show(translations.deleteSuccess, {
                        severity: "success",
                        autoHideDuration: 2000,
                    });
                    setSelectedPaths([]);
                    await fetchList();
                    return true;
                }
            } catch (e) {
                logger.error("Delete failed", e);
            }
            notifications.show(translations.failedDelete, {
                severity: "error",
                autoHideDuration: 3000,
            });
            return false;
        },
        [
            notifications,
            translations.failedDelete,
            translations.deleteSuccess,
            gql,
            fetchList,
        ],
    );

    const value: StorageManagementContextType = useMemo(
        () => ({
            // data
            items,
            stats,
            pagination,

            // selection
            selectedPaths,

            // params
            params: paramsState,

            // status
            loading,
            error,
            // actions
            setParams,
            navigateTo,
            goUp,
            refresh,
            toggleSelect,
            selectAll,
            clearSelection,
            rename,
            remove,
            search,
            setFilterType,
            setSortField,
            setPage,
            setLimit,
        }),
        [
            clearSelection,
            error,
            goUp,
            items,
            loading,
            navigateTo,
            pagination,
            paramsState,
            refresh,
            remove,
            rename,
            search,
            selectAll,
            selectedPaths,
            setFilterType,
            setLimit,
            setPage,
            setParams,
            setSortField,
            stats,
            toggleSelect,
        ],
    );

    return (
        <StorageManagementContext.Provider value={value}>
            {children}
        </StorageManagementContext.Provider>
    );
};
