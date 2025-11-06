import React from "react";
import { Box } from "@mui/material";
import StorageBreadcrumb from "./StorageBreadcrumb";
import StorageToolbar from "./StorageToolbar";
import StorageItemsView from "./StorageItemsView";
import { useStorageOperations } from "@/client/views/storage/hooks/useStorageOperations";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageActions } from "../hooks/useStorageActions";
import { StorageItemUnion } from "../core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface StorageMainViewProps {
  params: Graphql.FilesListInput;
  items: StorageItemUnion[];
  pagination: Graphql.PageInfo | null;
  loading: boolean;
  error: unknown;
}

/**
 * Main content pane for the storage browser.
 * Assembles the breadcrumb navigation, toolbar, and items view into a cohesive layout.
 * This component represents the right pane in the split-pane layout.
 */
const StorageMainView: React.FC<StorageMainViewProps> = ({ params, items, pagination, loading, error }) => {
  const {
    searchMode,
    selectedItems,
    lastSelectedItem,
    focusedItem,
    sortBy,
    sortDirection,
    searchResults,
    viewMode,
    clipboard,
  } = useStorageUIStore();

  const actions = useStorageActions();
  const {
    setViewMode,
    updateParams,
    copyItems,
    cutItems,
    setSelectedItems,
    toggleSelect,
    clearSelection,
    selectRange,
    setFocusedItem,
    setSortBy,
    setSortDirection,
    getSortedItems,
  } = actions;

  // Create selectAll handler with access to items
  const selectAll = React.useCallback(() => {
    setSelectedItems(items.map(item => item.path));
  }, [items, setSelectedItems]);

  // Get operations from context
  const { navigateTo, refresh, pasteItems, renameItem, deleteItems, move, createFolder } = useStorageOperations();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* Breadcrumb Navigation */}
      <StorageBreadcrumb params={params} onNavigate={navigateTo} />

      {/* Conditional Toolbar (Filters or Selection Actions) */}
      <StorageToolbar
        selectedItems={selectedItems}
        searchMode={searchMode}
        searchResults={searchResults}
        loading={loading}
        items={items}
        params={params}
        updateParams={updateParams}
        clipboard={clipboard}
        onCopyItems={copyItems}
        onCutItems={cutItems}
        onPasteItems={pasteItems}
        onRenameItem={renameItem}
        onDeleteItems={deleteItems}
        onMove={move}
        clearSelection={clearSelection}
      />

      {/* Main Items Display Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <StorageItemsView
          items={items}
          pagination={pagination}
          loading={loading}
          error={error}
          searchMode={searchMode}
          viewMode={viewMode}
          selectedItems={selectedItems}
          lastSelectedItem={lastSelectedItem}
          focusedItem={focusedItem}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setViewMode={setViewMode}
          params={params}
          onNavigate={navigateTo}
          onRefresh={refresh}
          clipboard={clipboard}
          onPasteItems={pasteItems}
          onCopyItems={copyItems}
          onCutItems={cutItems}
          onRenameItem={renameItem}
          onDeleteItems={deleteItems}
          onCreateFolder={createFolder}
          toggleSelect={toggleSelect}
          selectAll={selectAll}
          clearSelection={clearSelection}
          selectRange={selectRange}
          setFocusedItem={setFocusedItem}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
          getSortedItems={getSortedItems}
        />
      </Box>
    </Box>
  );
};

export default StorageMainView;
