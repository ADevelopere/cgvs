"use client";
import React, { useCallback } from "react";
import {
  TreeView,
  BaseTreeItem,
  TreeViewItemRenderer,
} from "@/client/components/treeView/TreeView";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { DirectoryTreeNode } from "@/client/contexts/storage/storage.type";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import { useDebouncedCallback } from "use-debounce";
import { useAppTranslation } from "@/client/locale";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

type DirectoryTreeItemRendererProps = Pick<
  Parameters<TreeViewItemRenderer<DirectoryTreeNode>>[0],
  "item" | "isSelected"
>;

const StorageDirectoryTree: React.FC = () => {
  const {
    directoryTree,
    params,
    navigateTo,
    expandDirectoryNode,
    collapseDirectoryNode,
    prefetchDirectoryChildren,
    expandedNodes,
    loading,
    queueStates,
  } = useStorageManagementUI();
  const { ui: translations } = useAppTranslation("storageTranslations");

  const handleRetryFetchTree = useCallback(() => {
    // Use prefetchDirectoryChildren with empty path to refetch root directories
    // The refresh=true parameter forces a refetch even if already cached
    prefetchDirectoryChildren("", true);
  }, [prefetchDirectoryChildren]);

  const handleSelectItem = useCallback(
    (item: BaseTreeItem) => {
      const node = item as DirectoryTreeNode;
      navigateTo(node.path);
    },
    [navigateTo],
  );

  const handleExpandItem = useCallback(
    (item: BaseTreeItem) => {
      const node = item as DirectoryTreeNode;
      if (!expandedNodes.has(node.path)) {
        expandDirectoryNode(node.path);
      }
    },
    [expandedNodes, expandDirectoryNode],
  );

  const handleCollapseItem = useCallback(
    (item: BaseTreeItem) => {
      const node = item as DirectoryTreeNode;
      collapseDirectoryNode(node.path);
    },
    [collapseDirectoryNode],
  );

  const debouncedPrefetch = useDebouncedCallback((path: string) => {
    prefetchDirectoryChildren(path);
  }, 300);

  const handleHoverItem = useCallback(
    (item: BaseTreeItem) => {
      const node = item as DirectoryTreeNode;
      if (node.hasChildren && !expandedNodes.has(node.path)) {
        debouncedPrefetch(node.path);
      }
    },
    [expandedNodes, debouncedPrefetch],
  );

  const itemRenderer = React.useCallback(
    ({ item, isSelected }: DirectoryTreeItemRendererProps) => {
      const isExpandingNode = loading.expandingNode === item.path;
      const isPrefetching = loading.prefetchingNode === item.path;
      const isInExpansionQueue = queueStates.expansionQueue.has(item.path);
      const isCurrentlyFetching = queueStates.currentlyFetching.has(item.path);

      const showLoading =
        isExpandingNode ||
        isPrefetching ||
        isInExpansionQueue ||
        isCurrentlyFetching;

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FolderIcon
            sx={{
              color: isSelected ? "primary.main" : "text.secondary",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? "bold" : "normal",
            }}
          >
            {item.name}
          </Typography>
          {showLoading && <CircularProgress size={16} />}
        </Box>
      );
    },
    [
      loading.expandingNode,
      loading.prefetchingNode,
      queueStates.expansionQueue,
      queueStates.currentlyFetching,
    ],
  );

  return (
    <TreeView<DirectoryTreeNode>
      items={directoryTree}
      onSelectItem={handleSelectItem}
      onExpandItem={handleExpandItem}
      onCollapseItem={handleCollapseItem}
      onHoverItem={handleHoverItem}
      selectedItemId={params.path}
      expandedItems={expandedNodes}
      itemRenderer={itemRenderer}
      childrenKey="children"
      labelKey="name"
      noItemsMessage={
        directoryTree.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {translations.noFoldersFound}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRetryFetchTree}
              disabled={loading.prefetchingNode !== null}
            >
              {translations.retry}
            </Button>
          </Box>
        ) : (
          translations.noFoldersFound
        )
      }
      searchText={translations.searchFolders}
    />
  );
};

export default StorageDirectoryTree;
