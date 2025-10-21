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

### 3. Implement Local Adapter (Incremental Approach)

**File:** `server/storage/disk/local.ts` (new file)

Create `LocalAdapter` class implementing `StorageService` interface using an **incremental, function-by-function approach** with continuous validation.

**Implementation Strategy:**

1. **Initial Setup:**
   - Create the file with imports, class skeleton, and factory function
   - Implement serverless detection kill switch
   - Implement all helper functions first (they don't require interface compliance)
   - Add stub implementations for all `StorageService` interface methods that throw `new Error("Not implemented yet")`
   - Run `~/.bun/bin/bun lint` and `~/.bun/bin/bun tsc` to verify structure

2. **Incremental Function Implementation:**
   For each function below, follow this workflow:

   **a. Implement ONE function completely**

   **b. Run validation:**

   ```bash
   ~/.bun/bin/bun lint
   ~/.bun/bin/bun tsc
   ```

   Ignore "Not implemented yet" errors for other functions - only focus on the current function's errors.

   **c. Compare with GCP adapter:**
   - Open `server/storage/gcp/gcp-storage.ts` (or equivalent GCP adapter file)
   - Compare the implemented function's logic with the GCP version
   - Ensure consistency in:
     - Return types and structures
     - Error handling patterns
     - Permission checking logic
     - DB integration patterns
     - Logging approach
     - Edge case handling

   **d. Fix any errors found:**
   - Address lint errors
   - Fix TypeScript compilation errors
   - Adjust logic to match GCP adapter patterns
   - Ensure proper error propagation

   **e. Move to next function**

**Key Features:**

- Confirm the full method surface and return types against the existing `StorageService` interface (and reuse any shared utilities) to remain compatible with the current GCP adapter expectations.
- Use Node.js `fs/promises` for file operations.
- Store files in `LOCAL_STORAGE_PATH` directory (configurable via env var, default: `./cgsv/data/files/`).
- **Base URL**: The public-facing URL for accessing files will be configured via `NEXT_PUBLIC_BASE_URL` environment variable (e.g., `http://localhost:3000` in dev, `https://example.com` in prod). Upload and download URLs will resolve to `${NEXT_PUBLIC_BASE_URL}/api/storage/upload/[id]` and `${NEXT_PUBLIC_BASE_URL}/api/storage/files/[...path]` respectively.

**Implementation Order (one at a time):**

**Phase 1: Helper Functions (implement all, then validate)**

- `getAbsolutePath(relativePath)` - Path traversal protection
- `fileStatsToMetadata(stats, path)` - Convert fs.Stats to BlobMetadata
- `ensureDirectory(path)` - Recursive directory creation
- `calculateMd5(filePath)` - MD5 hash calculation
- `streamToFile(stream, filePath, expectedMd5?)` - Stream with validation

**Phase 2: Core File Operations (implement one by one)**

1. `fileExists()` - Check file with `fs.access()` → **validate** → **compare with GCP** → **fix**
2. `uploadFile(path, contentType, buffer)` - Write to disk + DB → **validate** → **compare with GCP** → **fix**
3. `deleteFile()` - Remove with `fs.unlink()` → **validate** → **compare with GCP** → **fix**
4. `renameFile()` - Rename with `fs.rename()` → **validate** → **compare with GCP** → **fix**

**Phase 3: Metadata & Info Operations (implement one by one)** 5. `fileInfoByPath()` - Stat file + DB data → **validate** → **compare with GCP** → **fix** 6. `fileInfoByDbFileId()` - Query DB then stat → **validate** → **compare with GCP** → **fix** 7. `directoryInfoByPath()` - Stat directory + DB → **validate** → **compare with GCP** → **fix**

**Phase 4: Directory Operations (implement one by one)** 8. `createFolder()` - Recursive mkdir → **validate** → **compare with GCP** → **fix** 9. `listFiles()` - Recursive readdir + filters → **validate** → **compare with GCP** → **fix** 10. `fetchDirectoryChildren()` - Immediate children only → **validate** → **compare with GCP** → **fix**

**Phase 5: Signed URLs (implement one by one)** 11. `generateUploadSignedUrl()` - Create DB entry + return API URL (with optional lazy cleanup) → **validate** → **compare with GCP** → **fix**

**Phase 6: Bulk Operations (implement one by one)** 12. `moveItems()` - Batch move with atomicity → **validate** → **compare with GCP** → **fix** 13. `copyItems()` - Batch copy → **validate** → **compare with GCP** → **fix** 14. `deleteItems()` - Batch delete with permissions → **validate** → **compare with GCP** → **fix**

**Phase 7: Statistics (implement last)** 15. `storageStatistics()` - Walk tree, calculate totals → **validate** → **compare with GCP** → **fix**

**Helper Functions Details:**

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

**Factory Function with Serverless Kill Switch:**

Export factory function: `createLocalAdapter(): Promise<StorageService>`

Before any other logic, this function must include a "kill switch":

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

**Quality Checklist (per function):**

- ✅ Lint passes for the implemented function
- ✅ TypeScript compilation succeeds for the implemented function
- ✅ Logic matches GCP adapter patterns
- ✅ Return types match interface exactly
- ✅ Error handling follows project conventions
- ✅ Logging uses `server/lib/logger` (never console.\*)
- ✅ Permission checks align with GCP adapter
- ✅ DB integration patterns match GCP adapter

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

# Signed URL Cleanup Configuration
SIGNED_URL_CLEANUP_STRATEGY=lazy  # Options: 'lazy', 'cron', 'both', 'disabled'
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Cron expression (default: every hour)
CRON_SECRET=your-secret-key-here  # Secret for authenticating cron requests
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

**Cleanup Strategy (Configurable):**

Add environment variables to control cleanup behavior:

```bash
# Signed URL Cleanup Configuration
SIGNED_URL_CLEANUP_STRATEGY=lazy  # Options: 'lazy', 'cron', 'both', 'disabled'
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Cron expression (default: every hour)
```

**Implementation:**

1. **Lazy Cleanup (`lazy` or `both`):**
   - In `LocalAdapter.generateUploadSignedUrl()`, before creating a new signed URL:
     ```typescript
     if (
       process.env.SIGNED_URL_CLEANUP_STRATEGY === "lazy" ||
       process.env.SIGNED_URL_CLEANUP_STRATEGY === "both"
     ) {
       await this.signedUrlRepository.deleteExpired();
     }
     ```
   - This runs cleanup on-demand, ensuring expired tokens are removed when new ones are generated.

2. **Cron Cleanup (`cron` or `both`):**
   - Create a scheduled API route using Next.js cron configuration
   - **File:** `app/api/cron/cleanup-signed-urls/route.ts`

     ```typescript
     export async function GET(request: NextRequest) {
       // Verify cron secret to prevent unauthorized access
       const authHeader = request.headers.get("authorization");
       if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
         return new Response("Unauthorized", { status: 401 });
       }

       const count = await signedUrlRepository.deleteExpired();
       logger.info(`Cron cleanup: deleted ${count} expired signed URLs`);
       return Response.json({ deleted: count });
     }
     ```

   - Add to `vercel.json` (if using Vercel):
     ```json
     {
       "crons": [
         {
           "path": "/api/cron/cleanup-signed-urls",
           "schedule": "0 * * * *"
         }
       ]
     }
     ```
   - For non-Vercel deployments, use external cron services (GitHub Actions, cron-job.org, etc.) to call the endpoint

3. **Disabled (`disabled`):**
   - No automatic cleanup; must be triggered manually via `/api/storage/cleanup`

**Default:** `lazy` for simplicity and reliability without external dependencies.

### 10. Documentation & Operations

- Update the primary README/docs to describe the `local` storage provider, including:
  - New environment variables (`STORAGE_PROVIDER=local`, `LOCAL_STORAGE_PATH`, `NEXT_PUBLIC_BASE_URL`)
  - Serverless restrictions (fatal error if detected)
  - Operational caveats (not suitable for horizontal scaling, requires persistent filesystem)
  - Backup strategy (recommend regular backups of `LOCAL_STORAGE_PATH` directory)
  - Migration guide (how to move files from local to GCP or vice versa)
- Document the signed URL cleanup strategy and how to trigger manual cleanup if needed.

## Testing & Validation

### 11. Setup Default Storage Path (Pre-requisite)

Before running any tests, set up the local storage directory structure:

**Terminal Commands:**

```bash
# Create the default storage directory structure
mkdir -p ./cgvs/data/files/public
mkdir -p ./cgvs/data/files/private
mkdir -p ./cgvs/data/files/temp

# Ensure proper permissions (read/write for owner, read for group)
chmod -R 755 ./cgvs/data/files

# Verify directory was created
ls -la ./cgvs/data/

# Add to .env file if not already present
if ! grep -q "LOCAL_STORAGE_PATH" .env; then
  echo "" >> .env
  echo "# Local Storage Configuration" >> .env
  echo "LOCAL_STORAGE_PATH=./cgvs/data/files/" >> .env
  echo "LOCAL_STORAGE_PATH added to .env"
else
  echo "LOCAL_STORAGE_PATH already exists in .env"
fi

# Verify .env configuration
grep "LOCAL_STORAGE_PATH" .env
```

**Directory Structure:**

```
./cgvs/data/files/
├── public/          # Public files (no auth required)
├── private/         # Protected files (auth required)
└── temp/            # Temporary uploads
```

**Permissions:**

- Owner: read, write, execute (7)
- Group: read, execute (5)
- Others: read, execute (5)

**Validation:**

```bash
# Verify permissions
ls -ld ./cgvs/data/files
# Should show: drwxr-xr-x

# Test write access
touch ./cgvs/data/files/test-write.txt && rm ./cgvs/data/files/test-write.txt
echo "Write access verified"
```

**Add to .gitignore:**

Ensure the storage directory is excluded from version control:

```bash
# Add to .gitignore if not already present
if ! grep -q "cgvs/data/files" .gitignore; then
  echo "" >> .gitignore
  echo "# Local storage files" >> .gitignore
  echo "cgvs/data/files/" >> .gitignore
  echo "Added storage directory to .gitignore"
fi
```

### 12. Jest Test Suite

Create comprehensive test coverage for the local storage adapter using an **incremental, test-by-test approach** with continuous validation.

**Implementation Strategy:**

For each test suite or describe block, follow this workflow:

1. **Write ONE describe block or test group completely**
2. **Run validation:**
   ```bash
   ~/.bun/bin/bun lint
   ~/.bun/bin/bun tsc --noEmit
   ```
3. **Run the specific test:**
   ```bash
   ~/.bun/bin/bun test tests/storage/local-adapter.test.ts
   ```
4. **Fix any errors found:**
   - Address lint errors
   - Fix TypeScript compilation errors
   - Fix test failures
   - Ensure proper assertions and edge cases
5. **Move to next describe block/test group**

**Quality Checklist (per test group):**

- ✅ Lint passes for the test file
- ✅ TypeScript compilation succeeds
- ✅ All tests in the group pass
- ✅ Proper setup/teardown implemented
- ✅ Edge cases covered
- ✅ Assertions are meaningful and complete

**File:** `tests/storage/local-adapter.test.ts`

```typescript
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createLocalAdapter } from "@/server/storage/disk/local";
import { signedUrlRepository } from "@/server/db/repo";
import type { StorageService } from "@/server/storage/storage.service";

describe("Local Storage Adapter", () => {
  let adapter: StorageService;
  let testDir: string;

  beforeAll(async () => {
    // Set up test environment (use separate test directory)
    testDir = path.join(process.cwd(), "tests", "fixtures", "storage-test");
    process.env.LOCAL_STORAGE_PATH = testDir;
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";

    // Create test directory with proper permissions
    await fs.mkdir(testDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testDir, "private"), {
      recursive: true,
      mode: 0o755,
    });

    adapter = await createLocalAdapter();
  });

  afterAll(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    // Reset test directory before each test
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testDir, "private"), {
      recursive: true,
      mode: 0o755,
    });
  });

  describe("Serverless Environment Detection", () => {
    it("should throw fatal error when VERCEL environment variable is set", async () => {
      process.env.VERCEL = "1";
      await expect(createLocalAdapter()).rejects.toThrow(
        /FATAL.*local.*storage provider.*serverless/i
      );
      delete process.env.VERCEL;
    });

    it("should throw fatal error when AWS_LAMBDA_FUNCTION_NAME is set", async () => {
      process.env.AWS_LAMBDA_FUNCTION_NAME = "test-function";
      await expect(createLocalAdapter()).rejects.toThrow(
        /FATAL.*local.*storage provider.*serverless/i
      );
      delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    });
  });

  describe("Path Traversal Protection", () => {
    it("should reject path traversal with ../", async () => {
      await expect(adapter.fileInfoByPath("../../etc/passwd")).rejects.toThrow(
        /path traversal/i
      );
    });

    it("should reject absolute paths", async () => {
      await expect(adapter.fileInfoByPath("/etc/passwd")).rejects.toThrow(
        /path traversal/i
      );
    });

    it("should reject complex traversal patterns", async () => {
      await expect(
        adapter.fileInfoByPath("public/../private/secret.txt")
      ).rejects.toThrow(/path traversal/i);
    });

    it("should accept valid relative paths", async () => {
      const result = await adapter.fileInfoByPath("public/test.txt");
      expect(result).toBeDefined();
    });
  });

  describe("File Upload Operations", () => {
    it("should upload file successfully with valid buffer", async () => {
      const buffer = Buffer.from("test content");
      const result = await adapter.uploadFile(
        "public/test.txt",
        "text/plain",
        buffer
      );

      expect(result.success).toBe(true);
      expect(result.file?.path).toBe("public/test.txt");

      // Verify file exists on disk
      const filePath = path.join(testDir, "public", "test.txt");
      const content = await fs.readFile(filePath, "utf-8");
      expect(content).toBe("test content");
    });

    it("should calculate correct MD5 hash", async () => {
      const content = "test content for md5";
      const buffer = Buffer.from(content);
      const expectedMd5 = crypto
        .createHash("md5")
        .update(content)
        .digest("base64");

      const result = await adapter.uploadFile(
        "public/hash-test.txt",
        "text/plain",
        buffer
      );

      expect(result.file?.metadata.md5Hash).toBe(expectedMd5);
    });

    it("should reject upload to protected directory without permission", async () => {
      const buffer = Buffer.from("unauthorized content");
      const result = await adapter.uploadFile(
        "private/restricted.txt",
        "text/plain",
        buffer
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("PERMISSION_DENIED");
    });
  });

  describe("Signed URL Operations", () => {
    it("should generate valid signed upload URL", async () => {
      const url = await adapter.generateUploadSignedUrl({
        path: "public/upload-test.txt",
        contentType: "text/plain",
        size: 1024,
        expiresIn: 3600,
      });

      expect(url).toContain("/api/storage/upload/");
      expect(url).toContain("http://localhost:3000");
    });

    it("should prevent race condition with concurrent uploads", async () => {
      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/race-test.txt",
        contentType: "text/plain",
        size: 100,
        expiresIn: 3600,
      });

      const token = signedUrl.split("/").pop()!;
      const buffer = Buffer.from("test");

      // Simulate 3 concurrent upload attempts
      const results = await Promise.allSettled([
        uploadViaSignedUrl(token, buffer, "text/plain"),
        uploadViaSignedUrl(token, buffer, "text/plain"),
        uploadViaSignedUrl(token, buffer, "text/plain"),
      ]);

      const successful = results.filter(
        r => r.status === "fulfilled" && r.value === 201
      );
      const forbidden = results.filter(
        r => r.status === "fulfilled" && r.value === 403
      );

      expect(successful).toHaveLength(1);
      expect(forbidden).toHaveLength(2);
    });

    it("should reject expired signed URL", async () => {
      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/expired-test.txt",
        contentType: "text/plain",
        size: 100,
        expiresIn: -1, // Already expired
      });

      const token = signedUrl.split("/").pop()!;
      const buffer = Buffer.from("test");

      const status = await uploadViaSignedUrl(token, buffer, "text/plain");
      expect(status).toBe(403);
    });

    it("should reject reused signed URL", async () => {
      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/reuse-test.txt",
        contentType: "text/plain",
        size: 100,
        expiresIn: 3600,
      });

      const token = signedUrl.split("/").pop()!;
      const buffer = Buffer.from("test");

      // First upload should succeed
      const status1 = await uploadViaSignedUrl(token, buffer, "text/plain");
      expect(status1).toBe(201);

      // Second upload with same token should fail
      const status2 = await uploadViaSignedUrl(token, buffer, "text/plain");
      expect(status2).toBe(403);
    });

    it("should validate Content-Type matches signed URL", async () => {
      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/type-test.txt",
        contentType: "text/plain",
        size: 100,
        expiresIn: 3600,
      });

      const token = signedUrl.split("/").pop()!;
      const buffer = Buffer.from("test");

      // Upload with wrong content type
      const status = await uploadViaSignedUrl(token, buffer, "image/png");
      expect(status).toBe(400);
    });

    it("should validate Content-Length does not exceed limit", async () => {
      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/size-test.txt",
        contentType: "text/plain",
        size: 10, // Very small limit
        expiresIn: 3600,
      });

      const token = signedUrl.split("/").pop()!;
      const buffer = Buffer.from("this content is too large for the limit");

      const status = await uploadViaSignedUrl(token, buffer, "text/plain");
      expect(status).toBe(413);
    });

    it("should validate MD5 hash matches", async () => {
      const content = "test content";
      const buffer = Buffer.from(content);
      const correctMd5 = crypto
        .createHash("md5")
        .update(content)
        .digest("base64");
      const wrongMd5 = crypto
        .createHash("md5")
        .update("different content")
        .digest("base64");

      const signedUrl = await adapter.generateUploadSignedUrl({
        path: "public/md5-test.txt",
        contentType: "text/plain",
        size: buffer.length,
        expiresIn: 3600,
        md5Hash: correctMd5,
      });

      const token = signedUrl.split("/").pop()!;

      // Upload with wrong MD5
      const status = await uploadViaSignedUrl(
        token,
        buffer,
        "text/plain",
        wrongMd5
      );
      expect(status).toBe(400);

      // Verify file was not created
      const filePath = path.join(testDir, "public", "md5-test.txt");
      await expect(fs.access(filePath)).rejects.toThrow();
    });
  });

  describe("File Download Operations", () => {
    beforeEach(async () => {
      // Create test files
      await fs.mkdir(path.join(testDir, "public"), { recursive: true });
      await fs.mkdir(path.join(testDir, "private"), { recursive: true });
      await fs.writeFile(
        path.join(testDir, "public", "test.txt"),
        "public content"
      );
      await fs.writeFile(
        path.join(testDir, "private", "secret.txt"),
        "private content"
      );
    });

    it("should serve public file without authentication", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/public/test.txt"
      );
      expect(response.status).toBe(200);
      const content = await response.text();
      expect(content).toBe("public content");
    });

    it("should reject protected file without authentication", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/private/secret.txt"
      );
      expect(response.status).toBe(403);
    });

    it("should serve protected file with valid authentication", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/private/secret.txt",
        {
          headers: {
            Authorization: "Bearer valid-token",
          },
        }
      );
      expect(response.status).toBe(200);
      const content = await response.text();
      expect(content).toBe("private content");
    });

    it("should return 404 for non-existent file", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/public/missing.txt"
      );
      expect(response.status).toBe(404);
    });

    it("should support range requests for partial content", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/public/test.txt",
        {
          headers: {
            Range: "bytes=0-5",
          },
        }
      );
      expect(response.status).toBe(206);
      expect(response.headers.get("Content-Range")).toBe("bytes 0-5/14");
      const content = await response.text();
      expect(content).toBe("public");
    });

    it("should reject invalid range requests", async () => {
      const response = await fetch(
        "http://localhost:3000/api/storage/files/public/test.txt",
        {
          headers: {
            Range: "bytes=100-200",
          },
        }
      );
      expect(response.status).toBe(416);
    });
  });

  describe("Directory Operations", () => {
    it("should create nested directories", async () => {
      const result = await adapter.createFolder("public/nested/deep/folder");
      expect(result.success).toBe(true);

      const dirPath = path.join(testDir, "public", "nested", "deep", "folder");
      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it("should list directory contents with pagination", async () => {
      // Create test structure
      await fs.mkdir(path.join(testDir, "public"), { recursive: true });
      for (let i = 0; i < 25; i++) {
        await fs.writeFile(
          path.join(testDir, "public", `file${i}.txt`),
          `content ${i}`
        );
      }

      const result = await adapter.listFiles("public", {
        limit: 10,
        offset: 0,
      });

      expect(result.files).toHaveLength(10);
      expect(result.totalCount).toBe(25);
    });

    it("should filter files by type", async () => {
      await fs.mkdir(path.join(testDir, "public"), { recursive: true });
      await fs.writeFile(path.join(testDir, "public", "doc.txt"), "text");
      await fs.writeFile(path.join(testDir, "public", "image.png"), "binary");
      await fs.writeFile(path.join(testDir, "public", "doc2.txt"), "text2");

      const result = await adapter.listFiles("public", {
        fileType: "text/plain",
      });

      expect(result.files).toHaveLength(2);
      expect(result.files.every(f => f.path.endsWith(".txt"))).toBe(true);
    });
  });

  describe("Bulk Operations", () => {
    beforeEach(async () => {
      await fs.mkdir(path.join(testDir, "source"), { recursive: true });
      await fs.mkdir(path.join(testDir, "dest"), { recursive: true });
      await fs.writeFile(path.join(testDir, "source", "file1.txt"), "one");
      await fs.writeFile(path.join(testDir, "source", "file2.txt"), "two");
      await fs.writeFile(path.join(testDir, "source", "file3.txt"), "three");
    });

    it("should move multiple files atomically", async () => {
      const result = await adapter.moveItems([
        { from: "source/file1.txt", to: "dest/file1.txt" },
        { from: "source/file2.txt", to: "dest/file2.txt" },
      ]);

      expect(result.success).toBe(true);
      expect(result.successfulOperations).toBe(2);

      // Verify files moved
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).rejects.toThrow();
      await expect(
        fs.access(path.join(testDir, "dest", "file1.txt"))
      ).resolves.toBeUndefined();
    });

    it("should copy multiple files", async () => {
      const result = await adapter.copyItems([
        { from: "source/file1.txt", to: "dest/file1.txt" },
        { from: "source/file2.txt", to: "dest/file2.txt" },
      ]);

      expect(result.success).toBe(true);
      expect(result.successfulOperations).toBe(2);

      // Verify files copied (originals still exist)
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).resolves.toBeUndefined();
      await expect(
        fs.access(path.join(testDir, "dest", "file1.txt"))
      ).resolves.toBeUndefined();
    });

    it("should delete multiple files with permission checks", async () => {
      const result = await adapter.deleteItems([
        "source/file1.txt",
        "source/file2.txt",
      ]);

      expect(result.success).toBe(true);
      expect(result.successfulOperations).toBe(2);

      // Verify files deleted
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).rejects.toThrow();
    });

    it("should rollback on partial failure", async () => {
      const result = await adapter.moveItems([
        { from: "source/file1.txt", to: "dest/file1.txt" },
        { from: "source/nonexistent.txt", to: "dest/nonexistent.txt" },
      ]);

      expect(result.success).toBe(false);
      // Verify rollback: file1 should still be in source
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).resolves.toBeUndefined();
    });
  });

  describe("Cleanup Operations", () => {
    it("should delete expired signed URLs", async () => {
      // Create expired signed URL
      await signedUrlRepository.createSignedUrl({
        id: "expired-token",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: 100,
        contentMd5: "abc123",
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        createdAt: new Date(),
        used: false,
      });

      // Create valid signed URL
      await signedUrlRepository.createSignedUrl({
        id: "valid-token",
        filePath: "test2.txt",
        contentType: "text/plain",
        fileSize: 100,
        contentMd5: "def456",
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        createdAt: new Date(),
        used: false,
      });

      const deletedCount = await signedUrlRepository.deleteExpired();
      expect(deletedCount).toBe(1);

      // Verify expired token deleted
      const expired =
        await signedUrlRepository.getSignedUrlById("expired-token");
      expect(expired).toBeNull();

      // Verify valid token still exists
      const valid = await signedUrlRepository.getSignedUrlById("valid-token");
      expect(valid).not.toBeNull();
    });

    it("should perform lazy cleanup when configured", async () => {
      process.env.SIGNED_URL_CLEANUP_STRATEGY = "lazy";

      // Create expired token
      await signedUrlRepository.createSignedUrl({
        id: "lazy-expired",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: 100,
        contentMd5: "abc123",
        expiresAt: new Date(Date.now() - 3600000),
        createdAt: new Date(),
        used: false,
      });

      // Generate new signed URL (should trigger cleanup)
      await adapter.generateUploadSignedUrl({
        path: "public/new-file.txt",
        contentType: "text/plain",
        size: 100,
        expiresIn: 3600,
      });

      // Verify expired token was cleaned up
      const expired =
        await signedUrlRepository.getSignedUrlById("lazy-expired");
      expect(expired).toBeNull();
    });
  });

  describe("Storage Statistics", () => {
    beforeEach(async () => {
      await fs.mkdir(path.join(testDir, "public"), { recursive: true });
      await fs.writeFile(path.join(testDir, "public", "small.txt"), "hi");
      await fs.writeFile(
        path.join(testDir, "public", "large.txt"),
        "x".repeat(10000)
      );
    });

    it("should calculate storage statistics", async () => {
      const stats = await adapter.storageStatistics();

      expect(stats.totalFiles).toBe(2);
      expect(stats.totalSize).toBeGreaterThan(10000);
      expect(stats.publicFiles).toBe(2);
    });
  });

  describe("Database-Filesystem Synchronization", () => {
    it("should clean up filesystem if database insert fails", async () => {
      // Mock DB failure
      jest
        .spyOn(adapter as any, "createFileRecord")
        .mockRejectedValueOnce(new Error("DB failure"));

      const buffer = Buffer.from("test");
      await expect(
        adapter.uploadFile("public/fail-test.txt", "text/plain", buffer)
      ).rejects.toThrow("DB failure");

      // Verify file was cleaned up from filesystem
      const filePath = path.join(testDir, "public", "fail-test.txt");
      await expect(fs.access(filePath)).rejects.toThrow();
    });
  });
});

// Helper function for testing signed URL uploads
async function uploadViaSignedUrl(
  token: string,
  buffer: Buffer,
  contentType: string,
  md5Hash?: string
): Promise<number> {
  const response = await fetch(
    `http://localhost:3000/api/storage/upload/${token}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        ...(md5Hash && { "Content-MD5": md5Hash }),
      },
      body: buffer,
    }
  );
  return response.status;
}
```

**File:** `tests/storage/signed-url-repository.test.ts`

Create tests for the signed URL repository with the same incremental validation approach:

1. **Write ONE describe block completely**
2. **Run validation:** `~/.bun/bin/bun lint && ~/.bun/bin/bun tsc --noEmit`
3. **Run the test:** `~/.bun/bin/bun test tests/storage/signed-url-repository.test.ts`
4. **Fix any errors**
5. **Move to next describe block**

```typescript
import { describe, it, expect, beforeEach } from "@jest/globals";
import { signedUrlRepository } from "@/server/db/repo";
import { db } from "@/server/db";

describe("Signed URL Repository", () => {
  beforeEach(async () => {
    // Clean up signed_url table before each test
    await db.delete(signedUrls);
  });

  describe("createSignedUrl", () => {
    it("should create signed URL entry", async () => {
      const data = {
        id: "test-token-123",
        filePath: "public/test.txt",
        contentType: "text/plain",
        fileSize: BigInt(1024),
        contentMd5: "abc123def456",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        used: false,
      };

      const result = await signedUrlRepository.createSignedUrl(data);
      expect(result.id).toBe("test-token-123");
      expect(result.filePath).toBe("public/test.txt");
    });
  });

  describe("claimSignedUrl", () => {
    it("should atomically claim unused, non-expired token", async () => {
      const token = await signedUrlRepository.createSignedUrl({
        id: "claim-test",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        used: false,
      });

      const claimed = await signedUrlRepository.claimSignedUrl("claim-test");
      expect(claimed).not.toBeNull();
      expect(claimed!.used).toBe(true);
    });

    it("should return null for already-used token", async () => {
      await signedUrlRepository.createSignedUrl({
        id: "used-test",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        used: true,
      });

      const claimed = await signedUrlRepository.claimSignedUrl("used-test");
      expect(claimed).toBeNull();
    });

    it("should return null for expired token", async () => {
      await signedUrlRepository.createSignedUrl({
        id: "expired-test",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash",
        expiresAt: new Date(Date.now() - 3600000), // Expired
        createdAt: new Date(),
        used: false,
      });

      const claimed = await signedUrlRepository.claimSignedUrl("expired-test");
      expect(claimed).toBeNull();
    });

    it("should prevent race conditions with concurrent claims", async () => {
      await signedUrlRepository.createSignedUrl({
        id: "race-test",
        filePath: "test.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        used: false,
      });

      // Attempt 5 concurrent claims
      const claims = await Promise.allSettled([
        signedUrlRepository.claimSignedUrl("race-test"),
        signedUrlRepository.claimSignedUrl("race-test"),
        signedUrlRepository.claimSignedUrl("race-test"),
        signedUrlRepository.claimSignedUrl("race-test"),
        signedUrlRepository.claimSignedUrl("race-test"),
      ]);

      // Only one should succeed
      const successful = claims.filter(
        c => c.status === "fulfilled" && c.value !== null
      );
      expect(successful).toHaveLength(1);
    });
  });

  describe("deleteExpired", () => {
    it("should delete only expired tokens", async () => {
      // Create expired token
      await signedUrlRepository.createSignedUrl({
        id: "expired-1",
        filePath: "test1.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash1",
        expiresAt: new Date(Date.now() - 3600000),
        createdAt: new Date(),
        used: false,
      });

      // Create valid token
      await signedUrlRepository.createSignedUrl({
        id: "valid-1",
        filePath: "test2.txt",
        contentType: "text/plain",
        fileSize: BigInt(100),
        contentMd5: "hash2",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        used: false,
      });

      const deleted = await signedUrlRepository.deleteExpired();
      expect(deleted).toBe(1);

      // Verify correct tokens deleted
      const expired = await signedUrlRepository.getSignedUrlById("expired-1");
      const valid = await signedUrlRepository.getSignedUrlById("valid-1");

      expect(expired).toBeNull();
      expect(valid).not.toBeNull();
    });
  });
});
```

**File:** `jest.config.js` (update)

Add test coverage configuration:

```javascript
collectCoverageFrom: [
  "server/storage/**/*.ts",
  "server/db/repo/signedUrl.repository.ts",
  "app/api/storage/**/*.ts",
  "!**/*.d.ts",
  "!**/node_modules/**",
],
```

### Key Testing Points:

1.  ✅ **Race Condition:** Concurrent uploads with same signed URL token
2.  ✅ **Path Traversal:** Malicious path inputs with various traversal patterns
3.  ✅ **Serverless Check:** Fatal error detection with multiple cloud provider env vars
4.  ✅ **MD5 Validation:** Mismatched hash detection and file cleanup
5.  ✅ **File Size Validation:** Upload size exceeding declared limit
6.  ✅ **Signed URL Expiration:** Expired token rejection
7.  ✅ **Signed URL Reuse:** Already-used token rejection
8.  ✅ **File Upload via Signed URL:** Successful upload flow
9.  ✅ **File Download Permissions:** Public/protected access control
10. ✅ **Range Requests:** Partial content streaming
11. ✅ **Directory Operations:** Create, list, delete with permissions
12. ✅ **Bulk Operations:** Move, copy, delete with atomicity
13. ✅ **DB-Filesystem Sync:** Cleanup on transaction failures
14. ✅ **Cleanup Operations:** Lazy and scheduled cleanup strategies
15. ✅ **Atomic Token Claiming:** Row-level locking for concurrent claim prevention
16. ✅ **Storage Statistics:** Size and count calculations
17. ✅ **Filtering and Pagination:** List operations with limits and offsets

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

**Schema & Repository (Foundation):**

- [x] Add signed_url table to storage schema
- [x] Create signedUrl.repository.ts with CRUD operations
  - [x] createSignedUrl
  - [x] getSignedUrlById
  - [x] claimSignedUrl (atomic with row-level locking)
  - [x] deleteExpired

**Local Adapter Implementation (Incremental):**

- [x] Create local.ts file with class skeleton, imports, and stub methods
- [x] Implement factory function with serverless kill switch
- [x] Implement helper functions (getAbsolutePath, fileStatsToMetadata, ensureDirectory, calculateMd5, streamToFile)
- [x] Phase 1: Core file operations (validate after each)
  - [x] fileExists() → lint → tsc → compare with GCP → fix
  - [x] uploadFile() → lint → tsc → compare with GCP → fix
  - [x] deleteFile() → lint → tsc → compare with GCP → fix
  - [x] renameFile() → lint → tsc → compare with GCP → fix
- [x] Phase 2: Metadata & info operations (validate after each)
  - [x] fileInfoByPath() → lint → tsc → compare with GCP → fix
  - [x] fileInfoByDbFileId() → lint → tsc → compare with GCP → fix
  - [x] directoryInfoByPath() → lint → tsc → compare with GCP → fix
- [x] Phase 3: Directory operations (validate after each)
  - [x] createFolder() → lint → tsc → compare with GCP → fix
  - [x] listFiles() → lint → tsc → compare with GCP → fix
  - [x] fetchDirectoryChildren() → lint → tsc → compare with GCP → fix
- [x] Phase 4: Signed URLs (validate after each)
  - [x] generateUploadSignedUrl() → lint → tsc → compare with GCP → fix
- [x] Phase 5: Bulk operations (validate after each)
  - [x] moveItems() → lint → tsc → compare with GCP → fix
  - [x] copyItems() → lint → tsc → compare with GCP → fix
  - [x] deleteItems() → lint → tsc → compare with GCP → fix
- [x] Phase 6: Statistics (implement last)
  - [x] storageStatistics() → lint → tsc → compare with GCP → fix
- [x] Phase 6: Statistics
  - [x] storageStatistics() → lint → tsc → compare with GCP → fix

**API Routes:**

- [x] Create Next.js API route for signed URL uploads (/api/storage/upload/[id])
- [x] Create Next.js API route for file serving/download (/api/storage/files/[[...path]])
- [x] Create Next.js API route for cron cleanup (/api/cron/cleanup-signed-urls)
- [x] Create Next.js API route for manual cleanup (/api/storage/cleanup)

**Integration:**

- [x] Update storage service factory to support local provider
- [x] Update environment variables (.env.example)
- [x] Update Next.js config (image domains)
- [x] Create environment type definitions (server/types/environment.d.ts)
- [x] Implement configurable cleanup strategies (lazy/cron/both/disabled)

**Testing:**

- [x] Setup default storage path (create directories, set permissions, update .env, add to .gitignore)
- [ ] Write comprehensive Jest test suite for local adapter (incremental: lint → tsc → test after each describe block)
- [ ] Write Jest tests for signed URL repository (incremental: lint → tsc → test after each describe block)
- [ ] Add test coverage for API routes (incremental: lint → tsc → test after each describe block)
- [ ] Configure Jest coverage reporting for storage module

**Documentation:**

- [ ] Document the local storage provider and operational caveats
- [ ] Document cleanup strategies and configuration
- [ ] Document serverless restrictions
- [ ] Document backup and migration strategies

---

## Progress Summary (as of current session)

**Completed:**

- ✅ Database schema with signed_url table and indexes
- ✅ Drizzle migration generated and applied
- ✅ SignedUrlRepository with atomic operations
- ✅ LocalAdapter helper functions (5/5)
- ✅ Core file operations (4/4: fileExists, uploadFile, deleteFile, renameFile)
- ✅ Metadata operations (3/3: directoryInfoByPath, fileInfoByPath, fileInfoByDbFileId)
- ✅ Directory operations (3/3: createFolder, listFiles, fetchDirectoryChildren)
- ✅ Signed URL generation with lazy cleanup support
- ✅ Bulk operations (3/3: moveItems, copyItems, deleteItems)
- ✅ Storage statistics implementation
- ✅ All API routes created and validated:
  - ✅ Upload route with signed URL validation
  - ✅ File serving/download route with range request support
  - ✅ Manual cleanup route with authentication
  - ✅ Cron cleanup route with bearer token authentication
- ✅ Storage service factory updated for local provider
- ✅ Environment configuration complete (.env.example, environment.d.ts)
- ✅ Next.js config updated (image domains)
- ✅ All code passes lint and TypeScript compilation

**Next Steps:**

- Write comprehensive Jest test suite for local adapter
- Write Jest tests for signed URL repository
- Add test coverage for API routes
- Configure Jest coverage reporting for storage module
- Document the local storage provider and operational caveats
- Document cleanup strategies and configuration
- Document serverless restrictions
- Document backup and migration strategies
