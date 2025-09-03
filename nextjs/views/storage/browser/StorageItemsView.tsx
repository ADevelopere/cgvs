import React from "react";
import {
    Alert,
    Box,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    GridView as GridViewIcon,
    Sort as SortIcon,
    ViewList as ListViewIcon,
} from "@mui/icons-material";
import { useStorageManagementUI } from "@/contexts/storage/StorageManagementUIContext";
import useAppTranslation from "@/locale/useAppTranslation";
import StorageItem from "./StorageItem";
import { StorageManagementUITranslations } from "@/locale/components/Storage";
import {
    StorageItem as StorageItemType,
    StorageQueryParams,
    ViewMode,
} from "@/contexts/storage/storage.type";

// Render toolbar with view controls and sorting
const StorageToolbar: React.FC<{
    searchMode: boolean;
    viewMode: "grid" | "list";
    currentItems: StorageItemType[];
    sortBy: string;
    sortDirection: "ASC" | "DESC";
    translations: StorageManagementUITranslations;
    params: StorageQueryParams;
    setViewMode: (mode: ViewMode) => void;
    setSortBy: (field: string) => void;
    setSortDirection: (direction: "ASC" | "DESC") => void;
}> = ({
    searchMode,
    viewMode,
    currentItems,
    sortBy,
    sortDirection,
    translations,
    params,
    setViewMode,
    setSortBy,
    setSortDirection,
}) => {
    // Handle view mode change
    const handleViewModeChange = React.useCallback(
        (
            _event: React.MouseEvent<HTMLElement>,
            newViewMode: "grid" | "list" | null,
        ) => {
            if (newViewMode !== null) {
                setViewMode(newViewMode);
            }
        },
        [setViewMode],
    );

    // Handle sort field change (for grid view)
    const handleSortFieldChange = React.useCallback(
        (event: SelectChangeEvent<string>) => {
            setSortBy(event.target.value);
        },
        [setSortBy],
    );

    // Handle sort direction change
    const handleSortDirectionChange = React.useCallback(() => {
        setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    }, [setSortDirection, sortDirection]);

    // Sort field options for grid view
    const sortFieldOptions = React.useMemo(
        () => [
            { value: "name", label: translations.sortByName },
            { value: "size", label: translations.sortBySize },
            { value: "lastModified", label: translations.sortByLastModified },
            { value: "created", label: translations.sortByCreated },
            { value: "type", label: translations.sortByType },
        ],
        [
            translations.sortByCreated,
            translations.sortByLastModified,
            translations.sortByName,
            translations.sortBySize,
            translations.sortByType,
        ],
    );

    return (
        <Paper
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                borderRadius: 0,
            }}
        >
            <Toolbar
                variant="dense"
                sx={{ justifyContent: "space-between", minHeight: 48 }}
            >
                {/* Left side - Results info */}
                <Box>
                    {searchMode && (
                        <Typography variant="body2" color="text.secondary">
                            {translations.searchResults.replace(
                                "%{count}",
                                currentItems.length.toString(),
                            )}
                            {params.searchTerm && ` for "${params.searchTerm}"`}
                        </Typography>
                    )}
                    {!searchMode && (
                        <Typography variant="body2" color="text.secondary">
                            {currentItems.length}{" "}
                            {currentItems.length === 1
                                ? translations.item
                                : translations.items}
                        </Typography>
                    )}
                </Box>

                {/* Right side - View and sort controls */}
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Sort controls for grid view */}
                    {viewMode === "grid" && (
                        <>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>{translations.sortBy}</InputLabel>
                                <Select
                                    value={sortBy}
                                    label={translations.sortBy}
                                    onChange={handleSortFieldChange}
                                >
                                    {sortFieldOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <ToggleButtonGroup
                                value={sortDirection}
                                exclusive
                                onChange={handleSortDirectionChange}
                                size="small"
                            >
                                <ToggleButton
                                    value="ASC"
                                    aria-label={translations.ascending}
                                >
                                    <SortIcon
                                        sx={{ transform: "rotate(0deg)" }}
                                    />
                                </ToggleButton>
                                <ToggleButton
                                    value="DESC"
                                    aria-label={translations.descending}
                                >
                                    <SortIcon
                                        sx={{ transform: "rotate(180deg)" }}
                                    />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </>
                    )}

                    {/* View mode toggle */}
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        size="small"
                    >
                        <ToggleButton
                            value="grid"
                            aria-label={translations.gridView}
                        >
                            <GridViewIcon />
                        </ToggleButton>
                        <ToggleButton
                            value="list"
                            aria-label={translations.listView}
                        >
                            <ListViewIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Toolbar>
        </Paper>
    );
};

// function ListView(sortBy: string, sortDirection: "ASC" | "DESC", handleTableSort: (field: string) => void, translations: StorageManagementUITranslations, currentItems: StorageItemType[]) {
const ListView: React.FC<{
    sortBy: string;
    sortDirection: "ASC" | "DESC";
    translations: StorageManagementUITranslations;
    currentItems: StorageItemType[];
    setSortBy: (field: string) => void;
    setSortDirection: (direction: "ASC" | "DESC") => void;
}> = ({
    sortBy,
    sortDirection,
    translations,
    currentItems,
    setSortBy,
    setSortDirection,
}) => {
    // Handle table header click (for list view)
    const handleTableSort = React.useCallback(
        (field: string) => {
            if (sortBy === field) {
                // Same field, toggle direction
                setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
            } else {
                // New field, set ascending
                setSortBy(field);
                setSortDirection("ASC");
            }
        },
        [setSortBy, setSortDirection, sortBy, sortDirection],
    );
    return (
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ width: "40%" }}>
                        <TableSortLabel
                            active={sortBy === "name"}
                            direction={
                                sortBy === "name"
                                    ? sortDirection === "ASC"
                                        ? "asc"
                                        : "desc"
                                    : "asc"
                            }
                            onClick={() => handleTableSort("name")}
                        >
                            {translations.name}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                        <TableSortLabel
                            active={sortBy === "size"}
                            direction={
                                sortBy === "size"
                                    ? sortDirection === "ASC"
                                        ? "asc"
                                        : "desc"
                                    : "asc"
                            }
                            onClick={() => handleTableSort("size")}
                        >
                            {translations.size}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                        <TableSortLabel
                            active={sortBy === "lastModified"}
                            direction={
                                sortBy === "lastModified"
                                    ? sortDirection === "ASC"
                                        ? "asc"
                                        : "desc"
                                    : "asc"
                            }
                            onClick={() => handleTableSort("lastModified")}
                        >
                            {translations.lastModified}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                        <TableSortLabel
                            active={sortBy === "created"}
                            direction={
                                sortBy === "created"
                                    ? sortDirection === "ASC"
                                        ? "asc"
                                        : "desc"
                                    : "asc"
                            }
                            onClick={() => handleTableSort("created")}
                        >
                            {translations.created}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: "5%" }}>
                        {/* Actions column - no sorting */}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {currentItems.map((item) => (
                    <StorageItem key={item.path} item={item} />
                ))}
            </TableBody>
        </Table>
    );
};

const ErrorState: React.FC<{
    hasError: string | undefined;
    translations: StorageManagementUITranslations;
}> = ({ hasError, translations }) => {
    return (
        <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
                <button onClick={() => window.location.reload()}>
                    {translations.retry}
                </button>
            }
        >
            {hasError}
        </Alert>
    );
};

const LoadingStates: React.FC<{
    searchMode: boolean;
    translations: StorageManagementUITranslations;
}> = ({ searchMode, translations }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
                {searchMode ? translations.searching : translations.loading}
            </Typography>
        </Box>
    );
};

const EmptyState: React.FC<{
    translations: StorageManagementUITranslations;
    searchMode: boolean;
}> = ({ translations, searchMode }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                textAlign: "center",
                color: "text.secondary",
            }}
        >
            <Typography variant="h6" gutterBottom>
                {searchMode
                    ? translations.noSearchResults
                    : translations.emptyFolder}
            </Typography>
            <Typography variant="body2">
                {searchMode
                    ? translations.tryDifferentSearch
                    : translations.uploadOrCreate}
            </Typography>
        </Box>
    );
};

const GridView: React.FC<{
    currentItems: StorageItemType[];
}> = ({ currentItems }) => {
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {currentItems.map((item) => (
                <Grid
                    size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}
                    key={item.path}
                >
                    <StorageItem item={item} />
                </Grid>
            ))}
        </Grid>
    );
};

/**
 * Main items display area for the storage browser.
 * Handles view mode switching, local sorting, and rendering of items.
 * Supports both grid and list views with client-side sorting.
 */
const StorageItemsView: React.FC = () => {
    const {
        // items, // unused
        // searchResults, // unused
        searchMode,
        viewMode,
        setViewMode,
        sortBy,
        sortDirection,
        setSortBy,
        setSortDirection,
        getSortedItems,
        loading,
        operationErrors,
        params,
    } = useStorageManagementUI();
    const { ui: translations } = useAppTranslation("storageTranslations");

    // Get current items (search results or regular directory listing)
    const currentItems = getSortedItems();

    const isLoading = React.useMemo(() => {
        return loading.fetchList || loading.search;
    }, [loading.fetchList, loading.search]);

    const hasError = React.useMemo(() => {
        return operationErrors.fetchList || operationErrors.search;
    }, [operationErrors.fetchList, operationErrors.search]);

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Toolbar */}
            <StorageToolbar
                searchMode={searchMode}
                viewMode={viewMode}
                currentItems={currentItems}
                sortBy={sortBy}
                sortDirection={sortDirection}
                translations={translations}
                params={params}
                setViewMode={setViewMode}
                setSortBy={setSortBy}
                setSortDirection={setSortDirection}
            />

            {/* Content Area */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
                {isLoading && (
                    <LoadingStates
                        searchMode={searchMode}
                        translations={translations}
                    />
                )}
                {!isLoading && hasError && (
                    <ErrorState
                        hasError={hasError}
                        translations={translations}
                    />
                )}
                {!isLoading && !hasError && currentItems.length === 0 && (
                    <EmptyState
                        translations={translations}
                        searchMode={searchMode}
                    />
                )}
                {!isLoading && !hasError && currentItems.length > 0 && (
                    <>
                        {viewMode === "grid" && (
                            <GridView currentItems={currentItems} />
                        )}
                        {viewMode === "list" && (
                            <ListView
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                translations={translations}
                                currentItems={currentItems}
                                setSortBy={setSortBy}
                                setSortDirection={setSortDirection}
                            />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default StorageItemsView;
