import React, { useState } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    SelectChangeEvent,
} from "@mui/material";
import {
    Clear as ClearIcon,
    FilterList as FilterListIcon,
    CalendarToday as CalendarIcon,
    Category as CategoryIcon,
} from "@mui/icons-material";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import useAppTranslation from "@/locale/useAppTranslation";
import * as Graphql from "@/graphql/generated/types";

// Type-safe file type mapping
const FILE_TYPE: Record<Graphql.FileType, Graphql.FileType> = {
    ARCHIVE: "ARCHIVE",
    AUDIO: "AUDIO",
    DOCUMENT: "DOCUMENT",
    IMAGE: "IMAGE",
    OTHER: "OTHER",
    VIDEO: "VIDEO",
};

/**
 * Filter controls component for the storage browser.
 * Displays type and date filters when no items are selected.
 * Updates URL query parameters to trigger data re-fetch.
 */
const StorageFilters: React.FC = () => {
    const { params, setFilterType, setParams } = useStorageManagementUI();
    const { ui: translations } = useAppTranslation("storageTranslations");

    // Local state for date filter (not in URL params yet, but can be extended)
    const [dateFilter, setDateFilter] = useState<string>("");

    // File type options mapping (use string literals, not Graphql.FileType)
    const fileTypeOptions = React.useMemo(
        () => [
            { value: "", label: translations.allTypes },
            { value: FILE_TYPE.ARCHIVE, label: translations.archives },
            { value: FILE_TYPE.AUDIO, label: translations.audio },
            { value: FILE_TYPE.DOCUMENT, label: translations.documents },
            { value: FILE_TYPE.IMAGE, label: translations.photos },
            { value: FILE_TYPE.OTHER, label: translations.otherTypes },
            { value: FILE_TYPE.VIDEO, label: translations.videos },
        ],
        [
            translations.allTypes,
            translations.archives,
            translations.audio,
            translations.documents,
            translations.otherTypes,
            translations.photos,
            translations.videos,
        ],
    );

    // Date filter options
    const dateFilterOptions = React.useMemo(
        () => [
            { value: "", label: translations.allDates || "All dates" },
            { value: "today", label: translations.today || "Today" },
            {
                value: "last7days",
                label: translations.last7Days || "Last 7 days",
            },
            {
                value: "last30days",
                label: translations.last30Days || "Last 30 days",
            },
            { value: "thisYear", label: translations.thisYear || "This year" },
            { value: "lastYear", label: translations.lastYear || "Last year" },
            {
                value: "custom",
                label: translations.customDateRange || "Custom date range",
            },
        ],
        [
            translations.allDates,
            translations.customDateRange,
            translations.last30Days,
            translations.last7Days,
            translations.lastYear,
            translations.thisYear,
            translations.today,
        ],
    );

    // Handle file type filter change
    const handleFileTypeChange = React.useCallback(
        (event: SelectChangeEvent<string>) => {
            const value = event.target.value;
            const fileType = value ? (value as Graphql.FileType) : undefined;
            setFilterType(fileType);
        },
        [setFilterType],
    );

    // Handle date filter change
    const handleDateFilterChange = React.useCallback(
        (event: SelectChangeEvent<string>) => {
            const value = event.target.value;
            setDateFilter(value);

            // For now, we're not implementing date filtering in the backend,
            // but this is where you would update the query params with date range
            // setParams({ dateFilter: value, offset: 0 });
        },
        [],
    );
    // Clear all filters
    const handleClearFilters = React.useCallback(() => {
        setFilterType(undefined);
        setDateFilter("");
        // Clear any other filters from params
        setParams({
            fileType: undefined,
            searchTerm: undefined,
            offset: 0,
        });
    }, [setFilterType, setParams]);

    // Check if any filters are active
    const hasActiveFilters = params.fileType || dateFilter || params.searchTerm;

    // Get active filter chips
    const getActiveFilterChips = React.useCallback(() => {
        const chips: Array<{ label: string; onDelete: () => void }> = [];

        // File type filter chip
        if (params.fileType) {
            const fileTypeOption = fileTypeOptions.find(
                (option) => option.value === params.fileType,
            );
            if (fileTypeOption) {
                chips.push({
                    label: `${translations.filterByType}: ${fileTypeOption.label}`,
                    onDelete: () => setFilterType(undefined),
                });
            }
        }

        // Date filter chip
        if (dateFilter) {
            const dateOption = dateFilterOptions.find(
                (option) => option.value === dateFilter,
            );
            if (dateOption) {
                chips.push({
                    label: `${translations.filterByDate}: ${dateOption.label}`,
                    onDelete: () => setDateFilter(""),
                });
            }
        }

        // Search term chip
        if (params.searchTerm) {
            chips.push({
                label: `${translations.searchTerm || "Search"}: ${params.searchTerm}`,
                onDelete: () => setParams({ searchTerm: undefined, offset: 0 }),
            });
        }

        return chips;
    }, [
        dateFilter,
        dateFilterOptions,
        fileTypeOptions,
        params.fileType,
        params.searchTerm,
        setFilterType,
        setParams,
        translations.filterByDate,
        translations.filterByType,
        translations.searchTerm,
    ]);

    const activeFilterChips = getActiveFilterChips();

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}
        >
            {/* Filter Controls Row */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: hasActiveFilters ? 2 : 0 }}
            >
                {/* Filter Icon and Label */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterListIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        {translations.filters || "Filters"}:
                    </Typography>
                </Box>

                {/* File Type Filter */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="file-type-filter-label">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <CategoryIcon fontSize="small" />
                            {translations.filterByType}
                        </Box>
                    </InputLabel>
                    <Select
                        labelId="file-type-filter-label"
                        value={params.fileType || ""}
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <CategoryIcon fontSize="small" />
                                {translations.filterByType}
                            </Box>
                        }
                        onChange={handleFileTypeChange}
                    >
                        {fileTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Date Filter */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="date-filter-label">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <CalendarIcon fontSize="small" />
                            {translations.filterByDate}
                        </Box>
                    </InputLabel>
                    <Select
                        labelId="date-filter-label"
                        value={dateFilter}
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <CalendarIcon fontSize="small" />
                                {translations.filterByDate}
                            </Box>
                        }
                        onChange={handleDateFilterChange}
                    >
                        {dateFilterOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Tooltip title={translations.clearFilters}>
                        <IconButton
                            size="small"
                            onClick={handleClearFilters}
                            sx={{
                                color: "text.secondary",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>

            {/* Active Filter Chips */}
            {activeFilterChips.length > 0 && (
                <Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block" }}
                    >
                        {translations.activeFilters || "Active filters"}:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {activeFilterChips.map((chip, index) => (
                            <Chip
                                key={chip.label + "-" + index}
                                label={chip.label}
                                onDelete={chip.onDelete}
                                size="small"
                                variant="outlined"
                                sx={{
                                    "& .MuiChip-deleteIcon": {
                                        fontSize: "0.875rem",
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default StorageFilters;
