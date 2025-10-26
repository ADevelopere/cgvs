"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { useStorageUploadStore } from "../stores/useStorageUploadStore";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import {
  inferContentType,
  getFileKey,
  generateFileMD5,
} from "../core/storage.util";
import { getStoragePath } from "../core/storage.location";
import logger from "@/client/lib/logger";
import { UploadFileState } from "../core/storage-upload.types";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { useMutationWrapper } from "@/client/graphql/utils";
import { generateUploadSignedUrlMutationDocument } from "../core/storage.documents";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  evictListFilesCache as evictListFilesCacheUtil,
  evictDirectoryChildrenCache as evictDirectoryChildrenCacheUtil,
} from "../core/storage.cache";

export const useStorageUploadOperations = () => {
  const {
    uploadBatch,
    setUploadBatch,
    updateFileState,
    updateBatchProgress,
    clearUploadBatch,
  } = useStorageUploadStore();
  const generateUploadSignedUrl = useMutationWrapper(
    useMutation(generateUploadSignedUrlMutationDocument)
  );
  const apolloClient = useApolloClient();
  const { params } = useStorageDataStore();
  const notifications = useNotifications();
  const { uploading: translations } = useAppTranslation("storageTranslations");
  const uploadXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const uploadStartTimeRef = useRef<number | null>(null);
  const paramsRef = useRef<Graphql.FilesListInput>(params);

  // Keep paramsRef updated
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const uploadSingleFile = useCallback(
    async (file: File, targetPath: string): Promise<void> => {
      const fileKey = getFileKey(file);
      const contentType = inferContentType(file);
      let loadListener: ((ev: Event) => void) | null = null;
      let errorListener: ((ev: Event) => void) | null = null;
      let abortListener: ((ev: Event) => void) | null = null;
      let timeoutListener: ((ev: Event) => void) | null = null;
      let xhr: XMLHttpRequest | undefined = undefined;

      try {
        updateFileState(fileKey, {
          status: "uploading",
          progress: 0,
        });

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
          logger.error("Failed to get signed URL from response", {
            fileKey,
            fileName: file.name,
            response: signedUrlRes.data,
          });
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

        currentXhr.upload.onprogress = event => {
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

        const uploadContentType = file.type || "application/octet-stream";

        currentXhr.open("PUT", signedUrl);
        currentXhr.setRequestHeader("Content-Type", uploadContentType);
        currentXhr.setRequestHeader("Content-MD5", contentMd5);

        // Set timeout for the request (5 minutes)
        currentXhr.timeout = 5 * 60 * 1000;

        currentXhr.send(file);

        await new Promise<void>((resolve, reject) => {
          loadListener = () => {
            if (
              !currentXhr ||
              currentXhr.readyState !== XMLHttpRequest.DONE ||
              currentXhr.status === 0
            ) {
              logger.warn("Upload cancelled or incomplete", {
                fileKey,
                fileName: file.name,
                readyState: currentXhr?.readyState,
                status: currentXhr?.status,
                statusText: currentXhr?.statusText,
                responseText: currentXhr?.responseText,
                responseHeaders: currentXhr?.getAllResponseHeaders(),
                signedUrl: signedUrl.substring(0, 200) + "...",
                contentMd5,
                contentType: file.type,
              });
              handleError(translations.uploadCancelled);
              uploadXhrsRef.current.delete(fileKey);
              reject(new Error(translations.uploadCancelled));
              return;
            }
            if (currentXhr.status >= 200 && currentXhr.status < 300) {
              handleSuccess();
              resolve();
            } else {
              logger.error("🔍 [UPLOAD DEBUG] Upload failed with HTTP error", {
                fileKey,
                fileName: file.name,
                status: currentXhr.status,
                statusText: currentXhr.statusText,
                responseText: currentXhr.responseText,
                responseHeaders: currentXhr.getAllResponseHeaders(),
                signedUrl: signedUrl.substring(0, 200) + "...",
                sentContentMd5: contentMd5,
                sentContentType: uploadContentType,
                browserFileType: file.type,
                inferredContentType: contentType,
              });
              const errorMsg = translations.uploadFailedWithStatus.replace(
                "%{status}",
                String(currentXhr.status)
              );
              handleError(errorMsg);
              uploadXhrsRef.current.delete(fileKey);
              reject(new Error(errorMsg));
            }
          };
          errorListener = e => {
            logger.error("XMLHttpRequest error event", {
              fileKey,
              fileName: file.name,
              readyState: currentXhr?.readyState,
              status: currentXhr?.status,
              statusText: currentXhr?.statusText,
              responseText: currentXhr?.responseText,
              responseHeaders: currentXhr?.getAllResponseHeaders(),
              signedUrl: signedUrl.substring(0, 200) + "...",
              contentMd5,
              contentType: file.type,
              errorType: e.type,
              errorTarget: e.target,
            });
            logger.error("XMLHttpRequest error event", {
              error: e,
            });

            // Provide more specific error message based on status
            let errorMessage = translations.uploadFailed;
            if (currentXhr?.status === 0) {
              errorMessage =
                "Network error or CORS issue - check browser console for details";
              logger.error(
                "Upload failed with status 0 - likely CORS or network issue",
                {
                  fileKey,
                  fileName: file.name,
                  signedUrl: signedUrl.substring(0, 200) + "...",
                }
              );
            }

            handleError(errorMessage);
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error(errorMessage));
          };
          abortListener = () => {
            logger.warn("XMLHttpRequest abort event", {
              fileKey,
              fileName: file.name,
            });
            handleError(translations.uploadCancelled);
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error(translations.uploadCancelled));
          };

          timeoutListener = () => {
            logger.error("XMLHttpRequest timeout event", {
              fileKey,
              fileName: file.name,
              timeout: currentXhr?.timeout,
            });
            handleError("Upload timeout - please try again");
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error("Upload timeout - please try again"));
          };

          currentXhr.addEventListener("load", loadListener);
          currentXhr.addEventListener("error", errorListener);
          currentXhr.addEventListener("abort", abortListener);
          currentXhr.addEventListener("timeout", timeoutListener);
        });
      } catch (error) {
        logger.error("Upload failed with exception", {
          fileKey,
          fileName: file.name,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
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
          if (xhr && timeoutListener)
            xhr.removeEventListener("timeout", timeoutListener);
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
    ]
  );

  const startUpload = useCallback(
    async (
      files: File[],
      targetPath: string,
      callbacks?: { onComplete?: () => void },
      maxConcurrentUploads: number = 5,
      maxAllowedFileSize: number = 10 * 1024 * 1024
    ) => {
      const validFiles: File[] = [];
      const oversizedFiles: File[] = [];

      files.forEach(file => {
        if (file.size > maxAllowedFileSize) {
          oversizedFiles.push(file);
        } else {
          validFiles.push(file);
        }
      });

      if (oversizedFiles.length > 0) {
        const maxMb = (maxAllowedFileSize / 1024 / 1024).toFixed(2);
        const message = `${oversizedFiles.length} file(s) exceed the size limit of ${maxMb}MB and will not be uploaded.`;
        logger.warn("Files exceed size limit", {
          oversizedFiles: oversizedFiles.map(f => ({
            name: f.name,
            size: f.size,
          })),
          maxAllowedFileSize,
        });
        notifications.show(message, {
          severity: "warning",
          autoHideDuration: 5000,
        });
      }

      if (validFiles.length === 0) {
        logger.warn("No valid files to upload");
        return;
      }

      const fileMap = new Map<string, UploadFileState>();
      let totalSize = 0;
      validFiles.forEach(file => {
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

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
          const chunk = chunks[chunkIndex];

          await Promise.all(
            chunk.map(file => {
              return uploadSingleFile(file, targetPath);
            })
          );
        }

        // Update completion status
        if (uploadBatch) {
          const successCount = Array.from(uploadBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "success"
          ).length;
          const errorCount = Array.from(uploadBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "error"
          ).length;

          // Evict cache if any files were successfully uploaded
          if (successCount > 0) {
            // Evict listFiles and directoryChildren caches for target path
            evictListFilesCacheUtil(
              apolloClient,
              targetPath,
              paramsRef.current
            );
            evictDirectoryChildrenCacheUtil(apolloClient, targetPath);
          }

          setTimeout(() => {
            if (successCount > 0) {
              notifications.show(
                translations.uploadSuccessCount.replace(
                  "%{count}",
                  String(successCount)
                ),
                { severity: "success", autoHideDuration: 3000 }
              );
              callbacks?.onComplete?.();
            }
            if (errorCount > 0) {
              notifications.show(
                translations.uploadFailedCount.replace(
                  "%{count}",
                  String(errorCount)
                ),
                { severity: "warning", autoHideDuration: 5000 }
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
      apolloClient,
    ]
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
    [updateFileState, setUploadBatch, uploadBatch, translations.uploadCancelled]
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
        await uploadSingleFile(fileState.file, uploadBatch.targetPath);
      } catch {
        // uploadSingleFile handles setting error state; nothing more to do here
      }
    },
    [uploadBatch, updateFileState, uploadSingleFile]
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
    failedFiles.forEach(file => {
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
          chunk.map(file => uploadSingleFile(file, uploadBatch.targetPath))
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

  return useMemo(
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
    ]
  );
};
