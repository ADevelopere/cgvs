<!-- 7367ba9a-12d3-45b8-a1db-4d0be5453b25 a8178181-683a-4242-9c42-523833ef32ee -->
# Refactor StorageOperationsContext Usage

## Overview

Update the storage browser architecture so that only the two main parent components (`StorageBrowserView` and `StorageMainView`) consume the `StorageOperationsContext`. All child components will receive necessary operations and state as props.

## Key Files to Modify

### Main Components (Context Consumers)

- `client/views/storage/StorageBrowserView.tsx` - Add `useStorageOperations()` hook, pass operations to children
- `client/views/storage/browser/StorageMainView.tsx` - Add `useStorageOperations()` hook, pass operations to children

### Browser Components (Convert to Props)

1. **StorageSearch.tsx**

- Remove: `useStorageDataOperations`
- Add prop: `onSearch: (query: string, path?: string) => Promise<{items: StorageItem[]; totalCount: number} | null>`

2. **StorageDirectoryTree.tsx**

- Remove: `useStorageNavigation`, `useStorageTreeOperations`
- Add props: `onNavigate`, `onExpandNode`, `onCollapseNode`, `onPrefetchChildren`

3. **StorageBreadcrumb.tsx**

- Remove: `useStorageNavigation`
- Add prop: `onNavigate`

4. **StorageItemsView.tsx**

- Remove: `useStorageNavigation`
- Add props: `onNavigate`, `onRefresh`

5. **StorageItem.tsx**

- Remove: `useStorageNavigation`, `useStorageClipboard`
- Add props: `onNavigate`, `clipboard`

6. **StorageSelectionActions.tsx**

- Remove: `useStorageClipboard`
- Add props: `clipboard`, `onCopyItems`, `onCutItems`, `onPasteItems`

### Menu Components (Convert to Props)

7. **FileMenu.tsx**

- Remove: `useStorageClipboard`, `useStorageFileOperations`, `useStorageNavigation`
- Add props: `onCopyItems`, `onCutItems`, `onRenameItem`, `onDeleteItems`, `onRefresh`

8. **FolderMenu.tsx**

- Remove: `useStorageClipboard`, `useStorageFileOperations`, `useStorageNavigation`
- Add props: `onNavigate`, `onRefresh`, `onCopyItems`, `onCutItems`, `onPasteItems`, `clipboard`, `onRenameItem`, `onDeleteItems`

9. **ViewAreaMenu.tsx**

- Remove: `useStorageClipboard`, `useStorageNavigation`
- Add props: `clipboard`, `onPasteItems`, `onRefresh`

### Dialog Components (Convert to Props)

10. **RenameDialog.tsx**

- Remove: `useStorageFileOperations`
- Add prop: `onRename`

11. **DeleteConfirmationDialog.tsx**

- Remove: `useStorageDataOperations`
- Add prop: `onDelete`

12. **MoveToDialog.tsx**

- Remove: `useStorageDataOperations`
- Add props: `onFetchDirectoryChildren`, `onMove`

13. **FilePickerDialog.tsx**

- Remove: `useStorageDataOperations`
- Add prop: `onFetchList`

14. **CreateFolderDialog.tsx**

- Remove: `useStorageDataOperations`
- Add prop: `onCreateFolder`

## Implementation Approach

1. Start with main components: Update `StorageBrowserView` and `StorageMainView` to consume `useStorageOperations()`
2. Update browser components in dependency order (leaf components first)
3. Update menu components
4. Update dialog components
5. Verify no imports of old hooks remain in child components

## Excluded from Changes

- `client/views/storage/uploading/` - Uses different hook (`useUploadProgressUIOperations`)
- `client/views/storage/dropzone/` - Uses different hook (`useStorageUploadOperations`)
- These are NOT part of StorageOperationsContext scope

### To-dos

- [ ] Update StorageBrowserView and StorageMainView to consume StorageOperationsContext and extract all needed operations
- [ ] Update StorageItem, StorageSearch, StorageBreadcrumb to receive operations as props
- [ ] Update StorageDirectoryTree, StorageItemsView, StorageSelectionActions to receive operations as props and pass them down
- [ ] Update FileMenu, FolderMenu, ViewAreaMenu to receive operations as props
- [ ] Update all dialog components (RenameDialog, DeleteConfirmationDialog, MoveToDialog, FilePickerDialog, CreateFolderDialog) to receive operations as props
- [ ] Verify no child components import useStorageDataOperations, useStorageFileOperations, useStorageNavigation, useStorageTreeOperations, or useStorageClipboard