"use client";

import React, { useState } from "react";
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    useTheme,
    Divider,
} from "@mui/material";
import {
    ContentCut as CutIcon,
    ContentCopy as CopyIcon,
    Download as DownloadIcon,
    Edit as RenameIcon,
    Info as InfoIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { StorageItem } from "@/client/views/storage/hooks/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

export interface FileMenuProps {
    anchorPosition?: {
        top: number;
        left: number;
    };
    open: boolean;
    onClose: () => void;
    file: Graphql.FileInfo;
}

const FileMenu: React.FC<FileMenuProps> = ({
    anchorPosition,
    open,
    onClose,
    file,
}) => {
    const theme = useTheme();
    const { ui: translations } = useAppTranslation("storageTranslations");
    const { copyItems, cutItems, renameItem, deleteItems, refresh } =
        useStorageManagementUI();

    // State for confirmation dialogs
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle menu actions
    const handleCopy = () => {
        copyItems([file as StorageItem]);
        onClose();
    };

    const handleCut = () => {
        cutItems([file as StorageItem]);
        onClose();
    };

    const handleDownload = () => {
        if (file.mediaLink) {
            // Construct download URL from file path
            // This assumes there's an API endpoint that serves files for download

            // Create a temporary link and trigger download
            const link = document.createElement("a");
            link.href = file.mediaLink;
            link.download = file.name;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onClose();
        }
    };

    const handleRename = () => {
        // Simple prompt for now - will be replaced with RenameDialog component later
        const fileName = file.name;
        const newName = prompt("Enter new name:", fileName);
        if (newName && newName !== fileName) {
            renameItem(file.path, newName);
        }
        onClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        onClose();
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        const success = await deleteItems([file.path]);
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        if (success) {
            refresh();
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const handleGetInfo = () => {
        setInfoDialogOpen(true);
        onClose();
    };

    const handleInfoClose = () => {
        setInfoDialogOpen(false);
    };

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <>
            <Menu
                open={open}
                onClose={onClose}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            minWidth: 200,
                        },
                    },
                }}
                // Position the menu at the exact cursor position
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem onClick={handleCut}>
                    <ListItemIcon>
                        <CutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.cut}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <CopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.copy}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleDownload}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.download}</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleRename}>
                    <ListItemIcon>
                        <RenameIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.rename}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.delete}</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleGetInfo}>
                    <ListItemIcon>
                        <InfoIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{translations.getInfo}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        },
                    },
                }}
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{ color: theme.palette.text.primary }}
                >
                    {translations.delete}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="delete-dialog-description"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        {translations.deleteConfirmationMessage.replace(
                            "%{fileName}",
                            file.name,
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: theme.spacing(1, 3, 2) }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={isDeleting}
                        sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        {translations.cancel}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        disabled={isDeleting}
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText,
                            "&:hover": {
                                backgroundColor: theme.palette.error.dark,
                            },
                        }}
                        autoFocus
                    >
                        {isDeleting
                            ? translations.loading
                            : translations.delete}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* File Info Dialog */}
            <Dialog
                open={infoDialogOpen}
                onClose={handleInfoClose}
                aria-labelledby="info-dialog-title"
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        },
                    },
                }}
            >
                <DialogTitle
                    id="info-dialog-title"
                    sx={{ color: theme.palette.text.primary }}
                >
                    {translations.getInfo}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        component="div"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        <div style={{ marginBottom: theme.spacing(2) }}>
                            <strong>{translations.name}:</strong>{" "}
                            {file.name}
                        </div>
                        <div style={{ marginBottom: theme.spacing(2) }}>
                            <strong>{translations.size}:</strong>{" "}
                            {formatFileSize(file.size)}
                        </div>
                        {file.contentType && (
                            <div style={{ marginBottom: theme.spacing(2) }}>
                                <strong>{translations.contentType}:</strong>{" "}
                                {file.contentType}
                            </div>
                        )}
                        <div style={{ marginBottom: theme.spacing(2) }}>
                            <strong>{translations.lastModified}:</strong>{" "}
                            {formatDate(file.lastModified)}
                        </div>
                        <div style={{ marginBottom: theme.spacing(2) }}>
                            <strong>{translations.createdAt}:</strong>{" "}
                            {formatDate(file.createdAt)}
                        </div>
                        <div style={{ marginBottom: theme.spacing(2) }}>
                            <strong>{translations.path}:</strong> {file.path}
                        </div>
                        {file.md5Hash && (
                            <div style={{ marginBottom: theme.spacing(2) }}>
                                <strong>{translations.md5Hash}:</strong>{" "}
                                {file.md5Hash}
                            </div>
                        )}
                        {file.isProtected && (
                            <div style={{ marginBottom: theme.spacing(2) }}>
                                <strong>{translations.protected}:</strong>{" "}
                                {translations.yes}
                            </div>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: theme.spacing(1, 3, 2) }}>
                    <Button
                        onClick={handleInfoClose}
                        sx={{
                            color: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        {translations.close}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default React.memo(FileMenu);
