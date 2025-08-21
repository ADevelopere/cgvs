"use client";

import React from "react";
import {
    List,
    Box,
    Typography,
    Skeleton,
    Stack,
} from "@mui/material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import EmptyStateIllustration from "@/components/common/EmptyStateIllustration";
import FileItem from "./FileItem";
import useAppTranslation from "@/locale/useAppTranslation";

const FileList: React.FC = () => {
    const { items, loading, selectedPaths, error } = useStorageManagement();
    const translations = useAppTranslation("storageTranslations");

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            height={64}
                            sx={{ borderRadius: 1 }}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <EmptyStateIllustration message={error} />
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box sx={{ p: 4 }}>
                <EmptyStateIllustration message={translations.emptyFolderUpload} />
            </Box>
        );
    }

    // Separate folders and files for better organization
    const folders = items.filter(item => item.__typename === "FolderInfo");
    const files = items.filter(item => item.__typename === "FileInfo");

    return (
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <List sx={{ p: 0 }}>
                {/* Folders first */}
                {folders.length > 0 && (
                    <>
                        {folders.length > 0 && files.length > 0 && (
                            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {translations.foldersCount.replace("{count}", String(folders.length))}
                                </Typography>
                            </Box>
                        )}
                        {folders.map((folder) => (
                            <FileItem
                                key={folder.path}
                                item={folder}
                                isSelected={selectedPaths.includes(folder.path)}
                            />
                        ))}
                    </>
                )}

                {/* Files */}
                {files.length > 0 && (
                    <>
                        {folders.length > 0 && (
                            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {translations.filesCount.replace("{count}", String(files.length))}
                                </Typography>
                            </Box>
                        )}
                        {files.map((file) => (
                            <FileItem
                                key={file.path}
                                item={file}
                                isSelected={selectedPaths.includes(file.path)}
                            />
                        ))}
                    </>
                )}
            </List>
        </Box>
    );
};

export default FileList;
