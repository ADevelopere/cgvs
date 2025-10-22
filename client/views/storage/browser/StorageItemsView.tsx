import React from "react";
import * as MUI from "@mui/material";
import {
  GridView as GridViewIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import { useStorageSelection } from "@/client/views/storage/hooks/useStorageSelection";
import { useStorageSorting } from "@/client/views/storage/hooks/useStorageSorting";
import { useAppTranslation } from "@/client/locale";
import StorageItem from "./StorageItem";
import ViewAreaMenu from "../menu/ViewAreaMenu";
import { useUploadDropzone } from "@/client/views/storage/dropzone/useUploadDropzone";
import { StorageManagementUITranslations } from "@/client/locale/components/Storage";
import {
  StorageItem as StorageItemType,
  ViewMode,
  OperationErrors,
  StorageClipboardState,
} from "@/client/views/storage/core/storage.type";
import type { LoadingStates } from "@/client/views/storage/core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Render toolbar with view controls and sorting
const StorageToolbar: React.FC<{
  searchMode: boolean;
  viewMode: "grid" | "list";
  currentItems: StorageItemType[];
  sortBy: string;
  sortDirection: "ASC" | "DESC";
  translations: StorageManagementUITranslations;
  params: Graphql.FilesListInput;
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
      newViewMode: "grid" | "list" | null
    ) => {
      if (newViewMode !== null) {
        setViewMode(newViewMode);
      }
    },
    [setViewMode]
  );

  // Handle sort field change (for grid view)
  const handleSortFieldChange = React.useCallback(
    (event: MUI.SelectChangeEvent<string>) => {
      setSortBy(event.target.value);
    },
    [setSortBy]
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
    ]
  );

  return (
    <MUI.Paper
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        borderRadius: 0,
      }}
    >
      <MUI.Toolbar
        variant="dense"
        sx={{ justifyContent: "space-between", minHeight: 48 }}
      >
        {/* Left side - Results info */}
        <MUI.Box>
          {searchMode && (
            <MUI.Typography variant="body2" color="text.secondary">
              {translations.searchResults.replace(
                "%{count}",
                currentItems.length.toString()
              )}
              {params.searchTerm && ` for "${params.searchTerm}"`}
            </MUI.Typography>
          )}
          {!searchMode && (
            <MUI.Typography variant="body2" color="text.secondary">
              {currentItems.length}{" "}
              {currentItems.length === 1
                ? translations.item
                : translations.items}
            </MUI.Typography>
          )}
        </MUI.Box>

        {/* Right side - View and sort controls */}
        <MUI.Stack direction="row" spacing={2} alignItems="center">
          {/* Sort controls for grid view */}
          {viewMode === "grid" && (
            <>
              <MUI.FormControl size="small" sx={{ minWidth: 120 }}>
                <MUI.InputLabel>{translations.sortBy}</MUI.InputLabel>
                <MUI.Select
                  value={sortBy}
                  label={translations.sortBy}
                  onChange={handleSortFieldChange}
                >
                  {sortFieldOptions.map(option => (
                    <MUI.MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MUI.MenuItem>
                  ))}
                </MUI.Select>
              </MUI.FormControl>

              <MUI.ToggleButtonGroup
                value={sortDirection}
                exclusive
                onChange={handleSortDirectionChange}
                size="small"
              >
                <MUI.ToggleButton
                  value="ASC"
                  aria-label={translations.ascending}
                >
                  <SortIcon sx={{ transform: "rotate(0deg)" }} />
                </MUI.ToggleButton>
                <MUI.ToggleButton
                  value="DESC"
                  aria-label={translations.descending}
                >
                  <SortIcon sx={{ transform: "rotate(180deg)" }} />
                </MUI.ToggleButton>
              </MUI.ToggleButtonGroup>
            </>
          )}

          {/* View mode toggle */}
          <MUI.ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <MUI.ToggleButton value="grid" aria-label={translations.gridView}>
              <GridViewIcon />
            </MUI.ToggleButton>
            <MUI.ToggleButton value="list" aria-label={translations.listView}>
              <ListViewIcon />
            </MUI.ToggleButton>
          </MUI.ToggleButtonGroup>
        </MUI.Stack>
      </MUI.Toolbar>
    </MUI.Paper>
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
  viewMode: ViewMode;
  params: Graphql.FilesListInput;
  clipboard: StorageClipboardState | null;
  onNavigate: (
    path: string,
    currentParams: Graphql.FilesListInput
  ) => Promise<void>;
}> = ({
  sortBy,
  sortDirection,
  translations,
  currentItems,
  setSortBy,
  setSortDirection,
  onContextMenu,
  onClick,
  viewMode,
  params,
  clipboard,
  onNavigate,
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
    [setSortBy, setSortDirection, sortBy, sortDirection]
  );

  return (
    <MUI.Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <MUI.Table stickyHeader>
        <MUI.TableHead>
          <MUI.TableRow>
            <MUI.TableCell sx={{ width: "40%" }}>
              <MUI.TableSortLabel
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
              </MUI.TableSortLabel>
            </MUI.TableCell>
            <MUI.TableCell sx={{ width: "15%" }}>
              <MUI.TableSortLabel
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
              </MUI.TableSortLabel>
            </MUI.TableCell>
            <MUI.TableCell sx={{ width: "20%" }}>
              <MUI.TableSortLabel
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
              </MUI.TableSortLabel>
            </MUI.TableCell>
            <MUI.TableCell sx={{ width: "20%" }}>
              <MUI.TableSortLabel
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
              </MUI.TableSortLabel>
            </MUI.TableCell>
            <MUI.TableCell sx={{ width: "5%" }}>
              {/* Actions column - no sorting */}
            </MUI.TableCell>
          </MUI.TableRow>
        </MUI.TableHead>
        <MUI.TableBody>
          {currentItems.map(item => (
            <StorageItem
              key={item.path}
              item={item}
              viewMode={viewMode}
              params={params}
              onNavigate={onNavigate}
              clipboard={clipboard}
            />
          ))}
        </MUI.TableBody>
      </MUI.Table>
    </MUI.Box>
  );
};

const ErrorState: React.FC<{
  hasError: string | undefined;
  translations: StorageManagementUITranslations;
}> = ({ hasError, translations }) => {
  return (
    <MUI.Alert
      severity="error"
      sx={{ m: 2 }}
      action={
        <button onClick={() => window.location.reload()}>
          {translations.retry}
        </button>
      }
    >
      {hasError}
    </MUI.Alert>
  );
};

const LoadingStates: React.FC<{
  searchMode: boolean;
  translations: StorageManagementUITranslations;
}> = ({ searchMode, translations }) => {
  return (
    <MUI.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        gap: 2,
      }}
    >
      <MUI.CircularProgress />
      <MUI.Typography variant="body2" color="text.secondary">
        {searchMode ? translations.searching : translations.loading}
      </MUI.Typography>
    </MUI.Box>
  );
};

const EmptyState: React.FC<{
  translations: StorageManagementUITranslations;
  searchMode: boolean;
}> = ({ translations, searchMode }) => {
  return (
    <MUI.Box
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
      <MUI.Typography variant="h6" gutterBottom>
        {searchMode ? translations.noSearchResults : translations.emptyFolder}
      </MUI.Typography>
      <MUI.Typography variant="body2">
        {searchMode
          ? translations.tryDifferentSearch
          : translations.uploadOrCreate}
      </MUI.Typography>
    </MUI.Box>
  );
};

const GridView: React.FC<{
  currentItems: StorageItemType[];
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  viewMode: ViewMode;
  params: Graphql.FilesListInput;
  clipboard: StorageClipboardState | null;
  onNavigate: (
    path: string,
    currentParams: Graphql.FilesListInput
  ) => Promise<void>;
}> = ({
  currentItems,
  onContextMenu,
  onClick,
  viewMode,
  params,
  clipboard,
  onNavigate,
}) => {
  return (
    <MUI.Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        position: "relative",
      }}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <MUI.Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
        {currentItems.map(item => (
          <MUI.Grid
            size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}
            key={item.path}
          >
            <StorageItem
              item={item}
              viewMode={viewMode}
              params={params}
              onNavigate={onNavigate}
              clipboard={clipboard}
            />
          </MUI.Grid>
        ))}
      </MUI.Grid>
    </MUI.Box>
  );
};

interface StorageItemsViewProps {
  searchMode: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  loading: LoadingStates;
  operationErrors: OperationErrors;
  params: Graphql.FilesListInput;
  onNavigate: (
    path: string,
    currentParams: Graphql.FilesListInput
  ) => Promise<void>;
  onRefresh: () => Promise<void>;
  onPasteItems: () => Promise<boolean>;
  clipboard: StorageClipboardState | null;
}

/**
 * Main items display area for the storage browser.
 * Handles view mode switching, local sorting, and rendering of items.
 * Supports both grid and list views with client-side sorting.
 */
const StorageItemsView: React.FC<StorageItemsViewProps> = ({
  searchMode,
  viewMode,
  setViewMode,
  loading,
  operationErrors,
  params,
  clipboard,
  onNavigate,
  onRefresh,
  onPasteItems,
}) => {
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
  const { ui: translations } = useAppTranslation("storageTranslations");
  const theme = MUI.useTheme();

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
      onRefresh();
    },
  });

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (currentItems.length === 0) return;

      const currentFocusedIndex = focusedItem
        ? currentItems.findIndex(item => item.path === focusedItem)
        : -1;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = Math.min(
            currentFocusedIndex + 1,
            currentItems.length - 1
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
              currentItems[currentItems.length - 1].path
            );
          }
          break;

        case "Enter":
          event.preventDefault();
          if (focusedItem) {
            const item = currentItems.find(item => item.path === focusedItem);
            if (item && item.__typename === "DirectoryInfo") {
              onNavigate(item.path, params);
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
      selectedItems.length,
      selectRange,
      onNavigate,
      params,
      toggleSelect,
      clearSelection,
      selectAll,
    ]
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
    [clearSelection, selectedItems]
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
    [handleCloseViewAreaMenu]
  );

  return (
    <MUI.Box
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
      <MUI.Box
        {...getRootProps()}
        sx={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          border: isDragActive
            ? `2px dashed ${theme.palette.primary.main}`
            : "2px solid transparent",
          backgroundColor: isDragActive
            ? MUI.alpha(theme.palette.primary.main, 0.05)
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
                viewMode={viewMode}
                params={params}
                clipboard={clipboard}
                onNavigate={onNavigate}
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
                viewMode={viewMode}
                params={params}
                clipboard={clipboard}
                onNavigate={onNavigate}
              />
            )}
          </>
        )}
      </MUI.Box>

      {/* View Area Context Menu */}
      <ViewAreaMenu
        anchorEl={viewAreaMenuAnchor}
        open={viewAreaMenuOpen}
        anchorPosition={viewAreaMenuPosition}
        onClose={handleCloseViewAreaMenu}
        onContextMenu={handleViewAreaContextMenu}
        params={params}
        clipboard={clipboard}
        onPasteItems={onPasteItems}
        onRefresh={onRefresh}
      />
    </MUI.Box>
  );
};

export default StorageItemsView;
