"use client";
import React from "react";
import { ReactiveCategoryTree } from "@/client/components";
import { StorageDirectoryNode } from "@/client/views/storage/core/storage.type";
import Box from "@mui/material/Box";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { directoryChildrenQueryDocument } from "@/client/views/storage/core/storage.documents";
import { useStorageTreeStore } from "@/client/views/storage/stores/useStorageTreeStore";

interface StorageDirectoryTreeProps {
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => void;
}

const StorageDirectoryTree: React.FC<StorageDirectoryTreeProps> = ({ params, onNavigate }) => {
  const {
    storageTranslations: { ui: translations },
  } = useAppTranslation();

  // Get tree store state and actions
  const { expandedNodes, toggleExpanded, markAsFetched, isFetched, updateCurrentDirectory, setCurrentDirectory } =
    useStorageTreeStore();

  // Callback handlers following CategoryPane pattern
  const handleSelectDirectory = React.useCallback(
    (node: StorageDirectoryNode) => {
      // Update the store to persist the selected directory
      setCurrentDirectory(node);
      // Navigate to the directory
      onNavigate(node.path);
    },
    [setCurrentDirectory, onNavigate]
  );

  const handleUpdateDirectory = React.useCallback(
    (node: StorageDirectoryNode) => {
      updateCurrentDirectory(node);
    },
    [updateCurrentDirectory]
  );

  const handleToggleExpanded = React.useCallback(
    (path: string | number) => {
      toggleExpanded(String(path));
    },
    [toggleExpanded]
  );

  const handleIsFetched = React.useCallback(
    (path: string | number) => {
      return isFetched(String(path));
    },
    [isFetched]
  );

  const handleMarkAsFetched = React.useCallback(
    (path: string | number) => {
      markAsFetched(String(path));
    },
    [markAsFetched]
  );

  const getItems = React.useCallback(
    (data: Graphql.DirectoryChildrenQuery) =>
      data.directoryChildren?.map(dir => ({
        ...dir,
        id: dir.path,
      })) || [],
    []
  );

  const getNodeLabel = React.useCallback(
    (node: StorageDirectoryNode) => node.name ?? node.path.split("/").pop() ?? "",
    []
  );

  const itemRenderer = React.useCallback(
    ({ node, isSelected }: { node: StorageDirectoryNode; isSelected: boolean }) => (
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
          {node.name}
        </Typography>
      </Box>
    ),
    []
  );

  return (
    <ReactiveCategoryTree<StorageDirectoryNode, Graphql.DirectoryChildrenQuery, Graphql.DirectoryChildrenQueryVariables>
      resolver={parent => ({
        query: directoryChildrenQueryDocument,
        variables: { path: parent ? parent.path : "" },
        fetchPolicy: "cache-first",
      })}
      getItems={getItems}
      getNodeLabel={getNodeLabel}
      itemRenderer={itemRenderer}
      selectedItemId={params.path}
      onSelectItem={handleSelectDirectory}
      onUpdateItem={handleUpdateDirectory}
      expandedItemIds={expandedNodes}
      onToggleExpand={handleToggleExpanded}
      isFetched={handleIsFetched}
      onMarkAsFetched={handleMarkAsFetched}
      header={translations.folders}
      noItemsMessage={translations.noFoldersFound}
      itemHeight={48}
    />
  );
};

export default StorageDirectoryTree;
