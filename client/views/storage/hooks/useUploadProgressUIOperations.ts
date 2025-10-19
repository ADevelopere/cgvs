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

  return {
    // Upload batch information
    totalCount: storageUpload.uploadBatch?.totalCount || 0,
    completedCount: storageUpload.uploadBatch?.completedCount || 0,
    totalProgress: storageUpload.uploadBatch?.totalProgress || 0,
    timeRemaining: storageUpload.uploadBatch?.timeRemaining || null,
    isUploading: storageUpload.uploadBatch?.isUploading || false,
    files,

    // UI states
    isCollapsed,
    showCancelDialog,
    cancelTarget,

    // Action handlers
    onToggleCollapse,
    onClose,
    onCancelAll,
    onCancelFile,
    onConfirmCancel,
    onDismissDialog,
  };
};
