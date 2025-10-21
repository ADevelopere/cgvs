# API Routes Testing Plan

## Implementation Approach

**CRITICAL: Incremental Development with Continuous Validation**

Follow this workflow for EVERY step:

1. **Setup Phase** (do once, validate before moving on):
   - Create file skeleton with imports
   - Implement all setup/teardown functions (beforeAll, afterAll, beforeEach)
   - Implement all helper/utility functions
   - Run `~/.bun/bin/bun lint tests/storage/api-routes.integration.test.ts`
   - Run `~/.bun/bin/bun tsc --noEmit`
   - Fix any errors before proceeding

2. **Test Implementation Phase** (one test at a time):
   - Write ONE complete test function
   - Run `~/.bun/bin/bun lint tests/storage/api-routes.integration.test.ts`
   - Run `~/.bun/bin/bun tsc --noEmit`
   - Run `~/.bun/bin/bun test tests/storage/api-routes.integration.test.ts`
   - Verify the single test passes
   - Fix any errors before moving to next test
   - Move to next test function

3. **Quality Checklist per Test**:
   - ✅ Lint passes
   - ✅ TypeScript compilation succeeds
   - ✅ Test passes consistently (run 2-3 times)
   - ✅ Proper cleanup (no orphaned files/records)
   - ✅ Clear assertions with meaningful error messages

**Do NOT write multiple tests at once. Do NOT skip validation steps.**

## Overview

Create comprehensive integration tests for the local storage adapter's API routes, combining:

- Dev server management from `tests/upload-integration.test.ts`
- Database setup and migrations from `tests/storage/local-adapter.integrationTest.ts`
- API endpoint testing for signed URL uploads, file serving, and cleanup operations

## Test File Structure

**File:** `tests/storage/api-routes.integration.test.ts`

This will be a comprehensive integration test suite that:

1. Starts a real Next.js dev server on a random port
2. Runs database migrations on the test database
3. Tests all storage API routes with actual HTTP requests
4. Cleans up server and database after tests complete

## Setup Strategy

### 1. Environment and Database Setup (Before All Tests)

**Load Test Environment:**

- Use `dotenv` to load `.env.test` configuration
- Validate required environment variables:
  - `DATABASE_URL` (test database)
  - `LOCAL_STORAGE_PATH` (test storage directory)
  - `STORAGE_PROVIDER=local`

**Run Database Migrations:**

- Import `runMigrations` from `@/server/db/scripts/migrate`
- Execute migrations against test database
- Do NOT close the pool (keep it open for tests)
- Log migration status for debugging

**Create Test Storage Directories:**

- Create `LOCAL_STORAGE_PATH` directory structure
- Create subdirectories: `public/`, `private/`, `temp/`
- Set proper permissions (0o755)

**Start Development Server:**

- Spawn `bun dev` process on random port (8000-8999 range)
- Wait for server ready signal in stdout
- Store server port for API requests
- Set timeout of 30 seconds for server startup
- Handle server startup errors gracefully

### 2. Test Data Setup (Before Each Test)

**Clean Database:**

- Delete all records from `signed_urls` table
- Delete all records from `storage_files` table
- Delete all records from `storage_directories` table

**Clean Filesystem:**

- Remove all files from test storage directory
- Recreate directory structure (public/, private/, temp/)

**Create Test Files:**

- Generate sample test files as needed per test case
- Create binary data for upload tests
- Generate MD5 hashes for validation

### 3. Cleanup Strategy (After All Tests)

**Stop Development Server:**

- Send SIGTERM to dev server process
- Wait up to 5 seconds for graceful shutdown
- Force kill (SIGKILL) if timeout exceeded
- Log server shutdown status

**Clean Test Storage:**

- Recursively delete test storage directory
- Ignore errors if already cleaned

**Database Cleanup:**

- Pool will be closed automatically by test framework
- No manual cleanup needed (handled by drizzle)

## Test Suites

### Suite 1: Upload API (`/api/storage/upload/[id]`)

**Test Structure:**

- All tests use actual HTTP PUT requests to the running dev server
- Each test creates a signed URL token in the database first
- Then attempts to upload a file using the token

**Test Cases:**

1. **Successful File Upload with Valid Signed URL**
   - Create signed URL token in database (unused, not expired)
   - Generate test file with known content and MD5 hash
   - Send PUT request with correct headers (Content-Type, Content-MD5, Content-Length)
   - Verify response status 201 Created
   - Verify response body contains file metadata
   - Verify file exists on disk at correct path
   - Verify file content matches uploaded data
   - Verify database record created in `storage_files` table
   - Verify signed URL marked as used in database

2. **Reject Invalid Token (Non-Existent)**
   - Send PUT request with random token ID that doesn't exist in database
   - Verify response status 403 Forbidden
   - Verify error message indicates invalid token
   - Verify no file created on disk
   - Verify no database record created

3. **Reject Expired Token**
   - Create signed URL token with expiration in the past
   - Attempt to upload file
   - Verify response status 403 Forbidden
   - Verify error message indicates expired token
   - Verify token remains unused in database
   - Verify no file created

4. **Reject Already Used Token**
   - Create signed URL token marked as used
   - Attempt to upload file
   - Verify response status 403 Forbidden
   - Verify error message indicates token already used
   - Verify no file created

5. **Reject Content-Type Mismatch**
   - Create signed URL for "image/jpeg"
   - Send PUT request with "text/plain" Content-Type header
   - Verify response status 400 Bad Request
   - Verify error message mentions Content-Type mismatch
   - Verify token marked as used (claimed but failed validation)
   - Verify no file created

6. **Reject Content-MD5 Mismatch**
   - Create signed URL with specific MD5 hash
   - Send PUT request with different MD5 in header
   - Verify response status 400 Bad Request
   - Verify error message mentions MD5 mismatch
   - Verify file deleted from disk if partially written
   - Verify no database record created

7. **Reject Missing Content-MD5 Header**
   - Create valid signed URL token
   - Send PUT request without Content-MD5 header
   - Verify response status 400 Bad Request
   - Verify error message indicates missing MD5

8. **Reject Content-Length Exceeding Declared Size**
   - Create signed URL for 1KB file
   - Send PUT request with Content-Length header of 10KB
   - Verify response status 413 Payload Too Large
   - Verify error message indicates size exceeded

9. **Handle Path Traversal Attack**
   - Create signed URL with malicious path (e.g., "../../etc/passwd")
   - Attempt to upload file
   - Verify response status 400 Bad Request
   - Verify error message indicates invalid path
   - Verify no file created outside storage directory

10. **Race Condition: Concurrent Upload Attempts**
    - Create single signed URL token
    - Send 3 simultaneous PUT requests with same token
    - Verify only ONE request succeeds (201 Created)
    - Verify other TWO requests fail (403 Forbidden)
    - Verify only ONE file created on disk
    - Verify only ONE database record created
    - Verify token marked as used only once

11. **Database Transaction Failure Recovery**
    - Mock database insert to fail after file written
    - Verify orphaned file is deleted from disk
    - Verify response status 500 Internal Server Error
    - (This test may require mocking or special setup)

### Suite 2: File Download API (`/api/storage/files/[[...path]]`)

**Test Structure:**

- Pre-create files on disk and database records
- Send GET requests to download files
- Verify response headers and content

**Test Cases:**

1. **Successful Download of Public File**
   - Create file in `public/` directory
   - Create database record with `isProtected=false`
   - Send GET request without authentication
   - Verify response status 200 OK
   - Verify Content-Type header correct
   - Verify Content-Length header matches file size
   - Verify response body matches file content
   - Verify Cache-Control header present

2. **Download Protected File with Authentication**
   - Create file in `private/` directory
   - Create database record with `isProtected=true`
   - Send GET request WITH valid authentication (session/JWT)
   - Verify response status 200 OK
   - Verify file content returned correctly

3. **Reject Protected File without Authentication**
   - Create file in `private/` directory
   - Create database record with `isProtected=true`
   - Send GET request WITHOUT authentication
   - Verify response status 403 Forbidden
   - Verify error message indicates authentication required

4. **Return 404 for Non-Existent File**
   - Send GET request for file that doesn't exist
   - Verify response status 404 Not Found
   - Verify error message indicates file not found

5. **Reject Path Traversal in Download**
   - Send GET request with path like `../../../etc/passwd`
   - Verify response status 400 Bad Request
   - Verify error message indicates invalid path
   - Verify no file served

6. **Support Range Requests (Partial Content)**
   - Create large test file (e.g., 10KB)
   - Send GET request with `Range: bytes=0-1023` header
   - Verify response status 206 Partial Content
   - Verify Content-Range header present
   - Verify Content-Length is 1024 bytes
   - Verify response body contains correct byte range

7. **Support Multiple Range Requests**
   - Create test file
   - Send GET request with `Range: bytes=1000-1999`
   - Verify correct middle section returned
   - Send GET request with `Range: bytes=5000-` (to end)
   - Verify correct tail section returned

8. **Handle Invalid Range Requests**
   - Create 1KB test file
   - Send GET request with `Range: bytes=5000-10000` (beyond file size)
   - Verify appropriate error response (416 Range Not Satisfiable)

### Suite 3: Manual Cleanup API (`/api/storage/cleanup`)

**Test Structure:**

- Create mix of expired and valid signed URL tokens
- Call cleanup endpoint
- Verify expired tokens deleted

**Test Cases:**

1. **Delete Expired Signed URLs**
   - Create 3 expired signed URL tokens (expiration in past)
   - Create 2 valid signed URL tokens (expiration in future)
   - Send POST request to `/api/storage/cleanup`
   - Verify response status 200 OK
   - Verify response body indicates 3 deleted
   - Verify expired tokens removed from database
   - Verify valid tokens still exist in database

2. **Return Zero When No Expired Tokens**
   - Create only valid (non-expired) tokens
   - Send POST request to cleanup endpoint
   - Verify response status 200 OK
   - Verify response body indicates 0 deleted
   - Verify all tokens still exist in database

3. **Require Authentication for Cleanup**
   - Send POST request WITHOUT admin authentication
   - Verify response status 401 or 403
   - Verify error message indicates authentication required
   - Verify no tokens deleted

4. **Handle Cleanup of Large Batches**
   - Create 100 expired signed URL tokens
   - Send POST request to cleanup endpoint
   - Verify all 100 tokens deleted
   - Verify response indicates correct count

### Suite 4: Cron Cleanup API (`/api/cron/cleanup-signed-urls`)

**Test Structure:**

- Test cron-triggered cleanup with bearer token authentication
- Similar to manual cleanup but with different auth mechanism

**Test Cases:**

1. **Successful Cleanup with Valid Bearer Token**
   - Set `CRON_SECRET` environment variable
   - Create expired tokens in database
   - Send POST request with `Authorization: Bearer <CRON_SECRET>` header
   - Verify response status 200 OK
   - Verify expired tokens deleted
   - Verify response includes deletion count

2. **Reject Request with Invalid Bearer Token**
   - Send POST request with wrong bearer token
   - Verify response status 401 Unauthorized
   - Verify error message indicates invalid token
   - Verify no tokens deleted

3. **Reject Request without Authorization Header**
   - Send POST request without Authorization header
   - Verify response status 401 Unauthorized
   - Verify no tokens deleted

## HTTP Client Strategy

**Use `node-fetch` or Native `fetch` API:**

- Modern fetch API available in Node.js 18+
- Construct full URLs: `http://localhost:${serverPort}/api/storage/...`
- Set appropriate headers for each request
- Handle response parsing (JSON, binary)

**Example Request Pattern:**

```javascript
const response = await fetch(
  `http://localhost:${serverPort}/api/storage/upload/${tokenId}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
      "Content-MD5": md5Hash,
      "Content-Length": fileSize.toString(),
    },
    body: fileBuffer,
  }
);
```

## Utilities and Helpers

**Helper Functions to Create:**

1. **`createSignedUrlToken(options)`**
   - Creates a signed URL token directly in database
   - Accepts options: id, filePath, contentType, fileSize, contentMd5, expiresAt, used
   - Returns the created token entity
   - Used to set up test scenarios

2. **`createTestFile(path, content)`**
   - Creates a file on disk in test storage directory
   - Optionally creates database record
   - Returns file stats and MD5 hash

3. **`calculateMd5(buffer)`**
   - Calculate MD5 hash of buffer in base64 format
   - Consistent with upload expectations
   - Returns base64-encoded MD5 string

4. **`waitForServer(port, timeout)`**
   - Poll server port until it responds
   - Used to ensure server is ready before tests start
   - Returns promise that resolves when server ready

5. **`makeApiRequest(path, options)`**
   - Wrapper around fetch for API calls
   - Automatically includes server port
   - Handles common headers
   - Returns parsed response

## Test Execution Order

1. **Setup Phase (beforeAll):**
   - Load environment
   - Run migrations
   - Create storage directories
   - Start dev server
   - Wait for server ready

2. **Test Execution (describe blocks run sequentially):**
   - Upload API tests
   - Download API tests
   - Manual cleanup API tests
   - Cron cleanup API tests

3. **Cleanup Phase (afterAll):**
   - Stop dev server
   - Clean storage directory
   - Database pool closes automatically

## Error Handling and Debugging

**Logging Strategy:**

- Use `testLogger` for all test-related logging
- Log server startup/shutdown events
- Log API request/response for debugging
- Log database operations (token creation, cleanup)

**Timeout Configuration:**

- Overall test suite timeout: 120 seconds (2 minutes)
- Individual test timeout: 30 seconds
- Server startup timeout: 30 seconds
- Server shutdown timeout: 5 seconds

**Error Scenarios to Handle:**

- Server fails to start (port in use, build errors)
- Database connection failures
- Migration errors
- API request timeouts
- Unexpected response formats

## Dependencies

**Test Framework:**

- Jest (already configured)
- `@jest/globals` for test functions

**HTTP Client:**

- Native `fetch` API (Node.js 18+)
- Or `node-fetch` if needed for compatibility

**File Operations:**

- `fs/promises` for async file operations
- `crypto` for MD5 hash calculation

**Process Management:**

- `child_process.spawn` for dev server
- Process signal handling (SIGTERM, SIGKILL)

**Database:**

- Drizzle ORM for database operations
- Migration runner from existing setup

## Success Criteria

**All Tests Must:**

- ✅ Pass consistently without flakiness
- ✅ Clean up after themselves (no orphaned files/records)
- ✅ Use isolated test database
- ✅ Not interfere with each other (proper beforeEach cleanup)
- ✅ Complete within timeout limits
- ✅ Provide clear error messages on failure

**Code Quality:**

- ✅ Pass lint checks
- ✅ Pass TypeScript compilation
- ✅ Follow existing test patterns
- ✅ Include descriptive test names
- ✅ Use proper assertions (expect statements)

**Coverage Goals:**

- ✅ All API route handlers tested
- ✅ All error paths tested
- ✅ All authentication/authorization scenarios tested
- ✅ Edge cases covered (race conditions, invalid input, etc.)

## Implementation Steps

1. **Create test file skeleton** with setup/teardown
2. **Implement server management** (start/stop functions)
3. **Implement database setup** (migrations, cleanup)
4. **Create helper functions** (token creation, file creation, etc.)
5. **Write Upload API tests** (one at a time, validate each)
6. **Write Download API tests** (one at a time, validate each)
7. **Write Cleanup API tests** (manual and cron)
8. **Run full suite** and fix any race conditions or flakiness
9. **Document any gotchas** or special setup requirements

## Notes and Considerations

**Port Selection:**

- Use random port (8000-8999) to avoid conflicts
- Store port globally for all tests to use
- Verify port is actually free before starting server

**Database Isolation:**

- Always use `.env.test` configuration
- Never run against production database
- Verify `DATABASE_URL` points to test database before starting

**File System Isolation:**

- Use test-specific storage path from `.env.test`
- Never use production storage directory
- Clean up test files even if tests fail

**Timing Considerations:**

- Server startup can take 10-30 seconds
- Database operations are fast (< 100ms typically)
- File operations are fast on local disk
- Network requests to localhost are fast (< 10ms)
- Allow enough timeout for CI/CD environments (slower)

**Authentication Mocking:**

- For protected file downloads, may need to mock authentication
- Consider using test JWT tokens
- Or mock the authentication middleware
- Document authentication setup in test file

**Potential Issues:**

- Server port already in use → use random port selection
- Database migrations fail → check test database connectivity
- File permission errors → verify test directory permissions
- Race conditions in concurrent tests → proper test isolation needed
- Server doesn't start → increase timeout, check build errors

## Future Enhancements

**After Initial Implementation:**

- Add performance benchmarks (upload/download speed)
- Add stress tests (many concurrent requests)
- Add tests for very large files (>100MB)
- Add tests for resumable uploads
- Add tests for signed URL expiration edge cases (expires during upload)
- Add tests for disk space limits
- Add tests for corrupted file scenarios
