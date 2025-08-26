"use client";

import React from "react";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import {
    CloudUpload as UploadIcon,
    ArrowUpward as ArrowUpIcon,
    FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";
import useAppTranslation from "@/locale/useAppTranslation";

const EmptyState: React.FC = () => {
    const theme = useTheme();
    const notifications = useNotifications();
    const { goUp, startUpload } = useStorageManagement();
    const { canUpload, isAtRoot } = useStorageLocation();
    const translations = useAppTranslation("storageTranslations");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            startUpload(files)
                .then(() => {
                    notifications.show(translations.uploadStartedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                })
                .catch(() => {
                    notifications.show(translations.failedToStartUpload, {
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
                {isAtRoot
                    ? translations.noFilesYet
                    : translations.thisFolderIsEmpty}
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400 }}
            >
                {isAtRoot
                    ? translations.chooseStorageLocation
                    : canUpload
                      ? translations.emptyFolderGetStarted
                      : translations.emptyFolder}
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
                        {translations.uploadFiles}
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
                        {translations.goUp}
                    </Button>
                )}
            </Stack>

            {/* Additional Help Text */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, maxWidth: 500 }}
            >
                {translations.dragAndDropHelpText}
            </Typography>
        </Box>
    );
};

export default EmptyState;
