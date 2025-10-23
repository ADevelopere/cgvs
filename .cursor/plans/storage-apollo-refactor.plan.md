<!-- 5aa22cea-5faf-47ca-8400-fc1fccb8c441 7b32e646-0b9b-432d-b793-62ba61087391 -->
# Storage Module Query Refactor Plan

## Overview

Migrate from imperative fetch functions to declarative useQuery pattern with Apollo cache eviction, eliminating redundant data storage and simplifying the data flow.

## Phase 1: Update Stores - Remove Data Storage

### 1.1 Update useStorageDataStore

**File**: `client/views/storage/stores/useStorageDataStore.ts`

Remove from store:

- `items: StorageItemUnion[]`
- `pagination: PageInfo | null`
- `setItems()` function
- `setPagination()` function

Keep only:

- `params: FilesListInput` (query variables)
- `stats: StorageStats | null` (optional, if needed elsewhere)
- `setParams()` function
- `updateParams()` function
- `setStats()` function
- `reset()` function

### 1.2 Update useStorageUIStore

**File**: `client/views/storage/stores/useStorageUIStore.ts`

Remove from store:

- `loading: LoadingStates` object
- `operationErrors: OperationErrors` object
- `updateLoading()` function
- `updateError()` function

Keep:

- `searchMode: boolean`
- `searchResults: StorageItemUnion[]` (temporarily, will use query data)
- `selectedItems: string[]`
- `focusedItem: string | null`
- `clipboard: StorageClipboardState | null`
- All UI state management functions

### 1.3 Update useStorageActions

**File**: `client/views/storage/hooks/useStorageActions.ts`

Remove functions:

- `setItems()`
- `setPagination()`
- `navigateToDirectory()` (was atomic update of params+items+pagination)
- `clearNavigationState()`
- `updateLoading()`
- `updateError()`

Keep and ensure working:

- `setParams()`
- `updateParams()`
- All UI state functions (setFocusedItem, toggleSelect, etc.)

## Phase 2: Add Cache Eviction to Mutations

### 2.1 Update useStorageMutations

**File**: `client/views/storage/hooks/useStorageMutations.ts`

Add Apollo client and cache eviction helpers:

```typescript
import { useApolloClient } from "@apollo/client";

export const useStorageMutations = () => {
  const apolloClient = useApolloClient();
  
  // Helper to evict listFiles cache
  const evictListFilesCache = useCallback((path?: string) => {
    apolloClient.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'listFiles',
      args: { input: { path: path || "" } }
    });
    apolloClient.cache.gc();
  }, [apolloClient]);
  
  // Helper to evict directoryChildren cache
  const evictDirectoryChildrenCache = useCallback((path?: string) => {
    apolloClient.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'directoryChildren',
      args: { path: path || undefined }
    });
    apolloClient.cache.gc();
  }, [apolloClient]);
  
  // ... rest of implementation
}
```

Update each mutation to evict cache on success:

- `deleteStorageItems`: Evict current path after success
- `copyStorageItems`: Evict destination path after success
- `moveStorageItems`: Evict both source and destination paths after success
- `createFolder`: Evict parent path + directoryChildren cache after success
- `renameFile`: Evict parent path after success

## Phase 3: Refactor useStorageOperations

### 3.1 Remove Fetch Functions

**File**: `client/views/storage/hooks/useStorageOperations.tsx`

Remove these functions completely (lines 110-232, 234-277, 535-568):

- `fetchList()` - replaced by useQuery
- `fetchDirectoryChildren()` - not directly used
- `fetchStats()` - getting rid of it
- `search()` - replaced by useQuery

### 3.2 Simplify Navigation Functions

Update `navigateTo()` (lines 650-730 → ~15 lines):

```typescript
const navigateTo = useCallback(
  (path: string) => {
    logger.info("navigateTo called", {
      fromPath: dataStoreRef.current.params.path,
      toPath: path,
    });
    
    if (dataStoreRef.current.params.path === path) {
      logger.info("Skipping navigation - already at target path", { path });
      return;
    }
    
    const newParams = { 
      ...dataStoreRef.current.params, 
      path, 
      offset: 0 
    };
    
    actionsRef.current.setParams(newParams);
    logger.info("Params updated, useQuery will refetch", { newParams });
  },
  []
);
```

Update `goUp()` (remove await, use dataStoreRef):

```typescript
const goUp = useCallback(() => {
  const currentPath = dataStoreRef.current.params.path;
  
  if (!currentPath || currentPath === "") {
    logger.info("Already at root - cannot go up further");
    return;
  }
  
  const cleanPath = currentPath.replace(/\/+$/, "");
  const pathSegments = cleanPath.split("/").filter(segment => segment !== "");
  const parentPath = pathSegments.length > 1 
    ? pathSegments.slice(0, -1).join("/") 
    : "";
  
  navigateTo(parentPath);
}, [navigateTo]);
```

Update `refresh()` (cache eviction only):

```typescript
const refresh = useCallback(() => {
  const currentParams = dataStoreRef.current.params;
  
  logger.info("Manual refresh - evicting cache", {
    path: currentParams.path,
  });
  
  apolloRef.current.client.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'listFiles',
    args: { input: currentParams }
  });
  apolloRef.current.client.cache.gc();
  
  logger.info("Cache evicted, useQuery will refetch");
}, []);
```

### 3.3 Remove refresh() calls from mutation wrappers

Update these functions to remove `await refresh()` calls:

- `renameItem()` line 581
- `deleteItems()` line 597
- `moveItems()` line 614
- `copyItemsTo()` line 631
- `pasteItems()` lines 775, 782

### 3.4 Update Type Definition

Update `StorageOperations` type (lines 19-63):

```typescript
type StorageOperations = {
  // Remove these:
  // fetchList, fetchDirectoryChildren, fetchStats, search
  
  // Update signatures (remove async):
  navigateTo: (path: string) => void;
  goUp: () => void;
  refresh: () => void;
  
  // Keep these unchanged:
  rename: (path: string, newName: string) => Promise<boolean>;
  remove: (paths: string[]) => Promise<boolean>;
  move: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  copy: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  createFolder: (path: string, name: string) => Promise<boolean>;
  renameItem: (path: string, newName: string) => Promise<boolean>;
  deleteItems: (paths: string[]) => Promise<boolean>;
  moveItems: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  copyItemsTo: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
  pasteItems: () => Promise<boolean>;
};
```

## Phase 4: Add useQuery to Components

### 4.1 Update StorageMainView - Add listFiles useQuery

**File**: `client/views/storage/browser/StorageMainView.tsx`

Add useQuery at component top with useMemo for derived data:

```typescript
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { listFilesQueryDocument } from "@/client/views/storage/core/storage.documents";

const StorageMainView: React.FC = () => {
  const { params } = useStorageDataStore();
  
  // Query based on params
  const { data, loading, error } = useQuery(listFilesQueryDocument, {
    variables: { input: params },
  });
  
  // Use useMemo to derive items from query data
  const items = useMemo(() => {
    return data?.listFiles?.items || [];
  }, [data?.listFiles?.items]);
  
  // Use useMemo to derive pagination from query data
  const pagination = useMemo(() => {
    if (!data?.listFiles) return null;
    
    return {
      hasMorePages: data.listFiles.hasMore,
      total: data.listFiles.totalCount,
      count: data.listFiles.totalCount,
      perPage: data.listFiles.limit,
      firstItem: data.listFiles.offset,
      currentPage: Math.floor(data.listFiles.totalCount / data.listFiles.limit) + 1,
      lastPage: Math.ceil(data.listFiles.totalCount / data.listFiles.limit),
    };
  }, [
    data?.listFiles?.hasMore,
    data?.listFiles?.totalCount,
    data?.listFiles?.limit,
    data?.listFiles?.offset,
  ]);
  
  // Pass data as props to children
  return (
    <Box>
      <StorageBreadcrumb params={params} onNavigate={navigateTo} />
      <StorageToolbar
        items={items}
        params={params}
        loading={loading}
        // ...
      />
      <StorageItemsView
        items={items}
        pagination={pagination}
        loading={loading}
        error={error}
        params={params}
        onNavigate={navigateTo}
        onRefresh={refresh}
        // ...
      />
    </Box>
  );
};
```

Add useEffect for focused item validation:

```typescript
useEffect(() => {
  if (focusedItem && !items.find(item => item.path === focusedItem)) {
    actions.setFocusedItem(null);
  }
}, [items, focusedItem, actions]);
```

### 4.2 Update StorageBrowserView - Add search useQuery

**File**: `client/views/storage/StorageBrowserView.tsx`

Add search query with skip and useMemo for derived data:

```typescript
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { searchFilesQueryDocument } from "./core/storage.documents";

export const StorageBrowserView: React.FC = () => {
  const { searchMode } = useStorageUIStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Search query - only runs when explicitly searching
  const { data: searchData, loading: searchLoading } = useQuery(
    searchFilesQueryDocument,
    {
      variables: { 
        searchTerm: searchTerm,
        folder: "",
        limit: 100
      },
      skip: !searchMode || !searchTerm,
    }
  );
  
  // Use useMemo to derive search results from query data
  const searchResults = useMemo(() => {
    return searchData?.searchFiles?.items || [];
  }, [searchData?.searchFiles?.items]);
  
  // Pass to StorageSearch
  return (
    <StorageSearch
      searchMode={searchMode}
      setSearchMode={setSearchMode}
      searchResults={searchResults}
      searchLoading={searchLoading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      // ...
    />
  );
}
```

## Phase 5: Update Component Props

### 5.1 Update StorageItemsView

**File**: `client/views/storage/browser/StorageItemsView.tsx`

Update props interface:

```typescript
interface StorageItemsViewProps {
  // Add these props:
  items: StorageItemUnion[];
  pagination: PageInfo | null;
  loading: boolean;
  error: ApolloError | undefined;
  
  // Remove access to stores for items/pagination
  // Keep other props unchanged
  searchMode: boolean;
  viewMode: ViewMode;
  params: FilesListInput;
  onNavigate: (path: string) => void;  // Updated signature
  onRefresh: () => void;  // Updated signature
  // ...
}
```

Remove store access for data:

```typescript
// REMOVE: const { items } = useStorageDataStore();
// REMOVE: const { loading, operationErrors } = useStorageUIStore();

// Use props instead:
const { items, pagination, loading, error, ...otherProps } = props;
```

### 5.2 Update StorageBreadcrumb

**File**: `client/views/storage/browser/StorageBreadcrumb.tsx`

Update prop signature:

```typescript
interface StorageBreadcrumbProps {
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => void;  // Remove currentParams
}
```

Update usage:

```typescript
// Before: onNavigate(path, params)
// After: onNavigate(path)
```

### 5.3 Update StorageDirectoryTree

**File**: `client/views/storage/browser/StorageDirectoryTree.tsx`

Update prop signature:

```typescript
interface StorageDirectoryTreeProps {
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => void;  // Remove currentParams
}
```

Update callback:

```typescript
const handleSelectDirectory = useCallback(
  (node: StorageDirectoryNode) => {
    setCurrentDirectory(node);
    onNavigate(node.path);  // Remove params argument
  },
  [setCurrentDirectory, onNavigate]
);
```

### 5.4 Update StorageItem and sub-components

**File**: `client/views/storage/browser/StorageItem.tsx`

Update prop signature:

```typescript
interface StorageItemProps {
  // Update:
  onNavigate: (path: string) => void;  // Remove currentParams
  onRefresh: () => void;  // Remove async
  // ... keep others
}
```

Update usage:

```typescript
// In handleDoubleClick:
onNavigate(item.path);  // Remove params
```

### 5.5 Update StorageToolbar

**File**: `client/views/storage/browser/StorageToolbar.tsx`

Update props:

```typescript
interface StorageToolbarProps {
  items: StorageItemUnion[];  // Now from props
  loading: boolean;  // Now from props
  // ... other props
}
```

### 5.6 Update ViewAreaMenu

**File**: `client/views/storage/menu/ViewAreaMenu.tsx`

Update prop signatures:

```typescript
interface ViewAreaMenuProps {
  onRefresh: () => void;  // Remove async
  onPasteItems: () => Promise<boolean>;
  // ... other props
}
```

### 5.7 Update StorageSearch

**File**: `client/views/storage/browser/StorageSearch.tsx`

Update to receive search results as prop instead of calling search function:

```typescript
interface StorageSearchProps {
  searchMode: boolean;
  setSearchMode: (mode: boolean) => void;
  searchResults: StorageItemUnion[];
  searchLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  // Remove: onSearch function
}
```

## Phase 6: Update Type Definitions

### 6.1 Update storage.type.ts

**File**: `client/views/storage/core/storage.type.ts`

Remove from types:

- `LoadingStates` type (or keep if used elsewhere)
- `OperationErrors` type
- Data-related actions from `StorageActions` interface

## Phase 7: Testing & Validation

After implementation, verify:

1. Navigation between directories works
2. Refresh button evicts cache and refetches
3. Delete/Move/Copy/Rename operations trigger automatic refetch
4. Search only queries when explicitly searching
5. Focused item clears when navigating to directory without it
6. No redundant data in stores
7. Loading and error states display correctly from useQuery
8. All 56+ refresh() call sites are eliminated
9. useMemo optimizations prevent unnecessary recalculations

## Summary of Changes

**Files to modify**: 15 files

**Lines removed**: ~300+ lines (fetch logic, store management)

**Lines added**: ~200 lines (useQuery implementations, cache eviction, useMemo)

**Net reduction**: ~100 lines

**Key improvements**:

- Single source of truth (Apollo cache)
- Automatic refetching via cache eviction
- Simpler data flow (Query → useMemo → Props)
- Reduced store complexity
- Better performance (Apollo caching + useMemo optimization)
- Prevent unnecessary recalculations of derived data

### To-dos

- [ ] Remove data storage (items, pagination, loading, errors) from useStorageDataStore and useStorageUIStore, keep only query params and UI state
- [ ] Remove data-related actions (setItems, setPagination, navigateToDirectory, updateLoading, updateError) from useStorageActions
- [ ] Add Apollo cache eviction helpers to useStorageMutations for all mutation operations (delete, move, copy, create, rename)
- [ ] Remove fetchList, fetchDirectoryChildren, fetchStats, and search functions from useStorageOperations
- [ ] Refactor navigateTo, goUp, and refresh functions in useStorageOperations to only update params or evict cache
- [ ] Remove all await refresh() calls from mutation wrappers (renameItem, deleteItems, moveItems, copyItemsTo, pasteItems)
- [ ] Add useQuery for listFiles in StorageMainView with useMemo for derived items and pagination
- [ ] Add useQuery with skip for searchFiles in StorageBrowserView with useMemo for derived search results
- [ ] Update prop interfaces and implementations for all child components (StorageItemsView, StorageBreadcrumb, StorageDirectoryTree, StorageItem, StorageToolbar, ViewAreaMenu, StorageSearch)
- [ ] Update StorageOperations type and remove unused types from storage.type.ts
- [ ] Test navigation, refresh, mutations, search, and focused item behavior