<!-- eb53105f-bfb9-46f3-8abe-d89ec2e1a633 868cfcaf-a086-4a78-8e1d-5d7015b7fc58 -->
# Refactor Storage Hooks to 4 Contexts

## CRITICAL CONSTRAINTS

### 🚫 CONTEXTS CANNOT IMPORT FROM `hooks/` FOLDER

- **NEVER** import ANY `useStorage*` or `use*Operations` hooks
- Copy ALL logic directly into contexts - no imports from hooks
- Import Apollo hooks directly from `@apollo/client/react` 
- Import notifications from `@toolpad/core/useNotifications`

### ✅ Validation Process Per Context

1. Create context file (copy all logic from source files)
2. Run `~/.bun/bin/bun lint` → fix all errors
3. Run `~/.bun/bin/bun tsc` → fix all errors
4. **Compare with source files** → if fails, go to step 2
5. **Compare again (2nd time)** → verify completeness
6. **Compare again (3rd time)** → absolutely certain nothing is missed
7. Update ALL components using this context
8. Run lint and tsc one final time
9. **⏸️ WAIT FOR USER REVIEW AND APPROVAL**
10. **ONLY AFTER APPROVAL** proceed to next context

## Context 1: StorageApolloContext

**File:** `client/views/storage/contexts/StorageApolloContext.tsx`

**Copy logic from:** `storage.operations.ts` (lines 8-106)

**Provides:**

- checkFileUsage, fetchDirectoryChildren, getFileInfo, getFolderInfo, getStorageStats, listFiles, searchFiles
- copyStorageItems, createFolder, deleteFile, deleteStorageItems, generateUploadSignedUrl, moveStorageItems, renameFile, setStorageItemProtection, updateDirectoryPermissions

**Components to update:** Minimal - operations context uses this

## Context 2: StorageStateContext

**File:** `client/views/storage/contexts/StorageStateContext.tsx`

**Copy logic from:**

- `stores/useStorageDataStore.ts` (all state + actions)
- `stores/useStorageUIStore.ts` (all state + actions)
- `stores/useStorageTreeStore.ts` (all state + actions)
- `hooks/useStorageSelection.ts` (selection logic)
- `hooks/useStorageSorting.ts` (sorting logic)

**Provides:**

- Data: items, pagination, params, stats + setters
- UI: selection, focus, viewMode, search, clipboard, sorting, loading, errors + setters
- Selection: toggleSelect, selectAll, clearSelection, selectRange
- Sorting: getSortedItems
- Clipboard: copyItems, cutItems, clearClipboard
- Tree: directoryTree, expandedNodes, prefetchedNodes, queues + all tree operations

**Components to update:** Nearly all components (major refactor)

## Context 3: StorageOperationsContext

**File:** `client/views/storage/contexts/StorageOperationsContext.tsx`

**Copy logic from:**

- `hooks/useStorageDataOperations.ts` (lines 15-497)
- `hooks/useStorageFileOperations.ts` (lines 8-86)
- `hooks/useStorageNavigation.ts` (lines 11-221)
- `hooks/useStorageTreeOperations.ts` (lines 8-190)
- `hooks/useStorageClipboard.ts` (lines 9-70)

**Provides:**

- fetchList, fetchDirectoryChildren, fetchStats
- rename, remove, move, copy, createFolder, search
- renameItem, deleteItems, moveItems, copyItemsTo (with loading states)
- navigateTo, goUp, refresh
- prefetchDirectoryChildren, expandDirectoryNode, collapseDirectoryNode
- pasteItems

**Components to update:** All components using operations

## Context 4: StorageUploadContext

**File:** `client/views/storage/contexts/StorageUploadContext.tsx`

**Copy logic from:**

- `hooks/useStorageUploadOperations.ts` (lines 14-633)
- `hooks/useUploadProgressUIOperations.ts` (lines 69-210)
- `stores/useStorageUploadStore.ts` (all state)
- `stores/useUploadProgressUIStore.ts` (all state)

**Provides:**

- Upload state: uploadBatch, files, totalCount, completedCount, totalProgress
- startUpload, cancelUpload, retryFailedUploads, retryFile, clearUploadBatch
- UI: isCollapsed, showCancelDialog, cancelTarget
- onToggleCollapse, onClose, onCancelAll, onCancelFile, onConfirmCancel, onDismissDialog

**Components to update:** Upload components only

## Provider Wrapper

**File:** `client/views/storage/contexts/StorageProvider.tsx`

```tsx
<StorageApolloProvider>
  <StorageStateProvider>
    <StorageOperationsProvider>
      <StorageUploadProvider>
        {children}
      </StorageUploadProvider>
    </StorageOperationsProvider>
  </StorageStateProvider>
</StorageApolloProvider>
```

**Update:** `StorageBrowserView.tsx` to wrap with `<StorageProvider>`

## Final Cleanup

**Delete after ALL contexts working:**

- `stores/` folder (5 files)
- 10 hook files from `hooks/`

**Keep:**

- `storage.documents.ts`, `storage.operations.ts`, `storage.type.ts`, `storage.constant.ts`, `storage.util.ts`, `storage.location.ts`, `storage-upload.types.ts`

### To-dos

- [ ] Create 4 context files in client/views/storage/contexts/
- [ ] Create StorageProvider wrapper component
- [ ] Update all components to use new contexts
- [ ] Delete old stores and hook files
- [ ] Run lint and tsc to validate changes