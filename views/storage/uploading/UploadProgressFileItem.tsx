"use client";

import React from "react";
import useAppTranslation from "@/locale/useAppTranslation";
import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
    useTheme,
} from "@mui/material";
import {
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    Description as DocumentIcon,
    TableChart as SpreadsheetIcon,
    Slideshow as PresentationIcon,
    Archive as ArchiveIcon,
    Code as CodeIcon,
    VideoFile as VideoIcon,
    AudioFile as AudioIcon,
    Close as CloseIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
} from "@mui/icons-material";

export interface UploadProgressFileItemProps {
    fileKey: string;
    fileName: string;
    fileType: string;
    progress: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
    onCancel: (fileKey: string) => void;
}

const UploadProgressFileItem: React.FC<UploadProgressFileItemProps> = ({
    fileKey,
    fileName,
    fileType,
    progress,
    status,
    error,
    onCancel,
}) => {
    const theme = useTheme();
    const { uploading: translations } = useAppTranslation(
        "storageTranslations",
    );

    const getFileIcon = () => {
        const iconProps = {
            sx: {
                fontSize: 20,
                color: theme.palette.text.secondary,
            },
        };

        switch (fileType) {
            case "image":
                return <ImageIcon {...iconProps} />;
            case "document":
                return <DocumentIcon {...iconProps} />;
            case "spreadsheet":
                return <SpreadsheetIcon {...iconProps} />;
            case "presentation":
                return <PresentationIcon {...iconProps} />;
            case "archive":
                return <ArchiveIcon {...iconProps} />;
            case "code":
                return <CodeIcon {...iconProps} />;
            case "video":
                return <VideoIcon {...iconProps} />;
            case "audio":
                return <AudioIcon {...iconProps} />;
            default:
                return <FileIcon {...iconProps} />;
        }
    };

    const getProgressIndicator = () => {
        if (status === "success") {
            return (
                <CheckIcon
                    sx={{
                        fontSize: 24,
                        color: theme.palette.success.main,
                    }}
                />
            );
        }

        if (status === "error") {
            return (
                <ErrorIcon
                    sx={{
                        fontSize: 24,
                        color: theme.palette.error.main,
                    }}
                />
            );
        }

        if (status === "uploading" || status === "pending") {
            return (
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={24}
                        thickness={4}
                        sx={{
                            color: theme.palette.primary.main,
                        }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() => onCancel(fileKey)}
                            aria-label={translations.cancelUploadOf.replace(
                                "%{fileName}",
                                fileName,
                            )}
                            sx={{
                                padding: 0,
                                color: theme.palette.text.secondary,
                                fontSize: "12px",
                                "&:hover": {
                                    color: theme.palette.error.main,
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Box>
                </Box>
            );
        }

        return null;
    };

    const truncateFileName = (name: string, maxLength: number = 30): string => {
        if (name.length <= maxLength) return name;

        const extension = name.split(".").pop();
        const nameWithoutExtension = name.substring(0, name.lastIndexOf("."));

        if (
            extension &&
            nameWithoutExtension.length > maxLength - extension.length - 4
        ) {
            const truncated = nameWithoutExtension.substring(
                0,
                maxLength - extension.length - 4,
            );
            return `${truncated}...${extension}`;
        }

        return `${name.substring(0, maxLength - 3)}...`;
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                padding: theme.spacing(1, 2),
                gap: theme.spacing(1.5),
                "&:not(:last-child)": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            {/* File Type Icon */}
            <Box sx={{ flexShrink: 0 }}>{getFileIcon()}</Box>

            {/* File Name */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                    title={fileName}
                >
                    {truncateFileName(fileName)}
                </Typography>
                {error && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.error.main,
                            display: "block",
                            marginTop: theme.spacing(0.25),
                        }}
                    >
                        {error}
                    </Typography>
                )}
            </Box>

            {/* Progress Indicator */}
            <Box sx={{ flexShrink: 0 }}>{getProgressIndicator()}</Box>
        </Box>
    );
};

export default React.memo(UploadProgressFileItem);
