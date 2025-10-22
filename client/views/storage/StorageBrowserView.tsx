"use client";
import React from "react";
import Box from "@mui/material/Box";
import StorageDirectoryTree from "./browser/StorageDirectoryTree";
import StorageMainView from "./browser/StorageMainView";
import StorageSearch from "./browser/StorageSearch";
import { SplitPane } from "@/client/components";
import UploadProgress from "./uploading/UploadProgress";
import { useStorageOperations } from "./hooks/useStorageOperations";
import { useStorageActions } from "./hooks/useStorageActions";
import { useStorageUIStore } from "./stores/useStorageUIStore";
import { useStorageTreeStore } from "./stores/useStorageTreeStore";
import { useStorageDataStore } from "./stores/useStorageDataStore";

export const StorageBrowserView: React.FC = () => {
  // Initialize storage data on mount
  // useStorageInitialization();

  const { searchMode, loading } = useStorageUIStore();

  const { directoryTree, expandedNodes, queueStates } = useStorageTreeStore();
  const { params } = useStorageDataStore();

  const {
    setSearchMode,
    setSearchResults,
    clearSelection,
    setLastSelectedItem,
  } = useStorageActions();

  // Get operations from context
  const {
    search,
    navigateTo,
    expandDirectoryNode,
    collapseDirectoryNode,
    prefetchDirectoryChildren,
  } = useStorageOperations();

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StorageSearch
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          setSearchResults={setSearchResults}
          clearSelection={clearSelection}
          setLastSelectedItem={setLastSelectedItem}
          onSearch={search}
        />
        <SplitPane
          orientation="vertical"
          firstPane={{
            visible: true,
            minRatio: 0.1,
          }}
          secondPane={{
            visible: true,
            minRatio: 0.7,
          }}
          resizerProps={{
            style: {
              cursor: "col-resize",
            },
          }}
          style={{
            flex: 1,
            minHeight: `calc(100vh -256px)`,
          }}
          storageKey={"storage-browser-split-pane"}
        >
          <StorageDirectoryTree
            params={params}
            directoryTree={directoryTree}
            expandedNodes={expandedNodes}
            queueStates={queueStates}
            loading={loading}
            onNavigate={navigateTo}
            onExpandNode={expandDirectoryNode}
            onCollapseNode={collapseDirectoryNode}
            onPrefetchChildren={prefetchDirectoryChildren}
          />
          <StorageMainView />
        </SplitPane>
      </Box>

      {/* Upload Progress UI - positioned as floating overlay */}
      <UploadProgress />
    </>
  );
};