"use client";

import React, { useState, useCallback } from "react";
import * as MUI from "@mui/material";
import { useStorageDataOperations } from "@/client/views/storage/hooks/useStorageDataOperations";
import { StorageItem } from "@/client/views/storage/core/storage.type";
import { useAppTranslation } from "@/client/locale";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  items: StorageItem[];
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  items,
}) => {
  const theme = MUI.useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const { remove } = useStorageDataOperations();

  // State
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle delete confirmation
  const handleDelete = useCallback(async () => {
    if (items.length === 0) return;

    setIsDeleting(true);
    setError(null);

    try {
      const itemPaths = items.map(item => item.path);
      const success = await remove(itemPaths);

      if (success) {
        onClose();
      } else {
        setError(
          translations.deleteDialogFailedToDelete ||
            "Failed to delete the item(s). Please try again."
        );
      }
    } catch {
      setError(
        translations.deleteDialogUnexpectedError ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }, [items, remove, onClose, translations]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  }, [isDeleting, onClose]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !isDeleting) {
        event.preventDefault();
        handleDelete();
      } else if (event.key === "Escape" && !isDeleting) {
        event.preventDefault();
        handleClose();
      }
    },
    [handleDelete, handleClose, isDeleting]
  );

  if (items.length === 0) {
    return null;
  }

  // Generate dialog title and message based on item count
  const getDialogContent = () => {
    if (items.length === 1) {
      const item = items[0];
      return {
        title: translations.deleteConfirmation.replace(
          "%{fileName}",
          item.name
        ),
        message: translations.deleteConfirmationMessage.replace(
          "%{fileName}",
          item.name
        ),
      };
    } else {
      return {
        title: `${translations.delete} ${items.length} ${translations.items}`,
        message: `Are you sure you want to delete ${items.length} items? This action cannot be undone.`,
      };
    }
  };

  const { title, message } = getDialogContent();

  return (
    <MUI.Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      onKeyDown={handleKeyDown}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minHeight: 200,
          },
        },
      }}
    >
      <MUI.DialogTitle
        id="delete-confirmation-dialog-title"
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          pb: 1,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </MUI.DialogTitle>

      <MUI.DialogContent>
        <MUI.Box sx={{ pt: 1 }}>
          <MUI.DialogContentText
            id="delete-confirmation-dialog-description"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            {message}
          </MUI.DialogContentText>

          {error && (
            <MUI.Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 1,
              }}
            >
              {error}
            </MUI.Alert>
          )}
        </MUI.Box>
      </MUI.DialogContent>

      <MUI.DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          gap: 1,
        }}
      >
        <MUI.Button
          onClick={handleClose}
          disabled={isDeleting}
          variant="outlined"
          sx={{
            minWidth: 80,
            borderRadius: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {translations.renameDialogCancel}
        </MUI.Button>
        <MUI.Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="contained"
          autoFocus
          sx={{
            minWidth: 80,
            borderRadius: 1,
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          {isDeleting ? translations.loading : translations.delete}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

export default DeleteConfirmationDialog;
