import { create } from "zustand";
import { DirectoryTreeNode, QueueStates } from "../core/storage.type";

// ============================================================================
// STATE INTERFACE
// ============================================================================

export type StorageTreeState = {
  directoryTree: DirectoryTreeNode[];
  expandedNodes: Set<string>;
  prefetchedNodes: Set<string>;
  queueStates: QueueStates;
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export type StorageTreeStore = StorageTreeState & {
  setDirectoryTree: (tree: DirectoryTreeNode[]) => void;
  setExpandedNodes: (nodes: Set<string>) => void;
  setPrefetchedNodes: (nodes: Set<string>) => void;
  setQueueStates: (states: QueueStates) => void;
  reset: () => void;
};

// ============================================================================
// INITIAL STATE
// ============================================================================

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

// ============================================================================
// STORE
// ============================================================================

export const useStorageTreeStore = create<StorageTreeStore>((set) => ({
  ...initialState,

  setDirectoryTree: (directoryTree) => set({ directoryTree }),
  setExpandedNodes: (expandedNodes) => set({ expandedNodes }),
  setPrefetchedNodes: (prefetchedNodes) => set({ prefetchedNodes }),
  setQueueStates: (queueStates) => set({ queueStates }),
  reset: () => set(initialState),
}));

