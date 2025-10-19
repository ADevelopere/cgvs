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
  alpha,
  useTheme,
} from "@mui/material";
import {
  GridView as GridViewIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import { useStorageUIStore } from "@/client/views/storage/stores/useStorageUIStore";
import { useStorageDataStore } from "@/client/views/storage/stores/useStorageDataStore";
import { useStorageSelection } from "@/client/views/storage/hooks/useStorageSelection";
import { useStorageSorting } from "@/client/views/storage/hooks/useStorageSorting";
import { useStorageNavigation } from "@/client/views/storage/hooks/useStorageNavigation";
import { useAppTranslation } from "@/client/locale";
import StorageItem from "./StorageItem";
import ViewAreaMenu from "../menu/ViewAreaMenu";
import { useUploadDropzone } from "@/client/views/storage/dropzone/useUploadDropzone";
import { StorageManagementUITranslations } from "@/client/locale/components/Storage";
import {
  StorageItem as StorageItemType,
  ViewMode,
} from "@/client/views/storage/hooks/storage.type";
import { FilesListInput } from "@/client/graphql/generated/gql/graphql";

// Render toolbar with view controls and sorting
const StorageToolbar: React.FC<{
  searchMode: boolean;
  viewMode: "grid" | "list";
  currentItems: StorageItemType[];
  sortBy: string;
  sortDirection: "ASC" | "DESC";
  translations: StorageManagementUITranslations;
  params: FilesListInput;
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
                    <MenuItem key={option.value} value={option.value}>
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
                <ToggleButton value="ASC" aria-label={translations.ascending}>
                  <SortIcon sx={{ transform: "rotate(0deg)" }} />
                </ToggleButton>
                <ToggleButton value="DESC" aria-label={translations.descending}>
                  <SortIcon sx={{ transform: "rotate(180deg)" }} />
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
            <ToggleButton value="grid" aria-label={translations.gridView}>
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label={translations.listView}>
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
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
}> = ({
  sortBy,
  sortDirection,
  translations,
  currentItems,
  setSortBy,
  setSortDirection,
  onContextMenu,
  onClick,
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
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
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
                {translations.createdAt}
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
    </Box>
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
        {searchMode ? translations.noSearchResults : translations.emptyFolder}
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
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
}> = ({ currentItems, onContextMenu, onClick }) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
        {currentItems.map((item) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }} key={item.path}>
            <StorageItem item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

/**
 * Main items display area for the storage browser.
 * Handles view mode switching, local sorting, and rendering of items.
 * Supports both grid and list views with client-side sorting.
 */
const StorageItemsView: React.FC = () => {
  const { searchMode, viewMode, setViewMode, loading, operationErrors } =
    useStorageUIStore();
  const { params } = useStorageDataStore();
  const {
    selectedItems,
    focusedItem,
    setFocusedItem,
    toggleSelect,
    selectRange,
    clearSelection,
    selectAll,
    lastSelectedItem,
  } = useStorageSelection();
  const { getSortedItems, sortBy, sortDirection, setSortBy, setSortDirection } =
    useStorageSorting();
  const { navigateTo, refresh } = useStorageNavigation();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const theme = useTheme();

  // Context menu state
  const [viewAreaMenuAnchor, setViewAreaMenuAnchor] =
    React.useState<HTMLElement | null>(null);
  const [viewAreaMenuPosition, setViewAreaMenuPosition] = React.useState<
    | {
        top: number;
        left: number;
      }
    | undefined
  >(undefined);
  const [viewAreaMenuOpen, setViewAreaMenuOpen] = React.useState(false);

  // Global context menu management to close all menus when a new one opens
  React.useEffect(() => {
    const handleGlobalContextMenu = () => {
      // Close all existing context menus when a new context menu is about to open
      setViewAreaMenuOpen(false);
      setViewAreaMenuPosition(undefined);
      setViewAreaMenuAnchor(null);
    };

    // Listen for context menu events globally
    document.addEventListener("contextmenu", handleGlobalContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
    };
  }, []);

  // Get current items (search results or regular directory listing)
  const currentItems = getSortedItems();

  const isLoading = React.useMemo(() => {
    return loading.fetchList || loading.search;
  }, [loading.fetchList, loading.search]);

  const hasError = React.useMemo(() => {
    return operationErrors.fetchList || operationErrors.search;
  }, [operationErrors.fetchList, operationErrors.search]);

  // Add dropzone functionality for the main view area
  const { getRootProps, getInputProps, isDragActive } = useUploadDropzone({
    uploadPath: params.path,
    disabled: isLoading,
    onUploadComplete: () => {
      refresh();
    },
  });

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (currentItems.length === 0) return;

      const currentFocusedIndex = focusedItem
        ? currentItems.findIndex((item) => item.path === focusedItem)
        : -1;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = Math.min(
            currentFocusedIndex + 1,
            currentItems.length - 1,
          );
          if (nextIndex !== currentFocusedIndex) {
            setFocusedItem(currentItems[nextIndex].path);
            if (event.shiftKey && lastSelectedItem) {
              selectRange(lastSelectedItem, currentItems[nextIndex].path);
            }
          }
          break;
        }

        case "ArrowUp": {
          event.preventDefault();
          const prevIndex = Math.max(currentFocusedIndex - 1, 0);
          if (prevIndex !== currentFocusedIndex) {
            setFocusedItem(currentItems[prevIndex].path);
            if (event.shiftKey && lastSelectedItem) {
              selectRange(lastSelectedItem, currentItems[prevIndex].path);
            }
          }
          break;
        }

        case "Home":
          event.preventDefault();
          setFocusedItem(currentItems[0].path);
          if (event.shiftKey && lastSelectedItem) {
            selectRange(lastSelectedItem, currentItems[0].path);
          }
          break;

        case "End":
          event.preventDefault();
          setFocusedItem(currentItems[currentItems.length - 1].path);
          if (event.shiftKey && lastSelectedItem) {
            selectRange(
              lastSelectedItem,
              currentItems[currentItems.length - 1].path,
            );
          }
          break;

        case "Enter":
          event.preventDefault();
          if (focusedItem) {
            const item = currentItems.find((item) => item.path === focusedItem);
            if (item && item.__typename === "DirectoryInfo") {
              navigateTo(item.path);
            }
          }
          break;

        case " ":
          event.preventDefault();
          if (focusedItem) {
            if (event.ctrlKey) {
              toggleSelect(focusedItem);
            } else {
              clearSelection();
              toggleSelect(focusedItem);
            }
          }
          break;

        case "a":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            selectAll();
          }
          break;

        case "Delete":
          if (selectedItems.length > 0) {
            event.preventDefault();
            // Delete functionality will be handled by delete key
            // For now, just prevent default
          }
          break;
      }
    },
    [
      currentItems,
      focusedItem,
      setFocusedItem,
      lastSelectedItem,
      selectRange,
      navigateTo,
      toggleSelect,
      clearSelection,
      selectAll,
      selectedItems.length,
    ],
  );

  const handleCloseViewAreaMenu = React.useCallback(() => {
    setViewAreaMenuOpen(false);
    setViewAreaMenuPosition(undefined);
    setViewAreaMenuAnchor(null);
  }, []);

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle click on view area (empty space) to deselect items
  const handleViewAreaClick = React.useCallback(
    (event: React.MouseEvent) => {
      // Only deselect if clicking on empty area (not on items)
      const target = event.target as HTMLElement;
      const isEmptyArea =
        target.closest("[data-storage-item]") === null &&
        target.closest(".storage-item") === null;
      if (isEmptyArea && selectedItems.length > 0) {
        clearSelection();
      }
    },
    [clearSelection, selectedItems],
  );

  // Handle context menu for view area (right-click on empty space)
  const handleViewAreaContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      // Only show context menu if clicking on empty area (not on items)
      const target = event.target as HTMLElement;
      const isEmptyArea =
        target.closest("[data-storage-item]") === null &&
        target.closest(".storage-item") === null;

      if (isEmptyArea) {
        event.preventDefault();

        // Close any existing context menus first
        handleCloseViewAreaMenu();

        // Small delay to ensure previous menu is closed
        setTimeout(() => {
          setViewAreaMenuPosition({
            top: event.clientY,
            left: event.clientX,
          });
          setViewAreaMenuOpen(true);
        }, 0);
      }
    },
    [handleCloseViewAreaMenu],
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
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
      <Box
        {...getRootProps()}
        sx={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          border: isDragActive
            ? `2px dashed ${theme.palette.primary.main}`
            : "2px solid transparent",
          backgroundColor: isDragActive
            ? alpha(theme.palette.primary.main, 0.05)
            : "transparent",
          transition: "border-color 0.2s ease, background-color 0.2s ease",
        }}
        onContextMenu={handleViewAreaContextMenu}
        onClick={handleViewAreaClick}
      >
        <input {...getInputProps()} />
        {isLoading && (
          <LoadingStates searchMode={searchMode} translations={translations} />
        )}
        {!isLoading && hasError && (
          <ErrorState hasError={hasError} translations={translations} />
        )}
        {!isLoading && !hasError && currentItems.length === 0 && (
          <EmptyState translations={translations} searchMode={searchMode} />
        )}
        {!isLoading && !hasError && currentItems.length > 0 && (
          <>
            {viewMode === "grid" && (
              <GridView
                currentItems={currentItems}
                onContextMenu={handleViewAreaContextMenu}
                onClick={handleViewAreaClick}
              />
            )}
            {viewMode === "list" && (
              <ListView
                sortBy={sortBy}
                sortDirection={sortDirection}
                translations={translations}
                currentItems={currentItems}
                setSortBy={setSortBy}
                setSortDirection={setSortDirection}
                onContextMenu={handleViewAreaContextMenu}
                onClick={handleViewAreaClick}
              />
            )}
          </>
        )}
      </Box>

      {/* View Area Context Menu */}
      <ViewAreaMenu
        anchorEl={viewAreaMenuAnchor}
        open={viewAreaMenuOpen}
        anchorPosition={viewAreaMenuPosition}
        onClose={handleCloseViewAreaMenu}
        onContextMenu={handleViewAreaContextMenu}
      />
    </Box>
  );
};

export default StorageItemsView;
