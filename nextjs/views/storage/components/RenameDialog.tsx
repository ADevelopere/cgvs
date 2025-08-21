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

    useEffect(() => {
        if (open) {
            setNewName(currentName);
            setError(null);
        }
    }, [open, currentName]);

    const validateName = (name: string): string | null => {
        if (!name.trim()) {
            return "Name cannot be empty";
        }
        if (name.trim() === currentName) {
            return "New name must be different from current name";
        }
        if (name.includes("/")) {
            return "Name cannot contain forward slashes";
        }
        if (name.includes("\\")) {
            return "Name cannot contain backslashes";
        }
        if (name.length > 255) {
            return "Name is too long (maximum 255 characters)";
        }
        // Check for illegal characters
        const illegalChars = /[<>:"|?*]/;
        if (illegalChars.test(name)) {
            return "Name contains illegal characters";
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
                setError("Failed to rename item. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred");
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
                    Rename Item
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
                            label="New name"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            error={!!error}
                            helperText={error || "Enter a new name for this item"}
                            margin="normal"
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !isValid || !newName.trim()}
                        color="primary"
                    >
                        {loading ? "Renaming..." : "Rename"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RenameDialog;
