"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as MUI from "@mui/material";
import { useStorageUploadOperations } from "@/client/views/storage/hooks/useStorageUploadOperations";
import logger from "@/client/lib/logger";

export interface FolderDropTargetProps {
  /**
   * The folder path where files should be uploaded when dropped
   */
  folderPath: string;

  /**
   * Whether the drop target is currently disabled
   */
  disabled?: boolean;

  /**
   * The content to wrap (typically a folder item)
   */
  children: React.ReactNode;

  /**
   * Callback fired when files are dropped
   */
  onFilesDropped?: (files: File[]) => void;

  /**
   * Callback fired when upload starts
   */
  onUploadStart?: () => void;

  /**
   * Callback fired when upload completes
   */
  onUploadComplete?: () => void;

  /**
   * Custom styling for the drop overlay
   */
  sx?: object;
}

/**
 * FolderDropTarget - A wrapper component that makes any folder item a drop target for file uploads
 *
 * This component wraps around folder items (like StorageItemGrid or StorageItemListRow)
 * to make them accept file drops. When files are dropped on a folder, they will be
 * uploaded to that folder's path.
 *
 * Features:
 * - Visual feedback when dragging over the folder
 * - Integration with StorageUploadContext
 * - Proper drag event handling to prevent conflicts
 * - Accessible and keyboard-friendly
 */
export const FolderDropTarget: React.FC<FolderDropTargetProps> = ({
  folderPath,
  disabled = false,
  children,
  onFilesDropped,
  onUploadStart,
  onUploadComplete,
  sx,
}) => {
  const theme = MUI.useTheme();
  const { startUpload } = useStorageUploadOperations();

  // Handle file upload
  const handleFilesUpload = useCallback(
    (files: File[]) => {
      if (disabled || files.length === 0) return;

      // Start upload in the background
      (async () => {
        try {
          onUploadStart?.();
          onFilesDropped?.(files);

          logger.info(
            `Uploading ${files.length} files to folder: ${folderPath}`
          );

          await startUpload(files, folderPath, {
            onComplete: () => {
              onUploadComplete?.();
              logger.info("Folder upload completed successfully");
            },
          });
        } catch (error) {
          logger.error("Folder upload failed:", error);
        }
      })();
    },
    [
      disabled,
      onUploadStart,
      onFilesDropped,
      folderPath,
      startUpload,
      onUploadComplete,
    ]
  );

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleFilesUpload,
      disabled,
      noClick: true, // Prevent click-to-select for folders
      noKeyboard: true, // Prevent keyboard activation
      noDragEventsBubbling: true, // Prevent event bubbling conflicts
    });

  return (
    <MUI.Box
      {...getRootProps()}
      sx={{
        position: "relative",
        border:
          isDragActive && !disabled
            ? `2px dashed ${
                isDragReject
                  ? theme.palette.error.main
                  : theme.palette.primary.main
              }`
            : "2px solid transparent",
        backgroundColor:
          isDragActive && !disabled
            ? MUI.alpha(
                isDragReject
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                0.05
              )
            : "transparent",
        borderRadius: theme.shape.borderRadius,
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        ...sx,
      }}
    >
      <input {...getInputProps()} />
      {children}
    </MUI.Box>
  );
};

export default FolderDropTarget;
