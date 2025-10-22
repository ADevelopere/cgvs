"use client";

import { useCallback, useMemo } from "react";
import { useStorageUploadOperations } from "./useStorageUploadOperations";
import { useUploadProgressUIStore } from "../stores/useUploadProgressUIStore";
import { UploadFileState, UploadFileDisplayInfo } from "./storage-upload.types";

// Helper function to determine file type from file name
const getFileTypeFromName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Image types
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(extension)) {
    return "image";
  }

  // Document types
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
    return "document";
  }

  // Spreadsheet types
  if (["xls", "xlsx", "csv"].includes(extension)) {
    return "spreadsheet";
  }

  // Presentation types
  if (["ppt", "pptx"].includes(extension)) {
    return "presentation";
  }

  // Archive types
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return "archive";
  }

  // Code types
  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "css",
      "html",
      "php",
    ].includes(extension)
  ) {
    return "code";
  }

  // Video types
  if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension)) {
    return "video";
  }

  // Audio types
  if (["mp3", "wav", "flac", "aac", "ogg"].includes(extension)) {
    return "audio";
  }

  return "file";
};

export const useUploadProgressUIOperations = () => {
  const storageUpload = useStorageUploadOperations();
  const {
    isCollapsed,
    showCancelDialog,
    cancelTarget,
    toggleCollapse,
    setShowCancelDialog,
    setCancelTarget,
    clearCancelDialog,
  } = useUploadProgressUIStore();

  // Transform storage upload state to UI-friendly format
  const files: UploadFileDisplayInfo[] = useMemo(() => {
    if (!storageUpload.uploadBatch?.files) return [];

    return Array.from(storageUpload.uploadBatch.files.entries()).map(
      ([fileKey, fileState]: [string, UploadFileState]) => ({
        fileKey,
        fileName: fileState.file.name,
        fileType: getFileTypeFromName(fileState.file.name),
        progress: fileState.progress,
        status: fileState.status,
        error: fileState.error,
      })
    );
  }, [storageUpload.uploadBatch?.files]);

  // UI action handlers
  const onToggleCollapse = useCallback(() => {
    toggleCollapse();
  }, [toggleCollapse]);

  const onClose = useCallback(() => {
    storageUpload.clearUploadBatch();
  }, [storageUpload]);

  const onCancelAll = useCallback(() => {
    setCancelTarget({ type: "all" });
    setShowCancelDialog(true);
  }, [setCancelTarget, setShowCancelDialog]);

  const onCancelFile = useCallback(
    (fileKey: string) => {
      const file = files.find(f => f.fileKey === fileKey);
      if (file) {
        setCancelTarget({
          type: "file",
          fileKey,
          fileName: file.fileName,
        });
        setShowCancelDialog(true);
      }
    },
    [files, setCancelTarget, setShowCancelDialog]
  );

  const onConfirmCancel = useCallback(() => {
    if (cancelTarget) {
      if (cancelTarget.type === "all") {
        storageUpload.cancelUpload();
      } else if (cancelTarget.type === "file" && cancelTarget.fileKey) {
        storageUpload.cancelUpload(cancelTarget.fileKey);
      }
    }
    clearCancelDialog();
  }, [cancelTarget, storageUpload, clearCancelDialog]);

  const onDismissDialog = useCallback(() => {
    clearCancelDialog();
  }, [clearCancelDialog]);

  // Stabilize primitive values with useMemo
  const totalCount = useMemo(
    () => storageUpload.uploadBatch?.totalCount || 0,
    [storageUpload.uploadBatch?.totalCount]
  );
  const completedCount = useMemo(
    () => storageUpload.uploadBatch?.completedCount || 0,
    [storageUpload.uploadBatch?.completedCount]
  );
  const totalProgress = useMemo(
    () => storageUpload.uploadBatch?.totalProgress || 0,
    [storageUpload.uploadBatch?.totalProgress]
  );
  const timeRemaining = useMemo(
    () => storageUpload.uploadBatch?.timeRemaining || null,
    [storageUpload.uploadBatch?.timeRemaining]
  );
  const isUploading = useMemo(
    () => storageUpload.uploadBatch?.isUploading || false,
    [storageUpload.uploadBatch?.isUploading]
  );
  const stableIsCollapsed = useMemo(() => isCollapsed, [isCollapsed]);
  const stableShowCancelDialog = useMemo(
    () => showCancelDialog,
    [showCancelDialog]
  );
  const stableCancelTarget = useMemo(() => cancelTarget, [cancelTarget]);

  return useMemo(
    () => ({
      // Upload batch information
      totalCount,
      completedCount,
      totalProgress,
      timeRemaining,
      isUploading,
      files,

      // UI states
      isCollapsed: stableIsCollapsed,
      showCancelDialog: stableShowCancelDialog,
      cancelTarget: stableCancelTarget,

      // Action handlers
      onToggleCollapse,
      onClose,
      onCancelAll,
      onCancelFile,
      onConfirmCancel,
      onDismissDialog,
    }),
    [
      totalCount,
      completedCount,
      totalProgress,
      timeRemaining,
      isUploading,
      files,
      stableIsCollapsed,
      stableShowCancelDialog,
      stableCancelTarget,
      onToggleCollapse,
      onClose,
      onCancelAll,
      onCancelFile,
      onConfirmCancel,
      onDismissDialog,
    ]
  );
};
