"use client";

import React, { useEffect } from "react";
import {
    Box,
    Grid,
    List,
    Typography,
    Alert,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
    Paper,
    Stack,
    Divider,
} from "@mui/material";
import {
    ViewModule as GridViewIcon,
    ViewList as ListViewIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useFileSelector } from "@/contexts/storage/FileSelectorContext";
import LocationSelector from "./LocationSelector";
import UploadDropzone from "../upload/UploadDropzone";
import FileSelectItem from "./FileSelectItem";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";

export interface FileSelectorProps {
    location?: Graphql.UploadLocation;
    multiple?: boolean;
    allowUpload?: boolean;
    maxSelection?: number;
    disabled?: boolean;
    viewMode?: "grid" | "list";
    onViewModeChange?: (mode: "grid" | "list") => void;
    compact?: boolean;
    showLocationSelector?: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({
    multiple = false,
    allowUpload = true,
    maxSelection,
    disabled = false,
    viewMode = "grid",
    onViewModeChange,
    compact = false,
    location: propLocation,
    showLocationSelector = true,
}) => {
    const {
        location,
        setLocation,
        files,
        loading,
        error,
        selectedFiles,
        setSelectedFiles,
        clearSelection,
        refreshFiles,
        isFileProhibited,
    } = useFileSelector();
    const translations = useAppTranslation("storageTranslations");

    // Sync location from props to context
    useEffect(() => {
        if (
            propLocation &&
            JSON.stringify(propLocation) !== JSON.stringify(location)
        ) {
            setLocation(propLocation);
        }
    }, [propLocation, setLocation, location]);

    const handleLocationChange = (newLocation: Graphql.UploadLocation) => {
        setLocation(newLocation);
        clearSelection();
    };

    const handleFileToggle = (file: Graphql.FileInfo) => {
        if (disabled || isFileProhibited(file)) return;

        const isSelected = selectedFiles.some((f) => f.path === file.path);

        if (multiple) {
            if (isSelected) {
                const newSelection = selectedFiles.filter(
                    (f) => f.path !== file.path,
                );
                setSelectedFiles(newSelection);
            } else if (!maxSelection || selectedFiles.length < maxSelection) {
                const newSelection = [...selectedFiles, file];
                setSelectedFiles(newSelection);
            }
        } else {
            const newSelection = isSelected ? [] : [file];
            setSelectedFiles(newSelection);
        }
    };

    const handleViewModeChange = (event: SelectChangeEvent<string>) => {
        const newMode = event.target.value as "grid" | "list";
        onViewModeChange?.(newMode);
    };

    const handleSelectAll = () => {
        if (disabled) return;
        const limitedFiles = maxSelection
            ? files.slice(0, maxSelection)
            : files;
        setSelectedFiles(limitedFiles);
    };

    const canSelectMore = !maxSelection || selectedFiles.length < maxSelection;
    const selectionLimitReached =
        !!maxSelection && selectedFiles.length >= maxSelection;

    return (
        <Box>
            {/* Location Selector */}
            {showLocationSelector && (
                <Box sx={{ mb: 3 }}>
                    <LocationSelector
                        value={location}
                        onChange={handleLocationChange}
                        disabled={disabled}
                    />
                </Box>
            )}

            {/* Upload Area */}
            {allowUpload && location && (
                <UploadDropzone disabled={disabled} compact={compact} />
            )}

            {/* Selection Info & Controls */}
            {location && (
                <Box sx={{ mb: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {multiple
                                        ? `${selectedFiles.length} ${translations.filesSelected}`
                                        : selectedFiles.length > 0
                                          ? `1 ${translations.fileSelected}`
                                          : translations.noFileSelected}
                                    {maxSelection &&
                                        ` (${translations.max} ${maxSelection})`}
                                </Typography>
                                {selectionLimitReached && (
                                    <Typography
                                        variant="caption"
                                        color="warning.main"
                                    >
                                        {translations.selectionLimitReached}
                                    </Typography>
                                )}
                            </Box>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                {multiple && files.length > 0 && (
                                    <>
                                        <Button
                                            size="small"
                                            onClick={handleSelectAll}
                                            disabled={
                                                disabled || !canSelectMore
                                            }
                                        >
                                            {translations.selectAll}
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={clearSelection}
                                            disabled={
                                                disabled ||
                                                selectedFiles.length === 0
                                            }
                                        >
                                            {translations.clearSelection}
                                        </Button>
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    </>
                                )}

                                <Button
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={refreshFiles}
                                    disabled={disabled || loading}
                                >
                                    {translations.refresh}
                                </Button>

                                {onViewModeChange && (
                                    <FormControl
                                        size="small"
                                        sx={{ minWidth: 100 }}
                                    >
                                        <InputLabel>
                                            {translations.view}
                                        </InputLabel>
                                        <Select
                                            value={viewMode}
                                            label={translations.view}
                                            onChange={handleViewModeChange}
                                            disabled={disabled}
                                        >
                                            <MenuItem value="grid">
                                                <GridViewIcon
                                                    sx={{ mr: 1, fontSize: 16 }}
                                                />
                                                {translations.grid}
                                            </MenuItem>
                                            <MenuItem value="list">
                                                <ListViewIcon
                                                    sx={{ mr: 1, fontSize: 16 }}
                                                />
                                                {translations.list}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            )}

            {/* Error Display */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* No Location Selected */}
            {!location && !loading && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        {translations.selectLocationToViewFiles}
                    </Typography>
                </Box>
            )}

            {/* Files Display */}
            {location && !loading && (
                <>
                    {files.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                {translations.noFilesInLocation}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {viewMode === "grid" ? (
                                <Grid container spacing={2}>
                                    {files.map((file) => {
                                        const isSelected = selectedFiles.some(
                                            (f) => f.path === file.path,
                                        );
                                        const isProhibited = isFileProhibited(file);
                                        return (
                                            <Grid
                                                key={file.path}
                                                size={{
                                                    xs: 12,
                                                    sm: 6,
                                                    md: 4,
                                                    lg: 3,
                                                }}
                                            >
                                                <FileSelectItem
                                                    file={file}
                                                    selected={isSelected}
                                                    onToggleSelect={() =>
                                                        handleFileToggle(file)
                                                    }
                                                    viewMode="grid"
                                                    disabled={
                                                        disabled ||
                                                        isProhibited ||
                                                        (!isSelected &&
                                                            !canSelectMore)
                                                    }
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <List>
                                    {files.map((file) => {
                                        const isSelected = selectedFiles.some(
                                            (f) => f.path === file.path,
                                        );
                                        const isProhibited = isFileProhibited(file);
                                        return (
                                            <FileSelectItem
                                                key={file.path}
                                                file={file}
                                                selected={isSelected}
                                                onToggleSelect={() =>
                                                    handleFileToggle(file)
                                                }
                                                viewMode="list"
                                                disabled={
                                                    disabled ||
                                                    isProhibited ||
                                                    (!isSelected &&
                                                        !canSelectMore)
                                                }
                                            />
                                        );
                                    })}
                                </List>
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default FileSelector;
