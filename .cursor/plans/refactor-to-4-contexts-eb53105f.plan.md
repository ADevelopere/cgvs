<!-- eb53105f-bfb9-46f3-8abe-d89ec2e1a633 7a0260f1-18d3-493c-a8d4-4652ef4b284b -->

# Refactor Storage Hooks to 4 Contexts (Incremental)

## Overview

Replace Zustand stores and individual hooks with 4 React Contexts, validating each context thoroughly before proceeding.

## Validation Process per Context

1. Create context file
2. Run lint and tsc, fix until clean
3. Compare with original hooks 3 times to ensure completeness
4. Update all components to use the new context
5. Run lint and tsc again
6. Proceed to next context

## Context 1: StorageApolloContext

**File:** `client/views/storage/contexts/StorageApolloContext.tsx`

**Sources:** `storage.operations.ts` (useStorageApolloQueries, useStorageApolloMutations)

**Provides:**

- All Apollo query functions: checkFileUsage, fetchDirectoryChildren, getFileInfo, getFolderInfo, getStorageStats, listFiles, searchFiles
- All Apollo mutation functions: copyStorageItems, createFolder, deleteFile, deleteStorageItems, generateUploadSignedUrl, moveStorageItems, renameFile, setStorageItemProtection, updateDirectoryPermissions

**Validation:**

- Run `~/.bun/bin/bun lint` and `~/.bun/bin/bun tsc`
- Compare with `storage.operations.ts` 3 times
- Update components using Apollo (minimal usage expected)
- Run lint/tsc

## Context 2: StorageStateContext

**File:** `client/views/storage/contexts/StorageStateContext.tsx`

**Sources:**

- `useStorageDataStore.ts`
- `useStorageUIStore.ts`
- `useStorageTreeStore.ts`
- `useStorageSelection.ts`
- `useStorageSorting.ts`

**Provides:**

- Data state: items, pagination, params, stats, setItems, setPagination, setParams, updateParams, setStats
- UI state: selectedItems, lastSelectedItem, focusedItem, viewMode, searchMode, searchResults, clipboard, sortBy, sortDirection, loading, operationErrors
- UI setters: setFocusedItem, setLastSelectedItem, setViewMode, setSearchMode, setSearchResults, setSortBy, setSortDirection, updateLoading, updateError
- Selection: toggleSelect, selectAll, clearSelection, selectRange
- Sorting: getSortedItems
- Clipboard: copyItems, cutItems, clearClipboard
- Tree state: directoryTree, expandedNodes, prefetchedNodes, queueStates, setDirectoryTree, addChildToNode, expandNode, collapseNode, setPrefetchedNode, queue management functions

**Validation:**

- Run lint/tsc
- Compare with `useStorageDataStore.ts` 3 times
- Compare with `useStorageUIStore.ts` 3 times
- Compare with `useStorageTreeStore.ts` 3 times
- Compare with `useStorageSelection.ts` 3 times
- Compare with `useStorageSorting.ts` 3 times
- Update all components
- Run lint/tsc

## Context 3: StorageOperationsContext

**File:** `client/views/storage/contexts/StorageOperationsContext.tsx`

**Sources:**

- `useStorageDataOperations.ts`
- `useStorageFileOperations.ts`
- `useStorageNavigation.ts`
- `useStorageTreeOperations.ts`
- `useStorageClipboard.ts`

**Provides:**

- Data operations: fetchList, fetchDirectoryChildren, fetchStats, rename, remove, move, copy, createFolder, search
- File operations (with loading): renameItem, deleteItems, moveItems, copyItemsTo
- Navigation: navigateTo, goUp, refresh
- Tree operations: prefetchDirectoryChildren, expandDirectoryNode, collapseDirectoryNode, processExpansionQueue
- Clipboard operations: pasteItems

**Validation:**

- Run lint/tsc
- Compare with `useStorageDataOperations.ts` 3 times
- Compare with `useStorageFileOperations.ts` 3 times
- Compare with `useStorageNavigation.ts` 3 times
- Compare with `useStorageTreeOperations.ts` 3 times
- Compare with `useStorageClipboard.ts` 3 times
- Update all components
- Run lint/tsc

## Context 4: StorageUploadContext

**File:** `client/views/storage/contexts/StorageUploadContext.tsx`

**Sources:**

- `useStorageUploadOperations.ts`
- `useUploadProgressUIOperations.ts`
- `useStorageUploadStore.ts`
- `useUploadProgressUIStore.ts`

**Provides:**

- Upload state: uploadBatch, files, totalCount, completedCount, totalProgress, timeRemaining, isUploading
- Upload operations: startUpload, cancelUpload, retryFailedUploads, retryFile, clearUploadBatch
- UI state: isCollapsed, showCancelDialog, cancelTarget
- UI operations: onToggleCollapse, onClose, onCancelAll, onCancelFile, onConfirmCancel, onDismissDialog

**Validation:**

- Run lint/tsc
- Compare with `useStorageUploadOperations.ts` 3 times
- Compare with `useUploadProgressUIOperations.ts` 3 times
- Compare with `useStorageUploadStore.ts` 3 times
- Compare with `useUploadProgressUIStore.ts` 3 times
- Update upload components
- Run lint/tsc

## Provider Wrapper

**File:** `client/views/storage/contexts/StorageProvider.tsx`

**Structure:**

```tsx
<StorageApolloProvider>
  <StorageStateProvider>
    <StorageOperationsProvider>
      <StorageUploadProvider>{children}</StorageUploadProvider>
    </StorageOperationsProvider>
  </StorageStateProvider>
</StorageApolloProvider>
```

**Update:** `StorageBrowserView.tsx` to use `<StorageProvider>`

## Final Cleanup

**Delete:**

- `stores/useStorageDataStore.ts`
- `stores/useStorageUIStore.ts`
- `stores/useStorageTreeStore.ts`
- `stores/useStorageUploadStore.ts`
- `stores/useUploadProgressUIStore.ts`
- `hooks/useStorageDataOperations.ts`
- `hooks/useStorageFileOperations.ts`
- `hooks/useStorageInitialization.ts`
- `hooks/useStorageNavigation.ts`
- `hooks/useStorageSelection.ts`
- `hooks/useStorageSorting.ts`
- `hooks/useStorageTreeOperations.ts`
- `hooks/useStorageUploadOperations.ts`
- `hooks/useStorageClipboard.ts`
- `hooks/useUploadProgressUIOperations.ts`

**Keep:**

- `storage.documents.ts`, `storage.operations.ts`, `storage.type.ts`, `storage.constant.ts`, `storage.util.ts`, `storage.location.ts`, `storage-upload.types.ts`

**Final validation:**

- Run lint and tsc

### To-dos

- [ ] Create 4 context files in client/views/storage/contexts/
- [ ] Create StorageProvider wrapper component
- [ ] Update all components to use new contexts
- [ ] Delete old stores and hook files
- [ ] Run lint and tsc to validate changes
