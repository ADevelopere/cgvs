"use client";

import React, { useCallback } from "react";
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
    FilterList as FilterIcon,
    Sort as SortIcon,
} from "@mui/icons-material";
import { useStorageManagement } from "@/contexts/storage/StorageManagementContext";
import * as Graphql from "@/graphql/generated/types";
import { useNotifications } from "@toolpad/core/useNotifications";
import SearchBar from "./SearchBar";
import { useStorageLocation } from "@/contexts/storage/useStorageLocation";
import useAppTranslation from "@/locale/useAppTranslation";

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
    const translations = useAppTranslation("storageTranslations");

    const { canUpload } = useStorageLocation();

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0) {
                startUpload(files)
                    .then(() => {
                        notifications.show(
                            translations.uploadStartedSuccessfully,
                            {
                                severity: "success",
                                autoHideDuration: 3000,
                            },
                        );
                    })
                    .catch(() => {
                        notifications.show(translations.failedToStartUpload, {
                            severity: "error",
                            autoHideDuration: 3000,
                        });
                    });
            }
            // Reset input
            event.target.value = "";
        },
        [startUpload, notifications, translations],
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
        { value: "", label: translations.allFiles },
        { value: "IMAGE", label: translations.images },
        { value: "DOCUMENT", label: translations.documents },
        { value: "VIDEO", label: translations.videos },
        { value: "AUDIO", label: translations.audio },
        { value: "ARCHIVE", label: translations.archives },
        { value: "OTHER", label: translations.other },
    ];

    const sortOptions = [
        { value: "", label: translations.default },
        { value: "NAME", label: translations.name },
        { value: "SIZE", label: translations.size },
        { value: "MODIFIED", label: translations.modifiedDate },
        { value: "TYPE", label: translations.fileType },
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
                    placeholder={translations.searchFilesAndFolders}
                />
            </Box>

            {/* Filters and Sort */}
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="file-type-filter-label">
                        <FilterIcon sx={{ mr: 1, fontSize: 16 }} />
                        {translations.filter}
                    </InputLabel>
                    <Select
                        labelId="file-type-filter-label"
                        value={params.fileType || ""}
                        onChange={handleFilterChange}
                        label={translations.filter}
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
                        {translations.sort}
                    </InputLabel>
                    <Select
                        labelId="sort-field-label"
                        value={params.sortField || ""}
                        onChange={handleSortChange}
                        label={translations.sort}
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
                            ? translations.uploadToLocation
                            : translations.navigateToLocationToUpload
                    }
                >
                    {translations.uploadFiles}
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
                            label={translations.selected.replace(
                                "{count}",
                                String(selectedPaths.length),
                            )}
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
                            {translations.activeFilters}
                        </Typography>
                        {params.fileType && (
                            <Chip
                                label={translations.typeFilter.replace(
                                    "{fileType}",
                                    params.fileType,
                                )}
                                size="small"
                                onDelete={() => setFilterType(undefined)}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {params.searchTerm && (
                            <Chip
                                label={translations.searchFilter.replace(
                                    "{searchTerm}",
                                    params.searchTerm,
                                )}
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
