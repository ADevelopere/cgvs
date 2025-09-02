"use client";
import React, { useCallback } from "react";
import {
    TreeView,
    BaseTreeItem,
    TreeViewItemRendererFull,
} from "@/components/common/TreeView";
import { useStorageManagementUI } from "@/contexts/storage/StorageManagementUIContext";
import { DirectoryTreeNode } from "@/contexts/storage/storage.type";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import { useDebouncedCallback } from "use-debounce";
import useAppTranslation from "@/locale/useAppTranslation";

type DirectoryTreeItemRendererProps = Pick<
    Parameters<TreeViewItemRendererFull<DirectoryTreeNode>>[0],
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
    } = useStorageManagementUI();
    const { ui: translations } = useAppTranslation("storageTranslations");

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
            const isLoading = loading.expandingNode === item.path;
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FolderIcon
                        sx={{
                            color: isSelected
                                ? "primary.main"
                                : "text.secondary",
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
                    {isLoading && <CircularProgress size={16} />}
                </Box>
            );
        },
        [loading.expandingNode],
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
            noItemsMessage={translations.noFoldersFound}
            searchText={translations.searchFolders}
        />
    );
};

export default StorageDirectoryTree;
