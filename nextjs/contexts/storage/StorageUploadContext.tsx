"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { useStorageGraphQL } from "./StorageGraphQLContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import { inferContentType, getFileKey } from "./storage.util";
import { getUploadLocationForPath, getStoragePath } from "./storage.location";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";

export type UploadFileState = {
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
    signedUrl?: string;
    xhr?: XMLHttpRequest;
};

export type UploadBatchState = {
    files: Map<string, UploadFileState>;
    location: Graphql.UploadLocation;
    targetPath: string;
    isUploading: boolean;
    completedCount: number;
    totalCount: number;
    totalProgress: number;
    timeRemaining: number | null; // in seconds
    totalSize: number;
    bytesUploaded: number;
};

export type StorageUploadContextType = {
    uploadBatch: UploadBatchState | undefined;
    startUpload: (
        files: File[],
        targetPath: string,
        callbacks?: { onComplete?: () => void },
    ) => Promise<void>;
    cancelUpload: (fileKey?: string) => void;
    retryFailedUploads: () => Promise<void>;
    retryFile: (fileKey: string) => Promise<void>;
    clearUploadBatch: () => void;
};

const StorageUploadContext = createContext<
    StorageUploadContextType | undefined
>(undefined);

export const useStorageUpload = () => {
    const ctx = useContext(StorageUploadContext);
    if (!ctx) {
        throw new Error(
            "useStorageUpload must be used within a StorageUploadProvider",
        );
    }
    return ctx;
};

export const StorageUploadProvider: React.FC<{
    children: React.ReactNode;
    maxConcurrentUploads?: number;
    maxAllowedFileSize?: number;
}> = ({
    children,
    maxConcurrentUploads = 5,
    maxAllowedFileSize = 10 * 1024 * 1024,
}) => {
    const gql = useStorageGraphQL();
    const notifications = useNotifications();
    const translations = useAppTranslation("storageTranslations");

    const [uploadBatch, setUploadBatch] = useState<
        UploadBatchState | undefined
    >(undefined);
    const uploadXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
    const uploadStartTimeRef = useRef<number | null>(null);

    const uploadSingleFile = useCallback(
        async (
            file: File,
            location: Graphql.UploadLocation,
            targetPath: string,
        ): Promise<void> => {
            const fileKey = getFileKey(file);
            const contentType = inferContentType(file);
            let loadListener: ((ev: Event) => void) | null = null;
            let errorListener: ((ev: Event) => void) | null = null;
            let abortListener: ((ev: Event) => void) | null = null;
            let xhr: XMLHttpRequest | undefined = undefined;

            try {
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

                try {
                    const storageTargetParent = getStoragePath(targetPath);
                    const destinationStoragePath = storageTargetParent
                        ? `${storageTargetParent}/${file.name}`
                        : file.name;

                    const listResForCheck = await gql.listFiles({
                        input: {
                            path: storageTargetParent,
                            limit: 10,
                            offset: 0,
                            searchTerm: file.name,
                        },
                    });

                    const existingItems =
                        listResForCheck.listFiles?.items || [];
                    const conflict = existingItems.some(
                        (it: { path: string; name: string }) =>
                            it.path === destinationStoragePath ||
                            it.name === file.name,
                    );

                    if (conflict) {
                        setUploadBatch((prev) => {
                            if (!prev) return prev;
                            const updated = new Map(prev.files);
                            const existing = updated.get(fileKey);
                            if (!existing) return prev;
                            updated.set(fileKey, {
                                ...existing,
                                status: "error",
                                error: translations.fileAlreadyExists,
                            });
                            return { ...prev, files: updated };
                        });
                        notifications.show(
                            `${file.name} — ${translations.fileAlreadyExists}`,
                            { severity: "warning", autoHideDuration: 4000 },
                        );
                        return;
                    }
                } catch (err) {
                    logger.warn(
                        "Failed to verify existing files before upload:",
                        err,
                    );
                }

                const signedUrlRes = await gql.generateUploadSignedUrl({
                    input: {
                        fileName: file.name,
                        contentType,
                        location,
                    },
                });

                const signedUrl = signedUrlRes.generateUploadSignedUrl;
                if (!signedUrl) {
                    throw new Error(translations.failedGenerateSignedUrl);
                }

                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, { ...existing, signedUrl });
                    return { ...prev, files: updated };
                });

                xhr = new XMLHttpRequest();
                const currentXhr = xhr;
                uploadXhrsRef.current.set(fileKey, xhr);

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

                currentXhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round(
                            (event.loaded / event.total) * 100,
                        );
                        setUploadBatch((prev) => {
                            if (!prev) return prev;

                            const updatedFiles = new Map(prev.files);
                            const existing = updatedFiles.get(fileKey);
                            if (!existing) return prev;

                            const oldBytesLoaded =
                                (existing.progress / 100) * existing.file.size;
                            const newBytesLoaded = (progress / 100) * file.size;
                            const deltaBytes = newBytesLoaded - oldBytesLoaded;

                            updatedFiles.set(fileKey, {
                                ...existing,
                                progress,
                            });

                            const bytesUploaded =
                                prev.bytesUploaded + deltaBytes;
                            const totalProgress =
                                prev.totalSize > 0
                                    ? Math.round(
                                          (bytesUploaded / prev.totalSize) *
                                              100,
                                      )
                                    : 0;

                            const elapsedTime =
                                (Date.now() -
                                    (uploadStartTimeRef.current ??
                                        Date.now())) /
                                1000;
                            const uploadSpeed =
                                elapsedTime > 0
                                    ? bytesUploaded / elapsedTime
                                    : 0;
                            const timeRemaining =
                                uploadSpeed > 0
                                    ? Math.round(
                                          (prev.totalSize - bytesUploaded) /
                                              uploadSpeed,
                                      )
                                    : null;

                            return {
                                ...prev,
                                files: updatedFiles,
                                bytesUploaded,
                                totalProgress,
                                timeRemaining,
                            };
                        });
                    }
                };

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

                currentXhr.open("PUT", signedUrl);
                currentXhr.setRequestHeader(
                    "Content-Type",
                    file.type || "application/octet-stream",
                );
                currentXhr.send(file);

                await new Promise<void>((resolve, reject) => {
                    loadListener = () => {
                        if (
                            !currentXhr ||
                            currentXhr.readyState !== XMLHttpRequest.DONE ||
                            currentXhr.status === 0
                        ) {
                            handleError(translations.uploadCancelled);
                            uploadXhrsRef.current.delete(fileKey);
                            reject(new Error(translations.uploadCancelled));
                            return;
                        }
                        if (
                            currentXhr.status >= 200 &&
                            currentXhr.status < 300
                        ) {
                            handleSuccess();
                            resolve();
                        } else {
                            const errorMsg =
                                translations.uploadFailedWithStatus.replace(
                                    "%{status}",
                                    String(currentXhr.status),
                                );
                            handleError(errorMsg);
                            uploadXhrsRef.current.delete(fileKey);
                            reject(new Error(errorMsg));
                        }
                    };
                    errorListener = () =>
                        handleError(translations.uploadFailed);
                    abortListener = () =>
                        handleError(translations.uploadCancelled);

                    currentXhr.addEventListener("load", loadListener);
                    currentXhr.addEventListener("error", errorListener);
                    currentXhr.addEventListener("abort", abortListener);
                });
            } catch (error) {
                logger.error(`Upload failed for ${file.name}:`, error);
                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const updated = new Map(prev.files);
                    const existing = updated.get(fileKey);
                    if (!existing) return prev;
                    updated.set(fileKey, {
                        ...existing,
                        status: "error",
                        error:
                            error instanceof Error
                                ? error.message
                                : translations.uploadFailed,
                        xhr: undefined,
                    });
                    return { ...prev, files: updated };
                });
            } finally {
                try {
                    if (xhr && loadListener)
                        xhr.removeEventListener("load", loadListener);
                    if (xhr && errorListener)
                        xhr.removeEventListener("error", errorListener);
                    if (xhr && abortListener)
                        xhr.removeEventListener("abort", abortListener);
                } catch {
                    /* ignore */
                }
                uploadXhrsRef.current.delete(fileKey);
            }
        },
        [gql, notifications, translations],
    );

    const startUpload = useCallback(
        async (
            files: File[],
            targetPath: string,
            callbacks?: { onComplete?: () => void },
        ) => {
            const validFiles: File[] = [];
            const oversizedFiles: File[] = [];

            files.forEach((file) => {
                if (file.size > maxAllowedFileSize) {
                    oversizedFiles.push(file);
                } else {
                    validFiles.push(file);
                }
            });

            if (oversizedFiles.length > 0) {
                const maxMb = (maxAllowedFileSize / 1024 / 1024).toFixed(2);
                const message = `${oversizedFiles.length} file(s) exceed the size limit of ${maxMb}MB and will not be uploaded.`;
                notifications.show(message, {
                    severity: "warning",
                    autoHideDuration: 5000,
                });
            }

            if (validFiles.length === 0) return;

            const location = getUploadLocationForPath(targetPath);
            if (!location) {
                notifications.show(translations.uploadNotAllowed, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                return;
            }

            const fileMap = new Map<string, UploadFileState>();
            let totalSize = 0;
            validFiles.forEach((file) => {
                fileMap.set(getFileKey(file), {
                    file,
                    progress: 0,
                    status: "pending",
                });
                totalSize += file.size;
            });

            uploadStartTimeRef.current = Date.now();

            setUploadBatch({
                files: fileMap,
                location,
                isUploading: true,
                completedCount: 0,
                totalCount: validFiles.length,
                targetPath,
                totalProgress: 0,
                timeRemaining: null,
                totalSize,
                bytesUploaded: 0,
            });

            try {
                const chunks: File[][] = [];
                for (
                    let i = 0;
                    i < validFiles.length;
                    i += maxConcurrentUploads
                ) {
                    chunks.push(validFiles.slice(i, i + maxConcurrentUploads));
                }

                for (const chunk of chunks) {
                    await Promise.all(
                        chunk.map((file) =>
                            uploadSingleFile(file, location, targetPath),
                        ),
                    );
                }

                setUploadBatch((prev) => {
                    if (!prev) return prev;
                    const successCount = Array.from(prev.files.values()).filter(
                        (f) => f.status === "success",
                    ).length;
                    const errorCount = Array.from(prev.files.values()).filter(
                        (f) => f.status === "error",
                    ).length;

                    setTimeout(() => {
                        if (successCount > 0) {
                            notifications.show(
                                translations.uploadSuccessCount.replace(
                                    "%{count}",
                                    String(successCount),
                                ),
                                { severity: "success", autoHideDuration: 3000 },
                            );
                            callbacks?.onComplete?.();
                        }
                        if (errorCount > 0) {
                            notifications.show(
                                translations.uploadFailedCount.replace(
                                    "%{count}",
                                    String(errorCount),
                                ),
                                { severity: "warning", autoHideDuration: 5000 },
                            );
                        }
                    }, 0);

                    return { ...prev, isUploading: false };
                });
            } catch (error) {
                logger.error("Upload batch failed:", error);
                notifications.show(translations.uploadFailed, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            } finally {
                setUploadBatch((prev) =>
                    prev ? { ...prev, isUploading: false } : undefined,
                );
            }
        },
        [
            notifications,
            translations,
            uploadSingleFile,
            maxAllowedFileSize,
            maxConcurrentUploads,
        ],
    );

    const clearUploadBatch = useCallback(() => setUploadBatch(undefined), []);

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
                    } catch {
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
                        error: translations.uploadCancelled,
                        xhr: undefined,
                    });
                    notifications.show(translations.uploadCancelled, {
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
                } catch {
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
                        error: translations.uploadCancelled,
                        xhr: undefined,
                    });
                });

                notifications.show(translations.uploadCancelled, {
                    severity: "info",
                    autoHideDuration: 2000,
                });
                return { ...prev, files: updated, isUploading: false };
            });
        },
        [notifications, translations.uploadCancelled],
    );

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
                await uploadSingleFile(
                    fileState.file,
                    uploadBatch.location,
                    uploadBatch.targetPath,
                );
            } catch {
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
            notifications.show(translations.noFailedUploads, {
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
            const chunks: File[][] = [];
            for (let i = 0; i < failedFiles.length; i += maxConcurrentUploads) {
                chunks.push(failedFiles.slice(i, i + maxConcurrentUploads));
            }

            for (const chunk of chunks) {
                await Promise.all(
                    chunk.map((file) =>
                        uploadSingleFile(
                            file,
                            uploadBatch.location,
                            uploadBatch.targetPath,
                        ),
                    ),
                );
            }
            notifications.show(translations.retryCompleted, {
                severity: "success",
                autoHideDuration: 2000,
            });
        } catch (error) {
            logger.error("Retry failed:", error);
            notifications.show(translations.retryFailed, {
                severity: "error",
                autoHideDuration: 3000,
            });
        } finally {
            setUploadBatch((prev) =>
                prev ? { ...prev, isUploading: false } : undefined,
            );
        }
    }, [
        uploadBatch,
        notifications,
        translations.noFailedUploads,
        translations.retryCompleted,
        translations.retryFailed,
        uploadSingleFile,
        maxConcurrentUploads,
    ]);

    const value: StorageUploadContextType = useMemo(
        () => ({
            uploadBatch,
            startUpload,
            cancelUpload,
            retryFailedUploads,
            retryFile,
            clearUploadBatch,
        }),
        [
            uploadBatch,
            startUpload,
            cancelUpload,
            retryFailedUploads,
            retryFile,
            clearUploadBatch,
        ],
    );

    return (
        <StorageUploadContext.Provider value={value}>
            {children}
        </StorageUploadContext.Provider>
    );
};
