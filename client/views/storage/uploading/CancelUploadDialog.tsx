"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { CancelTarget } from "../hooks/storage-upload.types";

export interface CancelUploadDialogProps {
  open: boolean;
  cancelTarget: CancelTarget | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelUploadDialog: React.FC<CancelUploadDialogProps> = ({
  open,
  cancelTarget,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const { uploading: translations } = useAppTranslation("storageTranslations");

  const getDialogContent = () => {
    if (!cancelTarget) return { title: "", message: "" };

    if (cancelTarget.type === "all") {
      return {
        title: translations.cancelAllUploads,
        message: translations.cancelAllUploadsMessage,
      };
    } else {
      return {
        title: translations.cancelFileUpload,
        message: translations.cancelFileUploadMessage.replace(
          "%{fileName}",
          cancelTarget.fileName ?? "unknown target"
        ),
      };
    }
  };

  const { title, message } = getDialogContent();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="cancel-upload-dialog-title"
      aria-describedby="cancel-upload-dialog-description"
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
        id="cancel-upload-dialog-title"
        sx={{ color: theme.palette.text.primary }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="cancel-upload-dialog-description"
          sx={{ color: theme.palette.text.secondary }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(1, 3, 2) }}>
        <Button
          onClick={onCancel}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {translations.keepUploading}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
          }}
          autoFocus
        >
          {translations.cancelUpload}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CancelUploadDialog);
