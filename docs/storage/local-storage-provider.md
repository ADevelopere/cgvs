# Local Storage Provider

## Overview

The local storage provider is a filesystem-based storage adapter that stores files directly on the server's local disk. It provides an alternative to cloud-based storage solutions like Google Cloud Storage, making it ideal for development, testing, or single-server deployments.

**⚠️ WARNING: Not suitable for serverless or horizontally scaled deployments.**

---

## Table of Contents

- [Features](#features)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Security](#security)
- [Operational Caveats](#operational-caveats)
- [API Routes](#api-routes)
- [Cleanup Strategies](#cleanup-strategies)
- [Backup & Migration](#backup--migration)
- [Troubleshooting](#troubleshooting)
- [Detailed Guides](#detailed-guides)

---

## Features

✅ **Full StorageService Interface Compatibility** - Drop-in replacement for GCP adapter  
✅ **Signed URL Support** - Secure upload/download URLs with expiration  
✅ **MD5 Hash Validation** - File integrity verification on upload  
✅ **Range Request Support** - Partial content streaming for video/large files  
✅ **Path Traversal Protection** - Security-first path validation  
✅ **Permission System** - Public/private access control aligned with GCP adapter  
✅ **Bulk Operations** - Batch move, copy, and delete with atomicity  
✅ **Database Integration** - File metadata tracking in PostgreSQL  
✅ **Configurable Cleanup** - Flexible signed URL expiration cleanup strategies

---

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Storage Provider Selection
STORAGE_PROVIDER=local

# Local Storage Configuration
LOCAL_STORAGE_PATH=./storage/

# Public base URL of the application (no trailing slash)
# Used for generating signed upload/download URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Signed URL Cleanup Configuration
SIGNED_URL_CLEANUP_STRATEGY=lazy  # Options: 'lazy', 'cron', 'both', 'disabled'
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Cron expression (default: every hour)
CRON_SECRET=your-secret-key-here  # Secret for authenticating cron requests
```

### Directory Structure

The local storage provider expects the following directory structure:

```
./storage/
├── public/          # Public files (no authentication required)
├── private/         # Protected files (authentication required)
└── temp/            # Temporary uploads
```

**Setup Commands:**

```bash
# Create directory structure
mkdir -p ./storage/{public,private,temp}

# Set permissions (read/write for owner, read for group)
chmod -R 755 ./cgvs/data/files

# Add to .gitignore
echo "storage/" >> .gitignore
```

---

## Architecture

### Storage Adapter

**File:** `server/storage/disk/local.ts`

The `LocalAdapter` class implements the `StorageService` interface using Node.js filesystem APIs (`fs/promises`). Key features:

- **Serverless Kill Switch:** Detects serverless environments and throws a fatal error
- **Path Security:** All paths validated through `getAbsolutePath()` helper to prevent traversal attacks
- **Streaming Operations:** Memory-efficient file handling using streams
- **Database Sync:** File metadata tracked in PostgreSQL for consistency
- **Error Handling:** Graceful error handling with proper cleanup on failures

### Signed URLs

**Database Table:** `signed_url`

Signed URLs provide secure, time-limited access for uploads and downloads without requiring authentication headers on every request.

**Schema:**

```sql
CREATE TABLE signed_url (
  id TEXT PRIMARY KEY,              -- UUID token
  file_path TEXT NOT NULL,          -- Target file path
  operation TEXT NOT NULL,          -- 'upload' or 'download'
  expires_at TIMESTAMP NOT NULL,    -- Expiration timestamp
  content_type TEXT,                -- Expected MIME type
  file_size BIGINT,                 -- Max upload size (bytes)
  content_md5 TEXT,                 -- Expected MD5 hash (base64)
  is_used BOOLEAN DEFAULT FALSE,    -- Claimed flag
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient cleanup and lookup
CREATE INDEX idx_signed_url_expires ON signed_url(expires_at);
CREATE INDEX idx_signed_url_used ON signed_url(is_used, expires_at);
```

**Atomic Claiming:**

The `claimSignedUrl()` repository method uses PostgreSQL row-level locking to prevent race conditions:

```typescript
// Atomically claim a token (only one request succeeds)
UPDATE signed_url
SET is_used = true
WHERE id = $1
  AND is_used = false
  AND expires_at > NOW()
RETURNING *;
```

### API Routes

Three Next.js API routes handle file operations:

1. **Upload Route:** `/api/storage/upload/[id]` - Handles PUT requests with signed URL tokens
2. **Download Route:** `/api/storage/files/[[...path]]` - Serves files with range request support
3. **Cleanup Routes:**
   - `/api/storage/cleanup` - Manual cleanup endpoint
   - `/api/cron/cleanup-signed-urls` - Scheduled cleanup endpoint

---

## Security

### Path Traversal Protection

All file paths are validated through the `getAbsolutePath()` helper function:

```typescript
function getAbsolutePath(relativePath: string): string {
  const basePath = path.resolve(LOCAL_STORAGE_PATH);
  const fullPath = path.resolve(basePath, relativePath);

  // Ensure the resolved path is within the base directory
  const relativeToBase = path.relative(basePath, fullPath);
  if (relativeToBase.startsWith("..") || path.isAbsolute(relativeToBase)) {
    throw new Error("Path traversal detected");
  }

  return fullPath;
}
```

**Protected Against:**

- `../../../etc/passwd` - Directory traversal
- `/etc/passwd` - Absolute path injection
- `./secret/../../../etc/passwd` - Nested traversal
- Symlink attacks (resolved paths validated)

### Signed URL Security

**Upload Security:**

1. **Token Validation:** Atomic claim operation prevents reuse
2. **Expiration Check:** Expired tokens rejected immediately
3. **Header Validation:** Content-Type, Content-Length, and Content-MD5 must match token
4. **MD5 Verification:** File hash validated after upload, file deleted if mismatch
5. **Size Limit:** Upload size cannot exceed declared file size

**Download Security:**

1. **Permission Check:** Protected files require authentication
2. **Path Validation:** All paths checked for traversal attempts
3. **Public/Private Separation:** `public/` prefix determines access level
4. **Session Verification:** JWT or session tokens validated for protected resources

### Serverless Kill Switch

The adapter **refuses to start** in serverless environments:

```typescript
// Fatal error if serverless detected
const isServerless =
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.CLOUD_FUNCTIONS;

if (isServerless) {
  throw new Error(
    "Local storage adapter cannot run in serverless environments. " +
      "Use GCP or another cloud storage provider instead."
  );
}
```

---

## Operational Caveats

### ⚠️ Not for Serverless

**Affected Platforms:**

- Vercel
- AWS Lambda
- Netlify Functions
- Google Cloud Functions
- Azure Functions

**Why:** Serverless functions have ephemeral filesystems. Files written to disk are lost when the function instance terminates.

**Alternative:** Use GCP, AWS S3, or Azure Blob Storage for serverless deployments.

**📚 [Complete Serverless Restrictions Guide →](local/serverless-restrictions.md)**

This detailed guide covers:

- ✅ What is serverless and why it's incompatible
- ✅ How the serverless detection works (kill switch mechanism)
- ✅ All affected platforms and environment variables
- ✅ Error messages and troubleshooting
- ✅ Migration paths from local to cloud storage
- ✅ FAQ and common questions

### ⚠️ Not for Horizontal Scaling

**Issue:** Multiple server instances do not share filesystem state.

**Scenario:**

1. User uploads file to Server A
2. File saved to `/data/files/` on Server A's disk
3. User downloads file, load balancer routes to Server B
4. Server B cannot find the file (different disk)

**Solutions:**

- Use a shared network filesystem (NFS, EFS, Azure Files)
- Use cloud storage (GCP, S3, Azure Blob)
- Use a single server deployment

### ⚠️ Backup Requirements

**Critical:** Files are stored on a single server disk. Disk failure = data loss.

**Recommended Strategy:**

```bash
# Daily backup using rsync
rsync -avz --delete \
  /path/to/storage/ \
  /backup/location/files-$(date +%Y%m%d)/

# Or use tar with compression
tar -czf /backup/files-$(date +%Y%m%d).tar.gz \
  /path/to/storage/
```

**Automation Options:**

- Cron jobs for scheduled backups
- Database + filesystem backup together (consistency)
- Off-site backup storage (cloud, NAS, remote server)

### ⚠️ Disk Space Management

**Monitor disk usage:**

```bash
# Check storage usage
du -sh ./storage/

# Check available disk space
df -h /path/to/cgvs/data/
```

**Set up alerts:**

- Disk usage > 80%: Warning
- Disk usage > 90%: Critical
- Automate cleanup of temporary files

---

## API Routes

### Upload Endpoint

**Path:** `PUT /api/storage/upload/[id]`

**Request:**

```http
PUT /api/storage/upload/abc-123-def-456 HTTP/1.1
Host: localhost:3000
Content-Type: image/png
Content-Length: 12345
Content-MD5: rL0Y20zC+Fzt72VPzMSk2A==

[binary file data]
```

**Response (Success):**

```json
{
  "id": 1,
  "path": "uploads/2024/01/image.png",
  "name": "image.png",
  "size": 12345,
  "mimeType": "image/png",
  "url": "http://localhost:3000/api/storage/files/uploads/2024/01/image.png",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `403 Forbidden` - Token invalid, expired, or already used
- `400 Bad Request` - Header validation failed or MD5 mismatch
- `413 Payload Too Large` - File size exceeds limit
- `500 Internal Server Error` - Upload failed

### Download Endpoint

**Path:** `GET /api/storage/files/[[...path]]`

**Request (Full File):**

```http
GET /api/storage/files/public/images/logo.png HTTP/1.1
Host: localhost:3000
```

**Request (Range):**

```http
GET /api/storage/files/videos/demo.mp4 HTTP/1.1
Host: localhost:3000
Range: bytes=0-1023
```

**Response (Full File):**

```http
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 12345
Cache-Control: public, max-age=31536000
ETag: "rL0Y20zC+Fzt72VPzMSk2A=="
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT

[binary file data]
```

**Response (Partial Content):**

```http
HTTP/1.1 206 Partial Content
Content-Type: video/mp4
Content-Length: 1024
Content-Range: bytes 0-1023/1234567
Accept-Ranges: bytes

[partial binary data]
```

**Error Responses:**

- `404 Not Found` - File does not exist
- `403 Forbidden` - Protected file, authentication required
- `400 Bad Request` - Path traversal detected
- `416 Range Not Satisfiable` - Invalid range request

---

## Cleanup Strategies

Expired signed URLs must be cleaned up to prevent database bloat. Four strategies are available:

**Available Strategies:**

1. **Lazy Cleanup (`lazy`)** - Default - Cleanup runs before generating new signed URLs
2. **Cron Cleanup (`cron`)** - Scheduled cleanup via external trigger
3. **Both (`both`)** - Recommended for production - Combines lazy + cron
4. **Disabled (`disabled`)** - Manual cleanup only

**Configuration:**

```bash
SIGNED_URL_CLEANUP_STRATEGY=both  # Options: lazy, cron, both, disabled
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Every hour (default)
CRON_SECRET=your-secret-key-here
```

**📚 [Complete Cleanup Strategies Guide →](local/cleanup-strategies.md)**

**Quick Reference:**

| Strategy   | Best For                  | Pros                           | Cons                         |
| ---------- | ------------------------- | ------------------------------ | ---------------------------- |
| `lazy`     | Development, low traffic  | Simple, no dependencies        | Tied to upload activity      |
| `cron`     | Production, high traffic  | Predictable, no upload latency | Requires external trigger    |
| `both`     | Production, critical apps | Maximum reliability            | More complex setup           |
| `disabled` | Testing only              | Full control                   | Manual intervention required |

### 1. Lazy Cleanup (`lazy`) - Default

**How it works:** Cleanup runs automatically when generating new signed URLs.

**Pros:**

- No external dependencies
- Guaranteed execution (cleanup happens before new tokens)
- Simple configuration

**Cons:**

- Cleanup frequency depends on upload activity
- Low-traffic apps may accumulate expired tokens

**Configuration:**

```bash
SIGNED_URL_CLEANUP_STRATEGY=lazy
```

### 2. Cron Cleanup (`cron`)

**How it works:** Scheduled job hits cleanup endpoint at regular intervals.

**Pros:**

- Predictable cleanup schedule
- Works regardless of application traffic
- Efficient for high-volume apps

**Cons:**

- Requires external cron service or Vercel cron configuration
- Must secure endpoint with `CRON_SECRET`

**Configuration:**

```bash
SIGNED_URL_CLEANUP_STRATEGY=cron
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Every hour
CRON_SECRET=your-secret-key-here
```

**Setup (Vercel):**

Add to `vercel.json`:

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

**Setup (External Cron):**

Use services like [cron-job.org](https://cron-job.org), GitHub Actions, or server cron:

```bash
# Crontab entry (runs every hour)
0 * * * * curl -H "Authorization: Bearer your-secret-key" \
  https://your-domain.com/api/cron/cleanup-signed-urls
```

### 3. Both (`both`)

**How it works:** Combines lazy + cron for maximum reliability.

**Configuration:**

```bash
SIGNED_URL_CLEANUP_STRATEGY=both
CRON_SECRET=your-secret-key-here
```

### 4. Disabled (`disabled`)

**How it works:** No automatic cleanup, manual only.

**Use case:** Testing, development, or custom cleanup scripts.

**Manual Cleanup:**

```bash
# Trigger manual cleanup
curl -X POST http://localhost:3000/api/storage/cleanup
```

---

## Backup & Migration

### Backup Strategy

**📚 [Complete Backup & Migration Guide →](local/backup-migration.md)**

This comprehensive guide covers:

#### Backup Strategies

- ✅ Full backups (weekly/monthly snapshots)
- ✅ Incremental backups (daily changed files)
- ✅ Differential backups (changes since last full)
- ✅ Database-consistent backups (coordinated snapshots)

#### Automated Solutions

- ✅ Cron-based automation
- ✅ Systemd timers
- ✅ Off-site backup (S3, GCP, remote servers)
- ✅ Backup verification and health monitoring

#### Disaster Recovery

- ✅ Single file restoration
- ✅ Complete system recovery
- ✅ Database-only recovery
- ✅ RTO/RPO planning

#### Migration Paths

- ✅ Local → GCP (moving to cloud)
- ✅ GCP → Local (moving to dedicated server)
- ✅ Local → S3 (future implementation)
- ✅ Data integrity verification

### Quick Start - Basic Backup

**Full Backup (Files + Database):**

```bash
#!/bin/bash
BACKUP_DIR="/backup/cgvs-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup files
rsync -avz --delete ./storage/ "$BACKUP_DIR/files/"

# Backup database
pg_dump -h localhost -U postgres cgvs > "$BACKUP_DIR/database.sql"

# Create archive
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup created: $BACKUP_DIR.tar.gz"
```

**Automated Daily Backups:**

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

### Migration: Local → GCP

**1. Upload files to GCP bucket:**

```bash
# Using gsutil
gsutil -m cp -r ./storage/* gs://your-bucket/

# Verify upload
gsutil ls -r gs://your-bucket/
```

**2. Update database file paths (if needed):**

```sql
-- No changes needed if paths remain the same
-- Files stored with relative paths like 'public/images/logo.png'
```

**3. Switch storage provider:**

```bash
# Update .env
STORAGE_PROVIDER=gcp
GCP_BUCKET_NAME=your-bucket
GCP_PROJECT_ID=your-project-id
```

**4. Restart application:**

```bash
bun run dev
```

### Migration: GCP → Local

**1. Download files from GCP:**

```bash
# Using gsutil
gsutil -m cp -r gs://your-bucket/* ./storage/

# Verify download
du -sh ./storage/
```

**2. Switch storage provider:**

```bash
# Update .env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./storage/
```

**3. Restart application:**

```bash
bun run dev
```

---

## Troubleshooting

### Issue: File not found after upload

**Symptoms:**

- Upload succeeds (201 response)
- Download returns 404

**Cause:** Database record created but file not written to disk.

**Solution:**

```bash
# Check file exists on disk
ls -la ./storage/path/to/file.png

# Check database record
psql -d cgvs -c "SELECT * FROM storage_files WHERE path = 'path/to/file.png';"

# Verify permissions
ls -ld ./storage/
# Should show: drwxr-xr-x
```

### Issue: Permission denied errors

**Symptoms:**

- `EACCES: permission denied` errors
- Cannot create directories
- Cannot write files

**Solution:**

```bash
# Fix directory permissions
chmod -R 755 ./storage/

# Ensure ownership
chown -R $(whoami):$(whoami) ./storage/

# Check parent directory permissions
ls -ld ./cgvs/data/
```

### Issue: Disk space full

**Symptoms:**

- `ENOSPC: no space left on device`
- Upload fails with 500 error

**Solution:**

```bash
# Check disk usage
df -h /path/to/cgvs/data/

# Find large files
du -ah ./storage/ | sort -rh | head -20

# Clean up temp files
rm -rf ./storage/temp/*

# Clean up old uploads (careful!)
find ./storage/ -type f -mtime +30 -delete
```

### Issue: MD5 hash mismatch

**Symptoms:**

- Upload fails with "MD5 hash mismatch" error
- File deleted after upload

**Cause:** File corrupted during transfer or incorrect MD5 calculation.

**Solution:**

```bash
# Calculate MD5 locally
md5sum /path/to/file.png | awk '{print $1}' | xxd -r -p | base64

# Compare with Content-MD5 header
# Should match exactly
```

### Issue: Path traversal detected

**Symptoms:**

- `400 Bad Request` with "Path traversal detected" message
- Cannot access files with `..` in path

**Cause:** Security protection blocking potentially malicious paths.

**Solution:**

- Use absolute paths without `..` or `./`
- Do not use paths that escape the storage directory
- Example: Use `public/images/logo.png` not `../../etc/passwd`

### Issue: Signed URL expired

**Symptoms:**

- `403 Forbidden` on upload attempt
- Error message: "Token invalid, expired, or already used"

**Cause:** Signed URL token exceeded expiration time.

**Solution:**

- Generate a new signed URL
- Increase expiration time (default: 1 hour)
- Check server clock synchronization (NTP)

### Issue: Concurrent upload race condition

**Symptoms:**

- Multiple uploads with same token succeed
- Duplicate files created

**Cause:** Atomic claim operation not working correctly.

**Solution:**

- Verify PostgreSQL supports row-level locking
- Check database transaction isolation level
- Review `claimSignedUrl()` implementation

### Enable Debug Logging

```bash
# Set log level in .env
LOG_LEVEL=debug

# Restart application
bun run dev

# Check logs
tail -f logs/combined.log
```

---

## Performance Optimization

### Streaming Best Practices

**DO:**

- ✅ Use `fs.createReadStream()` for large files
- ✅ Pipe streams directly to response
- ✅ Set appropriate `highWaterMark` for buffer size
- ✅ Use `Content-Length` headers for browser optimization

**DON'T:**

- ❌ Buffer entire files in memory
- ❌ Use `fs.readFile()` for large files
- ❌ Block event loop with synchronous operations

### Caching Strategy

**Public Files:**

```http
Cache-Control: public, max-age=31536000, immutable
```

**Protected Files:**

```http
Cache-Control: private, max-age=3600
```

### Database Optimization

**Indexes:**

```sql
-- File path lookups (critical for downloads)
CREATE INDEX idx_storage_files_path ON storage_files(path);

-- Directory listings
CREATE INDEX idx_storage_files_directory ON storage_files(directory_id);

-- Signed URL expiration cleanup
CREATE INDEX idx_signed_url_expires ON signed_url(expires_at);
```

---

## Best Practices

### Development

- ✅ Use local storage for development and testing
- ✅ Keep `LOCAL_STORAGE_PATH` outside version control
- ✅ Use lazy cleanup strategy for simplicity
- ✅ Test with small files during development

### Staging

- ⚠️ Use cloud storage (GCP) if staging environment is serverless
- ✅ Use local storage if staging is a dedicated server
- ✅ Enable cron cleanup for predictable maintenance
- ✅ Test with production-sized files

### Production

- ❌ **DO NOT** use local storage for serverless deployments
- ✅ Use local storage only for single-server deployments
- ✅ Implement robust backup strategy
- ✅ Monitor disk usage with alerts
- ✅ Use `both` cleanup strategy for reliability
- ✅ Regular database + filesystem backups

---

## Detailed Guides

For in-depth information on specific topics, see these comprehensive guides:

### 📘 [Cleanup Strategies & Configuration](local/cleanup-strategies.md)

**Topics covered:**

- Why cleanup matters (database bloat, performance)
- Available strategies (lazy, cron, both, disabled)
- Configuration and environment variables
- Implementation details and database queries
- Monitoring, metrics, and alerting
- Troubleshooting common issues
- Best practices for each environment

**When to read:** Before configuring cleanup for production, or when troubleshooting expired token accumulation.

---

### 🚫 [Serverless Environment Restrictions](local/serverless-restrictions.md)

**Topics covered:**

- What is serverless and why it's incompatible
- Ephemeral filesystems and data loss scenarios
- All affected platforms (Vercel, Lambda, Functions, etc.)
- Detection mechanism and kill switch implementation
- Error messages and what they mean
- Cloud storage alternatives (GCP, S3, Azure)
- Migration guide from local to cloud storage
- Comprehensive FAQ

**When to read:** Before deploying to Vercel or any serverless platform, or when encountering serverless-related errors.

---

### 💾 [Backup & Migration Strategies](local/backup-migration.md)

**Topics covered:**

- Backup types (full, incremental, differential)
- Database-consistent backup coordination
- Automated backup solutions (cron, systemd)
- Off-site backup (S3, GCP, remote servers)
- Disaster recovery procedures
- Migration paths (Local ↔ GCP, Local ↔ S3)
- Data integrity verification
- Testing and verification procedures
- 3-2-1 backup rule implementation
- Recovery Time/Point Objectives (RTO/RPO)

**When to read:** Before setting up production deployment, or when planning disaster recovery procedures.

---

## See Also

- [Storage Service Interface](../../server/storage/storage.service.ts) - Complete API reference
- [GCP Storage Provider](./gcp-storage-provider.md) - Cloud storage alternative
- [Database Schema](../../server/db/schema/storage.ts) - Storage tables and indexes
- [API Routes](../../app/api/storage/) - Implementation details

---

## Summary

The local storage provider is a **filesystem-based storage solution** ideal for:

- ✅ Development and testing
- ✅ Single-server deployments
- ✅ On-premise installations
- ✅ Cost-sensitive projects (no cloud bills)

**Not suitable for:**

- ❌ Serverless deployments (Vercel, Lambda, etc.)
- ❌ Horizontally scaled applications (multiple servers)
- ❌ High-availability requirements (single point of failure)

**Key Features:**

- Full GCP adapter compatibility
- Secure signed URL implementation
- Path traversal protection
- MD5 hash validation
- Range request support
- Flexible cleanup strategies

**Before Using in Production:**

1. ✅ Ensure single-server deployment
2. ✅ Implement automated backups
3. ✅ Set up disk space monitoring
4. ✅ Configure cleanup strategy
5. ✅ Test disaster recovery procedures
