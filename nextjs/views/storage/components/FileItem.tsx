"use client";

import React, { useState } from "react";
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Chip,
    useTheme,
} from "@mui/material";
import {
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
    MoreVert as MoreIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Link as LinkIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    AudioFile as AudioIcon,
    PictureAsPdf as PdfIcon,
    Description as DocumentIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import * as Graphql from "@/graphql/generated/types";
import { StorageItem } from "@/contexts/storage/storage.type";
import { format } from "date-fns";
import useAppTranslation from "@/locale/useAppTranslation";

interface FileItemProps {
    item: StorageItem;
    isSelected: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ item, isSelected }) => {
    const theme = useTheme();
    const { toggleSelect, navigateTo, remove } = useStorageManagement();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    // const [isRenaming, setIsRenaming] = useState(false);
    const translations = useAppTranslation("storageTranslations");

    const isFolder = item.__typename === "FolderInfo";
    const fileInfo = item as Graphql.FileInfo;

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

    const getFileIcon = () => {
        if (isFolder) {
            return <FolderIcon color="primary" />;
        }

        const fileType = fileInfo.fileType;
        switch (fileType) {
            case "IMAGE":
                return <ImageIcon color="success" />;
            case "VIDEO":
                return <VideoIcon color="info" />;
            case "AUDIO":
                return <AudioIcon color="warning" />;
            case "DOCUMENT":
                return fileInfo.contentType === "PDF" ? (
                    <PdfIcon color="error" />
                ) : (
                    <DocumentIcon color="info" />
                );
            default:
                return <FileIcon color="action" />;
        }
    };

    const getFileTypeChip = () => {
        if (isFolder) return null;

        return (
            <Chip
                label={fileInfo.fileType}
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
            />
        );
    };

    const handleItemClick = () => {
        if (isFolder) {
            navigateTo(item.path);
        }
        // For files, we could implement preview here
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        toggleSelect(item.path);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleRename = () => {
        handleMenuClose();
        // setIsRenaming(true);
    };

    const handleDelete = async () => {
        handleMenuClose();
        await remove([item.path]);
        // Error handling is done in the context
    };

    const handleDownload = () => {
        handleMenuClose();
        if (!isFolder && fileInfo.url) {
            window.open(fileInfo.url, "_blank");
        }
    };

    const handleCopyLink = () => {
        handleMenuClose();
        if (!isFolder && fileInfo.url) {
            navigator.clipboard.writeText(fileInfo.url);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch {
            return translations.unknown;
        }
    };

    return (
        <>
            <ListItem
                disablePadding
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label={translations.moreActions}
                        onClick={handleMenuOpen}
                        size="small"
                    >
                        <MoreIcon />
                    </IconButton>
                }
                sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                    },
                    backgroundColor: isSelected
                        ? theme.palette.action.selected
                        : "transparent",
                }}
            >
                <ListItemButton onClick={handleItemClick} sx={{ pl: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox
                            edge="start"
                            checked={isSelected}
                            onChange={handleSelectChange}
                            size="small"
                        />
                    </ListItemIcon>

                    <ListItemIcon sx={{ minWidth: 40 }}>
                        {getFileIcon()}
                    </ListItemIcon>

                    <ListItemText
                        slotProps={{ secondary: { component: "div" } }}
                        primary={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="body2" fontWeight={500}>
                                    {item.name}
                                </Typography>
                                {getFileTypeChip()}
                            </Box>
                        }
                        secondary={
                            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {translations.modified}
                                    {formatDate(item.lastModified)}
                                </Typography>
                                {!isFolder && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {translations.size}
                                        {formatFileSize(fileInfo.size)}
                                    </Typography>
                                )}
                            </Box>
                        }
                    />
                </ListItemButton>
            </ListItem>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {!isFolder && (
                    <MenuItem onClick={handleDownload}>
                        <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
                        {translations.download}
                    </MenuItem>
                )}
                {!isFolder && fileInfo.url && (
                    <MenuItem onClick={handleCopyLink}>
                        <LinkIcon sx={{ mr: 1 }} fontSize="small" />
                        {translations.copyLink}
                    </MenuItem>
                )}
                <MenuItem onClick={handleRename}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" />
                    {translations.rename}
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                    {translations.delete}
                </MenuItem>
            </Menu>
        </>
    );
};

export default FileItem;
