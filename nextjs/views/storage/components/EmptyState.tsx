"use client";

import React from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
    useTheme,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    ArrowUpward as ArrowUpIcon,
    FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as Graphql from "@/graphql/generated/types";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";

const EmptyState: React.FC = () => {
    const theme = useTheme();
    const notifications = useNotifications();
    const { params, goUp, startUpload } = useStorageManagement();
    const { canUpload, isAtRoot } = useStorageLocation();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            startUpload(files)
                .then(() => {
                    notifications.show("Upload started successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                })
                .catch(() => {
                    notifications.show("Failed to start upload", {
                        severity: "error",
                        autoHideDuration: 3000,
                    });
                });
        }
        // Reset input
        event.target.value = "";
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
                p: 4,
                color: "text.secondary",
            }}
        >
            {/* Icon */}
            <FolderOpenIcon
                sx={{
                    fontSize: 120,
                    color: theme.palette.grey[300],
                    mb: 2,
                }}
            />

            {/* Title */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
                {isAtRoot ? "No files yet" : "This folder is empty"}
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400 }}
            >
                {isAtRoot
                    ? "Choose a storage location from above to start managing your files."
                    : canUpload
                    ? "This folder doesn't contain any files yet. Upload some files to get started."
                    : "This folder doesn't contain any files or subfolders yet."}
            </Typography>

            {/* Actions */}
            <Stack direction="row" spacing={2} alignItems="center">
                {/* Upload Button - only show if upload is allowed */}
                {canUpload && (
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<UploadIcon />}
                        component="label"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        Upload Files
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileUpload}
                        />
                    </Button>
                )}

                {/* Go Up Button (only for non-root directories) */}
                {!isAtRoot && (
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<ArrowUpIcon />}
                        onClick={goUp}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        Go Up
                    </Button>
                )}
            </Stack>

            {/* Additional Help Text */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, maxWidth: 500 }}
            >
                You can also drag and drop files here to upload them.
                Supported formats include images, documents, videos, and more.
            </Typography>
        </Box>
    );
};

export default EmptyState;
