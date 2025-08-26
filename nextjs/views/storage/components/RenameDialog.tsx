"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
} from "@mui/material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";

interface RenameDialogProps {
    open: boolean;
    onClose: () => void;
    currentPath: string;
    currentName: string;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
    open,
    onClose,
    currentPath,
    currentName,
}) => {
    const { rename } = useStorageManagement();
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const translations = useAppTranslation("storageTranslations");

    useEffect(() => {
        if (open) {
            setNewName(currentName);
            setError(null);
        }
    }, [open, currentName]);

    const validateName = (name: string): string | null => {
        if (!name.trim()) {
            return translations.nameCannotBeEmpty;
        }
        if (name.trim() === currentName) {
            return translations.nameMustBeDifferent;
        }
        if (name.includes("/")) {
            return translations.nameCannotContainForwardSlashes;
        }
        if (name.includes("\\")) {
            return translations.nameCannotContainBackslashes;
        }
        if (name.length > 255) {
            return translations.nameTooLong;
        }
        // Check for illegal characters
        const illegalChars = /[<>:"|?*]/;
        if (illegalChars.test(name)) {
            return translations.nameContainsIllegalCharacters;
        }
        return null;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedName = newName.trim();
        const validationError = validateName(trimmedName);

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const success = await rename(currentPath, trimmedName);
            if (success) {
                onClose();
            } else {
                setError(translations.failedToRenameItem);
            }
        } catch {
            setError(translations.unexpectedError);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    const isValid = !validateName(newName.trim());

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="rename-dialog-title"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="rename-dialog-title">
                    {translations.renameItem}
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            autoFocus
                            fullWidth
                            label={translations.newName}
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            error={!!error}
                            helperText={error || translations.enterNewName}
                            margin="normal"
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>
                        {translations.cancel}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !isValid || !newName.trim()}
                        color="primary"
                    >
                        {loading ? translations.renaming : translations.rename}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RenameDialog;
