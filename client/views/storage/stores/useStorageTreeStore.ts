import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to compute parent paths from a directory path
 * Example: "folder1/folder2/folder3" → ["", "folder1", "folder1/folder2"]
 */
function getParentPaths(path: string): string[] {
  logger.log("[getParentPaths] Input path:", path);
  
  if (!path || path === "") {
    logger.log("[getParentPaths] Empty path, returning []");
    return [];
  }
  
  const segments = path.split("/").filter(s => s !== "");
  logger.log("[getParentPaths] Segments:", segments);
  
  const parents: string[] = [""];  // Root always included
  
  for (let i = 0; i < segments.length - 1; i++) {
    parents.push(segments.slice(0, i + 1).join("/"));
  }
  
  logger.log("[getParentPaths] Parent paths:", parents);
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
        logger.log("[setCurrentDirectory] Called with dir:", dir);
        set(state => {
          logger.log("[setCurrentDirectory] Current state.currentDirectory:", state.currentDirectory);
          
          // Early return if same directory
          if (dir?.path === state.currentDirectory?.path) {
            logger.log("[setCurrentDirectory] Same directory, early return");
            return state;
          }
          
          // Compute and expand all parent paths
          const newExpandedNodes = new Set(state.expandedNodes);
          const newFetchedNodes = new Set(state.fetchedNodes);
          
          logger.log("[setCurrentDirectory] Before expansion - expandedNodes:", Array.from(state.expandedNodes));
          
          if (dir?.path) {
            logger.log("[setCurrentDirectory] Computing parent paths for:", dir.path);
            getParentPaths(dir.path).forEach(parentPath => {
              logger.log("[setCurrentDirectory] Expanding parent:", parentPath);
              newExpandedNodes.add(parentPath);
              newFetchedNodes.add(parentPath);
            });
          }
          
          logger.log("[setCurrentDirectory] After expansion - expandedNodes:", Array.from(newExpandedNodes));
          
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
        logger.log("[toggleExpanded] Called with path:", path);
        set(state => {
          const newSet = new Set(state.expandedNodes);
          const wasExpanded = newSet.has(path);
          if (wasExpanded) {
            newSet.delete(path);
            logger.log("[toggleExpanded] Collapsing path:", path);
          } else {
            newSet.add(path);
            logger.log("[toggleExpanded] Expanding path:", path);
          }
          logger.log("[toggleExpanded] New expandedNodes:", Array.from(newSet));
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
      partialize: (state) => {
        logger.log("[partialize] Persisting state.currentDirectory:", state.currentDirectory);
        const persistedData = {
          currentDirectory: state.currentDirectory,
        };
        logger.log("[partialize] Persisted data:", persistedData);
        return persistedData;
      },
      merge: (persistedState, currentState) => {
        logger.log("[StorageTreeStore] MERGE called");
        logger.log("[StorageTreeStore] persistedState:", persistedState);
        logger.log("[StorageTreeStore] currentState:", currentState);
        
        const typedPersisted = persistedState as Partial<StorageTreeState>;
        
        // Derive expandedNodes and fetchedNodes from currentDirectory.path
        const currentDirectory = 
          typedPersisted.currentDirectory || currentState.currentDirectory;
        
        logger.log("[StorageTreeStore] currentDirectory for expansion:", currentDirectory);
        
        const expandedNodes = new Set<string>();
        const fetchedNodes = new Set<string>();
        
        if (currentDirectory?.path) {
          logger.log("[StorageTreeStore] Computing parent paths for:", currentDirectory.path);
          getParentPaths(currentDirectory.path).forEach(path => {
            logger.log("[StorageTreeStore] Adding to expandedNodes:", path);
            expandedNodes.add(path);
            fetchedNodes.add(path);
          });
        } else {
          logger.log("[StorageTreeStore] No currentDirectory.path found");
        }
        
        logger.log("[StorageTreeStore] Final expandedNodes:", Array.from(expandedNodes));
        logger.log("[StorageTreeStore] Final fetchedNodes:", Array.from(fetchedNodes));
        
        const mergedState = {
          ...currentState,
          ...typedPersisted,
          expandedNodes,
          fetchedNodes,
        };
        
        logger.log("[StorageTreeStore] Merged state:", mergedState);
        return mergedState;
      },
    }
  )
);


