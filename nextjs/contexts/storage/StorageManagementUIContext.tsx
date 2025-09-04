"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from "react";
import { useStorageManagementCore } from "./StorageManagementCoreContext";
import * as Graphql from "@/graphql/generated/types";
import {
    StorageQueryParams,
    StorageItem,
    PaginationInfo,
    DirectoryTreeNode,
    StorageManagementUIContextType,
    ViewMode,
    Clipboard,
    LoadingStates,
    OperationErrors,
} from "./storage.type";
import logger from "@/utils/logger";
import useAppTranslation from "@/locale/useAppTranslation";

const StorageManagementUIContext = createContext<
    StorageManagementUIContextType | undefined
>(undefined);

export const useStorageManagementUI = () => {
    const context = useContext(StorageManagementUIContext);
    if (!context) {
        throw new Error(
            "useStorageManagementUI must be used within a StorageManagementUIProvider",
        );
    }
    return context;
};

export const StorageManagementUIProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const coreContext = useStorageManagementCore();
    const { ui: translations } = useAppTranslation("storageTranslations");

    // State Management
    const [items, setItems] = useState<StorageItem[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [directoryTree, setDirectoryTree] = useState<DirectoryTreeNode[]>([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [prefetchedNodes, setPrefetchedNodes] = useState<Set<string>>(
        new Set(),
    );

    // Query Parameters
    const [queryParams, setQueryParams] = useState<StorageQueryParams>({
        path: "",
        limit: 50,
        offset: 0,
    });

    // Selection State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(
        null,
    );
    const [focusedItem, setFocusedItem] = useState<string | null>(null);

    // UI Interaction State
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<StorageItem[]>([]);
    const [clipboard, setClipboard] = useState<Clipboard | null>(null);

    // Local UI State
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDirection, setSortDirection] =
        useState<Graphql.SortDirection>("ASC");

    // Operation States
    const [loading, setLoading] = useState<LoadingStates>({
        fetchList: false,
        rename: false,
        delete: false,
        move: false,
        copy: false,
        createFolder: false,
        search: false,
        expandingNode: null,
        prefetchingNode: null,
    });
    const [operationErrors, setOperationErrors] = useState<OperationErrors>({});

    // Helper function to update loading state
    const updateLoading = useCallback(
        (key: keyof LoadingStates, value: boolean | string | null) => {
            setLoading((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    // Helper function to update operation errors
    const updateError = useCallback(
        (key: keyof OperationErrors, error?: string) => {
            setOperationErrors((prev) => ({ ...prev, [key]: error }));
        },
        [],
    );

    // Initialize directory tree and root items on mount with proper hydration handling
    useEffect(() => {
        let isMounted = true;

        const initializeStorageData = async () => {
            // Wait for hydration to complete
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Check if component is still mounted
            if (!isMounted) return;

            try {
                // Initialize both directory tree and root items in parallel
                updateLoading("prefetchingNode", "");
                updateLoading("fetchList", true);

                const [rootDirectories, rootItems] = await Promise.all([
                    coreContext.fetchDirectoryChildren(),
                    coreContext.fetchList(queryParams),
                ]);

                // Check again if component is still mounted before updating state
                if (isMounted) {
                    if (rootDirectories) {
                        setDirectoryTree(rootDirectories);
                    }
                    if (rootItems) {
                        setItems(rootItems.items);
                        setPagination(rootItems.pagination);
                    }
                }
            } catch (error) {
                // Only log if not an abort error during unmount
                if (isMounted) {
                    logger.error("Error initializing storage data:", error);
                    updateError(
                        "fetchList",
                        translations.failedToNavigateToDirectory,
                    );
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

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [
        coreContext,
        updateLoading,
        queryParams,
        updateError,
        translations.failedToNavigateToDirectory,
    ]);

    // Navigation Functions
    const navigateTo = useCallback(
        async (path: string) => {
            updateLoading("fetchList", true);
            updateError("fetchList");

            try {
                const newParams = { ...queryParams, path, offset: 0 };
                const result = await coreContext.fetchList(newParams);

                if (result) {
                    setItems(result.items);
                    setPagination(result.pagination);
                    setQueryParams(newParams);
                    setSelectedItems([]);
                    setLastSelectedItem(null);

                    // Exit search mode if navigating
                    if (searchMode) {
                        setSearchMode(false);
                        setSearchResults([]);
                    }
                }
            } catch {
                updateError(
                    "fetchList",
                    translations.failedToNavigateToDirectory,
                );
            } finally {
                updateLoading("fetchList", false);
            }
        },
        [
            queryParams,
            coreContext,
            searchMode,
            updateError,
            updateLoading,
            translations,
        ],
    );

    const goUp = useCallback(async () => {
        const parentPath = queryParams.path.split("/").slice(0, -1).join("/");
        await navigateTo(parentPath);
    }, [queryParams.path, navigateTo]);

    const refresh = useCallback(async () => {
        updateLoading("fetchList", true);
        updateError("fetchList");

        try {
            const result = await coreContext.fetchList(queryParams);
            if (result) {
                setItems(result.items);
                setPagination(result.pagination);
            }
        } catch {
            updateError("fetchList", translations.failedToRefreshDirectory);
        } finally {
            updateLoading("fetchList", false);
        }
    }, [queryParams, coreContext, updateError, updateLoading, translations]);

    const expandDirectoryNode = useCallback(
        async (path: string) => {
            if (expandedNodes.has(path)) return; // Already expanded

            updateLoading("expandingNode", path);

            try {
                const children = await coreContext.fetchDirectoryChildren(path);
                if (children) {
                    // Update the directory tree
                    const updateTreeNode = (
                        nodes: DirectoryTreeNode[],
                    ): DirectoryTreeNode[] => {
                        return nodes.map((node) => {
                            if (node.path === path) {
                                // Replace children instead of concatenating
                                return { ...node, children: children };
                            }
                            if (node.children) {
                                return {
                                    ...node,
                                    children: updateTreeNode(node.children),
                                };
                            }
                            return node;
                        });
                    };

                    setDirectoryTree((prev) => updateTreeNode(prev));
                    setExpandedNodes((prev) => new Set([...prev, path]));
                }
            } catch (error) {
                logger.error("Error expanding directory node:", error);
            } finally {
                updateLoading("expandingNode", null);
            }
        },
        [expandedNodes, coreContext, updateLoading],
    );

    const collapseDirectoryNode = useCallback((path: string) => {
        const updateTreeNode = (
            nodes: DirectoryTreeNode[],
        ): DirectoryTreeNode[] => {
            return nodes.map((node) => {
                if (node.path === path) {
                    return {
                        ...node,
                        isExpanded: false,
                    };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateTreeNode(node.children),
                    };
                }
                return node;
            });
        };

        setDirectoryTree((prev) => updateTreeNode(prev));
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(path);
            return newSet;
        });
    }, []);

    const prefetchDirectoryChildren = useCallback(
        async (path: string, refresh?: boolean) => {
            if (
                (!refresh && prefetchedNodes.has(path)) ||
                expandedNodes.has(path)
            )
                return;

            updateLoading("prefetchingNode", path);
            setPrefetchedNodes((prev) => new Set([...prev, path]));

            try {
                const children = await coreContext.fetchDirectoryChildren(path);
                if (children) {
                    // Cache the children for instant expansion later
                    const updateTreeNode = (
                        nodes: DirectoryTreeNode[],
                    ): DirectoryTreeNode[] => {
                        // If nodes array is empty and this is the root path, return the children directly
                        if (nodes.length === 0 && path === "") {
                            return children.map((child) => ({
                                ...child,
                                isPrefetched: true,
                            }));
                        }

                        return nodes.map((node) => {
                            if (node.path === path) {
                                return {
                                    ...node,
                                    children,
                                    isPrefetched: true,
                                };
                            }
                            if (node.children) {
                                return {
                                    ...node,
                                    children: updateTreeNode(node.children),
                                };
                            }
                            return node;
                        });
                    };

                    setDirectoryTree((prev) => updateTreeNode(prev));
                }
            } catch (error) {
                // Fail silently for prefetching
                logger.debug("Prefetch failed:", error);
            } finally {
                updateLoading("prefetchingNode", null);
            }
        },
        [prefetchedNodes, expandedNodes, updateLoading, coreContext],
    );

    // Selection Management
    const toggleSelect = useCallback((path: string) => {
        setSelectedItems((prev) => {
            const isSelected = prev.includes(path);
            if (isSelected) {
                return prev.filter((p) => p !== path);
            } else {
                return [...prev, path];
            }
        });
        setLastSelectedItem(path);
    }, []);

    const selectAll = useCallback(() => {
        const currentItems = searchMode ? searchResults : items;
        const allPaths = currentItems.map((item) => item.path);
        setSelectedItems(allPaths);
    }, [searchMode, searchResults, items]);

    const clearSelection = useCallback(() => {
        setSelectedItems([]);
        setLastSelectedItem(null);
    }, []);

    const selectRange = useCallback(
        (fromPath: string, toPath: string) => {
            const currentItems = searchMode ? searchResults : items;
            const fromIndex = currentItems.findIndex(
                (item) => item.path === fromPath,
            );
            const toIndex = currentItems.findIndex(
                (item) => item.path === toPath,
            );

            if (fromIndex !== -1 && toIndex !== -1) {
                const start = Math.min(fromIndex, toIndex);
                const end = Math.max(fromIndex, toIndex);
                const rangePaths = currentItems
                    .slice(start, end + 1)
                    .map((item) => item.path);

                setSelectedItems((prev) => {
                    const newSelection = new Set([...prev, ...rangePaths]);
                    return Array.from(newSelection);
                });
            }
        },
        [searchMode, searchResults, items],
    );

    // Parameter Management
    const setParams = useCallback((partial: Partial<StorageQueryParams>) => {
        setQueryParams((prev) => ({ ...prev, ...partial }));
    }, []);

    const search = useCallback(
        async (term: string) => {
            updateLoading("search", true);
            updateError("search");

            try {
                const result = await coreContext.search(term, queryParams.path);
                if (result) {
                    setSearchResults(result.items);
                    setSearchMode(true);
                    setSelectedItems([]);
                    setLastSelectedItem(null);
                }
            } catch {
                updateError("search", translations.searchFailed);
            } finally {
                updateLoading("search", false);
            }
        },
        [
            coreContext,
            queryParams.path,
            updateError,
            updateLoading,
            translations,
        ],
    );

    const setFilterType = useCallback(
        (type?: Graphql.FileType) => {
            setParams({ fileType: type, offset: 0 });
        },
        [setParams],
    );

    const setSortField = useCallback(
        (field?: Graphql.FileSortField) => {
            setParams({ sortField: field, offset: 0 });
        },
        [setParams],
    );

    const setPage = useCallback(
        (page: number) => {
            setParams({ offset: page * queryParams.limit });
        },
        [setParams, queryParams.limit],
    );

    const setLimit = useCallback(
        (limit: number) => {
            setParams({ limit, offset: 0 });
        },
        [setParams],
    );

    // Local Sorting
    const getSortedItems = useCallback((): StorageItem[] => {
        const currentItems = searchMode ? searchResults : items;

        return [...currentItems].sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;
            const aName = (a.path.split("/").pop() || a.path).toLowerCase();
            const bName = (b.path.split("/").pop() || b.path).toLowerCase();
            switch (sortBy) {
                case "name":
                    aValue = aName;
                    bValue = bName;
                    break;
                case "size":
                    aValue = "size" in a ? a.size : 0;
                    bValue = "size" in b ? b.size : 0;
                    break;
                case "lastModified":
                    aValue =
                        (a as unknown as { lastModified?: number })
                            .lastModified ?? 0;
                    bValue =
                        (b as unknown as { lastModified?: number })
                            .lastModified ?? 0;
                    break;
                case "created":
                    aValue =
                        (a as unknown as { created?: number }).created ?? 0;
                    bValue =
                        (b as unknown as { created?: number }).created ?? 0;
                    break;
                default:
                    aValue = aName;
                    bValue = bName;
            }

            if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;
            return 0;
        });
    }, [searchMode, searchResults, items, sortBy, sortDirection]);

    // Clipboard Operations
    const copyItems = useCallback((items: StorageItem[]) => {
        setClipboard({ operation: "copy", items });
    }, []);

    const cutItems = useCallback((items: StorageItem[]) => {
        setClipboard({ operation: "cut", items });
    }, []);

    const pasteItems = useCallback(async (): Promise<boolean> => {
        if (!clipboard) return false;

        const sourcePaths = clipboard.items.map((item) => item.path);
        const destinationPath = queryParams.path;

        if (clipboard.operation === "copy") {
            updateLoading("copy", true);
            const success = await coreContext.copy(
                sourcePaths,
                destinationPath,
            );
            updateLoading("copy", false);

            if (success) {
                await refresh();
            }
            return success;
        } else if (clipboard.operation === "cut") {
            updateLoading("move", true);
            const success = await coreContext.move(
                sourcePaths,
                destinationPath,
            );
            updateLoading("move", false);

            if (success) {
                setClipboard(null); // Clear clipboard after successful cut/paste
                await refresh();
            }
            return success;
        }

        return false;
    }, [clipboard, queryParams.path, updateLoading, coreContext, refresh]);

    // File Operations (UI Layer)
    const renameItem = useCallback(
        async (path: string, newName: string): Promise<boolean> => {
            updateLoading("rename", true);
            const success = await coreContext.rename(path, newName);
            updateLoading("rename", false);

            if (success) {
                await refresh();
            }
            return success;
        },
        [coreContext, refresh, updateLoading],
    );

    const deleteItems = useCallback(
        async (paths: string[]): Promise<boolean> => {
            updateLoading("delete", true);
            const success = await coreContext.remove(paths);
            updateLoading("delete", false);

            if (success) {
                // Clear selection of deleted items
                setSelectedItems((prev) =>
                    prev.filter((path) => !paths.includes(path)),
                );
                await refresh();
            }
            return success;
        },
        [coreContext, refresh, updateLoading],
    );

    const moveItems = useCallback(
        async (
            sourcePaths: string[],
            destinationPath: string,
        ): Promise<boolean> => {
            updateLoading("move", true);
            const success = await coreContext.move(
                sourcePaths,
                destinationPath,
            );
            updateLoading("move", false);

            if (success) {
                await refresh();
            }
            return success;
        },
        [coreContext, refresh, updateLoading],
    );

    const copyItemsTo = useCallback(
        async (
            sourcePaths: string[],
            destinationPath: string,
        ): Promise<boolean> => {
            updateLoading("copy", true);
            const success = await coreContext.copy(
                sourcePaths,
                destinationPath,
            );
            updateLoading("copy", false);

            if (success) {
                await refresh();
            }
            return success;
        },
        [coreContext, refresh, updateLoading],
    );

    // Utility Functions
    const exitSearchMode = useCallback(() => {
        setSearchMode(false);
        setSearchResults([]);
        setSelectedItems([]);
        setLastSelectedItem(null);
    }, []);

    // Context Value
    const contextValue: StorageManagementUIContextType = useMemo(
        () => ({
            // Data State
            items,
            pagination,
            directoryTree,
            expandedNodes,
            prefetchedNodes,

            // Query Parameters
            params: queryParams,

            // Selection State
            selectedItems,
            lastSelectedItem,
            focusedItem,

            // UI Interaction State
            viewMode,
            searchMode,
            searchResults,
            clipboard,

            // Local UI State
            sortBy,
            sortDirection,

            // Operation States
            loading,
            operationErrors,

            // Navigation Functions
            navigateTo,
            goUp,
            refresh,
            expandDirectoryNode,
            collapseDirectoryNode,
            prefetchDirectoryChildren,

            // Selection Management
            toggleSelect,
            selectAll,
            clearSelection,
            selectRange,

            // Parameter Management
            setParams,
            search,
            setFilterType,
            setSortField,
            setPage,
            setLimit,

            // Local Sorting
            setSortBy,
            setSortDirection,
            getSortedItems,

            // Clipboard Operations
            copyItems,
            cutItems,
            pasteItems,

            // File Operations (UI Layer)
            renameItem,
            deleteItems,
            moveItems,
            copyItemsTo,

            // Utility Functions
            setViewMode,
            setFocusedItem,
            exitSearchMode,
        }),
        [
            items,
            pagination,
            directoryTree,
            expandedNodes,
            prefetchedNodes,
            queryParams,
            selectedItems,
            lastSelectedItem,
            focusedItem,
            viewMode,
            searchMode,
            searchResults,
            clipboard,
            sortBy,
            sortDirection,
            loading,
            operationErrors,
            navigateTo,
            goUp,
            refresh,
            expandDirectoryNode,
            collapseDirectoryNode,
            prefetchDirectoryChildren,
            toggleSelect,
            selectAll,
            clearSelection,
            selectRange,
            setParams,
            search,
            setFilterType,
            setSortField,
            setPage,
            setLimit,
            getSortedItems,
            copyItems,
            cutItems,
            pasteItems,
            renameItem,
            deleteItems,
            moveItems,
            copyItemsTo,
            exitSearchMode,
        ],
    );

    return (
        <StorageManagementUIContext.Provider value={contextValue}>
            {children}
        </StorageManagementUIContext.Provider>
    );
};
