import React from "react";
import * as MUI from "@mui/material";
import {
  GridView as GridViewIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import StorageItem from "./StorageItem";
import ViewAreaMenu from "../menu/ViewAreaMenu";
import { useUploadDropzone } from "@/client/views/storage/dropzone/useUploadDropzone";
import { StorageManagementUITranslations } from "@/client/locale/components/Storage";
import {
  StorageItemUnion as StorageItemType,
  ViewMode,
  StorageClipboardState,
} from "@/client/views/storage/core/storage.type";
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
  sortedItems: StorageItemType[];
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;
  setSortBy: (field: string) => void;
  setSortDirection: (direction: "ASC" | "DESC") => void;
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  viewMode: ViewMode;
  params: Graphql.FilesListInput;
  clipboard: StorageClipboardState | null;
  onNavigate: (path: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onCopyItems: (items: StorageItemType[]) => void;
  onCutItems: (items: StorageItemType[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (
    fromPath: string,
    toPath: string,
    items: StorageItemType[]
  ) => void;
  setFocusedItem: (path: string | null) => void;
}> = ({
  sortBy,
  sortDirection,
  translations,
  sortedItems,
  selectedItems,
  lastSelectedItem,
  focusedItem,
  setSortBy,
  setSortDirection,
  onContextMenu,
  onClick,
  viewMode,
  params,
  clipboard,
  onNavigate,
  onRefresh,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
  toggleSelect,
  selectAll,
  clearSelection,
  selectRange,
  setFocusedItem,
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
          {sortedItems.map(item => (
            <StorageItem
              key={item.path}
              item={item}
              focusedItem={focusedItem}
              viewMode={viewMode}
              params={params}
              sortedItems={sortedItems}
              selectedItems={selectedItems}
              lastSelectedItem={lastSelectedItem}
              onNavigate={onNavigate}
              clipboard={clipboard}
              onRefresh={onRefresh}
              onCopyItems={onCopyItems}
              onCutItems={onCutItems}
              onPasteItems={onPasteItems}
              onRenameItem={onRenameItem}
              onDeleteItems={onDeleteItems}
              toggleSelect={toggleSelect}
              selectAll={selectAll}
              clearSelection={clearSelection}
              selectRange={selectRange}
              setFocusedItem={setFocusedItem}
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
  sortedItems: StorageItemType[];
  selectedItems: string[];
  lastSelectedItem: string | null;
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  viewMode: ViewMode;
  focusedItem: string | null;
  params: Graphql.FilesListInput;
  clipboard: StorageClipboardState | null;
  onNavigate: (path: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onCopyItems: (items: StorageItemType[]) => void;
  onCutItems: (items: StorageItemType[]) => void;
  onPasteItems: () => Promise<boolean>;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (
    fromPath: string,
    toPath: string,
    items: StorageItemType[]
  ) => void;
  setFocusedItem: (path: string | null) => void;
}> = ({
  sortedItems,
  selectedItems,
  lastSelectedItem,
  focusedItem,
  onContextMenu,
  onClick,
  viewMode,
  params,
  clipboard,
  onNavigate,
  onRefresh,
  onCopyItems,
  onCutItems,
  onPasteItems,
  onRenameItem,
  onDeleteItems,
  toggleSelect,
  selectAll,
  clearSelection,
  selectRange,
  setFocusedItem,
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
        {sortedItems.map(item => (
          <MUI.Grid
            size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1.5 }}
            key={item.path}
          >
            <StorageItem
              item={item}
              focusedItem={focusedItem}
              viewMode={viewMode}
              params={params}
              sortedItems={sortedItems}
              selectedItems={selectedItems}
              lastSelectedItem={lastSelectedItem}
              onNavigate={onNavigate}
              clipboard={clipboard}
              onRefresh={onRefresh}
              onCopyItems={onCopyItems}
              onCutItems={onCutItems}
              onPasteItems={onPasteItems}
              onRenameItem={onRenameItem}
              onDeleteItems={onDeleteItems}
              toggleSelect={toggleSelect}
              selectAll={selectAll}
              clearSelection={clearSelection}
              selectRange={selectRange}
              setFocusedItem={setFocusedItem}
            />
          </MUI.Grid>
        ))}
      </MUI.Grid>
    </MUI.Box>
  );
};

interface StorageItemsViewProps {
  items: StorageItemType[];
  pagination: Graphql.PageInfo | null;
  loading: boolean;
  error: unknown;
  searchMode: boolean;
  viewMode: ViewMode;
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;
  sortBy: string;
  sortDirection: Graphql.OrderSortDirection;
  setViewMode: (mode: ViewMode) => void;
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onPasteItems: () => Promise<boolean>;
  clipboard: StorageClipboardState | null;
  onCopyItems: (items: StorageItemType[]) => void;
  onCutItems: (items: StorageItemType[]) => void;
  onRenameItem: (path: string, newName: string) => Promise<boolean>;
  onDeleteItems: (paths: string[]) => Promise<boolean>;
  onCreateFolder: (path: string, folderName: string) => Promise<boolean>;
  toggleSelect: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (
    fromPath: string,
    toPath: string,
    items: StorageItemType[]
  ) => void;
  setFocusedItem: (path: string | null) => void;
  setSortBy: (field: string) => void;
  setSortDirection: (direction: Graphql.OrderSortDirection) => void;
  getSortedItems: (items: StorageItemType[]) => StorageItemType[];
}

/**
 * Main items display area for the storage browser.
 * Handles view mode switching, local sorting, and rendering of items.
 * Supports both grid and list views with client-side sorting.
 */
const StorageItemsView: React.FC<StorageItemsViewProps> = ({
  items,
  // pagination, // TODO: Add pagination UI
  loading,
  error,
  searchMode,
  viewMode,
  selectedItems,
  lastSelectedItem,
  focusedItem,
  sortBy,
  sortDirection,
  setViewMode,
  params,
  clipboard,
  onNavigate,
  onRefresh,
  onPasteItems,
  onCopyItems,
  onCutItems,
  onRenameItem,
  onDeleteItems,
  onCreateFolder,
  toggleSelect,
  selectAll,
  clearSelection,
  selectRange,
  setFocusedItem,
  setSortBy,
  setSortDirection,
  getSortedItems,
}) => {
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
  const sortedItems = getSortedItems(items);

  const isLoading = loading;

  const hasError = !!error;

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
      if (sortedItems.length === 0) return;

      const currentFocusedIndex = focusedItem
        ? sortedItems.findIndex(item => item.path === focusedItem)
        : -1;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex = Math.min(
            currentFocusedIndex + 1,
            sortedItems.length - 1
          );
          if (nextIndex !== currentFocusedIndex) {
            setFocusedItem(sortedItems[nextIndex].path);
            if (event.shiftKey && lastSelectedItem) {
              selectRange(
                lastSelectedItem,
                sortedItems[nextIndex].path,
                sortedItems
              );
            }
          }
          break;
        }

        case "ArrowUp": {
          event.preventDefault();
          const prevIndex = Math.max(currentFocusedIndex - 1, 0);
          if (prevIndex !== currentFocusedIndex) {
            setFocusedItem(sortedItems[prevIndex].path);
            if (event.shiftKey && lastSelectedItem) {
              selectRange(
                lastSelectedItem,
                sortedItems[prevIndex].path,
                sortedItems
              );
            }
          }
          break;
        }

        case "Home":
          event.preventDefault();
          setFocusedItem(sortedItems[0].path);
          if (event.shiftKey && lastSelectedItem) {
            selectRange(lastSelectedItem, sortedItems[0].path, sortedItems);
          }
          break;

        case "End":
          event.preventDefault();
          setFocusedItem(sortedItems[sortedItems.length - 1].path);
          if (event.shiftKey && lastSelectedItem) {
            selectRange(
              lastSelectedItem,
              sortedItems[sortedItems.length - 1].path,
              sortedItems
            );
          }
          break;

        case "Enter":
          event.preventDefault();
          if (focusedItem) {
            const item = sortedItems.find(item => item.path === focusedItem);
            if (item && item.__typename === "DirectoryInfo") {
              onNavigate(item.path);
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
      sortedItems,
      focusedItem,
      setFocusedItem,
      lastSelectedItem,
      selectedItems.length,
      selectRange,
      onNavigate,
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
        currentItems={sortedItems}
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
          <ErrorState
            hasError={error instanceof Error ? error.message : "Unknown error"}
            translations={translations}
          />
        )}
        {!isLoading && !hasError && sortedItems.length === 0 && (
          <EmptyState translations={translations} searchMode={searchMode} />
        )}
        {!isLoading && !hasError && sortedItems.length > 0 && (
          <>
            {viewMode === "grid" && (
              <GridView
                sortedItems={sortedItems}
                focusedItem={focusedItem}
                selectedItems={selectedItems}
                lastSelectedItem={lastSelectedItem}
                onContextMenu={handleViewAreaContextMenu}
                onClick={handleViewAreaClick}
                viewMode={viewMode}
                params={params}
                clipboard={clipboard}
                onNavigate={onNavigate}
                onRefresh={onRefresh}
                onCopyItems={onCopyItems}
                onCutItems={onCutItems}
                onPasteItems={onPasteItems}
                onRenameItem={onRenameItem}
                onDeleteItems={onDeleteItems}
                toggleSelect={toggleSelect}
                selectAll={selectAll}
                clearSelection={clearSelection}
                selectRange={selectRange}
                setFocusedItem={setFocusedItem}
              />
            )}
            {viewMode === "list" && (
              <ListView
                sortBy={sortBy}
                focusedItem={focusedItem}
                sortDirection={sortDirection}
                translations={translations}
                sortedItems={sortedItems}
                selectedItems={selectedItems}
                lastSelectedItem={lastSelectedItem}
                setSortBy={setSortBy}
                setSortDirection={setSortDirection}
                onContextMenu={handleViewAreaContextMenu}
                onClick={handleViewAreaClick}
                viewMode={viewMode}
                params={params}
                clipboard={clipboard}
                onNavigate={onNavigate}
                onRefresh={onRefresh}
                onCopyItems={onCopyItems}
                onCutItems={onCutItems}
                onPasteItems={onPasteItems}
                onRenameItem={onRenameItem}
                onDeleteItems={onDeleteItems}
                toggleSelect={toggleSelect}
                selectAll={selectAll}
                clearSelection={clearSelection}
                selectRange={selectRange}
                setFocusedItem={setFocusedItem}
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
        onCreateFolder={onCreateFolder}
        selectAll={selectAll}
      />
    </MUI.Box>
  );
};

export default StorageItemsView;
