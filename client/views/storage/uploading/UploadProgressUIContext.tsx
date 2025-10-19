"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useStorageUploadOperations } from "@/client/views/storage/hooks/useStorageUploadOperations";
import { UploadFileState } from "@/client/views/storage/hooks/storage-upload.types";

export interface UploadFileDisplayInfo {
  fileKey: string;
  fileName: string;
  fileType: string;
  progress: number;
  status:
    | "pending"
    | "uploading"
    | "completed"
    | "success"
    | "error"
    | "cancelled";
  error?: string;
}

export interface CancelTarget {
  type: "all" | "file";
  fileKey?: string;
  fileName?: string;
}

export interface UploadProgressUIContextType {
  // Upload batch information
  totalCount: number;
  completedCount: number;
  totalProgress: number;
  timeRemaining: number | null;
  isUploading: boolean;
  files: UploadFileDisplayInfo[];

  // UI states
  isCollapsed: boolean;
  showCancelDialog: boolean;
  cancelTarget: CancelTarget | null;

  // Action handlers
  onToggleCollapse: () => void;
  onClose: () => void;
  onCancelAll: () => void;
  onCancelFile: (fileKey: string) => void;
  onConfirmCancel: () => void;
  onDismissDialog: () => void;
}

const UploadProgressUIContext = createContext<
  UploadProgressUIContextType | undefined
>(undefined);

export const useUploadProgressUI = () => {
  const context = useContext(UploadProgressUIContext);
  if (!context) {
    throw new Error(
      "useUploadProgressUI must be used within an UploadProgressUIProvider"
    );
  }
  return context;
};

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

export const UploadProgressUIProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const storageUpload = useStorageUploadOperations();

  // UI-specific state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<CancelTarget | null>(null);

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
    setIsCollapsed(prev => !prev);
  }, []);

  const onClose = useCallback(() => {
    storageUpload.clearUploadBatch();
  }, [storageUpload]);

  const onCancelAll = useCallback(() => {
    setCancelTarget({ type: "all" });
    setShowCancelDialog(true);
  }, []);

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
    [files]
  );

  const onConfirmCancel = useCallback(() => {
    if (cancelTarget) {
      if (cancelTarget.type === "all") {
        storageUpload.cancelUpload();
      } else if (cancelTarget.type === "file" && cancelTarget.fileKey) {
        storageUpload.cancelUpload(cancelTarget.fileKey);
      }
    }
    setShowCancelDialog(false);
    setCancelTarget(null);
  }, [cancelTarget, storageUpload]);

  const onDismissDialog = useCallback(() => {
    setShowCancelDialog(false);
    setCancelTarget(null);
  }, []);

  const value: UploadProgressUIContextType = useMemo(
    () => ({
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
    }),
    [
      storageUpload.uploadBatch,
      files,
      isCollapsed,
      showCancelDialog,
      cancelTarget,
      onToggleCollapse,
      onClose,
      onCancelAll,
      onCancelFile,
      onConfirmCancel,
      onDismissDialog,
    ]
  );

  return (
    <UploadProgressUIContext.Provider value={value}>
      {children}
    </UploadProgressUIContext.Provider>
  );
};
