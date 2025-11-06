"use client";
import React, { useMemo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useQuery } from "@apollo/client/react";
import StorageDirectoryTree from "./browser/StorageDirectoryTree";
import StorageMainView from "./browser/StorageMainView";
import StorageSearch from "./browser/StorageSearch";
import { SplitPane } from "@/client/components";
import UploadProgress from "./uploading/UploadProgress";
import { useStorageOperations } from "./hooks/useStorageOperations";
import { useStorageActions } from "./hooks/useStorageActions";
import { useStorageUIStore } from "./stores/useStorageUIStore";
import { useStorageDataStore } from "./stores/useStorageDataStore";
import { searchFilesQueryDocument, listFilesQueryDocument } from "./core/storage.documents";

export const StorageBrowserView: React.FC = () => {
  const { searchMode, focusedItem } = useStorageUIStore();
  const { params } = useStorageDataStore();
  const [searchTerm, setSearchTerm] = useState("");

  const { setSearchMode, clearSelection, setLastSelectedItem, setFocusedItem } = useStorageActions();

  // Get operations from context
  const { navigateTo } = useStorageOperations();

  // Main list files query
  const {
    data: listData,
    loading: listLoading,
    error: listError,
  } = useQuery(listFilesQueryDocument, {
    variables: { input: params },
  });

  // Search query - only runs when explicitly searching
  const { data: searchData, loading: searchLoading } = useQuery(searchFilesQueryDocument, {
    variables: {
      searchTerm: searchTerm,
      folder: "",
      limit: 100,
    },
    skip: !searchMode || !searchTerm,
  });

  // Single useMemo to derive ALL data from Apollo query
  const { items, pagination, searchResults } = useMemo(() => {
    const derivedItems = listData?.listFiles?.items || [];

    const derivedPagination = !listData?.listFiles
      ? null
      : {
          hasMorePages: listData.listFiles.hasMore,
          total: listData.listFiles.totalCount,
          count: listData.listFiles.totalCount,
          perPage: listData.listFiles.limit,
          firstItem: listData.listFiles.offset,
          currentPage: Math.floor(listData.listFiles.offset / listData.listFiles.limit) + 1,
          lastPage: Math.ceil(listData.listFiles.totalCount / listData.listFiles.limit),
        };

    const derivedSearchResults = searchData?.searchFiles?.items || [];

    return {
      items: derivedItems,
      pagination: derivedPagination,
      searchResults: derivedSearchResults,
    };
  }, [listData, searchData]);

  // Handle side effects after render
  useEffect(() => {
    // Clear focused item if it's not in current items
    if (focusedItem && !items.find(item => item.path === focusedItem)) {
      setFocusedItem(null);
    }
  }, [focusedItem, items, setFocusedItem]);

  useEffect(() => {
    clearSelection();
  }, [clearSelection, listData]);

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
          searchResults={searchResults}
          searchLoading={searchLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearSelection={clearSelection}
          setLastSelectedItem={setLastSelectedItem}
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
          <StorageDirectoryTree params={params} onNavigate={navigateTo} />
          <StorageMainView
            params={params}
            items={items}
            pagination={pagination}
            loading={listLoading}
            error={listError}
          />
        </SplitPane>
      </Box>

      {/* Upload Progress UI - positioned as floating overlay */}
      <UploadProgress />
    </>
  );
};
