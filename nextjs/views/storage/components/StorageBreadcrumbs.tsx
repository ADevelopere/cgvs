"use client";

import React from "react";
import {
    Breadcrumbs,
    Typography,
    Box,
    IconButton,
    Link,
    Chip,
} from "@mui/material";
import {
    Home as HomeIcon,
    ArrowUpward as ArrowUpIcon,
    NavigateNext as NavigateNextIcon,
    Folder as FolderIcon,
    Storage as StorageIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";

const StorageBreadcrumbs: React.FC = () => {
    const { params, navigateTo, goUp } = useStorageManagement();
    const { currentLocationInfo } = useStorageLocation();

    const pathParts = params.path
        ? params.path.split("/").filter(Boolean)
        : [];

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            // Root level (show location grid)
            navigateTo("");
        } else {
            // Navigate to specific path level
            const targetPath = pathParts.slice(0, index + 1).join("/");
            navigateTo(targetPath);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                backgroundColor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            {/* Go Up Button */}
            {pathParts.length > 0 && (
                <IconButton
                    onClick={goUp}
                    size="small"
                    sx={{
                        mr: 1,
                        backgroundColor: "action.hover",
                        "&:hover": {
                            backgroundColor: "action.selected",
                        },
                    }}
                    title="Go up one level"
                >
                    <ArrowUpIcon />
                </IconButton>
            )}

            {/* Breadcrumb Navigation */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="storage breadcrumb navigation"
                sx={{ flex: 1 }}
            >
                {/* Root/Home */}
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => handleBreadcrumbClick(-1)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        textDecoration: "none",
                        color: "primary.main",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    <StorageIcon fontSize="small" />
                    Storage Locations
                </Link>

                {/* Path segments */}
                {pathParts.map((part, index) => {
                    const isLast = index === pathParts.length - 1;
                    const isFirstSegment = index === 0;

                    if (isLast) {
                        // Current folder - not clickable
                        return (
                            <Chip
                                key={index}
                                icon={<FolderIcon />}
                                label={
                                    isFirstSegment && currentLocationInfo
                                        ? currentLocationInfo.label
                                        : part
                                }
                                size="small"
                                variant="filled"
                                color="primary"
                                sx={{
                                    "& .MuiChip-label": {
                                        fontWeight: 600,
                                    },
                                }}
                            />
                        );
                    }

                    // Parent folders - clickable
                    return (
                        <Link
                            key={index}
                            component="button"
                            variant="body2"
                            onClick={() => handleBreadcrumbClick(index)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                textDecoration: "none",
                                color: "text.primary",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "primary.main",
                                },
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <FolderIcon fontSize="small" />
                            {isFirstSegment && currentLocationInfo
                                ? currentLocationInfo.label
                                : part}
                        </Link>
                    );
                })}
            </Breadcrumbs>

            {/* Current Path Info */}
            {pathParts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Choose a storage location
                </Typography>
            )}
        </Box>
    );
};

export default StorageBreadcrumbs;
