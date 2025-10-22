import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to compute parent paths from a directory path
 * Example: "folder1/folder2/folder3" → ["", "folder1", "folder1/folder2"]
 */
function getParentPaths(path: string): string[] {
  if (!path || path === "") return [];
  
  const segments = path.split("/").filter(s => s !== "");
  const parents: string[] = [""];  // Root always included
  
  for (let i = 0; i < segments.length - 1; i++) {
    parents.push(segments.slice(0, i + 1).join("/"));
  }
  
  return parents;
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

export type StorageTreeState = {
  currentDirectory: Graphql.DirectoryInfo | null; // Selected directory
  expandedNodes: Set<string>; // Expansion state (in-memory, derived on restore)
  fetchedNodes: Set<string>; // Fetch tracking (in-memory, derived on restore)
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export type StorageTreeStore = StorageTreeState & {
  setCurrentDirectory: (dir: Graphql.DirectoryInfo | null) => void;
  updateCurrentDirectory: (dir: Graphql.DirectoryInfo | null) => void;
  toggleExpanded: (path: string) => void;
  markAsFetched: (path: string) => void;
  isFetched: (path: string) => boolean;
  reset: () => void;
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: StorageTreeState = {
  currentDirectory: null,
  expandedNodes: new Set<string>(),
  fetchedNodes: new Set<string>(),
};

// ============================================================================
// STORE
// ============================================================================

export const useStorageTreeStore = create<StorageTreeStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentDirectory: (dir) => {
        set(state => {
          // Early return if same directory
          if (dir?.path === state.currentDirectory?.path) {
            return state;
          }
          
          // Compute and expand all parent paths
          const newExpandedNodes = new Set(state.expandedNodes);
          const newFetchedNodes = new Set(state.fetchedNodes);
          
          if (dir?.path) {
            getParentPaths(dir.path).forEach(parentPath => {
              newExpandedNodes.add(parentPath);
              newFetchedNodes.add(parentPath);
            });
          }
          
          return {
            currentDirectory: dir,
            expandedNodes: newExpandedNodes,
            fetchedNodes: newFetchedNodes,
          };
        });
      },

      updateCurrentDirectory: (dir) => {
        set(state => {
          if (!state.currentDirectory || !dir || 
              state.currentDirectory.path !== dir.path) {
            return state;
          }
          // Update with fresh data from Apollo cache
          return { currentDirectory: dir };
        });
      },

      toggleExpanded: (path) => {
        set(state => {
          const newSet = new Set(state.expandedNodes);
          if (newSet.has(path)) {
            newSet.delete(path);
          } else {
            newSet.add(path);
          }
          return { expandedNodes: newSet };
        });
      },

      markAsFetched: (path) => {
        set(state => {
          const newSet = new Set(state.fetchedNodes);
          newSet.add(path);
          return { fetchedNodes: newSet };
        });
      },

      isFetched: (path) => {
        return get().fetchedNodes.has(path);
      },

      reset: () => set(initialState),
    }),
    {
      name: "storage-tree-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentDirectory: state.currentDirectory,
      }),
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as Partial<StorageTreeState>;
        
        // Derive expandedNodes and fetchedNodes from currentDirectory.path
        const expandedNodes = new Set<string>();
        const fetchedNodes = new Set<string>();
        
        if (typedPersisted.currentDirectory?.path) {
          getParentPaths(typedPersisted.currentDirectory.path).forEach(path => {
            expandedNodes.add(path);
            fetchedNodes.add(path);
          });
        }
        
        return {
          ...currentState,
          ...typedPersisted,
          expandedNodes,
          fetchedNodes,
        };
      },
    }
  )
);

