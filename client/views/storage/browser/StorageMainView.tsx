import React from "react";
import { Box } from "@mui/material";
import StorageBreadcrumb from "./StorageBreadcrumb";
import StorageToolbar from "./StorageToolbar";
import StorageItemsView from "./StorageItemsView";
import { useStorageOperations } from "@/client/views/storage/hooks/useStorageOperations";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { useStorageActions } from "../hooks/useStorageActions";
/**
 * Main content pane for the storage browser.
 * Assembles the breadcrumb navigation, toolbar, and items view into a cohesive layout.
 * This component represents the right pane in the split-pane layout.
 */
const StorageMainView: React.FC = () => {
  const {
    searchMode,
    loading,
    selectedItems,
    lastSelectedItem,
    focusedItem,
    sortBy,
    sortDirection,
    searchResults,
    viewMode,
    operationErrors,
    clipboard,
  } = useStorageUIStore();

  const { params, items } = useStorageDataStore();

  const {
    setViewMode,
    updateParams,
    copyItems,
    cutItems,
    selectAll,
    toggleSelect,
    clearSelection,
    selectRange,
    setFocusedItem,
    setSortBy,
    setSortDirection,
    getSortedItems,
  } = useStorageActions();

  // Get operations from context
  const {
    navigateTo,
    refresh,
    pasteItems,
    renameItem,
    deleteItems,
    move,
    fetchDirectoryChildren,
    createFolder,
  } = useStorageOperations();

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
        onFetchDirectoryChildren={fetchDirectoryChildren}
        clearSelection={clearSelection}
      />

      {/* Main Items Display Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <StorageItemsView
          searchMode={searchMode}
          viewMode={viewMode}
          selectedItems={selectedItems}
          lastSelectedItem={lastSelectedItem}
          focusedItem={focusedItem}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setViewMode={setViewMode}
          loading={loading}
          operationErrors={operationErrors}
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
