"use client";

import { useCallback, useRef } from "react";
import { useStorageUploadStore } from "../stores/useStorageUploadStore";
import { useStorageApolloMutations } from "./storage.operations";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import { inferContentType, getFileKey, generateFileMD5 } from "./storage.util";
import { getUploadLocationForPath, getStoragePath } from "./storage.location";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { UploadFileState } from "./storage-upload.types";
import logger from "@/lib/logger";

export const useStorageUploadOperations = () => {
  const {
    uploadBatch,
    setUploadBatch,
    updateFileState,
    updateBatchProgress,
    clearUploadBatch,
  } = useStorageUploadStore();
  const { generateUploadSignedUrl } = useStorageApolloMutations();
  const notifications = useNotifications();
  const { uploading: translations } = useAppTranslation("storageTranslations");
  const uploadXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const uploadStartTimeRef = useRef<number | null>(null);

  const uploadSingleFile = useCallback(
    async (
      file: File,
      location: Graphql.UploadLocationPath,
      targetPath: string,
    ): Promise<void> => {
      const fileKey = getFileKey(file);
      const contentType = inferContentType(file);
      let loadListener: ((ev: Event) => void) | null = null;
      let errorListener: ((ev: Event) => void) | null = null;
      let abortListener: ((ev: Event) => void) | null = null;
      let xhr: XMLHttpRequest | undefined = undefined;

      try {
        updateFileState(fileKey, {
          status: "uploading",
          progress: 0,
        });

        try {
          // const storageTargetParent = getStoragePath(targetPath);
          // const destinationStoragePath = storageTargetParent
          //   ? `${storageTargetParent}/${file.name}`
          //   : file.name;
          // Check for conflicts (simplified - would need listFiles query)
          // This is a placeholder for the conflict check logic
        } catch {}

        // Generate MD5 hash for the file
        const contentMd5 = await generateFileMD5(file);

        const signedUrlRes = await generateUploadSignedUrl({
          input: {
            path: getStoragePath(targetPath) + "/" + file.name,
            contentType,
            fileSize: file.size,
            contentMd5,
          },
        });

        const signedUrl = signedUrlRes.data?.generateUploadSignedUrl;
        if (!signedUrl) {
          throw new Error(translations.failedGenerateSignedUrl);
        }

        updateFileState(fileKey, { signedUrl });

        xhr = new XMLHttpRequest();
        const currentXhr = xhr;
        uploadXhrsRef.current.set(fileKey, xhr);

        updateFileState(fileKey, {
          status: "uploading",
          progress: 0,
          xhr,
        });

        currentXhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);

            // Calculate bytes uploaded for this file
            const bytesUploaded = (progress / 100) * file.size;
            updateBatchProgress(fileKey, progress, bytesUploaded);
          }
        };

        const handleSuccess = () => {
          updateFileState(fileKey, {
            status: "success",
            progress: 100,
            xhr: undefined,
          });
        };

        const handleError = (errMsg: string) => {
          updateFileState(fileKey, {
            status: "error",
            error: errMsg,
            xhr: undefined,
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
            if (currentXhr.status >= 200 && currentXhr.status < 300) {
              handleSuccess();
              resolve();
            } else {
              const errorMsg = translations.uploadFailedWithStatus.replace(
                "%{status}",
                String(currentXhr.status),
              );
              handleError(errorMsg);
              uploadXhrsRef.current.delete(fileKey);
              reject(new Error(errorMsg));
            }
          };
          errorListener = () => handleError(translations.uploadFailed);
          abortListener = () => handleError(translations.uploadCancelled);

          currentXhr.addEventListener("load", loadListener);
          currentXhr.addEventListener("error", errorListener);
          currentXhr.addEventListener("abort", abortListener);
        });
      } catch (error) {
        logger.warn(`Upload failed for ${file.name}:`, error);
        updateFileState(fileKey, {
          status: "error",
          error:
            error instanceof Error ? error.message : translations.uploadFailed,
          xhr: undefined,
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
    [
      generateUploadSignedUrl,
      updateFileState,
      updateBatchProgress,
      translations,
    ],
  );

  const startUpload = useCallback(
    async (
      files: File[],
      targetPath: string,
      callbacks?: { onComplete?: () => void },
      maxConcurrentUploads: number = 5,
      maxAllowedFileSize: number = 10 * 1024 * 1024,
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
        for (let i = 0; i < validFiles.length; i += maxConcurrentUploads) {
          chunks.push(validFiles.slice(i, i + maxConcurrentUploads));
        }

        for (const chunk of chunks) {
          await Promise.all(
            chunk.map((file) => uploadSingleFile(file, location, targetPath)),
          );
        }

        // Update completion status
        if (uploadBatch) {
          const successCount = Array.from(uploadBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "success",
          ).length;
          const errorCount = Array.from(uploadBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "error",
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

          setUploadBatch({ ...uploadBatch, isUploading: false });
        }
      } catch {
        notifications.show(translations.uploadFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        if (uploadBatch) {
          setUploadBatch({ ...uploadBatch, isUploading: false });
        }
      }
    },
    [
      notifications,
      translations,
      uploadSingleFile,
      setUploadBatch,
      uploadBatch,
    ],
  );

  const cancelUpload = useCallback(
    (fileKey?: string) => {
      // If a single file key is provided, abort that XHR; otherwise abort all
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

        updateFileState(fileKey, {
          status: "error",
          error: translations.uploadCancelled,
          xhr: undefined,
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

      // Update all pending/uploading files to cancelled
      if (uploadBatch) {
        const updatedFiles = new Map(uploadBatch.files);
        updatedFiles.forEach((f: UploadFileState, key: string) => {
          if (f.status === "pending" || f.status === "uploading") {
            updatedFiles.set(key, {
              ...f,
              status: "error",
              error: translations.uploadCancelled,
              xhr: undefined,
            });
          }
        });

        setUploadBatch({
          ...uploadBatch,
          files: updatedFiles,
          isUploading: false,
          timeRemaining: null,
        });
      }
    },
    [
      updateFileState,
      setUploadBatch,
      uploadBatch,
      translations.uploadCancelled,
    ],
  );

  const retryFile = useCallback(
    async (fileKey: string): Promise<void> => {
      if (!uploadBatch) return;
      const fileState = uploadBatch.files.get(fileKey);
      if (!fileState || fileState.status !== "error") return;

      // Reset status to pending and call uploadSingleFile
      updateFileState(fileKey, {
        status: "pending",
        progress: 0,
        error: undefined,
      });

      try {
        await uploadSingleFile(
          fileState.file,
          uploadBatch.location,
          uploadBatch.targetPath,
        );
      } catch {
        // uploadSingleFile handles setting error state; nothing more to do here
      }
    },
    [uploadBatch, updateFileState, uploadSingleFile],
  );

  const retryFailedUploads = useCallback(async (): Promise<void> => {
    if (!uploadBatch) return;

    const failedFiles: File[] = [];
    uploadBatch.files.forEach((f: UploadFileState) => {
      if (f.status === "error") {
        failedFiles.push(f.file);
      }
    });

    if (failedFiles.length === 0) {
      notifications.show(translations.noFailedUploads, {
        severity: "info",
        autoHideDuration: 2000,
      });
      return;
    }

    // Reset failed files to pending
    failedFiles.forEach((file) => {
      const key = getFileKey(file);
      updateFileState(key, {
        status: "pending",
        progress: 0,
        error: undefined,
      });
    });

    // Retry failed uploads
    try {
      const chunks: File[][] = [];
      for (let i = 0; i < failedFiles.length; i += 5) {
        chunks.push(failedFiles.slice(i, i + 5));
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
      notifications.show(translations.retryCompletedUploads, {
        severity: "success",
        autoHideDuration: 2000,
      });
    } catch {
      notifications.show(translations.retryFailedUploads, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [
    uploadBatch,
    notifications,
    translations,
    updateFileState,
    uploadSingleFile,
  ]);

  return {
    uploadBatch,
    startUpload,
    cancelUpload,
    retryFailedUploads,
    retryFile,
    clearUploadBatch,
  };
};
