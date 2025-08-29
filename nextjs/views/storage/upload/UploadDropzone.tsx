"use client";

import React, { useCallback, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    LinearProgress,
    Alert,
    List,
} from "@mui/material";
import { CloudUpload as UploadIcon, Add as AddIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useFileSelector } from "@/contexts/storage/FileSelectorContext";
import {
    getLocationInfo,
    isFileTypeAllowed,
} from "@/contexts/storage/storage.location";
import {
    inferContentType,
    getAcceptAttribute,
    contentTypesToMimeTypes,
} from "@/contexts/storage/storage.util";
import UploadItem from "./UploadItem";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";

interface UploadDropzoneProps {
    disabled?: boolean;
    compact?: boolean;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
    disabled = false,
    compact = false,
}) => {
    const {
        location,
        uploadToLocation,
        uploadFiles,
        isUploading,
        clearUploads,
    } = useFileSelector();
    const translations = useAppTranslation("storageTranslations");

    const [dragActive, setDragActive] = useState(false);
    const [validationError, setValidationError] = useState<string>();

    const validateFiles = useCallback(
        (files: File[]) => {
            if (!location) {
                setValidationError(translations.selectLocationFirst);
                return false;
            }

            const locationInfo = getLocationInfo(location);
            const invalidFiles: string[] = [];

            files.forEach((file) => {
                const contentType = inferContentType(file);
                if (!isFileTypeAllowed(location, contentType)) {
                    invalidFiles.push(`${file.name} (${contentType})`);
                }
            });

            if (invalidFiles.length > 0) {
                setValidationError(
                    `${translations.invalidFileTypes}: ${invalidFiles.join(", ")}. ${translations.allowedTypes}: ${locationInfo.allowedContentTypes.join(", ")}`,
                );
                return false;
            }

            setValidationError(undefined);
            return true;
        },
        [location, translations],
    );

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            setDragActive(false);

            if (validateFiles(acceptedFiles)) {
                uploadToLocation(acceptedFiles);
            }
        },
        [uploadToLocation, validateFiles],
    );

    const handleDragEnter = useCallback(() => {
        if (!disabled) {
            setDragActive(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback(() => {
        setDragActive(false);
    }, []);

    const locationInfo = location ? getLocationInfo(location) : null;

    // Debug logging for file type enforcement
    React.useEffect(() => {
        if (locationInfo) {
            const mimeTypes = contentTypesToMimeTypes(locationInfo.allowedContentTypes);
            const acceptAttribute = getAcceptAttribute(locationInfo.allowedContentTypes);
            logger.log('UploadDropzone Debug:', {
                location,
                allowedContentTypes: locationInfo.allowedContentTypes,
                mimeTypes,
                acceptAttribute,
            });
        }
    }, [location, locationInfo]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        disabled: disabled || !location,
        noClick: true,
        noKeyboard: true,
        accept: locationInfo
            ? Object.fromEntries(
                  contentTypesToMimeTypes(locationInfo.allowedContentTypes).map(
                      (mimeType) => [mimeType, []],
                  ),
              )
            : undefined,
    });

    const uploadsArray = Array.from(uploadFiles.entries());
    const hasUploads = uploadsArray.length > 0;
    const completedCount = uploadsArray.filter(
        ([, file]) => file.status === "success",
    ).length;
    const failedCount = uploadsArray.filter(
        ([, file]) => file.status === "error",
    ).length;
    const inProgressCount = uploadsArray.filter(
        ([, file]) => file.status === "uploading" || file.status === "pending",
    ).length;

    if (compact && !hasUploads) {
        return (
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    component="label"
                    disabled={disabled || !location}
                    fullWidth
                    sx={{ py: 1.5 }}
                >
                    {translations.uploadFiles}
                    <input
                        type="file"
                        hidden
                        multiple
                        accept={
                            locationInfo
                                ? getAcceptAttribute(
                                      locationInfo.allowedContentTypes,
                                  )
                                : undefined
                        }
                        onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            if (files.length > 0) {
                                handleDrop(files);
                            }
                            event.target.value = ""; // Reset input
                        }}
                        disabled={disabled || !location}
                    />
                </Button>
                {validationError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {validationError}
                    </Alert>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            {/* Upload Dropzone */}
            <Paper
                {...getRootProps()}
                elevation={dragActive ? 4 : 1}
                sx={{
                    p: 3,
                    textAlign: "center",
                    border: `2px dashed ${dragActive ? "primary.main" : "grey.300"}`,
                    backgroundColor: dragActive
                        ? "primary.50"
                        : "background.paper",
                    cursor: disabled || !location ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease-in-out",
                    opacity: disabled || !location ? 0.6 : 1,
                    "&:hover":
                        !disabled && location
                            ? {
                                  borderColor: "primary.main",
                                  backgroundColor: "primary.50",
                              }
                            : {},
                }}
            >
                <input {...getInputProps()} />
                <UploadIcon
                    sx={{
                        fontSize: 48,
                        color: dragActive ? "primary.main" : "grey.400",
                        mb: 2,
                    }}
                />

                <Typography variant="h6" gutterBottom>
                    {dragActive
                        ? translations.dropFilesHere
                        : translations.dragFilesHere}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {translations.orClickToSelect}
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component="label"
                    disabled={disabled || !location}
                >
                    {translations.selectFiles}
                    <input
                        type="file"
                        hidden
                        multiple
                        accept={
                            locationInfo
                                ? getAcceptAttribute(
                                      locationInfo.allowedContentTypes,
                                  )
                                : undefined
                        }
                        onChange={(event) => {
                            const files = Array.from(event.target.files || []);
                            if (files.length > 0) {
                                handleDrop(files);
                            }
                            event.target.value = ""; // Reset input
                        }}
                        disabled={disabled || !location}
                    />
                </Button>

                {locationInfo && (
                    <Box
                        sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {translations.allowedFileTypes}:{" "}
                            {locationInfo.allowedContentTypes.join(", ")}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 0.5 }}
                        >
                            {translations.acceptedFormats}:{" "}
                            {getAcceptAttribute(
                                locationInfo.allowedContentTypes,
                            )}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Validation Error */}
            {validationError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {validationError}
                </Alert>
            )}

            {/* Upload Progress */}
            {hasUploads && (
                <Paper elevation={1} sx={{ mt: 2, overflow: "hidden" }}>
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "primary.main",
                            color: "white",
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600}>
                            {translations.uploadProgress}
                        </Typography>
                        <Typography variant="body2">
                            {isUploading
                                ? `${translations.uploading} ${inProgressCount} ${translations.files}...`
                                : `${completedCount} ${translations.completed}, ${failedCount} ${translations.failed}`}
                        </Typography>
                        {isUploading && (
                            <LinearProgress
                                variant="indeterminate"
                                sx={{
                                    mt: 1,
                                    backgroundColor: "rgba(255,255,255,0.3)",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "white",
                                    },
                                }}
                            />
                        )}
                    </Box>

                    <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                        {uploadsArray.map(([fileKey, fileState]) => (
                            <UploadItem
                                key={fileKey}
                                fileKey={fileKey}
                                fileState={fileState}
                            />
                        ))}
                    </List>

                    {!isUploading && hasUploads && (
                        <Box
                            sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
                        >
                            <Button
                                size="small"
                                onClick={clearUploads}
                                color="primary"
                            >
                                {translations.clearList}
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default UploadDropzone;
