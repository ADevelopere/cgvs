"use client";

import React from "react";
import {
    Alert,
    Button,
    Box,
    Typography,
    AlertTitle,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    Error as ErrorIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";

interface ErrorBannerProps {
    error?: string;
    onRetry?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
    error: propError, 
    onRetry: propOnRetry 
}) => {
    const { error: contextError, refresh } = useStorageManagement();
    
    const error = propError || contextError;
    const onRetry = propOnRetry || refresh;

    if (!error) {
        return null;
    }

    const getErrorMessage = (errorMsg: string) => {
        // Parse common error scenarios and provide user-friendly messages
        if (errorMsg.toLowerCase().includes("network")) {
            return "Network connection error. Please check your internet connection.";
        }
        if (errorMsg.toLowerCase().includes("unauthorized") || errorMsg.includes("401")) {
            return "Authentication error. Please log in again.";
        }
        if (errorMsg.toLowerCase().includes("forbidden") || errorMsg.includes("403")) {
            return "Access denied. You don't have permission to view this content.";
        }
        if (errorMsg.toLowerCase().includes("not found") || errorMsg.includes("404")) {
            return "The requested content was not found.";
        }
        if (errorMsg.toLowerCase().includes("timeout")) {
            return "Request timed out. Please try again.";
        }
        if (errorMsg.toLowerCase().includes("server") || errorMsg.includes("500")) {
            return "Server error. Please try again later.";
        }
        
        // Return the original error if no pattern matches
        return errorMsg;
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Alert
                severity="error"
                icon={<ErrorIcon />}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                        variant="outlined"
                        sx={{
                            borderColor: "currentColor",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                    >
                        Retry
                    </Button>
                }
                sx={{
                    "& .MuiAlert-message": {
                        flex: 1,
                    },
                }}
            >
                <AlertTitle>Failed to load storage content</AlertTitle>
                <Typography variant="body2">
                    {getErrorMessage(error)}
                </Typography>
            </Alert>
        </Box>
    );
};

export default ErrorBanner;
