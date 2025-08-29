"use client";

import React from "react";
import { List, Box, Typography, Skeleton, Stack } from "@mui/material";
import EmptyStateIllustration from "@/components/common/EmptyStateIllustration";
import FileItem from "./FileItem";
import useAppTranslation from "@/locale/useAppTranslation";
import { StorageItem } from "@/contexts/storage/storage.type";

export interface FileListProps {
    items: StorageItem[];
    loading: boolean;
    selectedPaths: string[];
    error?: string;
    onToggleSelect: (path: string) => void;
    onNavigateTo: (path: string) => void;
    onDelete: (paths: string[]) => Promise<boolean>;
    onRename?: (path: string, newName: string) => void;
}

const FileList: React.FC<FileListProps> = ({
    items,
    loading,
    selectedPaths,
    error,
    onToggleSelect,
    onNavigateTo,
    onDelete,
    onRename,
}) => {
    const translations = useAppTranslation("storageTranslations");

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                    {Array.from({ length: 6 }).map((_, idx) => {
                        const uniqueKey = `skeleton-${Math.random().toString(36).slice(2, 11)}-${Date.now()}-${idx}`;

                        return (
                            <Skeleton
                                key={uniqueKey}
                                variant="rectangular"
                                height={64}
                                sx={{ borderRadius: 1 }}
                            />
                        );
                    })}
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!items || items.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <EmptyStateIllustration
                    message={translations.emptyState || "No files found"}
                />
            </Box>
        );
    }

    // Separate folders and files for better organization
    const folders = items.filter(
        (item: StorageItem) => item.__typename === "FolderInfo",
    );
    const files = items.filter(
        (item: StorageItem) => item.__typename === "FileInfo",
    );
    return (
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <List sx={{ p: 0 }}>
                {/* Folders first */}
                {folders.length > 0 && (
                    <>
                        {folders.length > 0 && files.length > 0 && (
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderBottom: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {translations.foldersCount.replace(
                                        "{count}",
                                        String(folders.length),
                                    )}
                                </Typography>
                            </Box>
                        )}
                        {folders.map((folder: StorageItem) => (
                            <FileItem
                                key={folder.path}
                                item={folder}
                                isSelected={selectedPaths.includes(folder.path)}
                                onToggleSelect={onToggleSelect}
                                onNavigateTo={onNavigateTo}
                                onDelete={onDelete}
                                onRename={onRename}
                            />
                        ))}
                    </>
                )}

                {/* Files */}
                {files.length > 0 && (
                    <>
                        {folders.length > 0 && (
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderBottom: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {translations.filesCount.replace(
                                        "{count}",
                                        String(files.length),
                                    )}
                                </Typography>
                            </Box>
                        )}
                        {files.map((file: StorageItem) => (
                            <FileItem
                                key={file.path}
                                item={file}
                                isSelected={selectedPaths.includes(file.path)}
                                onToggleSelect={onToggleSelect}
                                onNavigateTo={onNavigateTo}
                                onDelete={onDelete}
                                onRename={onRename}
                            />
                        ))}
                    </>
                )}
            </List>
        </Box>
    );
};

export default FileList;
