"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as MUI from "@mui/material";
import { useAppTranslation } from "@/client/locale";

export interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
  onSuccess: () => void;
  onCreateFolder: (path: string, name: string) => Promise<boolean>;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  onClose,
  currentPath,
  onSuccess,
  onCreateFolder,
}) => {
  const theme = MUI.useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes and focus input
  useEffect(() => {
    if (open) {
      setFolderName("");
      setError(null);
      setIsLoading(false);

      // Focus the input field after a short delay to ensure dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Validation
  const validateName = useCallback(
    (name: string): string | null => {
      // Check for empty or whitespace-only names
      if (!name.trim()) {
        return translations.createFolderDialogEmpty;
      }

      // Check for invalid characters: <>:"/\|?*
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(name)) {
        return translations.createFolderDialogInvalid;
      }

      // Reject path separators anywhere in the name
      if (name.includes("/") || name.includes("\\")) {
        return translations.createFolderDialogInvalid;
      }

      // Reject path traversal patterns
      const pathTraversalPatterns = ["../", "..\\", "./", ".\\"];
      for (const pattern of pathTraversalPatterns) {
        if (name.includes(pattern)) {
          return translations.createFolderDialogInvalid;
        }
      }

      // Reject names that are just "." or ".."
      if (name === "." || name === "..") {
        return translations.createFolderDialogInvalid;
      }

      // Reject names starting with a dot followed by a path separator
      if (name.startsWith("./") || name.startsWith(".\\")) {
        return translations.createFolderDialogInvalid;
      }

      // Reject absolute paths
      if (name.startsWith("/") || name.startsWith("\\")) {
        return translations.createFolderDialogInvalid;
      }

      // Additional check for Windows-style absolute paths (e.g., C:\)
      if (/^[a-zA-Z]:/.test(name)) {
        return translations.createFolderDialogInvalid;
      }

      return null;
    },
    [translations]
  );

  // Handle folder creation submission
  const handleCreate = useCallback(async () => {
    const validationError = validateName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onCreateFolder(currentPath, folderName.trim());

      if (success) {
        onSuccess();
        onClose();
      } else {
        setError(translations.createFolderDialogFailedToCreate);
      }
    } catch {
      setError(translations.createFolderDialogUnexpectedError);
    } finally {
      setIsLoading(false);
    }
  }, [
    folderName,
    validateName,
    onCreateFolder,
    currentPath,
    onSuccess,
    onClose,
    translations.createFolderDialogFailedToCreate,
    translations.createFolderDialogUnexpectedError,
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
        handleCreate();
      } else if (event.key === "Escape" && !isLoading) {
        event.preventDefault();
        handleClose();
      }
    },
    [handleCreate, handleClose, isLoading]
  );

  // Handle text field changes
  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFolderName(value);

      // Clear error if user starts typing
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  const isFormValid = useMemo(() => {
    return folderName.trim() && !validateName(folderName);
  }, [folderName, validateName]);

  return (
    <MUI.Dialog
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
      <MUI.DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          pb: 1,
        }}
      >
        {translations.createFolderDialogTitle}
      </MUI.DialogTitle>

      <MUI.DialogContent>
        <MUI.Box sx={{ pt: 1 }}>
          <MUI.TextField
            inputRef={inputRef}
            autoFocus
            fullWidth
            label={translations.createFolderDialogLabel}
            value={folderName}
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
            onFocus={event => {
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
          disabled={isLoading}
          variant="outlined"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {translations.createFolderDialogCancel}
        </MUI.Button>
        <MUI.Button
          onClick={handleCreate}
          disabled={!isFormValid || isLoading}
          variant="contained"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {isLoading ? translations.loading : translations.createFolderDialogOk}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

export default CreateFolderDialog;
