<!-- 3eb745c8-c433-4068-8052-1374c19baf0a d8d79d21-bf73-430d-8d23-f93c22597018 -->

# Storage Module Apollo Query Refactor

## Overview

Refactor storage module to use Apollo useQuery pattern instead of imperative fetch functions, eliminating redundant state and implementing automatic cache eviction after mutations.

## Phase 1: Update Stores - Remove Data Storage

**Files to modify:**

- `client/views/storage/stores/useStorageDataStore.ts`
- `client/views/storage/stores/useStorageUIStore.ts`
- `client/views/storage/hooks/useStorageActions.ts`

**Changes:**

### useStorageDataStore

Remove from state and functions:

- `items: StorageItemUnion[]`
- `pagination: PageInfo | null`
- `stats: StorageStats | null` (complete removal)
- `setItems()`, `setPagination()`, `setStats()`

Keep only:

- `params: FilesListInput`
- `setParams()`, `updateParams()`, `reset()`

### useStorageUIStore

Remove from state and functions:

- `loading: LoadingStates`
- `operationErrors: OperationErrors`
- `setLoading()`, `setOperationErrors()`

Keep all other UI state (searchMode, selectedItems, focusedItem, clipboard, etc.)

### useStorageActions

Remove these functions:

- `setItems()`, `setPagination()`, `setStats()`
- `navigateToDirectory()`
- `updateLoading()`, `updateError()`
- `clearNavigationState()` (only if it references removed state)

Keep all other actions for params and UI state management.

**Validation checkpoint:** Verify stores compile and only contain UI state and query params.

---

## Phase 2: Add Cache Eviction to Mutations

**File to modify:**

- `client/views/storage/hooks/useStorageMutations.ts`

**Changes:**

Add Apollo client import and cache eviction helpers:

```typescript
import { useApolloClient } from "@apollo/client";

export const useStorageMutations = () => {
  const apolloClient = useApolloClient();

  const evictListFilesCache = useCallback(
    (path?: string) => {
      apolloClient.cache.evict({
        id: "ROOT_QUERY",
        fieldName: "listFiles",
        args: { input: { path: path || "" } },
      });
      apolloClient.cache.gc();
    },
    [apolloClient]
  );

  const evictDirectoryChildrenCache = useCallback(
    (path?: string) => {
      apolloClient.cache.evict({
        id: "ROOT_QUERY",
        fieldName: "directoryChildren",
        args: { path: path || undefined },
      });
      apolloClient.cache.gc();
    },
    [apolloClient]
  );

  // ... rest of mutations
};
```

Update each mutation wrapper to call eviction on success:

- `deleteStorageItems`: Evict current path
- `copyStorageItems`: Evict destination path
- `moveStorageItems`: Evict both source and destination
- `createFolder`: Evict parent path + directoryChildren
- `renameFile`: Evict parent path

Return eviction helpers along with mutations for use in operations.

**Validation checkpoint:** Verify mutations compile and cache eviction logic is present.

---

## Phase 3: Refactor useStorageOperations

**File to modify:**

- `client/views/storage/hooks/useStorageOperations.tsx`

**Changes:**

### Remove Fetch Functions (lines ~110-277, 535-568)

Delete these functions completely:

- `fetchList()`
- `fetchDirectoryChildren()`
- `fetchStats()`
- `search()`

### Simplify Navigation (lines ~650-730)

Replace `navigateTo()` with simple param update:

```typescript
const navigateTo = useCallback((path: string) => {
  logger.info("navigateTo called", {
    fromPath: dataStoreRef.current.params.path,
    toPath: path,
  });

  if (dataStoreRef.current.params.path === path) {
    logger.info("Skipping navigation - already at target path", { path });
    return;
  }

  const newParams = { ...dataStoreRef.current.params, path, offset: 0 };
  actionsRef.current.setParams(newParams);
  logger.info("Params updated, useQuery will refetch", { newParams });
}, []);
```

Update `goUp()` - remove async, use dataStoreRef:

```typescript
const goUp = useCallback(() => {
  const currentPath = dataStoreRef.current.params.path;
  if (!currentPath || currentPath === "") {
    logger.info("Already at root");
    return;
  }
  const cleanPath = currentPath.replace(/\/+$/, "");
  const pathSegments = cleanPath.split("/").filter(s => s !== "");
  const parentPath =
    pathSegments.length > 1 ? pathSegments.slice(0, -1).join("/") : "";
  navigateTo(parentPath);
}, [navigateTo]);
```

Update `refresh()` - cache eviction only:

```typescript
const refresh = useCallback(() => {
  const currentParams = dataStoreRef.current.params;
  logger.info("Manual refresh - evicting cache", { path: currentParams.path });

  apolloRef.current.client.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "listFiles",
    args: { input: currentParams },
  });
  apolloRef.current.client.cache.gc();
  logger.info("Cache evicted, useQuery will refetch");
}, []);
```

### Remove refresh() calls from mutation wrappers

In these functions, remove all `await refresh()` calls:

- `renameItem()` (line ~581)
- `deleteItems()` (line ~597)
- `moveItems()` (line ~614)
- `copyItemsTo()` (line ~631)
- `pasteItems()` (lines ~775, 782)

### Update Type Definition

Change `StorageOperations` type to remove fetch functions and make navigation sync:

```typescript
type StorageOperations = {
  // Remove: fetchList, fetchDirectoryChildren, fetchStats, search

  // Update to sync:
  navigateTo: (path: string) => void;
  goUp: () => void;
  refresh: () => void;

  // Keep async mutation wrappers unchanged
  rename;
  remove;
  move;
  copy;
  createFolder;
  renameItem;
  deleteItems;
  moveItems;
  copyItemsTo;
  pasteItems;
};
```

**Validation checkpoint:** Verify operations compile, navigation is synchronous, and no fetch functions remain.

---

## Phase 4: Add useQuery to Components

**Files to modify:**

- `client/views/storage/browser/StorageMainView.tsx`
- `client/views/storage/StorageBrowserView.tsx`

**Changes:**

### StorageMainView - Add listFiles useQuery

Add imports and query at component top:

```typescript
import { useQuery } from "@apollo/client";
import { useMemo, useEffect } from "react";
import { listFilesQueryDocument } from "../core/storage.documents";

const StorageMainView: React.FC = () => {
  const { params } = useStorageDataStore();

  const { data, loading, error } = useQuery(listFilesQueryDocument, {
    variables: { input: params },
  });

  const items = useMemo(() => data?.listFiles?.items || [], [data?.listFiles?.items]);

  const pagination = useMemo(() => {
    if (!data?.listFiles) return null;
    return {
      hasMorePages: data.listFiles.hasMore,
      total: data.listFiles.totalCount,
      count: data.listFiles.totalCount,
      perPage: data.listFiles.limit,
      firstItem: data.listFiles.offset,
      currentPage: Math.floor(data.listFiles.offset / data.listFiles.limit) + 1,
      lastPage: Math.ceil(data.listFiles.totalCount / data.listFiles.limit),
    };
  }, [data?.listFiles]);

  // Clear focused item if it's not in current items
  useEffect(() => {
    if (focusedItem && !items.find(item => item.path === focusedItem)) {
      actions.setFocusedItem(null);
    }
  }, [items, focusedItem, actions]);

  // Pass items, pagination, loading, error as props to children
  return (
    <Box>
      <StorageBreadcrumb params={params} onNavigate={navigateTo} />
      <StorageToolbar items={items} loading={loading} ... />
      <StorageItemsView items={items} pagination={pagination} loading={loading} error={error} ... />
    </Box>
  );
};
```

### StorageBrowserView - Add searchFiles useQuery

Add search query with skip:

```typescript
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { searchFilesQueryDocument } from "./core/storage.documents";

export const StorageBrowserView: React.FC = () => {
  const { searchMode } = useStorageUIStore();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchData, loading: searchLoading } = useQuery(
    searchFilesQueryDocument,
    {
      variables: { searchTerm, folder: "", limit: 100 },
      skip: !searchMode || !searchTerm,
    }
  );

  const searchResults = useMemo(() => searchData?.searchFiles?.items || [], [searchData?.searchFiles?.items]);

  return (
    <StorageSearch
      searchMode={searchMode}
      setSearchMode={setSearchMode}
      searchResults={searchResults}
      searchLoading={searchLoading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
}
```

**Validation checkpoint:** Verify queries compile and components receive data from Apollo.

---

## Phase 5: Update Component Props

**Files to modify:**

- `client/views/storage/browser/StorageItemsView.tsx`
- `client/views/storage/browser/StorageBreadcrumb.tsx`
- `client/views/storage/browser/StorageDirectoryTree.tsx`
- `client/views/storage/browser/StorageItem.tsx`
- `client/views/storage/browser/StorageToolbar.tsx`
- `client/views/storage/menu/ViewAreaMenu.tsx`
- `client/views/storage/browser/StorageSearch.tsx`

**Changes:**

### StorageItemsView

Add props for data:

```typescript
interface StorageItemsViewProps {
  items: StorageItemUnion[];
  pagination: PageInfo | null;
  loading: boolean;
  error: ApolloError | undefined;
  // Update navigation signatures
  onNavigate: (path: string) => void;
  onRefresh: () => void;
  // ... keep other props
}
```

Remove store access for items, pagination, loading. Use props instead.

### StorageBreadcrumb

```typescript
interface StorageBreadcrumbProps {
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => void; // Remove currentParams
}
```

### StorageDirectoryTree

```typescript
interface StorageDirectoryTreeProps {
  params: Graphql.FilesListInput;
  onNavigate: (path: string) => void; // Remove currentParams
}
```

### StorageItem

Update navigation to synchronous:

```typescript
interface StorageItemProps {
  onNavigate: (path: string) => void;
  onRefresh: () => void;
  // ... keep others
}
```

### StorageToolbar

```typescript
interface StorageToolbarProps {
  items: StorageItemUnion[]; // From props
  loading: boolean; // From props
  // ... other props
}
```

### ViewAreaMenu

```typescript
interface ViewAreaMenuProps {
  onRefresh: () => void; // Remove async
  // ... other props
}
```

### StorageSearch

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

**Validation checkpoint:** Verify all components compile with updated prop interfaces.

---

## Phase 6: Update Type Definitions & Cleanup

**File to modify:**

- `client/views/storage/core/storage.type.ts`

**Changes:**

Remove unused types:

- `LoadingStates` (if not used elsewhere)
- `OperationErrors`

Update `StorageActions` interface to remove:

- `setItems`, `setPagination`, `setStats`
- `navigateToDirectory`
- `updateLoading`, `updateError`
- `clearNavigationState` (if it was removed)

**Validation checkpoint:** Verify types compile and no unused types remain.

---

## Testing Checklist (Manual)

After all phases complete:

1. Navigation between directories works
2. Refresh button evicts cache and refetches
3. Delete/Move/Copy/Rename trigger automatic refetch
4. Search only queries when explicitly searching
5. Focused item clears when navigating away
6. No redundant data in stores
7. Loading and error states display from useQuery
8. All console errors are resolved

## Expected Outcome

- ~300 lines removed (fetch logic, store management)
- ~200 lines added (useQuery, cache eviction, useMemo)
- Net reduction: ~100 lines
- Single source of truth (Apollo cache)
- Automatic refetching via cache eviction
- Simpler data flow: Query → useMemo → Props

### To-dos

- [ ] Phase 1: Remove data storage from stores (items, pagination, stats, loading, errors)
- [ ] Phase 2: Add Apollo cache eviction helpers to mutations
- [ ] Phase 3: Refactor useStorageOperations - remove fetch functions, simplify navigation
- [ ] Phase 4: Add useQuery to StorageMainView and StorageBrowserView
- [ ] Phase 5: Update component prop interfaces and remove store access
- [ ] Phase 6: Remove unused types and clean up type definitions
