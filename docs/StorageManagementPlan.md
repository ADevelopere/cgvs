# Storage Management Page – Implementation Plan

This plan outlines how to build a file management page using the existing GraphQL schema and the project’s context patterns.

## Milestones

3) Next.js page and provider wiring
- Create `nextjs/app/storage/page.tsx` (client page).
- Provider hierarchy: `StorageGraphQLProvider` -> `StorageManagementProvider` -> components.

4) UI components  (structure them under "nextjs/views/storage")

The UI needs a complete set of components to wire into `StorageManagementProvider` so every context capability is exposed to the user. Below is a detailed list of components, responsibilities, inputs/outputs (contracts), priority, and short implementation notes / edge-cases. Implement these to satisfy the success criteria and map 1:1 to context actions and state.

- `StorageToolbar` (High)
	- Responsibilities: host SearchBar, Filter dropdown (file type), Sort dropdown, Upload button, and a small summary (e.g. selected count). Provides debounced search and triggers `startUpload` when user selects files.
	- Inputs: none (reads from `useStorageManagement()`), shows `params` and `selectedPaths` state.
	- Outputs: calls `search(term)`, `setFilterType(type)`, `setSortField(field)`, `startUpload(files, location)`.
	- Notes: debounce search (300ms), show active filter chips, disable upload button when upload backend unavailable.

- `SearchBar` (part of Toolbar) (High)
	- Responsibilities: text input with debounce and clear action.
	- Outputs: `search(term)`.

- `FiltersPanel` / `FileTypeFilter` (High)
	- Responsibilities: UI for `fileType` filtering and quick toggles (images, documents, all).
	- Outputs: `setFilterType(type)`.

- `SortControl` (High)
	- Responsibilities: Dropdown to choose `sortField` (name, size, date, type) and direction if supported.
	- Outputs: `setSortField(field)`.

- `StorageBreadcrumbs` (High)
	- Responsibilities: show current path, clickable breadcrumb segments to call `navigateTo(path)`, and a Go Up control wired to `goUp()`.
	- Inputs: `params.path` from context.

- `StorageStatsBar` (High)
	- Responsibilities: show usage stats (`stats`), folder/file counts, and quick actions (e.g., upload free-space hint).
	- Inputs: `stats`.

- `FileList` and `FileItem` (High)
	- Responsibilities: Render `items` (folders and files). Each `FileItem` must show icon/thumbnail, name, size, modified date, checkboxes for selection, and actions (rename, delete, preview, download, copy URL).
	- Inputs: `items`, `selectedPaths`, `loading`.
	- Outputs: `toggleSelect(path)`, `navigateTo(path)` for folders, `rename(path, newName)`, `remove([path])`, calls for preview/download/copy.
	- Notes: show folder rows separately; clicking a folder navigates into it.

- `SelectHeader` / `SelectAllCheckbox` (High)
	- Responsibilities: header checkbox to select all visible items and show current selection count.
	- Outputs: `selectAll()`, `clearSelection()`.

- `BulkActionsBar` (High)
	- Responsibilities: visible when `selectedPaths.length > 0`; provide bulk Delete, Download (if supported), Copy Public URL (if available), and Deselect actions.
	- Outputs: `remove(paths)`, and other callbacks mapped to context or GraphQL operations.

- `PaginationControls` (High)
	- Responsibilities: show pages or next/prev controls, allow changing `limit` (page size). Use `pagination` from context to compute current page and total pages.
	- Inputs: `pagination`.
	- Outputs: `setPage(page)`, `setLimit(limit)`.
	- Notes: support both classic pagination and a load-more button (tie to `hasMore`).

- `UploadDialog` (High)
	- Responsibilities: interface to pick files and target `location` (if multiple upload locations supported). Calls `startUpload(files, location)` and closes or shows UploadList.
	- Outputs: `startUpload(files, location)`.

- `DragDropZone` / DropTarget (Medium)
	- Responsibilities: drop area around `FileList` to accept files and call `startUpload(files, location)`; shows a highlight when dragging.
	- Notes: gracefully degrade on mobile / browsers that don't support drag/drop.

- `UploadList` and `UploadItem` (High)
	- Responsibilities: render `uploadBatch` from context. For each file show filename, progress bar (progress), status (pending/uploading/success/error), Cancel button, Retry button (for failed), and Remove (after success). Show batch-level controls: Cancel All, Retry Failed.
	- Inputs: `uploadBatch` (Map of `UploadFileState`).
	- Outputs: `cancelUpload(fileKey?)`, `retryFile(fileKey)`, `retryFailedUploads()`, `clearUploadBatch()`.
	- Notes: preserve order of selected files, show icons for file type, handle large batches gracefully (virtualize if > 100 files).

- `FileContextMenu` / `FileActions` (Medium)
	- Responsibilities: menu for each file with actions: Preview, Download, Rename, Delete, Copy public URL. Should open from `FileItem` action button / right-click.
	- Outputs: calls local handlers which invoke `rename` / `remove` / download flow / show preview.

- `SidePreview` and `FilePreviewModal` (Medium)
	- Responsibilities: preview images/documents/videos; `SidePreview` can show metadata and a thumbnail in a side panel; `FilePreviewModal` for larger previews.
	- Inputs: `items` and selected preview item.
	- Notes: fetch direct file URL or use signed URL flow if needed; fallback to download if preview not supported.

- `FileDetailsPanel` (Optional)
	- Responsibilities: show file metadata, download link, public URL field (copy), and a small activity log if available.

- `RenameDialog` (High)
	- Responsibilities: prompt for new name, call `rename(currentPath, newName)`, show success/failure notifications.
	- Notes: validate name, handle name conflicts from server and show errors.

- `DeleteConfirmDialog` (High)
	- Responsibilities: confirm deletion of one or more files, call `remove(paths)`, and show toast based on result.

- `EmptyState` (High)
	- Responsibilities: shown when folder is empty; include primary CTA to `Upload` and secondary CTA to `Go Up` or create folder (only if backend supports create).

- `LoadingSkeletons` / `ListPlaceholder` (Medium)
	- Responsibilities: show while `loading` to avoid layout shift and make UX smoother.

- `Thumbnail` / `FileIcon` (Medium)
	- Responsibilities: small component mapping `ContentType` to an icon or generated thumbnail.

- `ErrorBanner` / `InlineError` (High)
	- Responsibilities: show `error` state from context (e.g., "Failed to list files"), allow a Retry action which calls `refresh()`.

- `AccessibilityAnnouncer` (Low)
	- Responsibilities: announce upload completions/errors and selection counts to assistive tech.

Implementation priorities (short):
- Phase A (immediate / required to meet success criteria): `StorageToolbar` (with `SearchBar`/Filters/Sort), `StorageBreadcrumbs`, `StorageStatsBar`, `FileList`/`FileItem`, `SelectHeader`, `BulkActionsBar`, `RenameDialog`, `DeleteConfirmDialog`, `UploadDialog`, `UploadList` (per-file progress), `PaginationControls`, `EmptyState`, `ErrorBanner`, `LoadingSkeletons`.
- Phase B (improve discoverability / UX): `FileContextMenu`, `FilePreviewModal`, `SidePreview`, `DragDropZone`, `Thumbnail`.
- Phase C (polish / optional): `FileDetailsPanel`, `AccessibilityAnnouncer`, inline rename, optimistic updates.

Edge cases / notes for implementers
- Upload race conditions: the context stores active XHRs in a ref (`uploadXhrsRef`) to allow `cancelUpload` to abort even if React state isn't synced — UI should disable conflicting actions while a file is actually uploading.
- Pagination vs infinite scroll: because context exposes `offset`/`limit` and `hasMore`, support both modes but default to classic pagination with page size `limit` (default 50 as noted in the plan).
- Backend limitations: If backend doesn't support folder creation or move operations, hide/disable those UI controls and provide a clear tooltip explaining the limitation.
- Duplicate names & conflicts: show clear server error responses for `rename` and allow retry paths.
- Large batches: virtualize `UploadList` if showing many files, and limit concurrency if you plan to parallelize uploads.

Developer contract summary (key components)
- `FileList` -> Inputs: `items`, `loading`, `pagination`, `selectedPaths`; Outputs: `onOpen(path)`, `onToggleSelect(path)`, `onAction(action, path)`.
- `UploadList` -> Inputs: `uploadBatch`; Outputs: `onCancel(fileKey?)`, `onRetry(fileKey)`, `onRetryFailed()`.
- `PaginationControls` -> Inputs: `pagination`; Outputs: `onPage(page)`, `onLimit(limit)`.

With these expanded components and information, Step 4 now fully maps UI to the capabilities exposed by `StorageManagementContext` and satisfies the success criteria listed below.


1) Error handling and limitations
- Toast notifications on success/error, debounce search, reasonable defaults (limit 50), no folder create/move unless backend supports it.

1) Adjacent improvements (optional)
- Drag-and-drop upload, copy public URL, inline rename, optimistic rename, unit tests for context helpers.

## Success criteria
- Browse folders, search/filter/sort, see stats, select items, rename, delete, and upload using only provided GraphQL operations.
- Clear notifications, resilient handling of empty/large folders, and robust error reporting.
