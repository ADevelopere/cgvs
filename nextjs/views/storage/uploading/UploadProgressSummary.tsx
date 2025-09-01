"use client";

import React from "react";
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

    const formatTimeRemaining = (seconds: number | null): string => {
        if (!seconds || seconds <= 0) return "";

        if (seconds < 60) {
            return `${Math.ceil(seconds)} sec left...`;
        } else if (seconds < 3600) {
            const minutes = Math.ceil(seconds / 60);
            return `${minutes} min left...`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.ceil((seconds % 3600) / 60);
            return `${hours}h ${minutes}m left...`;
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
                    sx={{
                        color: theme.palette.primary.main,
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: theme.spacing(0.5, 1),
                        minWidth: "auto",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            color: theme.palette.primary.dark,
                        },
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Collapse>
    );
};

export default React.memo(UploadProgressSummary);
