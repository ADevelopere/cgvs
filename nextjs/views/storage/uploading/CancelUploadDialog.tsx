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
import { CancelTarget } from "./UploadProgressUIContext";

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

    const getDialogContent = () => {
        if (!cancelTarget) return { title: "", message: "" };

        if (cancelTarget.type === "all") {
            return {
                title: "Cancel All Uploads",
                message:
                    "Are you sure you want to cancel all uploads? This action cannot be undone.",
            };
        } else {
            return {
                title: "Cancel File Upload",
                message: `Are you sure you want to cancel uploading "${cancelTarget.fileName}"? This action cannot be undone.`,
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
                    Keep Uploading
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
                    Cancel Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(CancelUploadDialog);
