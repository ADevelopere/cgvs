"use client";

import React from "react";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    LinearProgress,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import {
    InsertDriveFile as FileIcon,
    Cancel as CancelIcon,
    Refresh as RetryIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    CloudUpload as UploadingIcon,
    Schedule as PendingIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { UploadFileState } from "@/contexts/storage/storage.type";
import useAppTranslation from "@/locale/useAppTranslation";

export type UploadItemProps = {
    fileKey: string;
    fileState: UploadFileState;
};

const UploadItem: React.FC<UploadItemProps> = ({ fileKey, fileState }) => {
    const { cancelUpload, retryFile } = useStorageManagement();
    const translations = useAppTranslation("storageTranslations");

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return translations.zeroBytes;
        const k = 1024;
        const sizes = [
            translations.bytes,
            translations.kb,
            translations.mb,
            translations.gb,
            translations.tb,
        ];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const getStatusIcon = () => {
        switch (fileState.status) {
            case "pending":
                return <PendingIcon color="action" />;
            case "uploading":
                return <UploadingIcon color="primary" />;
            case "success":
                return <SuccessIcon color="success" />;
            case "error":
                return <ErrorIcon color="error" />;
            default:
                return <FileIcon color="action" />;
        }
    };

    const getStatusChip = () => {
        const props = {
            size: "small" as const,
            variant: "filled" as const,
        };

        switch (fileState.status) {
            case "pending":
                return (
                    <Chip
                        label={translations.pending}
                        color="default"
                        {...props}
                    />
                );
            case "uploading":
                return (
                    <Chip
                        label={`${Math.round(fileState.progress)}%`}
                        color="primary"
                        {...props}
                    />
                );
            case "success":
                return (
                    <Chip
                        label={translations.success}
                        color="success"
                        {...props}
                    />
                );
            case "error":
                return (
                    <Chip
                        label={translations.failed}
                        color="error"
                        {...props}
                    />
                );
            default:
                return null;
        }
    };

    const handleCancel = () => {
        cancelUpload(fileKey);
    };

    const handleRetry = () => {
        retryFile(fileKey);
    };

    const getSecondaryAction = () => {
        switch (fileState.status) {
            case "pending":
            case "uploading":
                return (
                    <IconButton
                        edge="end"
                        aria-label={translations.cancelUpload}
                        onClick={handleCancel}
                        size="small"
                        color="error"
                    >
                        <CancelIcon />
                    </IconButton>
                );
            case "error":
                return (
                    <IconButton
                        edge="end"
                        aria-label={translations.retryUpload}
                        onClick={handleRetry}
                        size="small"
                        color="primary"
                    >
                        <RetryIcon />
                    </IconButton>
                );
            default:
                return null;
        }
    };

    return (
        <ListItem
            secondaryAction={getSecondaryAction()}
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                "&:last-child": {
                    borderBottom: 0,
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 40 }}>{getStatusIcon()}</ListItemIcon>

            <ListItemText
                slotProps={{ secondary: { component: "div" } }}
                primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                            {fileState.file.name}
                        </Typography>
                        {getStatusChip()}
                    </Box>
                }
                secondary={
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            {formatFileSize(fileState.file.size)}
                        </Typography>
                        {fileState.status === "error" && fileState.error && (
                            <Typography
                                variant="caption"
                                color="error"
                                display="block"
                            >
                                {fileState.error}
                            </Typography>
                        )}
                        {fileState.status === "uploading" && (
                            <Box sx={{ mt: 0.5 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={fileState.progress}
                                    sx={{
                                        height: 4,
                                        borderRadius: 2,
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                }
            />
        </ListItem>
    );
};

export default UploadItem;
