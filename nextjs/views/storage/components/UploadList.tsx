"use client";

import React from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    Button,
    Stack,
    Collapse,
    IconButton,
    LinearProgress,
    Divider,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    Clear as ClearIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import UploadItem from "./UploadItem";

const UploadList: React.FC = () => {
    const {
        uploadBatch,
        cancelUpload,
        retryFailedUploads,
        clearUploadBatch,
    } = useStorageManagement();

    const [expanded, setExpanded] = React.useState(true);

    if (!uploadBatch) {
        return null;
    }

    const filesArray = Array.from(uploadBatch.files.entries());
    const failedFiles = filesArray.filter(([, file]) => file.status === "error");
    const inProgressCount = filesArray.filter(([, file]) => 
        file.status === "uploading" || file.status === "pending"
    ).length;

    const overallProgress = uploadBatch.totalCount > 0 
        ? (uploadBatch.completedCount / uploadBatch.totalCount) * 100 
        : 0;

    const isCompleted = uploadBatch.completedCount === uploadBatch.totalCount;
    const hasFailures = failedFiles.length > 0;

    const handleToggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleCancelAll = () => {
        cancelUpload(); // Cancel all uploads
    };

    const handleRetryFailed = () => {
        retryFailedUploads();
    };

    const getStatusSummary = () => {
        if (isCompleted && !hasFailures) {
            return `All ${uploadBatch.totalCount} files uploaded successfully`;
        }
        if (isCompleted && hasFailures) {
            return `${uploadBatch.completedCount - failedFiles.length} succeeded, ${failedFiles.length} failed`;
        }
        return `Uploading ${inProgressCount} files...`;
    };

    return (
        <Paper
            elevation={2}
            sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                width: 400,
                maxWidth: "90vw",
                maxHeight: "70vh",
                zIndex: 1300,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <UploadIcon />
                    <Typography variant="subtitle1" fontWeight={600}>
                        File Upload
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <IconButton
                        size="small"
                        onClick={handleToggleExpanded}
                        sx={{ color: "inherit" }}
                    >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    {isCompleted && (
                        <IconButton
                            size="small"
                            onClick={clearUploadBatch}
                            sx={{ color: "inherit" }}
                        >
                            <ClearIcon />
                        </IconButton>
                    )}
                </Stack>
            </Box>

            {/* Progress Summary */}
            <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {getStatusSummary()}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={overallProgress}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor: hasFailures && isCompleted 
                                ? "warning.main" 
                                : isCompleted 
                                    ? "success.main" 
                                    : "primary.main",
                        },
                    }}
                />
            </Box>

            {/* Action Buttons */}
            {(inProgressCount > 0 || hasFailures) && (
                <Box sx={{ px: 2, pb: 1 }}>
                    <Stack direction="row" spacing={1}>
                        {inProgressCount > 0 && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancelAll}
                                color="error"
                            >
                                Cancel All
                            </Button>
                        )}
                        {hasFailures && isCompleted && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRetryFailed}
                                color="primary"
                            >
                                Retry Failed
                            </Button>
                        )}
                    </Stack>
                </Box>
            )}

            <Divider />

            {/* File List */}
            <Collapse in={expanded}>
                <Box
                    sx={{
                        maxHeight: 300,
                        overflow: "auto",
                    }}
                >
                    <List dense sx={{ p: 0 }}>
                        {filesArray.map(([fileKey, fileState]) => (
                            <UploadItem
                                key={fileKey}
                                fileKey={fileKey}
                                fileState={fileState}
                            />
                        ))}
                    </List>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default UploadList;
