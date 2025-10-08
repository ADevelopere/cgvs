"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    Box,
    Paper,
    Typography,
    alpha,
    useTheme,
    CircularProgress,
    Fade,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { useStorageUpload } from "@/client/contexts/storage/StorageUploadContext";
import { useAppTranslation } from "@/client/locale";
import logger from "@/utils/logger";

export interface UploadDropzoneProps {
    /**
     * The target path where files should be uploaded
     */
    uploadPath: string;

    /**
     * Whether the dropzone is currently disabled
     */
    disabled?: boolean;

    /**
     * Whether to show the visual dropzone area (false makes it invisible but still functional)
     */
    showDropzone?: boolean;

    /**
     * Whether to allow click-to-select files in addition to drag and drop
     */
    allowClick?: boolean;

    /**
     * Maximum number of files that can be uploaded at once
     */
    maxFiles?: number;

    /**
     * Maximum file size in bytes
     */
    maxFileSize?: number;

    /**
     * Accepted file types (MIME types or file extensions)
     */
    acceptedFileTypes?: string[];

    /**
     * Custom content to display in the dropzone
     */
    children?: React.ReactNode;

    /**
     * Callback fired when files are dropped or selected
     */
    onFilesSelected?: (files: File[]) => void;

    /**
     * Callback fired when upload starts
     */
    onUploadStart?: () => void;

    /**
     * Callback fired when upload completes
     */
    onUploadComplete?: () => void;

    /**
     * Custom styling
     */
    sx?: object;

    /**
     * Minimum height for the dropzone
     */
    minHeight?: number | string;
}

/**
 * UploadDropzone - A reusable drag-and-drop file upload component
 *
 * This component integrates with the StorageUploadContext to handle file uploads.
 * It can be used as a visible dropzone area or as an invisible overlay.
 *
 * Features:
 * - Drag and drop file upload
 * - Click to select files (optional)
 * - File validation (type, size, count)
 * - Visual feedback during drag operations
 * - Integration with existing upload context
 * - Material-UI theming and internationalization
 */
export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
    uploadPath,
    disabled = false,
    showDropzone = true,
    allowClick = true,
    maxFiles = 100,
    maxFileSize = 100 * 1024 * 1024, // 100MB default
    acceptedFileTypes,
    children,
    onFilesSelected,
    onUploadStart,
    onUploadComplete,
    sx,
    minHeight = 120,
}) => {
    const theme = useTheme();
    const { dropzone: translations } = useAppTranslation("storageTranslations");
    const { startUpload, uploadBatch } = useStorageUpload();

    // Handle file upload
    const handleFilesUpload = useCallback(
        (files: File[]) => {
            if (disabled || files.length === 0) return;

            // Start upload in the background
            (async () => {
                try {
                    onUploadStart?.();
                    onFilesSelected?.(files);

                    logger.info(
                        `Starting upload of ${files.length} files to ${uploadPath}`,
                    );

                    await startUpload(files, uploadPath, {
                        onComplete: () => {
                            onUploadComplete?.();
                            logger.info("Upload completed successfully");
                        },
                    });
                } catch (error) {
                    logger.error("Upload failed:", error);
                }
            })();
        },
        [
            disabled,
            onUploadStart,
            onFilesSelected,
            uploadPath,
            startUpload,
            onUploadComplete,
        ],
    );

    // Configure react-dropzone
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
    } = useDropzone({
        onDrop: handleFilesUpload,
        disabled,
        noClick: !allowClick,
        maxFiles,
        maxSize: maxFileSize,
        accept: acceptedFileTypes
            ? {
                  // Convert array of file types to react-dropzone format
                  ...acceptedFileTypes.reduce(
                      (acc, type) => {
                          if (type.startsWith(".")) {
                              // File extension
                              acc["application/octet-stream"] =
                                  acc["application/octet-stream"] || [];
                              acc["application/octet-stream"].push(type);
                          } else {
                              // MIME type
                              acc[type] = [];
                          }
                          return acc;
                      },
                      {} as Record<string, string[]>,
                  ),
              }
            : undefined,
    });

    // Log file rejections for debugging
    useEffect(() => {
        if (fileRejections.length > 0) {
            fileRejections.forEach(({ file, errors }) => {
                errors.forEach((error) => {
                    let message = "";
                    switch (error.code) {
                        case "file-too-large":
                            message = translations.fileTooLarge
                                .replace("%{fileName}", file.name)
                                .replace(
                                    "%{maxSize}",
                                    formatFileSize(maxFileSize),
                                );
                            break;
                        case "file-invalid-type":
                            message = translations.invalidFileType.replace(
                                "%{fileName}",
                                file.name,
                            );
                            break;
                        case "too-many-files":
                            message = translations.tooManyFiles
                                .replace(
                                    "%{count}",
                                    fileRejections.length.toString(),
                                )
                                .replace("%{maxFiles}", maxFiles.toString());
                            break;
                        default:
                            message = `${file.name}: ${error.message}`;
                    }
                    logger.warn("File validation error:", message);
                });
            });
        }
    }, [fileRejections, translations, maxFileSize, maxFiles]);

    const isUploading = uploadBatch?.isUploading || false;

    if (!showDropzone) {
        // Invisible dropzone - just handle the drag and drop events
        return (
            <Box
                {...getRootProps()}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: isDragActive ? theme.zIndex.modal - 1 : -1,
                    pointerEvents: isDragActive ? "auto" : "none",
                    ...sx,
                }}
            >
                <input {...getInputProps()} />
                <Fade in={isDragActive}>
                    <Paper
                        elevation={8}
                        sx={{
                            position: "absolute",
                            top: theme.spacing(2),
                            left: theme.spacing(2),
                            right: theme.spacing(2),
                            bottom: theme.spacing(2),
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `2px dashed ${
                                isDragReject
                                    ? theme.palette.error.main
                                    : theme.palette.primary.main
                            }`,
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <UploadIcon
                            sx={{
                                fontSize: 64,
                                color: isDragReject
                                    ? theme.palette.error.main
                                    : theme.palette.primary.main,
                                mb: 2,
                            }}
                        />
                        <Typography
                            variant="h6"
                            color={isDragReject ? "error" : "primary"}
                            align="center"
                        >
                            {isDragReject
                                ? translations.invalidFileType
                                : translations.dropHereToUpload}
                        </Typography>
                    </Paper>
                </Fade>
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", ...sx }}>
            <Paper
                {...getRootProps()}
                elevation={isDragActive ? 4 : 1}
                sx={{
                    minHeight,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    cursor: allowClick && !disabled ? "pointer" : "default",
                    border: `2px dashed ${
                        isDragReject
                            ? theme.palette.error.main
                            : isDragActive
                              ? theme.palette.primary.main
                              : theme.palette.divider
                    }`,
                    bgcolor: isDragActive
                        ? alpha(
                              isDragReject
                                  ? theme.palette.error.main
                                  : theme.palette.primary.main,
                              0.05,
                          )
                        : "transparent",
                    transition: theme.transitions.create([
                        "border-color",
                        "background-color",
                        "elevation",
                    ]),
                    opacity: disabled ? 0.5 : 1,
                    pointerEvents: disabled ? "none" : "auto",
                }}
            >
                <input {...getInputProps()} />

                {children || (
                    <>
                        {isUploading ? (
                            <CircularProgress size={48} sx={{ mb: 2 }} />
                        ) : (
                            <UploadIcon
                                sx={{
                                    fontSize: 48,
                                    color: isDragReject
                                        ? theme.palette.error.main
                                        : isDragActive
                                          ? theme.palette.primary.main
                                          : theme.palette.text.secondary,
                                    mb: 2,
                                    transition:
                                        theme.transitions.create("color"),
                                }}
                            />
                        )}

                        <Typography
                            variant="h6"
                            align="center"
                            color={
                                isDragReject
                                    ? "error"
                                    : isDragActive
                                      ? "primary"
                                      : "textSecondary"
                            }
                            sx={{ mb: 1 }}
                        >
                            {isUploading
                                ? translations.uploading
                                : isDragReject
                                  ? translations.invalidFileType.replace(
                                        "%{fileName}",
                                        "",
                                    )
                                  : isDragActive
                                    ? translations.releaseToUpload
                                    : translations.dragFilesHere}
                        </Typography>

                        {!isUploading && allowClick && (
                            <Typography
                                variant="body2"
                                align="center"
                                color="textSecondary"
                            >
                                {translations.orClickToSelect}
                            </Typography>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

// Utility function to format file size
function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default UploadDropzone;
