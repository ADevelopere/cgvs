"use client";

import React from "react";
import useAppTranslation from "@/locale/useAppTranslation";
import { Box, Typography, Button, useTheme, Collapse } from "@mui/material";

export interface UploadProgressSummaryProps {
    timeRemaining: number | null;
    isCollapsed: boolean;
    onCancelAll: () => void;
}

const UploadProgressSummary: React.FC<UploadProgressSummaryProps> = ({
    timeRemaining,
    isCollapsed,
    onCancelAll,
}) => {
    const theme = useTheme();
    const { uploading: translations } = useAppTranslation("storageTranslations");

    const formatTimeRemaining = (seconds: number | null): string => {
        if (!seconds || seconds <= 0) return "";

        if (seconds < 60) {
            return translations.secondsLeft.replace("%{seconds}", Math.ceil(seconds).toString());
        } else if (seconds < 3600) {
            const minutes = Math.ceil(seconds / 60);
            return translations.minutesLeft.replace("%{minutes}", minutes.toString());
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.ceil((seconds % 3600) / 60);
            return `${translations.hoursLeft.replace("%{hours}", hours.toString())} ${translations.minutesLeftShort.replace("%{minutes}", minutes.toString())}`;
        }
    };

    return (
        <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: theme.spacing(1, 2),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 400,
                    }}
                >
                    {formatTimeRemaining(timeRemaining)}
                </Typography>

                <Button
                    onClick={onCancelAll}
                    size="small"
                    disabled={!timeRemaining || timeRemaining <= 0}
                    sx={{
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: theme.spacing(0.5, 1),
                        minWidth: "auto",
                    }}
                >
                    {translations.cancel}
                </Button>
            </Box>
        </Collapse>
    );
};

export default React.memo(UploadProgressSummary);
