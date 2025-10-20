<!-- 686bb020-cd66-434b-95d1-1946946183cc 66be3d27-300e-4df7-a0ac-0059e1b047cf -->

# Local Storage Adapter Implementation

## Overview

Create a local filesystem storage adapter that stores files in a configurable directory (`LOCAL_STORAGE_PATH` env variable, default: `./cgsv/data/files/`) with signed URL support via Next.js API routes.

## Database Schema Changes

### 1. Create Signed URL Table

**File:** `server/db/schema/storage.ts`

Add a new table for managing signed URLs:

```typescript
export const signedUrls = pgTable("signed_url", {
  id: varchar("id", { length: 64 }).primaryKey(), // UUID token
  filePath: varchar("file_path", { length: 1024 }).notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),
  fileSize: bigint("file_size", { mode: "bigint" }).notNull(),
  expiresAt: timestamp("expires_at", { precision: 3 }).notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  used: boolean("used").notNull().default(false),
});
```

### 2. Create Signed URL Repository

**File:** `server/db/repo/signedUrl.repository.ts` (new file)

Implement CRUD operations:

- `createSignedUrl(data)` - Create new signed URL entry
- `getSignedUrlById(id)` - Get by token ID
- `markAsUsed(id)` - Mark URL as used
- `deleteExpired()` - Cleanup expired URLs
- `validateSignedUrl(id)` - Check if valid and not expired

Update `server/db/repo/index.ts` to export the new repository.

## Local Storage Adapter

### 3. Implement Local Adapter

**File:** `server/storage/disk/local.ts` (new file)

Create `LocalAdapter` class implementing `StorageService` interface:

**Key Features:**

- Use Node.js `fs/promises` for file operations
- Store files in `LOCAL_STORAGE_PATH` directory (configurable, default: `./cgsv/data/files/`)
- Base URL: `http://localhost:${PORT}/api/storage/files/` for file serving
- Implement all methods from `StorageService` interface:
  - `fileExists()` - Check file with `fs.access()`
  - `generateUploadSignedUrl()` - Create DB entry with UUID token, return API URL
  - `uploadFile()` - Write buffer to disk with `fs.writeFile()`
  - `listFiles()` - Use `fs.readdir()` with recursive option, apply filters/pagination
  - `createFolder()` - Use `fs.mkdir()` with recursive option
  - `renameFile()` - Use `fs.rename()`
  - `deleteFile()` - Use `fs.unlink()`
  - `directoryInfoByPath()` - Stat directory and combine with DB data
  - `fileInfoByPath()` - Stat file and combine with DB data
  - `fileInfoByDbFileId()` - Query DB then stat file
  - `storageStatistics()` - Walk directory tree, calculate sizes and counts
  - `fetchDirectoryChildren()` - List immediate subdirectories
  - `moveItems()` - Batch move with `fs.rename()`
  - `copyItems()` - Batch copy with `fs.copyFile()`
  - `deleteItems()` - Batch delete with permission checks

**Helper Functions:**

- `cleanLocalPath(path)` - Normalize paths, prevent directory traversal
- `getAbsolutePath(path)` - Convert relative path to absolute filesystem path
- `fileStatsToMetadata(stats, path)` - Convert fs.Stats to BlobMetadata format
- `ensureDirectory(path)` - Create parent directories if needed

Export factory function: `createLocalAdapter(): Promise<StorageService>`

## Next.js API Routes

### 4. File Upload API (Signed URL)

**File:** `app/api/storage/upload/[id]/route.ts` (new file)

Handles PUT requests to upload files via signed URL:

```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
);
```

**Implementation:**

1. Validate signed URL from DB (check expiry, not used)
2. Validate content-type and file size match
3. Read request body as buffer
4. Write file to local storage path
5. Mark signed URL as used
6. Create file entity in DB
7. Return success response

### 5. File Download/Serving API

**File:** `app/api/storage/files/[[...path]]/route.ts` (new file)

Handles GET requests to serve files:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
);
```

**Implementation:**

1. Reconstruct file path from params
2. Check if file exists in local storage
3. Check permissions (public vs protected)
4. Stream file with appropriate headers (content-type, cache-control)
5. Handle range requests for partial content (videos, large files)

## Integration Updates

### 6. Update Storage Service Factory

**File:** `server/storage/storage.service.ts`

- Add `"local"` to `StorageProvider` type union
- Import `createLocalAdapter` from `./disk/local`
- Add case in `createService()` switch statement:
  ```typescript
  case "local":
    return await createLocalAdapter();
  ```

### 7. Update Environment Variables

**File:** `.env.example` (if exists) or document in README

Add:

```
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./cgsv/data/files/
```

### 8. Update Next.js Config

**File:** `next.config.ts`

Add localhost to image domains if serving images:

```typescript
images: {
  domains: ["storage.googleapis.com", "flagcdn.com", "localhost"],
  ...
}
```

## Testing & Validation

### Key Testing Points:

1. File upload via signed URL works correctly
2. File download respects permissions
3. Directory operations (create, list, delete) work
4. Bulk operations (move, copy, delete) maintain consistency
5. Signed URLs expire correctly and can't be reused
6. Path traversal attacks are prevented
7. DB and filesystem stay in sync

## Implementation Notes

- Use `StorageUtils` helper functions for consistency (path validation, file type detection, etc.)
- Follow same permission checking logic as GCP adapter
- Maintain DB integration for file/directory tracking
- Use `logger` from `@/server/lib/logger` (never console.\*)
- Handle errors gracefully, return proper `FileOperationResult` structures
- Clean up expired signed URLs periodically (consider cron job or lazy cleanup)

### To-dos

- [ ] Add signed_url table to storage schema
- [ ] Create signedUrl.repository.ts with CRUD operations
- [ ] Create local.ts adapter with basic file operations (exists, upload, delete)
- [ ] Implement listFiles with filtering, sorting, and pagination
- [ ] Implement bulk operations (move, copy, delete)
- [ ] Implement storage statistics and directory operations
- [ ] Create Next.js API route for signed URL uploads
- [ ] Create Next.js API route for file serving/download
- [ ] Update storage service factory to support local provider
- [ ] Update environment variables and Next.js config
