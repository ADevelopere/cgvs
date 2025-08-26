"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Divider,
} from "@mui/material";
import {
    Warning as WarningIcon,
    Folder as FolderIcon,
    InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    paths: string[];
    onConfirm?: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    open,
    onClose,
    paths,
    onConfirm,
}) => {
    const { remove, items } = useStorageManagement();
    const [loading, setLoading] = useState(false);
    const translations = useAppTranslation("storageTranslations");

    const getItemsToDelete = () => {
        return items.filter((item) => paths.includes(item.path));
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const success = await remove(paths);
            if (success) {
                onConfirm?.();
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const itemsToDelete = getItemsToDelete();
    const isMultiple = paths.length > 1;
    const folderCount = itemsToDelete.filter(
        (item) => item.__typename === "FolderInfo",
    ).length;
    const fileCount = itemsToDelete.filter(
        (item) => item.__typename === "FileInfo",
    ).length;

    const getDialogTitle = () => {
        if (isMultiple) {
            return translations.deleteItems.replace(
                "%{count}",
                String(paths.length),
            );
        }
        const item = itemsToDelete[0];
        if (item) {
            return item.__typename === "FolderInfo"
                ? translations.deleteFolder
                : translations.deleteFile;
        }
        return translations.deleteItem;
    };

    const getWarningMessage = () => {
        if (isMultiple) {
            const parts = [];
            if (folderCount > 0) {
                parts.push(
                    `${folderCount} folder${folderCount === 1 ? "" : "s"}`,
                );
            }
            if (fileCount > 0) {
                parts.push(`${fileCount} file${fileCount === 1 ? "" : "s"}`);
            }
            return translations.aboutToDelete.replace(
                "%{parts}",
                parts.join(" and "),
            );
        } else {
            const item = itemsToDelete[0];
            if (item) {
                const type =
                    item.__typename === "FolderInfo" ? "folder" : "file";
                return translations.aboutToDeleteItem
                    .replace("%{type}", type)
                    .replace("%{name}", item.name);
            }
            return translations.cannotBeUndone;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="delete-dialog-title"
        >
            <DialogTitle
                id="delete-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "error.main",
                }}
            >
                <WarningIcon />
                {getDialogTitle()}
            </DialogTitle>

            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {getWarningMessage()}
                </Alert>

                {itemsToDelete.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            {translations.itemsToBeDeleted}
                        </Typography>

                        <List
                            dense
                            sx={{
                                maxHeight: 200,
                                overflow: "auto",
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                backgroundColor: "background.default",
                            }}
                        >
                            {itemsToDelete.map((item, index) => (
                                <React.Fragment key={item.path}>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            {item.__typename ===
                                            "FolderInfo" ? (
                                                <FolderIcon color="primary" />
                                            ) : (
                                                <FileIcon color="action" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={item.path}
                                            slotProps={{
                                                primary: {
                                                    variant: "body2",
                                                    fontWeight: 500,
                                                },
                                                secondary: {
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                },
                                            }}
                                        />
                                    </ListItem>
                                    {index < itemsToDelete.length - 1 && (
                                        <Divider />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                )}

                {folderCount > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {translations.deleteFolderWarning}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} variant="outlined">
                    {translations.cancel}
                </Button>
                <Button
                    onClick={handleDelete}
                    disabled={loading}
                    variant="contained"
                    color="error"
                    autoFocus
                >
                    {loading ? translations.deleting : translations.delete}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;
