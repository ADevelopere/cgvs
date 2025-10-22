import React from "react";
import { Box } from "@mui/material";
import StorageBreadcrumb from "./StorageBreadcrumb";
import StorageToolbar from "./StorageToolbar";
import StorageItemsView from "./StorageItemsView";
import {
  useStorageState,
  useStorageStateActions,
} from "@/client/views/storage/contexts/StorageStateContext";
import { useStorageOperations } from "@/client/views/storage/contexts/StorageOperationsContext";

/**
 * Main content pane for the storage browser.
 * Assembles the breadcrumb navigation, toolbar, and items view into a cohesive layout.
 * This component represents the right pane in the split-pane layout.
 */
const StorageMainView: React.FC = () => {
  const {
    params,
    selectedItems,
    searchMode,
    searchResults,
    loading,
    items,
    viewMode,
    operationErrors,
    clipboard,
  } = useStorageState();

  const { setViewMode, updateParams, copyItems, cutItems } =
    useStorageStateActions();

  // Get operations from context
  const { navigateTo, refresh, pasteItems } = useStorageOperations();

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
      />

      {/* Main Items Display Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <StorageItemsView
          searchMode={searchMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
          operationErrors={operationErrors}
          params={params}
          onNavigate={navigateTo}
          onRefresh={refresh}
          clipboard={clipboard}
          onPasteItems={pasteItems}
        />
      </Box>
    </Box>
  );
};

export default StorageMainView;
