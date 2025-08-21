"use client";

import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    useTheme,
} from "@mui/material";
import {
    Folder as FolderIcon,
    Image as ImageIcon,
    ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import { getUploadLocationOptions } from "@/contexts/storage/storage.location";
import useAppTranslation from "@/locale/useAppTranslation";

const LocationGrid: React.FC = () => {
    const theme = useTheme();
    const { navigateTo } = useStorageManagement();
    const locations = getUploadLocationOptions();
    const translations = useAppTranslation("storageTranslations");

    const getLocationIcon = (iconName?: string) => {
        switch (iconName) {
            case "Image":
                return <ImageIcon sx={{ fontSize: 48 }} />;
            default:
                return <FolderIcon sx={{ fontSize: 48 }} />;
        }
    };

    const getContentTypeChips = (contentTypes: string[]) => {
        const maxShow = 3;
        const visibleTypes = contentTypes.slice(0, maxShow);
        const remaining = contentTypes.length - maxShow;

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {visibleTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                    />
                ))}
                {remaining > 0 && (
                    <Chip
                        label={translations.remainingMore.replace("{remaining}", String(remaining))}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: "0.75rem" }}
                    />
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                {translations.storageLocations}
            </Typography>
            <Grid container spacing={3}>
                {locations.map((location) => (
                    <Grid key={location.key} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                            onClick={() => {
                                // Navigate to the location path (without 'public/' prefix)
                                const displayPath = location.path.startsWith("public/") 
                                    ? location.path.substring(7) 
                                    : location.path;
                                navigateTo(displayPath);
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        {getLocationIcon(location.icon)}
                                    </Box>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            color: theme.palette.grey[500],
                                            "&:hover": {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </Box>

                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    {location.label}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2, minHeight: 40 }}
                                >
                                    {location.description}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {translations.allowedFileTypes}
                                </Typography>
                                {getContentTypeChips(location.allowedContentTypes)}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default LocationGrid;
