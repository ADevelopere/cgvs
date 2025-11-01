"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  alpha,
  useTheme,
  Fade,
  Portal,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { useStorageUploadOperations } from "@/client/views/storage/hooks/useStorageUploadOperations";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

export interface UploadDropzoneOverlayProps {
  /**
   * The target path where files should be uploaded
   */
  uploadPath: string;

  /**
   * Whether the overlay is currently disabled
   */
  disabled?: boolean;

  /**
   * Whether to show the overlay when dragging
   */
  showOverlay?: boolean;

  /**
   * The container element to attach the overlay to
   */
  container?: HTMLElement | null;

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
   * Custom z-index for the overlay
   */
  zIndex?: number;
}

/**
 * DropzoneOverlay - An invisible overlay that covers an entire area for drag and drop functionality
 *
 * This component creates an invisible overlay that detects when files are dragged over
 * any part of the specified container. When files are detected, it shows a visual overlay
 * with upload feedback. It's designed to be used with larger areas like the main file view.
 *
 * Features:
 * - Global drag detection within a container
 * - Visual overlay with upload feedback
 * - Integration with StorageUploadContext
 * - Portal-based rendering for proper z-index handling
 * - Prevents conflicts with other drag operations
 */
export const UploadDropzoneOverlay: React.FC<UploadDropzoneOverlayProps> = ({
  uploadPath,
  disabled = false,
  showOverlay = true,
  container,
  onFilesDropped,
  onUploadStart,
  onUploadComplete,
  zIndex = 1000,
}) => {
  const theme = useTheme();
  const {
    storageTranslations: { dropzone: translations },
  } = useAppTranslation();
  const { startUpload } = useStorageUploadOperations();

  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle file upload
  const handleFilesUpload = useCallback(
    async (files: File[]) => {
      if (disabled || files.length === 0) return;

      try {
        onUploadStart?.();
        onFilesDropped?.(files);

        logger.info(`Uploading ${files.length} files to: ${uploadPath}`);

        await startUpload(files, uploadPath, {
          onComplete: () => {
            onUploadComplete?.();
            logger.info("Overlay upload completed successfully");
          },
        });
      } catch (error) {
        logger.error("Overlay upload failed:", error);
      }
    },
    [
      disabled,
      onUploadStart,
      onFilesDropped,
      uploadPath,
      startUpload,
      onUploadComplete,
    ]
  );

  // Global drag event handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only handle file drags
    if (!e.dataTransfer?.types.includes("Files")) {
      return;
    }

    dragCounterRef.current += 1;

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
      setIsVisible(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragOver(false);
      // Delay hiding to prevent flicker
      setTimeout(() => setIsVisible(false), 100);
      dragCounterRef.current = 0;
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only allow drop if we have files
    if (e.dataTransfer?.types.includes("Files")) {
      e.dataTransfer.dropEffect = "copy";
    } else if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "none";
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      dragCounterRef.current = 0;
      setIsVisible(false);

      if (disabled) return;

      // Only handle file drops
      if (!e.dataTransfer?.types.includes("Files")) {
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFilesUpload(files);
      }
    },
    [disabled, handleFilesUpload]
  );

  // Attach global event listeners
  useEffect(() => {
    if (disabled) return;

    const targetElement = container || document.body;

    targetElement.addEventListener("dragenter", handleDragEnter);
    targetElement.addEventListener("dragleave", handleDragLeave);
    targetElement.addEventListener("dragover", handleDragOver);
    targetElement.addEventListener("drop", handleDrop);

    return () => {
      targetElement.removeEventListener("dragenter", handleDragEnter);
      targetElement.removeEventListener("dragleave", handleDragLeave);
      targetElement.removeEventListener("dragover", handleDragOver);
      targetElement.removeEventListener("drop", handleDrop);
    };
  }, [
    disabled,
    container,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  ]);

  if (!showOverlay || !isVisible) {
    return null;
  }

  const overlayContent = (
    <Fade in={isDragOver}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(4px)",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `3px dashed ${theme.palette.primary.main}`,
            borderRadius: `${typeof theme.shape.borderRadius === "number" ? theme.shape.borderRadius * 2 : theme.shape.borderRadius}px`,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <UploadIcon
            sx={{
              fontSize: 80,
              color: theme.palette.primary.main,
              mb: 3,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                },
                "50%": {
                  transform: "scale(1.05)",
                },
                "100%": {
                  transform: "scale(1)",
                },
              },
            }}
          />

          <Typography
            variant="h4"
            color="primary"
            align="center"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {translations.dropHereToUpload}
          </Typography>

          <Typography variant="body1" align="center" color="textSecondary">
            {translations.releaseToUpload}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );

  // Use Portal to render overlay at the root level
  if (container) {
    return <Portal container={container}>{overlayContent}</Portal>;
  }

  return <Portal>{overlayContent}</Portal>;
};

export default UploadDropzoneOverlay;
