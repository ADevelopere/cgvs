"use client";

import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

export interface UploadProgressHeaderProps {
    totalCount: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onClose: () => void;
}

const UploadProgressHeader: React.FC<UploadProgressHeaderProps> = ({
    totalCount,
    isCollapsed,
    onToggleCollapse,
    onClose,
}) => {
    const theme = useTheme();

    const getTitle = () => {
        if (totalCount === 0) return "No uploads";
        if (totalCount === 1) return "Uploading 1 item";
        return `Uploading ${totalCount} items`;
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: theme.spacing(1.5, 2),
                borderBottom: !isCollapsed
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    flex: 1,
                }}
            >
                {getTitle()}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                    onClick={onToggleCollapse}
                    size="small"
                    aria-label={
                        isCollapsed
                            ? "Expand upload details"
                            : "Collapse upload details"
                    }
                    sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>

                <IconButton
                    onClick={onClose}
                    size="small"
                    aria-label="Close upload progress"
                    sx={{
                        color: theme.palette.text.secondary,
                        marginLeft: theme.spacing(0.5),
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            color: theme.palette.text.primary,
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default React.memo(UploadProgressHeader);
