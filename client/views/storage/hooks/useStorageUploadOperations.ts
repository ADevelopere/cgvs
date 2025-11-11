"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { useStorageUploadStore } from "../stores/useStorageUploadStore";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import { inferContentType, getFileKey, generateFileMD5 } from "../core/storage.util";
import { getStoragePath } from "../core/storage.location";
import logger from "@/client/lib/logger";
import { UploadFileState } from "../core/storage-upload.types";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { useMutationWrapper } from "@/client/graphql/utils";
import { prepareUploadMutationDocument } from "../core/storage.documents";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  evictListFilesCache as evictListFilesCacheUtil,
  evictDirectoryChildrenCache as evictDirectoryChildrenCacheUtil,
} from "../core/storage.cache";
import { upload as vercelUpload } from "@vercel/blob/client";
import { useAuthToken } from "@/client/contexts/AppApolloProvider";
import { VercelUploadUrlClientPlayload } from "@/app/api/storage/vercel-upload/route";

export const useStorageUploadOperations = () => {
  const { uploadBatch, setUploadBatch, updateFileState, updateBatchProgress, clearUploadBatch } =
    useStorageUploadStore();
  const prepareUpload = useMutationWrapper(useMutation(prepareUploadMutationDocument));
  const apolloClient = useApolloClient();
  const { params } = useStorageDataStore();
  const notifications = useNotifications();
  const {
    storageTranslations: { uploading: translations },
  } = useAppTranslation();
  const { authToken } = useAuthToken();
  const uploadXhrsRef = useRef<Map<string, XMLHttpRequest>>(new Map());
  const uploadStartTimeRef = useRef<number | null>(null);
  const paramsRef = useRef<Graphql.FilesListInput>(params);

  // Keep paramsRef updated
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const uploadViaSignedUrl = useCallback(
    async (file: File, signedUrl: string, contentType: string, contentMd5: string): Promise<void> => {
      const fileKey = getFileKey(file);
      let loadListener: ((ev: Event) => void) | null = null;
      let errorListener: ((ev: Event) => void) | null = null;
      let abortListener: ((ev: Event) => void) | null = null;
      let timeoutListener: ((ev: Event) => void) | null = null;
      let xhr: XMLHttpRequest | undefined = undefined;

      try {
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
        currentXhr.setRequestHeader("Content-Type", contentType);
        currentXhr.setRequestHeader("Content-MD5", contentMd5);
        currentXhr.timeout = 5 * 60 * 1000;
        currentXhr.send(file);

        await new Promise<void>((resolve, reject) => {
          loadListener = () => {
            if (!currentXhr || currentXhr.readyState !== XMLHttpRequest.DONE || currentXhr.status === 0) {
              logger.warn({ caller: "useStorageUploadOperations" }, "Upload cancelled or incomplete", {
                fileKey,
                fileName: file.name,
                readyState: currentXhr?.readyState,
                status: currentXhr?.status,
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
              logger.error({ caller: "useStorageUploadOperations" }, "Upload failed with HTTP error", {
                fileKey,
                fileName: file.name,
                status: currentXhr.status,
              });
              const errorMsg = translations.uploadFailedWithStatus.replace("%{status}", String(currentXhr.status));
              handleError(errorMsg);
              uploadXhrsRef.current.delete(fileKey);
              reject(new Error(errorMsg));
            }
          };
          errorListener = () => {
            const errorMessage =
              currentXhr?.status === 0
                ? "Network error or CORS issue - check browser console for details"
                : translations.uploadFailed;
            handleError(errorMessage);
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error(errorMessage));
          };
          abortListener = () => {
            handleError(translations.uploadCancelled);
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error(translations.uploadCancelled));
          };
          timeoutListener = () => {
            handleError("Upload timeout - please try again");
            uploadXhrsRef.current.delete(fileKey);
            reject(new Error("Upload timeout - please try again"));
          };

          currentXhr.addEventListener("load", loadListener);
          currentXhr.addEventListener("error", errorListener);
          currentXhr.addEventListener("abort", abortListener);
          currentXhr.addEventListener("timeout", timeoutListener);
        });
      } finally {
        try {
          if (xhr && loadListener) xhr.removeEventListener("load", loadListener);
          if (xhr && errorListener) xhr.removeEventListener("error", errorListener);
          if (xhr && abortListener) xhr.removeEventListener("abort", abortListener);
          if (xhr && timeoutListener) xhr.removeEventListener("timeout", timeoutListener);
        } catch {
          /* ignore */
        }
        uploadXhrsRef.current.delete(fileKey);
      }
    },
    [updateFileState, updateBatchProgress, translations]
  );

  const uploadViaVercelSDK = useCallback(
    async (file: File, apiEndpoint: string, sessionId: string, pathname: string): Promise<void> => {
      const fileKey = getFileKey(file);

      try {
        updateFileState(fileKey, {
          status: "uploading",
          progress: 0,
        });

        logger.info({ caller: "useStorageUploadOperations" }, "Starting Vercel upload", {
          fileKey,
          fileName: file.name,
          apiEndpoint,
          pathname: pathname,
        });

        const clientPlayload: VercelUploadUrlClientPlayload = {
          sessionId,
          fileSize: file.size,
          contentType: inferContentType(file),
        };

        const blob = await vercelUpload(pathname, file, {
          access: "public",
          handleUploadUrl: apiEndpoint,
          clientPayload: JSON.stringify(clientPlayload),
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          onUploadProgress: progressEvent => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              const bytesUploaded = (progress / 100) * file.size;
              updateBatchProgress(fileKey, progress, bytesUploaded);
            }
          },
        });

        logger.info({ caller: "useStorageUploadOperations" }, "Vercel upload completed", {
          fileKey,
          fileName: file.name,
          blobUrl: blob.url,
        });

        updateFileState(fileKey, {
          status: "success",
          progress: 100,
        });
      } catch (error) {
        logger.error({ caller: "useStorageUploadOperations" }, "Vercel upload failed", {
          fileKey,
          fileName: file.name,
          error: error instanceof Error ? error.message : String(error),
        });

        updateFileState(fileKey, {
          status: "error",
          error: error instanceof Error ? error.message : translations.uploadFailed,
        });

        throw error;
      }
    },
    [updateFileState, updateBatchProgress, translations]
  );

  const uploadSingleFile = useCallback(
    async (file: File, targetPath: string): Promise<void> => {
      const fileKey = getFileKey(file);
      const contentType = inferContentType(file);

      const pathName = getStoragePath(targetPath) + file.name;

      try {
        updateFileState(fileKey, {
          status: "uploading",
          progress: 0,
        });

        const contentMd5 = await generateFileMD5(file);

        const prepRes = await prepareUpload({
          input: {
            path: pathName,
            contentType,
            fileSize: file.size,
            contentMd5,
          },
        });

        const prep = prepRes.data?.prepareUpload;
        if (!prep) {
          throw new Error(translations.failedGenerateSignedUrl);
        }

        logger.info({ caller: "useStorageUploadOperations" }, "Upload prepared", {
          fileKey,
          fileName: file.name,
          uploadType: prep.uploadType,
          sessionId: prep.id,
        });

        if (prep.uploadType === "SIGNED_URL") {
          await uploadViaSignedUrl(file, prep.url, contentType, contentMd5);
        } else if (prep.uploadType === "VERCEL_BLOB_CLIENT") {
          await uploadViaVercelSDK(file, prep.url, prep.id, pathName);
        } else {
          throw new Error(`Unknown upload type: ${prep.uploadType}`);
        }
      } catch (error) {
        logger.error({ caller: "useStorageUploadOperations" }, "Upload failed", {
          fileKey,
          fileName: file.name,
          error,
        });

        updateFileState(fileKey, {
          status: "error",
          error: error instanceof Error ? error.message : translations.uploadFailed,
          xhr: undefined,
        });

        throw error;
      }
    },
    [prepareUpload, uploadViaSignedUrl, uploadViaVercelSDK, updateFileState, translations]
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
        logger.warn({ caller: "useStorageUploadOperations" }, "Files exceed size limit", {
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
        logger.warn({ caller: "useStorageUploadOperations" }, "No valid files to upload");
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
        const currentBatch = useStorageUploadStore.getState().uploadBatch;

        // Update completion status
        if (currentBatch) {
          const successCount = Array.from(currentBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "success"
          ).length;
          const errorCount = Array.from(currentBatch.files.values()).filter(
            (f: UploadFileState) => f.status === "error"
          ).length;

          // Evict cache if any files were successfully uploaded
          if (successCount > 0) {
            logger.info(
              { caller: "useStorageUploadOperations" },
              "Evicting listFiles and directoryChildren caches for target path",
              {
                targetPath,
                params: paramsRef.current,
              }
            );
            // Evict listFiles and directoryChildren caches for target path
            evictListFilesCacheUtil(apolloClient, targetPath, paramsRef.current);
            evictDirectoryChildrenCacheUtil(apolloClient, targetPath);
          }

          setTimeout(() => {
            if (successCount > 0) {
              notifications.show(translations.uploadSuccessCount.replace("%{count}", String(successCount)), {
                severity: "success",
                autoHideDuration: 3000,
              });
              callbacks?.onComplete?.();
            }
            if (errorCount > 0) {
              notifications.show(translations.uploadFailedCount.replace("%{count}", String(errorCount)), {
                severity: "warning",
                autoHideDuration: 5000,
              });
            }
          }, 0);

          setUploadBatch({ ...currentBatch, isUploading: false });
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
    [notifications, translations, uploadSingleFile, setUploadBatch, uploadBatch, apolloClient]
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
        await Promise.all(chunk.map(file => uploadSingleFile(file, uploadBatch.targetPath)));
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
  }, [uploadBatch, notifications, translations, updateFileState, uploadSingleFile]);

  return useMemo(
    () => ({
      uploadBatch,
      startUpload,
      cancelUpload,
      retryFailedUploads,
      retryFile,
      clearUploadBatch,
    }),
    [uploadBatch, startUpload, cancelUpload, retryFailedUploads, retryFile, clearUploadBatch]
  );
};
