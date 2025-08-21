"use client";

import React from "react";
import {
    Box,
    Typography,
    Paper,
    Chip,
    Stack,
    useTheme,
} from "@mui/material";
import {
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
    CloudUpload as UploadIcon,
    Storage as StorageIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";

const StorageStatsBar: React.FC = () => {
    const theme = useTheme();
    const { stats, items } = useStorageManagement();
    const translations = useAppTranslation("storageTranslations");

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return translations.zeroBytes;
        const k = 1024;
        const sizes = [translations.bytes, translations.kb, translations.mb, translations.gb, translations.tb];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat().format(num);
    };

    const getFolderCount = (): number => {
        return items.filter((item) => item.__typename === "FolderInfo").length;
    };

    const getFileCount = (): number => {
        return items.filter((item) => item.__typename === "FileInfo").length;
    };

    if (!stats) {
        return null;
    }

    const folderCount = getFolderCount();
    const fileCount = getFileCount();

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems="stretch"
            >
                {/* Storage Usage */}
                <Box sx={{ flex: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={1}
                    >
                        <StorageIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            {translations.totalStorage}
                        </Typography>
                    </Stack>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                        {formatFileSize(stats.totalSize)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translations.acrossFilesAndFolders
                            .replace("{totalFiles}", formatNumber(stats.totalFiles))
                            .replace("{totalFolders}", formatNumber(stats.totalFolders))}
                    </Typography>
                </Box>

                {/* File/Folder Counts */}
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {translations.currentDirectory}
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Chip
                                icon={<FolderIcon />}
                                label={`${formatNumber(folderCount)} ${
                                    folderCount === 1 ? translations.folder : translations.folders
                                }`}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                            <Chip
                                icon={<FileIcon />}
                                label={`${formatNumber(fileCount)} ${
                                    fileCount === 1 ? translations.file : translations.files
                                }`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                        </Stack>
                    </Stack>
                </Box>

                {/* File Type Breakdown */}
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {translations.fileTypes}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {stats.fileTypeBreakdown
                                .filter((item) => item.count > 0)
                                .slice(0, 3) // Show top 3 types
                                .map((typeCount) => (
                                    <Chip
                                        key={typeCount.type}
                                        label={`${typeCount.type}: ${formatNumber(
                                            typeCount.count,
                                        )}`}
                                        size="small"
                                        variant="filled"
                                        color="default"
                                    />
                                ))}
                            {stats.fileTypeBreakdown.filter(
                                (item) => item.count > 0,
                            ).length > 3 && (
                                <Chip
                                    label={translations.more.replace("{count}", String(stats.fileTypeBreakdown.filter(
                                        (item) => item.count > 0,
                                    ).length - 3))}
                                    size="small"
                                    variant="outlined"
                                    color="default"
                                />
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
};

export default StorageStatsBar;
