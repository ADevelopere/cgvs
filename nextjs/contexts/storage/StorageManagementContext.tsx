"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as Graphql from "@/graphql/generated/types";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import { StorageItem, StorageManagementContextType, StorageQueryParams, UploadBatchState, UploadFileState } from "./storage.type";
import { STORAGE_DEFAULT_PARAMS } from "./storage.constant";
import { getFileKey, inferContentType } from "./storage.util";


const StorageManagementContext = createContext<StorageManagementContextType | undefined>(undefined);

export const useStorageManagement = () => {
  const ctx = useContext(StorageManagementContext);
  if (!ctx) throw new Error("useStorageManagement must be used within a StorageManagementProvider");
  return ctx;
};

export const StorageManagementProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const gql = useStorageGraphQL();
  const notifications = useNotifications();

  const [items, setItems] = useState<StorageItem[]>([]);
  const [stats, setStats] = useState<Graphql.StorageStats | undefined>(undefined);
  const [pagination, setPagination] = useState<StorageManagementContextType["pagination"]>(null);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [params, setParamsState] = useState<StorageQueryParams>(STORAGE_DEFAULT_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [uploadBatch, setUploadBatch] = useState<UploadBatchState | undefined>(undefined);

  // Helpers
  const setParams = useCallback((partial: Partial<StorageQueryParams>) => {
    setParamsState(prev => ({ ...prev, ...partial }));
  }, []);

  const navigateTo = useCallback((path: string) => {
    setParams({ path, offset: 0 });
    setSelectedPaths([]);
  }, [setParams]);

  const goUp = useCallback(() => {
    const parts = params.path.split("/").filter(Boolean);
    parts.pop();
    const parent = parts.join("/");
    navigateTo(parent);
  }, [params.path, navigateTo]);

  const toggleSelect = useCallback((path: string) => {
    setSelectedPaths(prev => prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedPaths(items.map(i => i.path));
  }, [items]);

  const clearSelection = useCallback(() => setSelectedPaths([]), []);

  const setPage = useCallback((page: number) => {
    const newOffset = Math.max(0, (page - 1) * params.limit);
    setParams({ offset: newOffset });
  }, [params.limit, setParams]);

  const setLimit = useCallback((limit: number) => {
    setParams({ limit, offset: 0 });
  }, [setParams]);

  const setFilterType = useCallback((type?: Graphql.FileType) => setParams({ fileType: type }), [setParams]);
  const setSortField = useCallback((field?: Graphql.FileSortField) => setParams({ sortField: field }), [setParams]);
  const search = useCallback((term: string) => setParams({ searchTerm: term, offset: 0 }), [setParams]);

  // Data fetching
  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const listRes = await gql.listFilesQuery({ input: {
        path: params.path,
        limit: params.limit,
        offset: params.offset,
        searchTerm: params.searchTerm,
        fileType: params.fileType,
        sortBy: params.sortField,
      }});
      const list = listRes.listFiles;
      setItems(list.items as StorageItem[]);
      setPagination({ totalCount: list.totalCount, limit: list.limit, offset: list.offset, hasMore: list.hasMore });
    } catch (e) {
      console.error("Failed to list files", e);
      setError("Failed to list files");
      notifications.show("Failed to list files", { severity: "error", autoHideDuration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [gql, notifications, params.fileType, params.limit, params.offset, params.path, params.searchTerm, params.sortField]);

  const fetchStats = useCallback(async () => {
    try {
      const statsRes = await gql.getStorageStatsQuery({ path: params.path || undefined });
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
  async (file: File, location: Graphql.UploadLocation): Promise<void> => {
    const fileKey = getFileKey(file);
    const contentType = inferContentType(file);

    try {
      // Update file state to uploading
      setUploadBatch(prev => {
        if (!prev) return prev;
        const updated = new Map(prev.files);
        updated.set(fileKey, { ...updated.get(fileKey)!, status: "uploading", progress: 0 });
        return { ...prev, files: updated };
      });

      // Step 1: Get signed URL
      const signedUrlRes = await gql.generateUploadSignedUrlMutation({
        input: {
          fileName: file.name,
          contentType,
          location,
        }
      });

      const signedUrl = signedUrlRes.data?.generateUploadSignedUrl;
      if (!signedUrl) {
        throw new Error("Failed to generate signed URL");
      }

      // Update with signed URL
      setUploadBatch(prev => {
        if (!prev) return prev;
        const updated = new Map(prev.files);
        updated.set(fileKey, { ...updated.get(fileKey)!, signedUrl });
        return { ...prev, files: updated };
      });

      // Step 2: Upload to signed URL
      const xhr = new XMLHttpRequest();

      // Attach XHR instance to upload state so it can be aborted externally
      setUploadBatch(prev => {
        if (!prev) return prev;
        const updated = new Map(prev.files);
        const existing = updated.get(fileKey)!;
        updated.set(fileKey, { ...existing, status: "uploading", progress: 0, xhr });
        return { ...prev, files: updated };
      });

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadBatch(prev => {
            if (!prev) return prev;
            const updated = new Map(prev.files);
            const existing = updated.get(fileKey)!;
            updated.set(fileKey, { ...existing, progress });
            return { ...prev, files: updated };
          });
        }
      };

      // Common completion handler
      const handleSuccess = () => {
        setUploadBatch(prev => {
          if (!prev) return prev;
          const updated = new Map(prev.files);
          const existing = updated.get(fileKey)!;
          updated.set(fileKey, { ...existing, status: "success", progress: 100, xhr: undefined });
          return { ...prev, files: updated, completedCount: prev.completedCount + 1 };
        });
      };

      const handleError = (errMsg: string) => {
        setUploadBatch(prev => {
          if (!prev) return prev;
          const updated = new Map(prev.files);
          const existing = updated.get(fileKey)!;
          updated.set(fileKey, { ...existing, status: "error", error: errMsg, xhr: undefined });
          return { ...prev, files: updated };
        });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          handleSuccess();
        } else {
          handleError(`Upload failed with status ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        // network-level error
        handleError("Network error during upload");
      };

      xhr.onabort = () => {
        // mark as error/aborted
        handleError("Upload aborted");
      };

      // Perform the upload
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);

      // Wait for completion or error
      await new Promise<void>((resolve, reject) => {
        const done = () => {
          // resolve if status indicates success
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };

        xhr.addEventListener('load', done);
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
      });

    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      setUploadBatch(prev => {
        if (!prev) return prev;
        const updated = new Map(prev.files);
        const existing = updated.get(fileKey)!;
        updated.set(fileKey, {
          ...existing,
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
          xhr: undefined,
        });
        return { ...prev, files: updated };
      });
    }
  },
  [gql, setUploadBatch]
);


  // Mutations
  const rename = useCallback(async (path: string, newName: string): Promise<boolean> => {
    try {
      const res = await gql.renameFileMutation({ input: { currentPath: path, newName } });
      const ok = !!res.data?.renameFile.success;
      if (ok) {
        notifications.show("Renamed successfully", { severity: "success", autoHideDuration: 2000 });
        await fetchList();
        return true;
      }
    } catch (e) {
      console.error("Rename failed", e);
    }
    notifications.show("Failed to rename", { severity: "error", autoHideDuration: 3000 });
    return false;
  }, [gql, notifications, fetchList]);

  const remove = useCallback(async (paths: string[]): Promise<boolean> => {
    if (paths.length === 0) return true;
    try {
      const results = await Promise.all(paths.map(p => gql.deleteFileMutation({ path: p })));
      const allOk = results.every(r => r.data?.deleteFile.success);
      if (allOk) {
        notifications.show("Deleted successfully", { severity: "success", autoHideDuration: 2000 });
        setSelectedPaths([]);
        await fetchList();
        return true;
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
    notifications.show("Failed to delete", { severity: "error", autoHideDuration: 3000 });
    return false;
  }, [gql, notifications, fetchList]);

  // Upload actions
  const startUpload = useCallback(async (files: File[], location: Graphql.UploadLocation): Promise<void> => {
    if (files.length === 0) return;

    // Initialize upload batch
    const fileMap = new Map<string, UploadFileState>();
    files.forEach(file => {
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
    });

    try {
      // Upload files with limited concurrency (3 at a time)
      const concurrencyLimit = 3;
      const chunks: File[][] = [];
      for (let i = 0; i < files.length; i += concurrencyLimit) {
        chunks.push(files.slice(i, i + concurrencyLimit));
      }

      for (const chunk of chunks) {
        await Promise.all(chunk.map(file => uploadSingleFile(file, location)));
      }

      // Check final results
      setUploadBatch(prev => {
        if (!prev) return prev;

        const successCount = Array.from(prev.files.values()).filter(f => f.status === "success").length;
        const errorCount = Array.from(prev.files.values()).filter(f => f.status === "error").length;

        if (successCount > 0) {
          notifications.show(`${successCount} file(s) uploaded successfully`, {
            severity: "success",
            autoHideDuration: 3000
          });
          // Refresh the file list to show new uploads
          fetchList();
        }

        if (errorCount > 0) {
          notifications.show(`${errorCount} file(s) failed to upload`, {
            severity: "warning",
            autoHideDuration: 5000
          });
        }

        return { ...prev, isUploading: false };
      });

    } catch (error) {
      console.error("Upload batch failed:", error);
      notifications.show("Upload failed", { severity: "error", autoHideDuration: 3000 });
    } finally {
      setUploadBatch(prev => prev ? { ...prev, isUploading: false } : undefined);
    }
  }, [notifications, fetchList, uploadSingleFile]);

  const clearUploadBatch = useCallback(() => {
    setUploadBatch(undefined);
  }, []);

  const cancelUpload = useCallback((fileKey?: string) => {
    // If a single file key is provided, abort that XHR; otherwise abort all
    setUploadBatch(prev => {
      if (!prev) return prev;
      const updated = new Map(prev.files);

      if (fileKey) {
        const fileState = updated.get(fileKey);
        if (fileState?.xhr) {
          try { fileState.xhr.abort(); } catch (e) { /* ignore */ }
        }
        updated.set(fileKey, { ...fileState!, status: "error", error: "Upload cancelled", xhr: undefined });
        notifications.show("Upload cancelled", { severity: "info", autoHideDuration: 2000 });
        return { ...prev, files: updated };
      }

      // Abort all
      updated.forEach((f, key) => {
        if (f?.xhr) {
          try { f.xhr.abort(); } catch (e) { /* ignore */ }
        }
        updated.set(key, { ...f, status: "error", error: "Upload cancelled", xhr: undefined });
      });

      notifications.show("Upload cancelled", { severity: "info", autoHideDuration: 2000 });
      return { ...prev, files: updated, isUploading: false };
    });
  }, [notifications]);

  const retryFailedUploads = useCallback(async (): Promise<void> => {
    if (!uploadBatch) return;

    const failedFiles = Array.from(uploadBatch.files.values())
      .filter(f => f.status === "error")
      .map(f => f.file);

    if (failedFiles.length === 0) {
      notifications.show("No failed uploads to retry", { severity: "info", autoHideDuration: 2000 });
      return;
    }

    // Reset failed files to pending
    setUploadBatch(prev => {
      if (!prev) return prev;
      const updated = new Map(prev.files);
      Array.from(updated.entries()).forEach(([key, file]) => {
        if (file.status === "error") {
          updated.set(key, { ...file, status: "pending", progress: 0, error: undefined });
        }
      });
      return { ...prev, files: updated, isUploading: true };
    });

    // Retry failed uploads
    try {
      await Promise.all(failedFiles.map(file => uploadSingleFile(file, uploadBatch.location)));
      notifications.show("Retry completed", { severity: "success", autoHideDuration: 2000 });
    } catch (error) {
      console.error("Retry failed:", error);
      notifications.show("Retry failed", { severity: "error", autoHideDuration: 3000 });
    } finally {
      setUploadBatch(prev => prev ? { ...prev, isUploading: false } : undefined);
    }
  }, [uploadBatch, notifications, uploadSingleFile]);

  const value: StorageManagementContextType = useMemo(() => ({
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
    clearUploadBatch,
  }), [clearSelection, error, goUp, items, loading, navigateTo, pagination, params, refresh, remove, rename, search, selectedPaths, setFilterType, setLimit, setPage, setParams, setSortField, stats, uploadBatch, startUpload, cancelUpload, retryFailedUploads, clearUploadBatch, toggleSelect, selectAll]);

  return (
    <StorageManagementContext.Provider value={value}>
      {children}
    </StorageManagementContext.Provider>
  );
};
