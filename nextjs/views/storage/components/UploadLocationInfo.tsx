"use client";

import React from "react";
import {
    Box,
    Typography,
    Chip,
    Alert,
    Stack,
    useTheme,
} from "@mui/material";
import {
    Info as InfoIcon,
    Upload as UploadIcon,
} from "@mui/icons-material";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";

const UploadLocationInfo: React.FC = () => {
    const theme = useTheme();
    const { currentLocationInfo, canUpload, allowedContentTypes } = useStorageLocation();

    if (!canUpload || !currentLocationInfo) {
        return null;
    }

    return (
        <Alert
            severity="info"
            icon={<UploadIcon />}
            sx={{
                mx: 2,
                mb: 2,
                "& .MuiAlert-message": {
                    width: "100%",
                },
            }}
        >
            <Stack spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                    Upload Location: {currentLocationInfo.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentLocationInfo.description}
                </Typography>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        Allowed file types:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {allowedContentTypes.map((type) => (
                            <Chip
                                key={type}
                                label={type}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ 
                                    fontSize: "0.75rem",
                                    height: 24,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Alert>
    );
};

export default UploadLocationInfo;
