"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    StorageItem,
    StorageQueryParams,
    StorageManagementContextType,
    UploadBatchState,
    UploadFileState,
} from "./storage.type";
import { STORAGE_DEFAULT_PARAMS } from "./storage.constant";
import { inferContentType, getFileKey } from "./storage.util";
import { 
    getLocationByPath, 
    getUploadLocationForPath, 
    isValidUploadLocation,
    getStoragePath,
    getDisplayPath,
    isPublicPath,
} from "./storage.location";
import * as Graphql from "@/graphql/generated/types";

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

    const [items, setItems] = useState<StorageItem[]>([]);
    const [stats, setStats] = useState<Graphql.StorageStats | undefined>(
        undefined,
    );
    const [pagination, setPagination] =
        useState<StorageManagementContextType["pagination"]>(null);
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
    const [params, setParamsState] = useState<StorageQueryParams>(
        STORAGE_DEFAULT_PARAMS,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [uploadBatch, setUploadBatch] = useState<
        UploadBatchState | undefined
    >(undefined);
    // Ref to track active XHRs immediately when they're created to avoid
    // a race where cancelUpload is called before the XHR reference is written
    // into React state (state updates may be async). Keys are fileKey strings.
    const uploadXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());

    // Helpers
    const setParams = useCallback((partial: Partial<StorageQueryParams>) => {
        setParamsState((prev) => ({ ...prev, ...partial }));
    }, []);

    const navigateTo = useCallback(
        (path: string) => {
            // Convert display path to storage path for the backend
            const storagePath = getStoragePath(path);
            setParams({ path, offset: 0 });
            setSelectedPaths([]);
        },
        [setParams],
    );

    const goUp = useCallback(() => {
        const parts = params.path.split("/").filter(Boolean);
        parts.pop();
        const parent = parts.join("/");
        navigateTo(parent);
    }, [params.path, navigateTo]);

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
            const newOffset = Math.max(0, (page - 1) * params.limit);
            setParams({ offset: newOffset });
        },
        [params.limit, setParams],
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
            const storagePath = getStoragePath(params.path);
            
            const listRes = await gql.listFilesQuery({
                input: {
                    path: storagePath,
                    limit: params.limit,
                    offset: params.offset,
                    searchTerm: params.searchTerm,
                    fileType: params.fileType,
                    sortBy: params.sortField,
                },
            });
            const list = listRes.listFiles;
            
            // Convert storage paths back to display paths
            const processedItems = list.items.map(item => ({
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
        } catch (e) {
            console.error("Failed to list files", e);
            setError("Failed to list files");
            notifications.show("Failed to list files", {
                severity: "error",
                autoHideDuration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }, [
        gql,
        notifications,
        params.fileType,
        params.limit,
        params.offset,
        params.path,
        params.searchTerm,
        params.sortField,
    ]);

    const fetchStats = useCallback(async () => {
        try {
            // Convert display path to storage path for backend API calls
            const storagePath = getStoragePath(params.path);
            const statsRes = await gql.getStorageStatsQuery({
                path: storagePath || undefined,
            });
            setStats(statsRes.getStorageStats);
        } catch (e) {
            console.warn("Failed to fetch storage stats", e);
        }
    }, [gql, params.path]);

    const refresh = useCallback(async () => {
        await Promise.all([fetchList(), fetchStats()]);
    }, [fetchList, fetchStats]);

    // Effects
    useEffect(() => {
        refresh();
    }, [refresh]);

    const uploadSingleFile = useCallback(
        async (file: File, location: Graphql.UploadLocation, targetPath: string): Promise<void> => {
            const fileKey = getFileKey(file);
            const contentType = inferContentType(file);
            // local refs for cleanup
            let loadListener: ((ev: Event) => void) | null = null;
            let errorListener: ((ev: Event) => void) | null = null;
            let abortListener: ((ev: Event) => void) | null = null;
            let xhr: XMLHttpRequest | undefined = undefined;

            try {
                // Update file state to uploading
                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, {
                        ...existing,
                        status: "uploading",
                        progress: 0,
                    });
                    return { ...prev, files: updated };
                });

                // Step 1: Get signed URL
                const signedUrlRes = await gql.generateUploadSignedUrlMutation({
                    input: {
                        fileName: file.name,
                        contentType,
                        location,
                    },
                });

                const signedUrl = signedUrlRes.data?.generateUploadSignedUrl;
                if (!signedUrl) {
                    throw new Error("Failed to generate signed URL");
                }

                // Update with signed URL
                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, {
                        ...existing,
                        signedUrl,
                    });
                    return { ...prev, files: updated };
                });

                // Step 2: Upload to signed URL
                xhr = new XMLHttpRequest();
                const currentXhr = xhr!;

                // Immediately store XHR in a ref to avoid race where cancelUpload is
                // called before the XHR is written into React state (setState is async).
                uploadXhrsRef.current.set(fileKey, xhr);

                // Attach XHR instance to upload state so it can be aborted externally
                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, {
                        ...existing,
                        status: "uploading",
                        progress: 0,
                        xhr,
                    });
                    return { ...prev, files: updated };
                });

                // Track progress
                currentXhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round(
                            (event.loaded / event.total) * 100,
                        );
                        setUploadBatch((prev) => {
                            if (!prev) return prev;
                            const updated = new Map(prev.files);
                            const existing = updated.get(fileKey);
                            if (!existing) return prev;
                            updated.set(fileKey, { ...existing, progress });
                            return { ...prev, files: updated };
                        });
                    }
                };

                // Common completion handler
                const handleSuccess = () => {
                    setUploadBatch((prev) => {
                        if (!prev) return prev;
                        const updated = new Map(prev.files);
                        const existing = updated.get(fileKey);
                        if (!existing) return prev;
                        updated.set(fileKey, {
                            ...existing,
                            status: "success",
                            progress: 100,
                            xhr: undefined,
                        });
                        return {
                            ...prev,
                            files: updated,
                            completedCount: prev.completedCount + 1,
                        };
                    });
                };

                const handleError = (errMsg: string) => {
                    setUploadBatch((prev) => {
                        if (!prev) return prev;
                        const updated = new Map(prev.files);
                        const existing = updated.get(fileKey);
                        if (!existing) return prev;
                        updated.set(fileKey, {
                            ...existing,
                            status: "error",
                            error: errMsg,
                            xhr: undefined,
                        });
                        return { ...prev, files: updated };
                    });
                };

                // Use addEventListener for load/error/abort and resolve/reject the
                // promise from those handlers. This keeps a single consistent
                // approach and allows us to remove exactly the listeners we add
                // in the finally block.
                // Perform the upload
                currentXhr.open("PUT", signedUrl);
                currentXhr.setRequestHeader(
                    "Content-Type",
                    file.type || "application/octet-stream",
                );
                currentXhr.send(file);

                // Wait for completion or error using listeners we can remove
                await new Promise<void>((resolve, reject) => {
                    const onLoad = () => {
                        try {
                            // Defensive: some environments may fire load with status 0
                            // or before the request is fully DONE; treat these as
                            // abort/failed.
                            if (
                                !currentXhr ||
                                currentXhr.readyState !== XMLHttpRequest.DONE ||
                                currentXhr.status === 0
                            ) {
                                handleError("Upload aborted");
                                uploadXhrsRef.current.delete(fileKey);
                                reject(new Error("Upload aborted"));
                                return;
                            }

                            if (currentXhr.status >= 200 && currentXhr.status < 300) {
                                handleSuccess();
                                resolve();
                            } else {
                                handleError(`Upload failed with status ${currentXhr.status}`);
                                uploadXhrsRef.current.delete(fileKey);
                                reject(new Error(`Upload failed with status ${currentXhr.status}`));
                            }
                        } catch (err) {
                            // Defensive fallback
                            handleError("Upload completion handler error");
                            uploadXhrsRef.current.delete(fileKey);
                            reject(err instanceof Error ? err : new Error(String(err)));
                        }
                    };

                    const onErr = () => {
                        const status = currentXhr?.status ?? 0;
                        const statusText = currentXhr?.statusText ?? "";
                        const resp = currentXhr?.responseText || "";

                        // Base message
                        let errorMsg = resp || "Network error during upload";

                        // When status is 0 or there is no response body, it's commonly a CORS/preflight
                        // failure in the browser. Provide a helpful hint for new developers and show
                        // a notification so the issue is easier to diagnose.
                        if (status === 0 || !resp) {
                            const hint = `Possible CORS/preflight failure. Ensure the GCS bucket has a CORS policy allowing PUT from your origin. See /cors/README.md and run: gcloud storage buckets update gs://cgvs --cors-file=./cors/cors-config.json`;
                            errorMsg = `${errorMsg} — ${hint}`;
                            try {
                                notifications.show(
                                    "Upload blocked by CORS/preflight. See cors/README.md for setup steps.",
                                    { severity: "error", autoHideDuration: 8000 },
                                );
                            } catch (e) {
                                // notifications may not be available in some contexts; ignore
                            }
                        }

                        const detailed = `Upload failed for ${file.name}. Status: ${status} ${statusText}. Response: ${resp || "No response text."}`;
                        console.error(detailed);

                        handleError(errorMsg);
                        uploadXhrsRef.current.delete(fileKey);
                        reject(new Error(errorMsg));
                    };

                    const onAbort = () => {
                        handleError("Upload aborted");
                        uploadXhrsRef.current.delete(fileKey);
                        reject(new Error("Upload aborted"));
                    };

                    loadListener = onLoad;
                    errorListener = onErr;
                    abortListener = onAbort;

                    if (currentXhr) {
                        currentXhr.addEventListener("load", onLoad);
                        currentXhr.addEventListener("error", onErr);
                        currentXhr.addEventListener("abort", onAbort);
                    } else {
                        reject(new Error("Internal upload error"));
                    }
                });
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, {
                        ...existing,
                        status: "error",
                        error: error instanceof Error ? error.message : "Upload failed",
                        xhr: undefined,
                    });
                    return { ...prev, files: updated };
                });
            } finally {
                // cleanup listeners and xhr ref to avoid leaks
                try {
                    if (xhr && loadListener) xhr.removeEventListener("load", loadListener);
                    if (xhr && errorListener) xhr.removeEventListener("error", errorListener);
                    if (xhr && abortListener) xhr.removeEventListener("abort", abortListener);
                } catch (e) {
                    /* ignore */
                }
                try {
                    if (uploadXhrsRef.current.has(fileKey)) uploadXhrsRef.current.delete(fileKey);
                } catch (e) {
                    /* ignore */
                }
            }
        },
        [gql, setUploadBatch],
    );

    // Mutations
    const rename = useCallback(
        async (path: string, newName: string): Promise<boolean> => {
            try {
                const res = await gql.renameFileMutation({
                    input: { currentPath: path, newName },
                });
                const ok = !!res.data?.renameFile.success;
                if (ok) {
                    notifications.show("Renamed successfully", {
                        severity: "success",
                        autoHideDuration: 2000,
                    });
                    await fetchList();
                    return true;
                }
            } catch (e) {
                console.error("Rename failed", e);
            }
            notifications.show("Failed to rename", {
                severity: "error",
                autoHideDuration: 3000,
            });
            return false;
        },
        [gql, notifications, fetchList],
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
                    notifications.show("Deleted successfully", {
                        severity: "success",
                        autoHideDuration: 2000,
                    });
                    setSelectedPaths([]);
                    await fetchList();
                    return true;
                }
            } catch (e) {
                console.error("Delete failed", e);
            }
            notifications.show("Failed to delete", {
                severity: "error",
                autoHideDuration: 3000,
            });
            return false;
        },
        [gql, notifications, fetchList],
    );

    // Upload actions
    const startUpload = useCallback(
        async (
            files: File[],
            targetPath?: string,
        ): Promise<void> => {
            if (files.length === 0) return;

            // Determine the upload location based on target path or current path
            const uploadPath = targetPath || params.path;
            const location = getUploadLocationForPath(uploadPath);
            
            if (!location) {
                notifications.show(
                    `Upload not allowed in this location. Please navigate to a valid upload location.`,
                    { severity: "error", autoHideDuration: 5000 }
                );
                return;
            }

            // Initialize upload batch
            const fileMap = new Map<string, UploadFileState>();
            files.forEach((file) => {
                fileMap.set(getFileKey(file), {
                    file,
                    progress: 0,
                    status: "pending",
                });
            });

            setUploadBatch({
                files: fileMap,
                location,
                isUploading: true,
                completedCount: 0,
                totalCount: files.length,
                targetPath: uploadPath,
            });

            try {
                // Upload files with limited concurrency (3 at a time)
                const concurrencyLimit = 3;
                const chunks: File[][] = [];
                for (let i = 0; i < files.length; i += concurrencyLimit) {
                    chunks.push(files.slice(i, i + concurrencyLimit));
                }

                for (const chunk of chunks) {
                    await Promise.all(
                        chunk.map((file) => uploadSingleFile(file, location, uploadPath)),
                    );
                }

                // Check final results
                setUploadBatch((prev) => {
                    if (!prev) return prev;

                    const successCount = Array.from(prev.files.values()).filter(
                        (f) => f.status === "success",
                    ).length;
                    const errorCount = Array.from(prev.files.values()).filter(
                        (f) => f.status === "error",
                    ).length;

                    // Defer side-effects to prevent state updates during render
                    if (successCount > 0 || errorCount > 0) {
                        setTimeout(() => {
                            if (successCount > 0) {
                                notifications.show(
                                    `${successCount} file(s) uploaded successfully`,
                                    {
                                        severity: "success",
                                        autoHideDuration: 3000,
                                    },
                                );
                                fetchList(); // Refresh on success
                            }
                            if (errorCount > 0) {
                                notifications.show(
                                    `${errorCount} file(s) failed to upload`,
                                    {
                                        severity: "warning",
                                        autoHideDuration: 5000,
                                    },
                                );
                            }
                        }, 0);
                    }

                    return { ...prev, isUploading: false };
                });
            } catch (error) {
                console.error("Upload batch failed:", error);
                notifications.show("Upload failed", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            } finally {
                setUploadBatch((prev) =>
                    prev ? { ...prev, isUploading: false } : undefined,
                );
            }
        },
        [notifications, fetchList, uploadSingleFile, params.path],
    );

    const clearUploadBatch = useCallback(() => {
        setUploadBatch(undefined);
    }, []);

    const cancelUpload = useCallback(
        (fileKey?: string) => {
            // If a single file key is provided, abort that XHR; otherwise abort all
            // First consult the XHR ref to immediately abort any active XHRs that
            // may not yet have been written into React state.
            if (fileKey) {
                const activeXhr = uploadXhrsRef.current.get(fileKey);
                if (activeXhr) {
                    try {
                        activeXhr.abort();
                    } catch (e) {
                        /* ignore */
                    }
                    uploadXhrsRef.current.delete(fileKey);
                }

                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const fileState = updated.get(fileKey);
                    updated.set(fileKey, {
                        ...fileState!,
                        status: "error",
                        error: "Upload cancelled",
                        xhr: undefined,
                    });
                    notifications.show("Upload cancelled", {
                        severity: "info",
                        autoHideDuration: 2000,
                    });
                    return { ...prev, files: updated };
                });
                return;
            }

            // Abort all: consult ref first then update state
            uploadXhrsRef.current.forEach((xhr, key) => {
                try {
                    xhr.abort();
                } catch (e) {
                    /* ignore */
                }
                uploadXhrsRef.current.delete(key);
            });

            setUploadBatch((prev) => {
                if (!prev) return prev;
                const updated = new Map(prev.files);

                updated.forEach((f, key) => {
                    updated.set(key, {
                        ...f,
                        status: "error",
                        error: "Upload cancelled",
                        xhr: undefined,
                    });
                });

                notifications.show("Upload cancelled", {
                    severity: "info",
                    autoHideDuration: 2000,
                });
                return { ...prev, files: updated, isUploading: false };
            });
        },
        [notifications],
    );

    // Retry a single failed file by key
    const retryFile = useCallback(
        async (fileKey: string): Promise<void> => {
            if (!uploadBatch) return;
            const fileState = uploadBatch.files.get(fileKey);
            if (!fileState) return;

            // Reset status to pending and call uploadSingleFile
            setUploadBatch((prev) => {
                if (!prev) return prev;
                const updated = new Map(prev.files);
                const f = updated.get(fileKey)!;
                updated.set(fileKey, {
                    ...f,
                    status: "pending",
                    progress: 0,
                    error: undefined,
                });
                return { ...prev, files: updated, isUploading: true };
            });

            try {
                await uploadSingleFile(fileState.file, uploadBatch.location, uploadBatch.targetPath);
            } catch (e) {
                // uploadSingleFile handles setting error state; nothing more to do here
            } finally {
                setUploadBatch((prev) =>
                    prev ? { ...prev, isUploading: false } : undefined,
                );
            }
        },
        [uploadBatch, uploadSingleFile],
    );

    const retryFailedUploads = useCallback(async (): Promise<void> => {
        if (!uploadBatch) return;

        const failedFiles = Array.from(uploadBatch.files.values())
            .filter((f) => f.status === "error")
            .map((f) => f.file);

        if (failedFiles.length === 0) {
            notifications.show("No failed uploads to retry", {
                severity: "info",
                autoHideDuration: 2000,
            });
            return;
        }

        // Reset failed files to pending
        setUploadBatch((prev) => {
            if (!prev) return prev;
            const updated = new Map(prev.files);
            Array.from(updated.entries()).forEach(([key, file]) => {
                if (file.status === "error") {
                    updated.set(key, {
                        ...file,
                        status: "pending",
                        progress: 0,
                        error: undefined,
                    });
                }
            });
            return { ...prev, files: updated, isUploading: true };
        });

        // Retry failed uploads
        try {
            await Promise.all(
                failedFiles.map((file) =>
                    uploadSingleFile(file, uploadBatch.location, uploadBatch.targetPath),
                ),
            );
            notifications.show("Retry completed", {
                severity: "success",
                autoHideDuration: 2000,
            });
        } catch (error) {
            console.error("Retry failed:", error);
            notifications.show("Retry failed", {
                severity: "error",
                autoHideDuration: 3000,
            });
        } finally {
            setUploadBatch((prev) =>
                prev ? { ...prev, isUploading: false } : undefined,
            );
        }
    }, [uploadBatch, notifications, uploadSingleFile]);

    const value: StorageManagementContextType = useMemo(
        () => ({
            // data
            items,
            stats,
            pagination,

            // selection
            selectedPaths,

            // params
            params,

            // status
            loading,
            error,

            // upload state
            uploadBatch,

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

            // upload actions
            startUpload,
            cancelUpload,
            retryFailedUploads,
            retryFile,
            clearUploadBatch,
        }),
        [clearSelection, error, goUp, items, loading, navigateTo, pagination, params, refresh, remove, rename, search, selectedPaths, setFilterType, setLimit, setPage, setParams, setSortField, stats, uploadBatch, startUpload, cancelUpload, retryFailedUploads, clearUploadBatch, toggleSelect, selectAll, retryFile],
    );

    return (
        <StorageManagementContext.Provider value={value}>
            {children}
        </StorageManagementContext.Provider>
    );
};
