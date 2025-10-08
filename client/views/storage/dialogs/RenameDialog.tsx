"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    useTheme,
    Box,
} from "@mui/material";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { StorageItem } from "@/client/contexts/storage/storage.type";
import { useAppTranslation } from "@/client/locale";

export interface RenameDialogProps {
    open: boolean;
    onClose: () => void;
    item: StorageItem | null;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ open, onClose, item }) => {
    const theme = useTheme();
    const { ui: translations } = useAppTranslation("storageTranslations");
    const { renameItem } = useStorageManagementUI();

    // State
    const [newName, setNewName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when dialog opens/closes or item changes
    useEffect(() => {
        if (open && item) {
            // Pre-populate with current name, excluding extension for files
            const currentName = item.name;
            let nameWithoutExtension = currentName;

            // For files, try to separate name and extension
            if ("contentType" in item && item.contentType) {
                const lastDotIndex = currentName.lastIndexOf(".");
                if (lastDotIndex > 0) {
                    nameWithoutExtension = currentName.substring(
                        0,
                        lastDotIndex,
                    );
                }
            }

            setNewName(nameWithoutExtension);
            setError(null);
            setIsLoading(false);
        } else {
            setNewName("");
            setError(null);
            setIsLoading(false);
        }
    }, [open, item]);

    // Validation
    const validateName = useCallback(
        (name: string): string | null => {
            if (!name.trim()) {
                return translations.renameDialogEmpty;
            }

            // Check for invalid characters (basic validation)
            const invalidChars = /[<>:"/\\|?*]/;
            if (invalidChars.test(name)) {
                return translations.renameDialogInvalid;
            }

            return null;
        },
        [translations],
    );

    // Handle rename submission
    const handleRename = useCallback(async () => {
        if (!item) return;

        const validationError = validateName(newName);
        if (validationError) {
            setError(validationError);
            return;
        }

        // If name hasn't changed, just close
        if (newName.trim() === item.name) {
            onClose();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // For files, we need to preserve the extension
            let finalName = newName.trim();
            if ("contentType" in item && item.contentType) {
                const currentName = item.name;
                const lastDotIndex = currentName.lastIndexOf(".");
                if (lastDotIndex > 0) {
                    const extension = currentName.substring(lastDotIndex);
                    finalName = newName.trim() + extension;
                }
            }

            const success = await renameItem(item.path, finalName);

            if (success) {
                onClose();
            } else {
                setError(translations.renameDialogFailedToRename);
            }
        } catch {
            setError(translations.renameDialogUnexpectedError);
        } finally {
            setIsLoading(false);
        }
    }, [
        item,
        newName,
        validateName,
        renameItem,
        onClose,
        translations.renameDialogFailedToRename,
        translations.renameDialogUnexpectedError,
    ]);

    // Handle dialog close
    const handleClose = useCallback(() => {
        if (!isLoading) {
            onClose();
        }
    }, [isLoading, onClose]);

    // Handle keyboard events
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter" && !isLoading) {
                event.preventDefault();
                handleRename();
            } else if (event.key === "Escape" && !isLoading) {
                event.preventDefault();
                handleClose();
            }
        },
        [handleRename, handleClose, isLoading],
    );

    // Handle text field changes
    const handleNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setNewName(value);

            // Clear error if user starts typing
            if (error) {
                setError(null);
            }
        },
        [error],
    );

    if (!item) {
        return null;
    }

    const isFormValid =
        newName.trim() &&
        !validateName(newName) &&
        newName.trim() !== item.name;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            onKeyDown={handleKeyDown}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        minHeight: 200,
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    pb: 1,
                }}
            >
                {translations.renameDialogTitle}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label={translations.renameDialogLabel}
                        value={newName}
                        onChange={handleNameChange}
                        error={!!error}
                        helperText={error}
                        disabled={isLoading}
                        variant="outlined"
                        size="medium"
                        slotProps={{
                            input: {
                                sx: {
                                    borderRadius: 1,
                                },
                            },
                        }}
                        onFocus={(event) => {
                            // Select all text when field is focused
                            event.target.select();
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            },
                        }}
                    />

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mt: 2,
                                borderRadius: 1,
                            }}
                        >
                            {error}
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 1,
                    gap: 1,
                }}
            >
                <Button
                    onClick={handleClose}
                    disabled={isLoading}
                    variant="outlined"
                    sx={{
                        minWidth: 80,
                        borderRadius: 1,
                    }}
                >
                    {translations.renameDialogCancel}
                </Button>
                <Button
                    onClick={handleRename}
                    disabled={!isFormValid || isLoading}
                    variant="contained"
                    sx={{
                        minWidth: 80,
                        borderRadius: 1,
                    }}
                >
                    {isLoading
                        ? translations.loading || "Loading..."
                        : translations.renameDialogOk}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameDialog;
