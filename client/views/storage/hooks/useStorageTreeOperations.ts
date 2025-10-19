"use client";

import { useCallback } from "react";
import { useStorageTreeStore } from "../stores/useStorageTreeStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { DirectoryTreeNode } from "./storage.type";

export const useStorageTreeOperations = () => {
  const {
    directoryTree,
    expandedNodes,
    prefetchedNodes,
    queueStates,
    addToFetchQueue,
    removeFromFetchQueue,
    addToExpansionQueue,
    removeFromExpansionQueue,
    setCurrentlyFetching,
    setDirectoryTree,
    addChildToNode,
    expandNode,
    collapseNode,
    setPrefetchedNode,
  } = useStorageTreeStore();
  const { fetchDirectoryChildren } = useStorageDataOperations();

  // Function to process expansion queue
  const processExpansionQueue = useCallback(
    (path: string) => {
      if (queueStates.expansionQueue.has(path)) {
        // Check if children are available in the tree
        const hasChildrenInTree = (
          nodes: DirectoryTreeNode[],
          targetPath: string
        ): boolean => {
          for (const node of nodes) {
            if (node.path === targetPath && node.children !== undefined) {
              return true;
            }
            if (node.children && hasChildrenInTree(node.children, targetPath)) {
              return true;
            }
          }
          return false;
        };

        if (hasChildrenInTree(directoryTree, path)) {
          // Children are available, expand immediately
          expandNode(path);
          removeFromExpansionQueue(path);
        }
      }
    },
    [
      queueStates.expansionQueue,
      directoryTree,
      expandNode,
      removeFromExpansionQueue,
    ]
  );

  const prefetchDirectoryChildren = useCallback(
    async (path: string, refresh?: boolean) => {
      if (
        (!refresh && prefetchedNodes.has(path)) ||
        expandedNodes.has(path) ||
        queueStates.currentlyFetching.has(path)
      )
        return;

      // Add to fetch queue and mark as currently fetching
      addToFetchQueue(path);
      setCurrentlyFetching(path, true);
      setPrefetchedNode(path, true);

      try {
        const children = await fetchDirectoryChildren(path);
        if (children) {
          // Cache the children for instant expansion later
          if (directoryTree.length === 0 && path === "") {
            // If nodes array is empty and this is the root path, return the children directly
            setDirectoryTree(
              children.map(child => ({
                ...child,
                isPrefetched: true,
              }))
            );
          } else {
            addChildToNode(path, children);
          }

          // Process expansion queue for this path after successful fetch
          processExpansionQueue(path);
        }
      } finally {
        // Remove from queues and update loading state
        removeFromFetchQueue(path);
        setCurrentlyFetching(path, false);
      }
    },
    [
      prefetchedNodes,
      expandedNodes,
      queueStates.currentlyFetching,
      addToFetchQueue,
      setCurrentlyFetching,
      setPrefetchedNode,
      fetchDirectoryChildren,
      directoryTree.length,
      setDirectoryTree,
      addChildToNode,
      processExpansionQueue,
      removeFromFetchQueue,
    ]
  );

  const expandDirectoryNode = useCallback(
    (path: string) => {
      if (expandedNodes.has(path)) return; // Already expanded

      // Check if children are already available in the tree
      const findNodeInTree = (
        nodes: DirectoryTreeNode[],
        targetPath: string
      ): DirectoryTreeNode | null => {
        for (const node of nodes) {
          if (node.path === targetPath) {
            return node;
          }
          if (node.children) {
            const found = findNodeInTree(node.children, targetPath);
            if (found) return found;
          }
        }
        return null;
      };

      const targetNode = findNodeInTree(directoryTree, path);

      if (targetNode?.children !== undefined) {
        // Children are already available, expand immediately
        expandNode(path);
      } else if (targetNode?.hasChildren) {
        // Children are not available but node has children
        // Add to expansion queue and trigger fetch if not already fetching
        addToExpansionQueue(path);

        if (
          !queueStates.currentlyFetching.has(path) &&
          !queueStates.fetchQueue.has(path)
        ) {
          // Not currently fetching and not in fetch queue, trigger prefetch
          prefetchDirectoryChildren(path);
        }
      }
      // If node doesn't have children, do nothing
    },
    [
      expandedNodes,
      directoryTree,
      addToExpansionQueue,
      queueStates.currentlyFetching,
      queueStates.fetchQueue,
      prefetchDirectoryChildren,
      expandNode,
    ]
  );

  const collapseDirectoryNode = useCallback(
    (path: string) => {
      collapseNode(path);
    },
    [collapseNode]
  );

  return {
    prefetchDirectoryChildren,
    expandDirectoryNode,
    collapseDirectoryNode,
    processExpansionQueue,
  };
};
