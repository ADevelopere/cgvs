"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Typography,
    Stack,
    Slide,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Link as LinkIcon,
    Close as CloseIcon,
    SelectAll as SelectAllIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";

const BulkActionsBar: React.FC = () => {
    const theme = useTheme();
    const { selectedPaths, clearSelection, remove } = useStorageManagement();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const translations = useAppTranslation("storageTranslations");

    const isVisible = selectedPaths.length > 0;

    const handleBulkDelete = async () => {
        setDeleteDialogOpen(false);
        const success = await remove(selectedPaths);
        if (success) {
            clearSelection();
        }
    };

    const handleBulkDownload = () => {
        // For now, we'll just show a message that this feature would be implemented
        // In a real implementation, this would create a zip file or trigger individual downloads
    };

    const handleCopyLinks = () => {
        // For now, we'll just show a message that this feature would be implemented
        // In a real implementation, this would copy all public URLs to clipboard
    };

    return (
        <>
            <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        p: 2,
                        zIndex: theme.zIndex.appBar,
                        boxShadow: theme.shadows[8],
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        {/* Selection Info */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <SelectAllIcon />
                            <Typography variant="subtitle1" fontWeight={600}>
                                {translations.itemsSelected.replace('%{count}', String(selectedPaths.length))}
                            </Typography>
                        </Stack>

                        {/* Actions */}
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleBulkDownload}
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                    borderColor: theme.palette.primary.contrastText,
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: theme.palette.primary.contrastText,
                                    },
                                }}
                            >
                                {translations.download}
                            </Button>

                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<LinkIcon />}
                                onClick={handleCopyLinks}
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                    borderColor: theme.palette.primary.contrastText,
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: theme.palette.primary.contrastText,
                                    },
                                }}
                            >
                                {translations.copyLinks}
                            </Button>

                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => setDeleteDialogOpen(true)}
                                sx={{
                                    color: theme.palette.error.light,
                                    borderColor: theme.palette.error.light,
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: theme.palette.error.light,
                                    },
                                }}
                            >
                                {translations.delete}
                            </Button>

                            <IconButton
                                onClick={clearSelection}
                                size="small"
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </Slide>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {translations.confirmBulkDelete}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {translations.confirmBulkDeleteMessage.replace('%{count}', String(selectedPaths.length))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        {translations.cancel}
                    </Button>
                    <Button 
                        onClick={handleBulkDelete} 
                        color="error" 
                        variant="contained"
                        autoFocus
                    >
                        {translations.delete}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BulkActionsBar;
