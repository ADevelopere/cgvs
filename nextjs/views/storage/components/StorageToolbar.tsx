"use client";

import React, { useState, useCallback } from "react";
import {
    Box,
    Toolbar,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Badge,
    Stack,
    Chip,
    useTheme,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Sort as SortIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import * as Graphql from "@/graphql/generated/types";
import { useNotifications } from "@toolpad/core/useNotifications";
import SearchBar from "./SearchBar";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";

const StorageToolbar: React.FC = () => {
    const theme = useTheme();
    const notifications = useNotifications();
    const {
        params,
        selectedPaths,
        setFilterType,
        setSortField,
        search,
        startUpload,
    } = useStorageManagement();
    
    const { canUpload } = useStorageLocation();

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0) {
                startUpload(files)
                    .then(() => {
                        notifications.show("Upload started successfully", {
                            severity: "success",
                            autoHideDuration: 3000,
                        });
                    })
                    .catch(() => {
                        notifications.show("Failed to start upload", {
                            severity: "error",
                            autoHideDuration: 3000,
                        });
                    });
            }
            // Reset input
            event.target.value = "";
        },
        [startUpload, notifications],
    );

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setFilterType(value === "" ? undefined : (value as Graphql.FileType));
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSortField(
            value === "" ? undefined : (value as Graphql.FileSortField),
        );
    };

    const fileTypeOptions = [
        { value: "", label: "All Files" },
        { value: "IMAGE", label: "Images" },
        { value: "DOCUMENT", label: "Documents" },
        { value: "VIDEO", label: "Videos" },
        { value: "AUDIO", label: "Audio" },
        { value: "ARCHIVE", label: "Archives" },
        { value: "OTHER", label: "Other" },
    ];

    const sortOptions = [
        { value: "", label: "Default" },
        { value: "NAME", label: "Name" },
        { value: "SIZE", label: "Size" },
        { value: "MODIFIED", label: "Modified Date" },
        { value: "TYPE", label: "File Type" },
    ];

    return (
        <Toolbar
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                gap: 2,
                flexWrap: "wrap",
                minHeight: "64px !important",
                paddingX: 2,
            }}
        >
            {/* Search Bar */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
                <SearchBar
                    value={params.searchTerm || ""}
                    onChange={search}
                    placeholder="Search files and folders..."
                />
            </Box>

            {/* Filters and Sort */}
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="file-type-filter-label">
                        <FilterIcon sx={{ mr: 1, fontSize: 16 }} />
                        Filter
                    </InputLabel>
                    <Select
                        labelId="file-type-filter-label"
                        value={params.fileType || ""}
                        onChange={handleFilterChange}
                        label="Filter"
                    >
                        {fileTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-field-label">
                        <SortIcon sx={{ mr: 1, fontSize: 16 }} />
                        Sort
                    </InputLabel>
                    <Select
                        labelId="sort-field-label"
                        value={params.sortField || ""}
                        onChange={handleSortChange}
                        label="Sort"
                    >
                        {sortOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Upload Button */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UploadIcon />}
                    component="label"
                    sx={{ whiteSpace: "nowrap" }}
                    disabled={!canUpload}
                    title={
                        canUpload 
                            ? "Upload files to this location" 
                            : "Navigate to a storage location to upload files"
                    }
                >
                    Upload Files
                    <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileUpload}
                        disabled={!canUpload}
                    />
                </Button>

                {/* Selection Summary */}
                {selectedPaths.length > 0 && (
                    <Badge badgeContent={selectedPaths.length} color="primary">
                        <Chip
                            label={`${selectedPaths.length} selected`}
                            variant="outlined"
                            color="primary"
                            size="small"
                        />
                    </Badge>
                )}
            </Stack>

            {/* Active Filters Display */}
            {(params.fileType || params.searchTerm) && (
                <Box sx={{ width: "100%", mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                            Active filters:
                        </Typography>
                        {params.fileType && (
                            <Chip
                                label={`Type: ${params.fileType}`}
                                size="small"
                                onDelete={() => setFilterType(undefined)}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {params.searchTerm && (
                            <Chip
                                label={`Search: "${params.searchTerm}"`}
                                size="small"
                                onDelete={() => search("")}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Stack>
                </Box>
            )}
        </Toolbar>
    );
};

export default StorageToolbar;
