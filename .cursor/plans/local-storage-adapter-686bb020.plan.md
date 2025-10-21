<!-- 686bb020-cd66-434b-95d1-1946946183cc 66be3d27-300e-4df7-a0ac-0059e1b047cf -->

# Local Storage Adapter Implementation

## Overview

Create a local filesystem storage adapter that stores files in a configurable directory (`LOCAL_STORAGE_PATH` env variable, default: `./cgsv/data/files/`) with signed URL support via Next.js API routes.

## Database Schema Changes

### 1. Create Signed URL Table

**File:** `server/db/schema/storage.ts`

Add a new table for managing signed URLs:

```typescript
export const signedUrls = pgTable(
  "signed_url",
  {
    id: varchar("id", { length: 64 }).primaryKey(), // UUID token
    filePath: varchar("file_path", { length: 1024 }).notNull(),
    contentType: varchar("content_type", { length: 255 }).notNull(),
    fileSize: bigint("file_size", { mode: "bigint" }).notNull(), // File size in bytes
    contentMd5: varchar("content_md5", { length: 44 }).notNull(), // base64-encoded MD5 hash (24 chars + padding)
    expiresAt: timestamp("expires_at", { precision: 3 }).notNull(),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    used: boolean("used").notNull().default(false),
  },
  table => {
    return {
      expiresAtIdx: index("signed_url_expires_at_idx").on(table.expiresAt),
      usedExpiresIdx: index("signed_url_used_expires_idx").on(
        table.used,
        table.expiresAt
      ),
    };
  }
);
```

> **Action item:** create the corresponding Drizzle migration with the above indexes to support efficient cleanup jobs and atomic claim operations.

### 2. Create Signed URL Repository

**File:** `server/db/repo/signedUrl.repository.ts` (new file)

Implement CRUD operations:

- `createSignedUrl(data)` - Create new signed URL entry
- `getSignedUrlById(id)` - Get by token ID, returns `SignedUrlEntity | null`
- `claimSignedUrl(id)` - **Atomically** finds a valid, unused, non-expired token and marks it as used. Returns the full `SignedUrlEntity` if successful, or `null` if the token is invalid/used/expired. This prevents race conditions. Implementation must use PostgreSQL row-level locking:
  ```typescript
  // In a transaction:
  // 1. SELECT * FROM signed_url WHERE id = ? AND used = false AND expires_at > NOW() FOR UPDATE SKIP LOCKED
  // 2. If row found: UPDATE signed_url SET used = true WHERE id = ? RETURNING *
  // 3. If no row or update fails: return null
  ```
  This ensures that concurrent requests cannot claim the same token.
- `deleteExpired()` - Cleanup expired URLs (deletes records where `expires_at < NOW()`)

Update `server/db/repo/index.ts` to export the new repository.

**Type Definition:**

```typescript
export type SignedUrlEntity = typeof signedUrls.$inferSelect;
export type SignedUrlEntityInput = typeof signedUrls.$inferInsert;
```

## Local Storage Adapter

### 3. Implement Local Adapter

**File:** `server/storage/disk/local.ts` (new file)

Create `LocalAdapter` class implementing `StorageService` interface:

**Key Features:**

- Confirm the full method surface and return types against the existing `StorageService` interface (and reuse any shared utilities) to remain compatible with the current GCP adapter expectations.

- Use Node.js `fs/promises` for file operations.
- Store files in `LOCAL_STORAGE_PATH` directory (configurable via env var, default: `./cgsv/data/files/`).
- **Base URL**: The public-facing URL for accessing files will be configured via `NEXT_PUBLIC_BASE_URL` environment variable (e.g., `http://localhost:3000` in dev, `https://example.com` in prod). Upload and download URLs will resolve to `${NEXT_PUBLIC_BASE_URL}/api/storage/upload/[id]` and `${NEXT_PUBLIC_BASE_URL}/api/storage/files/[...path]` respectively.
- Implement all methods from `StorageService` interface:
  - `fileExists()` - Check file with `fs.access()`
  - `generateUploadSignedUrl()` - Create DB entry with UUID token, return an API URL constructed from the base URL.
  - `uploadFile(path, contentType, buffer)` - Validates permissions (checks `directory.allowUploads`), writes buffer to disk using the internal write helper, creates file entity in DB, returns `FileUploadResult`.
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

- `getAbsolutePath(relativePath)` - Converts a relative user-provided path to a secure, absolute filesystem path, preventing path traversal attacks.
  1. Resolve the absolute path of the configured `LOCAL_STORAGE_PATH`.
  2. Join the user's `relativePath` with the base storage path and resolve it.
  3. **Critically:** Use `path.relative()` to verify the resolved path is within the base directory:
     ```typescript
     const relativePath = path.relative(basePath, resolvedPath);
     if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
       throw new StorageValidationError("Path traversal detected");
     }
     ```
  4. Return the validated absolute path.
- `fileStatsToMetadata(stats, path)` - Convert fs.Stats to BlobMetadata format
- `ensureDirectory(path)` - Create parent directories if needed using `fs.mkdir({ recursive: true })`
- `calculateMd5(filePath)` - Calculate MD5 hash of a file, returns base64-encoded string
- `streamToFile(stream, filePath, expectedMd5?)` - Stream data to file while calculating MD5, validates hash if provided

> Consider placing reusable helpers (e.g., `ensureDirectory`, `fileStatsToMetadata`, path sanitizers) alongside the adapter or in a shared `server/storage/disk` utility module so other adapters can leverage them.

Export factory function: `createLocalAdapter(): Promise<StorageService>`

Before any other logic, this function must include a "kill switch" to prevent the application from starting if the `local` provider is selected in a serverless environment where the filesystem is ephemeral.

```typescript
// Add this check at the very beginning of createLocalAdapter()
const isServerless =
  !!process.env.VERCEL ||
  !!process.env.NETLIFY ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.K_SERVICE || // Google Cloud Run
  !!process.env.FUNCTION_TARGET || // Google Cloud Functions
  !!process.env.FUNCTIONS_WORKER_RUNTIME || // Azure Functions
  !!process.env.CF_PAGES || // Cloudflare Pages/Workers
  !!process.env.RAILWAY_ENVIRONMENT; // Railway

if (isServerless) {
  throw new Error(
    "FATAL: The 'local' storage provider is enabled in a serverless environment. " +
      "This is not supported and will lead to data loss. " +
      "Use a compatible cloud provider (e.g., 'gcp', 's3') in your environment configuration. " +
      `Detected environment: ${Object.keys(process.env)
        .filter(k =>
          [
            "VERCEL",
            "NETLIFY",
            "AWS_LAMBDA_FUNCTION_NAME",
            "K_SERVICE",
            "FUNCTION_TARGET",
            "FUNCTIONS_WORKER_RUNTIME",
            "CF_PAGES",
            "RAILWAY_ENVIRONMENT",
          ].includes(k)
        )
        .join(", ")}`
  );
}

// ... rest of the factory function
```

## Next.js API Routes

### 4. File Upload API (Signed URL)

**File:** `app/api/storage/upload/[id]/route.ts` (new file)

Handles PUT requests to upload files via signed URL with a security-first approach.

```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
);
```

**API Contract:**

- **Method:** `PUT`
- **Path:** `/api/storage/upload/[id]`
- **Headers (Validated):**
  - `Content-Type`: Must match the `contentType` in the `signed_url` record.
  - `Content-Length`: Must not exceed the `fileSize` in the `signed_url` record.
  - `Content-MD5`: Must match the `contentMd5` in the `signed_url` record.
- **Success Response:**
  - `201 Created` (or `200 OK`) with JSON body of the newly created file's metadata.
- **Error Responses:**
  - `403 Forbidden`: Token is invalid, expired, or already used.
  - `400 Bad Request`: Headers (e.g., `Content-MD5`, `Content-Type`) do not match token record.
  - `413 Payload Too Large`: `Content-Length` exceeds allowed `fileSize`.

**Implementation:**

1.  **Atomically Claim Token:** Call `signedUrlRepository.claimSignedUrl(params.id)`. This single database operation attempts to find the token, verify it's not used or expired, and mark it as used all at once. If the operation returns `null`, the token is invalid/used/expired. **Return `403 Forbidden` immediately.**
2.  **Validate Metadata Headers:** If the token is valid, validate the incoming request headers:
    - `Content-Type` must match `signedUrl.contentType`
    - `Content-Length` must not exceed `signedUrl.fileSize`
    - `Content-MD5` header must match `signedUrl.contentMd5`
    - If any validation fails, return `400 Bad Request` with specific error message.
3.  **Secure Path Resolution:** Use the `getAbsolutePath()` helper to resolve the file path from the token into a safe, absolute filesystem path, ensuring it is within the configured storage directory. If path traversal is detected, return `400 Bad Request`.
4.  **Stream to Disk with MD5 Verification:**
    - Create a write stream to the destination file path (ensure parent directory exists)
    - Create an MD5 hash stream using `crypto.createHash('md5')`
    - Pipe the request body through the MD5 hash stream to the file write stream
    - **Memory-efficient streaming:** Never buffer the entire file in memory
    - Once streaming completes, finalize the MD5 hash and encode as base64
    - Compare calculated MD5 with `signedUrl.contentMd5`
    - If MD5 mismatch: delete the file using `fs.unlink()` and return `400 Bad Request` with message "MD5 hash mismatch"
5.  **Create File Record with Transaction Safety:**
    - After successful file write and MD5 verification, create the file entity in the `storage_files` table
    - Wrap in try-catch: if DB insert fails, delete the orphaned file from disk and return `500 Internal Server Error`
6.  **Return Success:** Return `201 Created` with the file metadata (FileInfo) in the response body.

### 5. File Download/Serving API

**File:** `app/api/storage/files/[[...path]]/route.ts` (new file)

Handles GET requests to serve files:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
);
```

**API Contract:**

- **Method:** `GET`
- **Path:** `/api/storage/files/[[...path]]`
- **Headers (Supported):**
  - `Range`: For partial content streaming (video, large files).
- **Success Response:**
  - `200 OK`: Full file stream with `Content-Type`, `Content-Length`, and `Cache-Control` headers.
  - `206 Partial Content`: Partial file stream if `Range` header was provided.
- **Error Responses:**
  - `404 Not Found`: File does not exist at the specified path.
  - `403 Forbidden`: File is not public and user does not have permission.
  - `400 Bad Request`: Path traversal attack detected.

**Implementation:**

1. Reconstruct the relative file path from `params.path` array (e.g., `['public', 'images', 'logo.png']` → `'public/images/logo.png'`).
2. **Secure Path Resolution:** Use the `getAbsolutePath()` helper to convert the relative path into a safe, absolute filesystem path, preventing any path traversal attacks. If validation fails, return `400 Bad Request`.
3. Check if the file exists at the absolute path using `fs.access()`. If not found, return `404 Not Found`.
4. **Check Permissions (align with GCP adapter model):**
   - Query the database for the file's metadata using `StorageDbRepository.fileByPath()`
   - Determine if the file is public:
     - If path starts with `'public/'`, the file is publicly accessible
     - If the file entity has custom protection (`isProtected === true`), check user authentication
     - If the parent directory has `isProtected === true`, check user authentication
   - **For protected files:** Verify the user is authenticated (check session/JWT). If not authenticated, return `403 Forbidden`.
5. **Stream file with appropriate headers:**
   - `Content-Type`: from file metadata or detect using file extension
   - `Content-Length`: from `fs.stat()`
   - `Cache-Control`: `public, max-age=31536000` for public files, `private, max-age=3600` for protected files
   - `ETag`: MD5 hash if available, otherwise generate from mtime and size
   - `Last-Modified`: from file stats
6. **Handle range requests for partial content:**
   - Check for `Range` header in request
   - Parse range using a library like `range-parser` or manual parsing
   - If valid range:
     - Set status to `206 Partial Content`
     - Add `Content-Range` header: `bytes start-end/total`
     - Add `Accept-Ranges: bytes` header
     - Stream only the requested byte range using `fs.createReadStream({ start, end })`
   - If invalid range: return `416 Range Not Satisfiable`
   - If no range header: stream entire file with `200 OK`

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

**File:** `.env.example`

Add:

```bash
# Storage Configuration
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./cgsv/data/files/

# Public base URL of the application (no trailing slash)
# Used for generating signed upload/download URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**File:** `server/types/environment.d.ts` (create if doesn't exist)

Add type definitions:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORAGE_PROVIDER: "gcp" | "local" | "s3" | "r2" | "vercel";
      LOCAL_STORAGE_PATH?: string;
      NEXT_PUBLIC_BASE_URL: string;
      // ... other env vars
    }
  }
}

export {};
```

### 8. Update Next.js Config

**File:** `next.config.ts`

Add localhost to image domains if serving images from the local storage provider:

```typescript
images: {
  domains: ["storage.googleapis.com", "flagcdn.com", "localhost"],
  ...
}
```

### 9. Signed URL Cleanup Implementation

**File:** `app/api/storage/cleanup/route.ts` (new file)

Create a cleanup API route for expired signed URLs:

```typescript
export async function POST(request: NextRequest) {
  // 1. Check authentication - only admin users can trigger cleanup
  // 2. Call signedUrlRepository.deleteExpired()
  // 3. Return count of deleted records
  // 4. Log the cleanup operation
}
```

**Cleanup Strategy:**

- **Development:** Run cleanup on app startup in `createLocalAdapter()`
- **Production:**
  - Option 1: Use a cron job service (e.g., GitHub Actions, cron-job.org) to call `/api/storage/cleanup` hourly
  - Option 2: Add a scheduled task using Vercel Cron (if migrating away from local storage later)
  - Option 3: Run cleanup lazily before each `generateUploadSignedUrl()` call (delete expired before creating new)

**Recommended approach:** Use lazy cleanup (Option 3) for simplicity, with optional scheduled cleanup for optimization.

### 10. Documentation & Operations

- Update the primary README/docs to describe the `local` storage provider, including:
  - New environment variables (`STORAGE_PROVIDER=local`, `LOCAL_STORAGE_PATH`, `NEXT_PUBLIC_BASE_URL`)
  - Serverless restrictions (fatal error if detected)
  - Operational caveats (not suitable for horizontal scaling, requires persistent filesystem)
  - Backup strategy (recommend regular backups of `LOCAL_STORAGE_PATH` directory)
  - Migration guide (how to move files from local to GCP or vice versa)
- Document the signed URL cleanup strategy and how to trigger manual cleanup if needed.

## Testing & Validation

### Key Testing Points:

1.  **Race Condition:** Actively test that a single signed URL cannot be used to upload multiple files simultaneously. Use concurrent requests (Promise.all with same token) and verify only one succeeds with `201`, others get `403`.
2.  **Path Traversal:** Craft malicious inputs (`../../etc/passwd`, `..\..\windows\system32`, `/etc/passwd`, `public/../private/secret.txt`) to ensure the `getAbsolutePath` helper correctly rejects them with `400 Bad Request`.
3.  **Serverless Check:** Actively test that the application fails to start (throws a fatal error) if `STORAGE_PROVIDER=local` is set while a serverless environment variable (e.g., `VERCEL=1`) is also present.
4.  **MD5 Validation:** Test upload with mismatched MD5 hash in header vs actual file content, verify file is deleted and `400` is returned.
5.  **File Size Validation:** Test upload exceeding the declared `fileSize` in signed URL, verify rejection with `413 Payload Too Large`.
6.  **Signed URL Expiration:** Test upload with expired token, verify `403 Forbidden`.
7.  **Signed URL Reuse:** Test upload with already-used token, verify `403 Forbidden`.
8.  **File Upload via Signed URL:** Test successful upload flow with correct headers and valid token.
9.  **File Download Permissions:** Test public file download (no auth), protected file download (requires auth), and unauthorized access (returns `403`).
10. **Range Requests:** Test partial content requests with valid/invalid ranges, verify `206` or `416` responses.
11. **Directory Operations:** Test create, list, delete operations with various permission configurations.
12. **Bulk Operations:** Test move, copy, delete with multiple files, verify atomicity and proper error handling.
13. **DB-Filesystem Sync:** Test that failed DB operations clean up filesystem changes and vice versa.
14. **Cleanup Operation:** Test that `deleteExpired()` removes only expired URLs and leaves valid ones intact.

### Integration Test Example:

```typescript
// tests/storage/local-adapter.test.ts
describe('Local Storage Adapter - Race Conditions', () => {
  it('should prevent concurrent uploads with same signed URL', async () => {
    const signedUrl = await generateUploadSignedUrl({...});
    const token = extractTokenFromUrl(signedUrl);

    // Attempt 3 concurrent uploads with same token
    const results = await Promise.allSettled([
      uploadFile(token, fileBuffer),
      uploadFile(token, fileBuffer),
      uploadFile(token, fileBuffer),
    ]);

    // Only one should succeed
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 201);
    expect(successful).toHaveLength(1);

    // Others should get 403
    const forbidden = results.filter(r => r.status === 'fulfilled' && r.value.status === 403);
    expect(forbidden).toHaveLength(2);
  });
});
```

## Implementation Notes

### Dependencies & Assumptions

- **Implicit Dependencies:** This plan assumes the existence of primary `files` (`storage_files`) and `directories` (`storage_directories`) tables in the database (see `server/db/schema/storage.ts`). The logic for methods like `fileInfoByDbFileId` and the creation of file records post-upload depend on these schemas.
- **Permission Logic:** The permission model aligns with the GCP adapter:
  - Files/directories under `public/` path are publicly accessible
  - `file.isProtected` and `directory.isProtected` flags control access
  - Directory permissions (`allowUploads`, `allowDeleteFiles`, etc.) gate operations
  - No explicit `isPublic` flag needed; derive from path prefix

### Coding Standards

- Use `StorageUtils` helper functions for consistency (path validation, file type detection, content type conversion, etc.).
- Maintain DB integration for file/directory tracking using `StorageDbRepository`.
- Use `logger` from `@/server/lib/logger` (never `console.*`).
  - `logger.info` for successful operations and state changes
  - `logger.warn` for recoverable errors or fallback behavior
  - `logger.error` for failures that require attention
- Handle errors gracefully, return proper `FileOperationResult` structures.
- Use streams for file operations to minimize memory usage (critical for large files).
- All database operations that modify state should be wrapped in try-catch with proper cleanup.

### Performance Considerations

- Lazy cleanup of expired signed URLs (run before generating new ones)
- Use batch DB queries when processing multiple files (avoid N+1 queries)
- Stream files directly to/from disk, never buffer entire files in memory
- Add appropriate indexes to signed_urls table for efficient expiration queries

### Security Checklist

- ✅ Path traversal protection using proper relative path validation
- ✅ Atomic signed URL token claiming with row-level locking
- ✅ MD5 hash verification on upload
- ✅ Content-Length and Content-Type validation
- ✅ Serverless environment detection and fatal error
- ✅ Permission checks on all file operations
- ✅ Authentication verification for protected resources

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
- [ ] Document the local storage provider and operational caveats
- [ ] Establish a signed URL cleanup workflow (cron/scheduled/on-demand)
