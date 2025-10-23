# Serverless Environment Restrictions

## Overview

The local storage adapter is **incompatible with serverless computing platforms**. It will refuse to start and throw a fatal error when deployed to serverless environments. This document explains why, how the detection works, and what alternatives are available.

---

## Table of Contents

- [What is Serverless?](#what-is-serverless)
- [Why Local Storage Cannot Work in Serverless](#why-local-storage-cannot-work-in-serverless)
- [Affected Platforms](#affected-platforms)
- [Detection Mechanism](#detection-mechanism)
- [Error Messages](#error-messages)
- [Alternatives](#alternatives)
- [Migration Guide](#migration-guide)
- [FAQ](#faq)

---

## What is Serverless?

**Serverless computing** is a cloud execution model where:

- Functions run in stateless containers
- Containers are created on-demand for each request
- Containers are destroyed after request completion
- No persistent filesystem between invocations
- Automatic scaling (0 to thousands of instances)

**Examples:**

- AWS Lambda
- Google Cloud Functions
- Azure Functions
- Vercel (Next.js deployments)
- Netlify Functions
- Cloudflare Workers

---

## Why Local Storage Cannot Work in Serverless

### 1. Ephemeral Filesystem

**Problem:** Serverless containers have temporary filesystems that are destroyed after each invocation.

**Scenario:**

```
Request 1 → Container A created
  ↓
User uploads file.png
  ↓
file.png saved to /tmp/files/file.png
  ↓
Request completes → Container A destroyed
  ↓
file.png is DELETED

Request 2 → Container B created (new container)
  ↓
User tries to download file.png
  ↓
file.png not found (it was on Container A's disk)
  ↓
404 Error
```

**Result:** Files are lost immediately after upload.

### 2. No Shared Filesystem

**Problem:** Multiple serverless instances cannot access the same disk.

**Scenario with concurrent requests:**

```
Request 1 (upload) → Container A
  ↓
Saves file.png to Container A's disk

Request 2 (download) → Container B (different container)
  ↓
Tries to read file.png
  ↓
File not found (it's on Container A's disk, not Container B's)
  ↓
404 Error
```

**Result:** File accessible only from the container that uploaded it.

### 3. Cold Starts

**Problem:** Containers are destroyed after idle periods.

**Timeline:**

```
10:00 AM - User uploads file.png
10:01 AM - Container destroyed (idle timeout)
10:05 AM - User tries to download file.png
          - New container created (cold start)
          - file.png not found (was on old container)
          - 404 Error
```

**Result:** Files disappear during idle periods.

### 4. Auto-Scaling

**Problem:** Load balancer distributes requests across multiple containers.

**High-traffic scenario:**

```
Upload requests: 100/second
  ↓
Serverless platform creates 20 containers
  ↓
Files spread across 20 different disks
  ↓
Download request hits random container
  ↓
90% chance of 404 (file on different container)
```

**Result:** Unpredictable file availability.

### 5. No Persistent Storage

**Problem:** `/tmp` directory (the only writable location) is cleared frequently.

**Limits:**

- **AWS Lambda:** `/tmp` limited to 512 MB, cleared between invocations
- **Vercel:** No persistent filesystem, `/tmp` cleared after function execution
- **Google Cloud Functions:** `/tmp` limited to 2 GB, cleared unpredictably
- **Netlify:** No persistent filesystem at all

**Result:** Even if files survive one request, they'll be deleted soon after.

---

## Affected Platforms

### ❌ Incompatible Platforms

| Platform                   | Environment Variable           | Detection |
| -------------------------- | ------------------------------ | --------- |
| **Vercel**                 | `VERCEL=1`                     | Automatic |
| **AWS Lambda**             | `AWS_LAMBDA_FUNCTION_NAME`     | Automatic |
| **Google Cloud Functions** | `FUNCTION_NAME` or `K_SERVICE` | Automatic |
| **Azure Functions**        | `AZURE_FUNCTIONS_ENVIRONMENT`  | Automatic |
| **Netlify**                | `NETLIFY=true`                 | Automatic |
| **Cloudflare Workers**     | `CF_PAGES=1`                   | Automatic |

### ✅ Compatible Platforms

| Platform                                 | Type                    | Persistent Storage               |
| ---------------------------------------- | ----------------------- | -------------------------------- |
| **Dedicated Server**                     | Traditional hosting     | ✅ Yes                           |
| **VPS** (DigitalOcean, Linode)           | Virtual private server  | ✅ Yes                           |
| **Docker Container** (persistent volume) | Containerized app       | ✅ Yes                           |
| **Kubernetes** (with PersistentVolume)   | Orchestrated containers | ✅ Yes                           |
| **Heroku** (with ephemeral warning)      | PaaS                    | ⚠️ Ephemeral (use cloud storage) |
| **Railway** (with persistent volume)     | PaaS                    | ✅ Yes                           |

---

## Detection Mechanism

### Kill Switch Implementation

**Location:** `server/storage/disk/local.ts`

```typescript
export async function createLocalAdapter(): Promise<StorageService> {
  // SERVERLESS KILL SWITCH
  const isServerless =
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.FUNCTION_NAME ||
    process.env.K_SERVICE ||
    process.env.NETLIFY ||
    process.env.AZURE_FUNCTIONS_ENVIRONMENT ||
    process.env.CF_PAGES;

  if (isServerless) {
    const platform = process.env.VERCEL
      ? "Vercel"
      : process.env.AWS_LAMBDA_FUNCTION_NAME
        ? "AWS Lambda"
        : process.env.FUNCTION_NAME || process.env.K_SERVICE
          ? "Google Cloud Functions"
          : process.env.NETLIFY
            ? "Netlify"
            : process.env.AZURE_FUNCTIONS_ENVIRONMENT
              ? "Azure Functions"
              : process.env.CF_PAGES
                ? "Cloudflare Pages"
                : "Unknown serverless platform";

    throw new Error(
      `Local storage adapter cannot run in serverless environments (detected: ${platform}). ` +
        "Serverless platforms have ephemeral filesystems where uploaded files are lost immediately. " +
        "Please use a cloud storage provider (GCP, AWS S3, Azure Blob Storage) instead. " +
        "See documentation: docs/storage/local-storage-provider.md#serverless-restrictions"
    );
  }

  return new LocalAdapter();
}
```

### Detection Timing

The kill switch executes:

1. **During application startup** (when storage service is initialized)
2. **Before any file operations** (fail-fast approach)
3. **Synchronously** (blocks further execution)

**Result:** Application refuses to start if serverless is detected.

---

## Error Messages

### Fatal Startup Error

```
Error: Local storage adapter cannot run in serverless environments (detected: Vercel).
Serverless platforms have ephemeral filesystems where uploaded files are lost immediately.
Please use a cloud storage provider (GCP, AWS S3, Azure Blob Storage) instead.
See documentation: docs/storage/local-storage-provider.md#serverless-restrictions

    at createLocalAdapter (server/storage/disk/local.ts:45:11)
    at createService (server/storage/storage.service.ts:23:16)
    ...
```

### What This Means

- ❌ Application will not start
- ❌ No HTTP server will be created
- ❌ No requests will be processed
- ✅ Data loss is prevented
- ✅ Clear error message guides to solution

### Development vs Production

**Development (localhost):**

```bash
STORAGE_PROVIDER=local  # ✅ Works fine
VERCEL=1                 # Not set
```

**Production (Vercel):**

```bash
STORAGE_PROVIDER=local  # ❌ Fatal error
VERCEL=1                 # Automatically set by platform
```

---

## Alternatives

### Option 1: Google Cloud Storage (Recommended)

**Pros:**

- ✅ Designed for serverless
- ✅ Unlimited storage
- ✅ Global CDN
- ✅ High availability
- ✅ Automatic scaling
- ✅ Built-in signed URLs

**Setup:**

```bash
# Environment variables
STORAGE_PROVIDER=gcp
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=your-bucket-name
GCP_CREDENTIALS_JSON='{"type":"service_account",...}'
```

**See:** [GCP Setup Guide](../../README.md#️-google-cloud-platform-gcp-setup)

### Option 2: AWS S3

**Pros:**

- ✅ Serverless-native
- ✅ Mature ecosystem
- ✅ Cost-effective
- ✅ Global availability

**Implementation Required:**

- Create `S3Adapter` class implementing `StorageService` interface
- Configure AWS credentials
- Set up bucket policies

### Option 3: Azure Blob Storage

**Pros:**

- ✅ Microsoft cloud integration
- ✅ Enterprise features
- ✅ Global distribution

**Implementation Required:**

- Create `AzureBlobAdapter` class implementing `StorageService` interface
- Configure Azure credentials
- Set up storage account

### Option 4: Cloudflare R2

**Pros:**

- ✅ S3-compatible API
- ✅ No egress fees
- ✅ Edge caching

**Implementation Required:**

- Create `R2Adapter` class (similar to S3)
- Configure R2 credentials

### Option 5: Dedicated Server

**Pros:**

- ✅ Use local storage adapter as-is
- ✅ No cloud storage costs
- ✅ Full control

**Cons:**

- ⚠️ Manual scaling
- ⚠️ Higher operational overhead
- ⚠️ Single point of failure

**Hosting Options:**

- DigitalOcean Droplet
- Linode VPS
- Hetzner Cloud
- Self-hosted server

---

## Migration Guide

### From Local Storage to GCP (for serverless deployment)

#### Step 1: Set up GCP

Follow the [GCP Setup Guide](../../README.md#️-google-cloud-platform-gcp-setup) to:

1. Enable required APIs
2. Create service account
3. Assign IAM roles
4. Create storage bucket
5. Generate credentials JSON

#### Step 2: Upload existing files

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Upload files (preserves directory structure)
gsutil -m cp -r ./cgvs/data/files/* gs://your-bucket/

# Verify upload
gsutil ls -r gs://your-bucket/
```

#### Step 3: Update environment variables

**Before (local storage):**

```bash
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./cgvs/data/files/
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**After (GCP storage):**

```bash
STORAGE_PROVIDER=gcp
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=your-bucket-name
GCP_CREDENTIALS_JSON='{"type":"service_account","project_id":"...",...}'
```

#### Step 4: Deploy to serverless platform

```bash
# Vercel
vercel env add GCP_CREDENTIALS_JSON production
vercel env add GCP_BUCKET_NAME production
vercel env add GCP_PROJECT_ID production
vercel --prod

# Netlify
netlify env:set GCP_CREDENTIALS_JSON '{"type":"service_account",...}'
netlify env:set GCP_BUCKET_NAME your-bucket-name
netlify deploy --prod
```

#### Step 5: Verify deployment

```bash
# Test file upload
curl -X POST https://your-domain.com/api/storage/signed-url \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"path":"test/file.txt","contentType":"text/plain","fileSize":100}'

# Test file download
curl https://your-domain.com/api/storage/files/public/test-file.png
```

#### Step 6: Clean up local files (optional)

```bash
# Backup before deletion
tar -czf cgvs-local-storage-backup.tar.gz ./cgvs/data/files/

# Remove local files
rm -rf ./cgvs/data/files/

# Update .gitignore (remove local storage path)
```

---

## FAQ

### Q: Can I use Docker with local storage on Vercel?

**A:** No. Even if you deploy a Docker container to Vercel, it runs in a serverless environment with ephemeral storage. Files will still be lost.

### Q: What about Vercel's persistent storage?

**A:** Vercel offers:

- **Vercel Blob Storage** - Proprietary blob storage (not supported by this adapter yet)
- **KV (Redis)** - Not suitable for file storage
- **Postgres** - Not suitable for binary files

For file storage on Vercel, use GCP, S3, or implement a Vercel Blob adapter.

### Q: Can I mount a network drive in serverless?

**A:** No. Serverless platforms don't allow mounting external filesystems (NFS, SMB, etc.). You must use cloud storage APIs (S3, GCP, Azure).

### Q: What if I deploy to a containerized serverless platform?

**A:** If the platform uses ephemeral containers (AWS Fargate with ephemeral storage, Cloud Run without volumes), local storage won't work. Use cloud storage instead.

### Q: Can I disable the kill switch?

**A:** Technically yes (remove the check), but **strongly not recommended**. Your application will appear to work but files will be lost randomly, leading to data loss and user complaints.

### Q: What about Heroku?

**A:** Heroku has an ephemeral filesystem. Files persist within a dyno's lifetime but are lost during:

- Dyno restarts (at least once every 24 hours)
- Deployments
- Scaling events

**Recommendation:** Use cloud storage for Heroku deployments.

### Q: Can I use local storage for testing in serverless CI/CD?

**A:** Yes, with modifications:

1. Set up a separate test database
2. Mock the serverless environment variables (don't set `VERCEL`, etc.)
3. Use in-memory storage or temporary directories
4. Clean up after tests

**Better approach:** Use cloud storage in CI/CD (test with real dependencies).

### Q: Is there a hybrid approach?

**A:** Yes, but complex:

1. Use local storage for development
2. Use cloud storage for staging/production
3. Maintain identical `StorageService` interface
4. Switch via `STORAGE_PROVIDER` env var

This is the recommended approach (already implemented in this codebase).

### Q: What about edge computing platforms?

**A:** Edge platforms (Cloudflare Workers, Deno Deploy, Fastly Compute) have even more restrictions:

- No filesystem access at all (not even `/tmp`)
- Must use cloud storage or edge storage (Cloudflare R2, Deno KV)
- Local storage adapter will fail detection and refuse to start

---

## Summary

### Key Points

- ❌ Local storage adapter is **incompatible** with serverless platforms
- ✅ Serverless detection is **automatic** (kill switch)
- ✅ Application **fails to start** (prevents data loss)
- ✅ Error message provides **clear guidance**
- ✅ Use **cloud storage** (GCP, S3, Azure) for serverless deployments
- ✅ Use **dedicated servers** if local storage is required

### Decision Matrix

| Deployment Type               | Local Storage   | Cloud Storage  |
| ----------------------------- | --------------- | -------------- |
| Development (localhost)       | ✅ Recommended  | ✅ Optional    |
| Staging (dedicated server)    | ✅ Acceptable   | ✅ Recommended |
| Staging (serverless)          | ❌ Not possible | ✅ Required    |
| Production (dedicated server) | ⚠️ With backups | ✅ Recommended |
| Production (serverless)       | ❌ Not possible | ✅ Required    |
| Production (edge)             | ❌ Not possible | ✅ Required    |

### Recommended Stack

**Development:**

```bash
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./cgvs/data/files/
```

**Production (Vercel/serverless):**

```bash
STORAGE_PROVIDER=gcp
GCP_CREDENTIALS_JSON='...'
GCP_BUCKET_NAME=your-bucket
```

**Production (dedicated server):**

```bash
# Either works, cloud storage recommended
STORAGE_PROVIDER=gcp  # Or: local with backups
```

### Further Reading

- [Local Storage Provider Overview](../local-storage-provider.md)
- [GCP Setup Guide](../../README.md#️-google-cloud-platform-gcp-setup)
- [Storage Service Interface](../../../server/storage/storage.service.ts)
- [Cleanup Strategies](./cleanup-strategies.md)
- [Backup & Migration Guide](./backup-migration.md)
