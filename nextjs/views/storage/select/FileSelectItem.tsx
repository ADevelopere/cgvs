"use client";

import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Checkbox,
    IconButton,
    Chip,
    useTheme,
} from "@mui/material";
import {
    InsertDriveFile as FileIcon,
    Visibility as PreviewIcon,
    Download as DownloadIcon,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
    Description as DocumentIcon,
} from "@mui/icons-material";
import * as Graphql from "@/graphql/generated/types";
import { format } from "date-fns";
import useAppTranslation from "@/locale/useAppTranslation";

interface FileSelectItemProps {
    file: Graphql.FileInfo;
    selected: boolean;
    onToggleSelect: (file: Graphql.FileInfo) => void;
    viewMode?: "grid" | "list";
    disabled?: boolean;
}

const FileSelectItem: React.FC<FileSelectItemProps> = React.memo(
    ({
        file,
        selected,
        onToggleSelect,
        viewMode = "grid",
        disabled = false,
    }) => {
        const theme = useTheme();
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

        const formatDate = (dateString: string) => {
            try {
                return format(new Date(dateString), "MMM dd, yyyy");
            } catch {
                return translations.unknown;
            }
        };

        const getFileIcon = () => {
            switch (file.fileType) {
                case "IMAGE":
                    return <ImageIcon color="success" sx={{ fontSize: 24 }} />;
                case "DOCUMENT":
                    return file.contentType === "PDF" ? (
                        <PdfIcon color="error" sx={{ fontSize: 24 }} />
                    ) : (
                        <DocumentIcon color="info" sx={{ fontSize: 24 }} />
                    );
                default:
                    return <FileIcon color="action" sx={{ fontSize: 24 }} />;
            }
        };

        const isImage = file.fileType === "IMAGE";
        const hasPreview = isImage && file.url;

        const handleClick = () => {
            if (!disabled) {
                onToggleSelect(file);
            }
        };

        const handleCheckboxChange = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                event.stopPropagation();
                if (!disabled) {
                    onToggleSelect(file);
                }
            },
            [disabled, onToggleSelect, file],
        );

        const handlePreview = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (file.url) {
                window.open(file.url, "_blank");
            }
        };

        const handleDownload = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (file.mediaLink) {
                window.open(file.mediaLink, "_blank");
            }
        };

        if (viewMode === "list") {
            return (
                <Card
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                        border: selected
                            ? `2px solid ${theme.palette.primary.main}`
                            : "1px solid transparent",
                        backgroundColor: selected
                            ? theme.palette.primary.light + "20"
                            : "transparent",
                        opacity: disabled ? 0.6 : 1,
                        "&:hover": !disabled
                            ? {
                                  backgroundColor: theme.palette.action.hover,
                              }
                            : {},
                    }}
                    onClick={handleClick}
                >
                    <Checkbox
                        checked={selected}
                        disabled={disabled}
                        sx={{ mr: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleCheckboxChange}
                    />

                    <Box sx={{ minWidth: 40, mr: 2 }}>{getFileIcon()}</Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>
                            {file.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {formatFileSize(file.size)}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {formatDate(file.lastModified)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {hasPreview && (
                            <IconButton
                                size="small"
                                onClick={handlePreview}
                                aria-label={translations.preview}
                            >
                                <PreviewIcon />
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            onClick={handleDownload}
                            aria-label={translations.download}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Box>
                </Card>
            );
        }

        return (
            <Card
                sx={{
                    position: "relative",
                    cursor: disabled ? "not-allowed" : "pointer",
                    border: selected
                        ? `2px solid ${theme.palette.primary.main}`
                        : "1px solid transparent",
                    opacity: disabled ? 0.6 : 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": !disabled
                        ? {
                              transform: "translateY(-2px)",
                              boxShadow: theme.shadows[4],
                          }
                        : {},
                }}
                onClick={handleClick}
            >
                {/* Selection Checkbox */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 1,
                    }}
                >
                    <Checkbox
                        checked={selected}
                        disabled={disabled}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: 1,
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                            },
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleCheckboxChange}
                    />
                </Box>

                {/* File Preview/Icon */}
                {hasPreview ? (
                    <CardMedia
                        component="img"
                        height={160}
                        image={file.url || ""}
                        alt={file.name}
                        sx={{
                            objectFit: "cover",
                            backgroundColor: theme.palette.grey[100],
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            height: 160,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.palette.grey[50],
                            color: theme.palette.grey[400],
                        }}
                    >
                        {getFileIcon()}
                    </Box>
                )}

                {/* Action Buttons */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 0.5,
                    }}
                >
                    {hasPreview && (
                        <IconButton
                            size="small"
                            onClick={handlePreview}
                            aria-label={translations.preview}
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                        >
                            <PreviewIcon />
                        </IconButton>
                    )}
                    <IconButton
                        size="small"
                        onClick={handleDownload}
                        aria-label={translations.download}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                            },
                        }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Box>

                {/* File Info */}
                <CardContent sx={{ pt: 1 }}>
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        title={file.name}
                    >
                        {file.name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0.5,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {formatFileSize(file.size)}
                        </Typography>
                        <Chip
                            label={file.fileType}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                    </Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                    >
                        {formatDate(file.lastModified)}
                    </Typography>
                </CardContent>
            </Card>
        );
    },
);

FileSelectItem.displayName = "FileSelectItem";

export default FileSelectItem;
