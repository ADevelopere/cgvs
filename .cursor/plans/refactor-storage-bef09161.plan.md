<!-- bef09161-0029-4fdb-bef2-ae0561ff2355 d9bbf591-4529-4697-b829-0dd77a4433a0 -->
# Refactor Storage Directory Tree to Reactive Pattern

## Overview

Simplify the storage directory tree implementation by adopting the ReactiveCategoryTree pattern used in CategoryPane, removing complex state management and relying on Apollo cache.

## Key Changes Comparison

**Current (Complex):**

- Stores entire `directoryTree: DirectoryTreeNode[]` array
- Complex queue management (`fetchQueue`, `expansionQueue`, `currentlyFetching`)
- Manual tree updates via `addChildToNode`, `updateTreeNode`
- Prefetch tracking with `prefetchedNodes`

**Target (Simplified - like CategoryPane):**

- NO tree data storage (Apollo cache handles it)
- NO queue management (reactive tree handles fetching)
- Simple expansion/fetch tracking: `expandedNodes: Set<string>`, `fetchedNodes: Set<string>`
- Store only `currentDirectory` selection state

## Implementation Steps

### 1. Simplify `useStorageTreeStore.ts` with Persistence

**Pattern from CategoryPane:**

- Uses `persist` middleware with `sessionStorage`
- Stores `currentCategory` (with `parentTree`)
- On restore: derives `expandedCategoryIds`/`fetchedCategoryIds` from `parentTree`
- On select: expands all ancestors

**For Directory Tree:**

- Must compute parent paths from path string
- E.g., `"folder1/folder2/folder3"` → parents: `["", "folder1", "folder1/folder2"]`

**Remove:**

- `directoryTree: DirectoryTreeNode[]`
- `queueStates: QueueStates` and all queue-related state
- `prefetchedNodes` (replace with `fetchedNodes`)

**Keep/Add:**

```typescript
type StorageTreeState = {
  currentDirectory: Graphql.DirectoryInfo | null; // Selected directory
  expandedNodes: Set<string>; // Expansion state (in-memory, derived on restore)
  fetchedNodes: Set<string>; // Fetch tracking (in-memory, derived on restore)
};

type StorageTreeStore = StorageTreeState & {
  setCurrentDirectory: (dir: Graphql.DirectoryInfo | null) => void;
  updateCurrentDirectory: (dir: Graphql.DirectoryInfo | null) => void;
  toggleExpanded: (path: string) => void;
  markAsFetched: (path: string) => void;
  isFetched: (path: string) => boolean;
  reset: () => void;
};
```

**Add persistence with helper function:**

```typescript
// Helper to compute parent paths from a directory path
function getParentPaths(path: string): string[] {
  if (!path || path === "") return [];
  
  const segments = path.split("/").filter(s => s !== "");
  const parents: string[] = [""];  // Root always included
  
  for (let i = 0; i < segments.length - 1; i++) {
    parents.push(segments.slice(0, i + 1).join("/"));
  }
  
  return parents;
}

// Example: "folder1/folder2/folder3" → ["", "folder1", "folder1/folder2"]
```

**Implement persist middleware:**

```typescript
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
      
      // Similar to category store's updateSelectedCategory
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
      
      // ... other actions
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
```

Files: `client/views/storage/stores/useStorageTreeStore.ts`

### 2. Update Type Definitions

**Modify `DirectoryTreeNode` in `storage.type.ts`:**

- Make it compatible with `ReactiveTreeNode` interface
- Remove client-side fields (`isExpanded`, `isLoading`, `isPrefetched`, `children`)
- These are now handled by reactive tree internally
```typescript
export type StorageDirectoryNode = Graphql.DirectoryInfo & {
  id: string; // Same as path for ReactiveTreeNode compatibility
};
```


**Remove from `storage.type.ts`:**

- `QueueStates` type (no longer needed)
- `LoadingStates.expandingNode` and `LoadingStates.prefetchingNode`

Files: `client/views/storage/core/storage.type.ts`

### 3. Refactor `StorageDirectoryTree.tsx`

Replace the current TreeView implementation with ReactiveCategoryTree.

**IMPORTANT: Follow CategoryPane pattern - wrap ALL functions in `React.useCallback`**

**Add callback handlers (like CategoryPane lines 60-184):**

```typescript
const handleSelectDirectory = React.useCallback(
  (node: StorageDirectoryNode) => {
    onNavigate(node.path, params);
  },
  [onNavigate, params]
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
    data.directoryChildren.map(dir => ({
      ...dir,
      id: dir.path,
    })) || [],
  []
);

const getNodeLabel = React.useCallback(
  (node: StorageDirectoryNode) => node.name,
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
```

**ReactiveCategoryTree usage:**

```typescript
<ReactiveCategoryTree<
  StorageDirectoryNode,
  Graphql.DirectoryChildrenQuery,
  Graphql.DirectoryChildrenQueryVariables
>
  resolver={parent => ({
    query: directoryChildrenQueryDocument,
    variables: parent ? { path: parent.path } : { path: "" },
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
```

**Remove props:**

- `directoryTree`
- `queueStates`
- `loading` (ReactiveCategoryTree has built-in loading indicator)
- `onExpandNode`, `onCollapseNode` (replaced by `onToggleExpand`)
- `onPrefetchChildren` (reactive tree handles automatically)

**Update component signature:**

```typescript
interface StorageDirectoryTreeProps {
  params: Graphql.FilesListInput;
  expandedNodes: Set<string>;
  onNavigate: (path: string, currentParams: Graphql.FilesListInput) => Promise<void>;
  updateCurrentDirectory: (node: StorageDirectoryNode) => void;
  toggleExpanded: (path: string) => void;
  isFetched: (path: string) => boolean;
  markAsFetched: (path: string) => void;
}
```

Files: `client/views/storage/browser/StorageDirectoryTree.tsx`

### 4. Update `useStorageActions.ts`

**Remove all tree-related actions:**

- `setDirectoryTree`
- `updateTreeNode`
- `addChildToNode`
- `expandNode`, `collapseNode`
- `setPrefetchedNode`
- All queue management actions: `addToFetchQueue`, `removeFromFetchQueue`, `addToExpansionQueue`, `removeFromExpansionQueue`, `setCurrentlyFetching`, `clearQueues`
- `resetTree` (now in `useStorageTreeActions`)

**Keep only general storage actions:**

- Data actions (setItems, setPagination, etc.)
- Selection actions (toggleSelect, selectAll, etc.)
- UI interaction actions (setViewMode, setSearchMode, etc.)
- Sorting actions
- Loading and error actions
- Reset actions for data and UI only

Files: `client/views/storage/hooks/useStorageActions.ts`

### 5. Simplify `useStorageOperations.tsx`

**Remove functions:**

- `prefetchDirectoryChildren` (reactive tree auto-fetches)
- `expandDirectoryNode` (replaced by reactive tree)
- `collapseDirectoryNode` (replaced by reactive tree)
- `processExpansionQueue` (no more queues)
- `transformDirectoryToTreeNode` (no longer needed)

**Keep:**

- `fetchDirectoryChildren` (used by other parts, if any)

**Update:**

- Remove all tree manipulation logic
- Remove queue processing logic
- Simplify to only handle navigation and file operations

Files: `client/views/storage/hooks/useStorageOperations.tsx`

### 6. Update Component Integration

Where `StorageDirectoryTree` is used, update props:

**Remove:**

- `directoryTree={directoryTree}`
- `queueStates={queueStates}`
- `onExpandNode={...}`
- `onCollapseNode={...}`
- `onPrefetchChildren={...}`

**Update:**

- `expandedNodes` now comes from simplified store
- Add `onToggleExpanded`, `isFetched`, `onMarkAsFetched` from store

Files: Any parent component using `StorageDirectoryTree`

### 7. Remove Loading State References

Update `LoadingStates` type:

- Remove `expandingNode: string | null`
- Remove `prefetchingNode: string | null`

Update components that reference these loading states.

Files: `client/views/storage/core/storage.type.ts`, any components using these states

### 8. Cleanup Apollo Context (if needed)

Ensure `fetchDirectoryChildren` is available in `StorageApolloContext` (it already is).

Files: `client/views/storage/contexts/StorageApolloContext.tsx`

## Benefits

1. **Simpler State**: From ~150 lines of tree state management → ~50 lines
2. **No Manual Tree Updates**: Apollo cache handles all tree data
3. **No Queue Management**: Reactive tree handles fetching automatically
4. **Consistent Pattern**: Matches category management implementation
5. **Automatic Prefetching**: Hover-based prefetch built into reactive tree
6. **Better Performance**: Apollo cache deduplication + automatic updates

## Files Modified

1. `client/views/storage/stores/useStorageTreeStore.ts` - Simplified state
2. `client/views/storage/core/storage.type.ts` - Updated types
3. `client/views/storage/browser/StorageDirectoryTree.tsx` - Use ReactiveCategoryTree
4. `client/views/storage/hooks/useStorageActions.ts` - Removed tree actions
5. `client/views/storage/hooks/useStorageOperations.tsx` - Removed tree operations
6. Parent components using StorageDirectoryTree (if any)