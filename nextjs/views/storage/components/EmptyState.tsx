"use client";

import React from "react";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import {
    CloudUpload as UploadIcon,
    ArrowUpward as ArrowUpIcon,
    FolderOpen as FolderOpenIcon,
} from "@mui/icons-material";
import { useNotifications } from "@toolpad/core/useNotifications";
import useAppTranslation from "@/locale/useAppTranslation";

export interface EmptyStateProps {
    canUpload: boolean;
    isAtRoot: boolean;
    onGoUp?: () => void;
    onUpload?: (files: File[]) => Promise<void>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    canUpload,
    isAtRoot,
    onGoUp,
    onUpload,
}) => {
    const theme = useTheme();
    const notifications = useNotifications();
    const translations = useAppTranslation("storageTranslations");

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0 && onUpload) {
            try {
                await onUpload(files);
                notifications.show(translations.uploadStartedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch {
                notifications.show(translations.failedToStartUpload, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            }
        }
        // Reset input
        event.target.value = "";
    };

    const handleGoUp = () => {
        if (onGoUp) {
            onGoUp();
        }
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
                        onClick={handleGoUp}
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
