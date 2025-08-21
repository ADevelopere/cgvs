# Storage Management Page – Implementation Plan

This plan outlines how to build a file management page using the existing GraphQL schema and the project’s context patterns.

## Milestones

1) ✅ GraphQL integration layer
- Reuse `nextjs/contexts/storage/StorageGraphQLContext.tsx` for:
  - `listFiles`, `getFileInfo`, `searchFiles`, `getStorageStats`, `renameFile`, `deleteFile`, `generateUploadSignedUrl`.
- Add `getFolderInfo` wrapper (present in backend `StorageQuery.kt` and generated hooks).
- Keep hooks in skip/imperative mode via `refetch` to match current style.

2) ✅ UI state/context: StorageManagementContext
- Provide a `StorageManagementContext` mirroring the student context to encapsulate page state and actions.
- State: items, path, breadcrumbs, filters (searchTerm, fileType, sort), pagination, selection, loading, stats, error.
- Actions: navigation, selection, refresh, search/filter/sort, pagination, rename, delete, upload (signed URL), and stats refresh.

3) Next.js page and provider wiring
- Create `nextjs/app/storage/page.tsx` (client page).
- Provider hierarchy: `StorageGraphQLProvider` -> `StorageManagementProvider` -> components.

4) UI components
- `StorageToolbar`, `StorageBreadcrumbs`, `StorageStatsBar`, `FileList`/`FileItem`, `SidePreview` (optional), dialogs (`Rename`, `DeleteConfirm`, `Upload`), `EmptyState`.

5) ✅ Upload flow (signed URL) - COMPLETE IMPLEMENTATION
- ✅ For each file: `generateUploadSignedUrl` -> HTTP PUT to signed URL (with `Content-Type`) -> refresh list
- ✅ Support parallel limited concurrency (3 files at a time) and per-file progress tracking
- ✅ Content-Type inference from MIME type and file extension fallback
- ✅ Upload state management with progress, success/error status per file
- ✅ Batch upload tracking with total/completed counts
- ✅ Cancel upload functionality
- ✅ Retry failed uploads capability
- ✅ Comprehensive error handling and user notifications
- ✅ Upload location support (PUBLIC, TEMPLATE_COVER)

6) Error handling and limitations
- Toast notifications on success/error, debounce search, reasonable defaults (limit 50), no folder create/move unless backend supports it.

7) Adjacent improvements (optional)
- Drag-and-drop upload, copy public URL, inline rename, optimistic rename, unit tests for context helpers.

## Assumptions
- `getFolderInfo` is available via codegen (verified) and will be exposed through the storage GraphQL context.
- `UploadLocation` is a valid input for signed URL generation; the UI will provide a selector or a sensible default.

## Success criteria
- Browse folders, search/filter/sort, see stats, select items, rename, delete, and upload using only provided GraphQL operations.
- Clear notifications, resilient handling of empty/large folders, and robust error reporting.
