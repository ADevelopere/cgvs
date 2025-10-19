"use client";

import { create } from "zustand";
import { DirectoryTreeNode, QueueStates } from "../hooks/storage.type";

interface StorageTreeState {
  directoryTree: DirectoryTreeNode[];
  expandedNodes: Set<string>;
  prefetchedNodes: Set<string>;
  queueStates: QueueStates;
}

interface StorageTreeActions {
  // Tree management actions
  setDirectoryTree: (tree: DirectoryTreeNode[]) => void;
  updateTreeNode: (
    path: string,
    updater: (node: DirectoryTreeNode) => DirectoryTreeNode
  ) => void;
  addChildToNode: (parentPath: string, children: DirectoryTreeNode[]) => void;

  // Node state actions
  expandNode: (path: string) => void;
  collapseNode: (path: string) => void;
  setPrefetchedNode: (path: string, isPrefetched: boolean) => void;

  // Queue management actions
  addToFetchQueue: (path: string) => void;
  removeFromFetchQueue: (path: string) => void;
  addToExpansionQueue: (path: string) => void;
  removeFromExpansionQueue: (path: string) => void;
  setCurrentlyFetching: (path: string, isFetching: boolean) => void;
  clearQueues: () => void;

  // Utility actions
  reset: () => void;
}

const initialQueueStates: QueueStates = {
  fetchQueue: new Set(),
  expansionQueue: new Set(),
  currentlyFetching: new Set(),
};

const initialState: StorageTreeState = {
  directoryTree: [],
  expandedNodes: new Set(),
  prefetchedNodes: new Set(),
  queueStates: initialQueueStates,
};

export const useStorageTreeStore = create<
  StorageTreeState & StorageTreeActions
>(set => ({
  ...initialState,

  // Tree management actions
  setDirectoryTree: tree => set({ directoryTree: tree }),

  updateTreeNode: (path, updater) =>
    set(state => {
      const updateTreeNode = (
        nodes: DirectoryTreeNode[]
      ): DirectoryTreeNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return updater(node);
          }
          if (node.children) {
            return {
              ...node,
              children: updateTreeNode(node.children),
            };
          }
          return node;
        });
      };

      return {
        directoryTree: updateTreeNode(state.directoryTree),
      };
    }),

  addChildToNode: (parentPath, children) =>
    set(state => {
      const updateTreeNode = (
        nodes: DirectoryTreeNode[]
      ): DirectoryTreeNode[] => {
        return nodes.map(node => {
          if (node.path === parentPath) {
            return {
              ...node,
              children,
              isPrefetched: true,
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateTreeNode(node.children),
            };
          }
          return node;
        });
      };

      return {
        directoryTree: updateTreeNode(state.directoryTree),
      };
    }),

  // Node state actions
  expandNode: path =>
    set(state => ({
      expandedNodes: new Set([...state.expandedNodes, path]),
    })),

  collapseNode: path =>
    set(state => {
      const newSet = new Set(state.expandedNodes);
      newSet.delete(path);
      return { expandedNodes: newSet };
    }),

  setPrefetchedNode: (path, isPrefetched) =>
    set(state => {
      const newSet = new Set(state.prefetchedNodes);
      if (isPrefetched) {
        newSet.add(path);
      } else {
        newSet.delete(path);
      }
      return { prefetchedNodes: newSet };
    }),

  // Queue management actions
  addToFetchQueue: path =>
    set(state => ({
      queueStates: {
        ...state.queueStates,
        fetchQueue: new Set([...state.queueStates.fetchQueue, path]),
      },
    })),

  removeFromFetchQueue: path =>
    set(state => ({
      queueStates: {
        ...state.queueStates,
        fetchQueue: new Set(
          [...state.queueStates.fetchQueue].filter(p => p !== path)
        ),
      },
    })),

  addToExpansionQueue: path =>
    set(state => ({
      queueStates: {
        ...state.queueStates,
        expansionQueue: new Set([...state.queueStates.expansionQueue, path]),
      },
    })),

  removeFromExpansionQueue: path =>
    set(state => ({
      queueStates: {
        ...state.queueStates,
        expansionQueue: new Set(
          [...state.queueStates.expansionQueue].filter(p => p !== path)
        ),
      },
    })),

  setCurrentlyFetching: (path, isFetching) =>
    set(state => {
      const newSet = new Set(state.queueStates.currentlyFetching);
      if (isFetching) {
        newSet.add(path);
      } else {
        newSet.delete(path);
      }
      return {
        queueStates: {
          ...state.queueStates,
          currentlyFetching: newSet,
        },
      };
    }),

  clearQueues: () =>
    set(state => ({
      queueStates: {
        ...state.queueStates,
        fetchQueue: new Set(),
        expansionQueue: new Set(),
        currentlyFetching: new Set(),
      },
    })),

  // Utility actions
  reset: () => set(initialState),
}));
