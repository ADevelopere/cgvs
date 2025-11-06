# Signed URL Cleanup Strategies

## Overview

Signed URLs have expiration timestamps to ensure security and prevent unauthorized access. However, expired tokens remain in the database until explicitly cleaned up. This document describes the available cleanup strategies and how to configure them.

---

## Table of Contents

- [Why Cleanup Matters](#why-cleanup-matters)
- [Available Strategies](#available-strategies)
- [Configuration](#configuration)
- [Implementation Details](#implementation-details)
- [Monitoring & Metrics](#monitoring--metrics)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Why Cleanup Matters

### Database Bloat

Expired signed URL records accumulate over time:

- **High-traffic apps:** Thousands of tokens generated daily
- **Database size:** Each token ~200 bytes + indexes
- **Query performance:** Large tables slow down lookups and claims

**Example:**

- 10,000 uploads/day × 200 bytes = ~2 MB/day
- 30 days = ~60 MB of expired tokens
- 1 year = ~730 MB (without cleanup)

### Index Performance

The `signed_url` table has indexes for efficient operations:

```sql
CREATE INDEX idx_signed_url_expires ON signed_url(expires_at);
CREATE INDEX idx_signed_url_used ON signed_url(is_used, expires_at);
```

Large tables degrade index performance:

- Slower token claims (upload delays)
- Increased memory usage
- Higher disk I/O

### Best Practice

**Regular cleanup prevents:**

- ✅ Database bloat
- ✅ Query performance degradation
- ✅ Index fragmentation
- ✅ Backup size inflation

---

## Available Strategies

### 1. Lazy Cleanup (Default)

**When it runs:** Before generating each new signed URL

**How it works:**

```typescript
async generateUploadSignedUrl(filePath: string, options: UploadOptions) {
  // Cleanup runs here, before creating new token
  if (strategy === 'lazy' || strategy === 'both') {
    await this.signedUrlRepository.deleteExpired();
  }

  // Generate new token
  const token = await this.signedUrlRepository.createSignedUrl({...});
  return token;
}
```

**Pros:**

- ✅ No external dependencies
- ✅ Guaranteed execution (cleanup before token creation)
- ✅ Simple configuration
- ✅ Works offline/air-gapped environments

**Cons:**

- ⚠️ Cleanup frequency tied to upload activity
- ⚠️ Low-traffic apps accumulate tokens
- ⚠️ Adds latency to upload URL generation (~10-50ms)

**Best for:**

- Development environments
- Low to medium traffic applications
- Single-server deployments
- Offline/isolated systems

### 2. Cron Cleanup

**When it runs:** On a fixed schedule (e.g., every hour)

**How it works:**

```typescript
// API Route: /api/cron/cleanup-signed-urls
export async function GET(request: Request) {
  // Authenticate request
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run cleanup
  const deleted = await signedUrlRepository.deleteExpired();
  return Response.json({ deleted, timestamp: new Date() });
}
```

**Pros:**

- ✅ Predictable cleanup schedule
- ✅ No performance impact on uploads
- ✅ Works regardless of traffic
- ✅ Efficient for high-volume apps

**Cons:**

- ⚠️ Requires external trigger (Vercel cron, service, etc.)
- ⚠️ Must secure endpoint with `CRON_SECRET`
- ⚠️ Won't run if external trigger fails

**Best for:**

- Production environments
- High-traffic applications
- Serverless deployments (Vercel cron)
- Predictable maintenance windows

### 3. Both (Recommended for Production)

**When it runs:** Lazy cleanup + scheduled cron

**How it works:**

- Combines both strategies for maximum reliability
- Lazy cleanup ensures regular maintenance
- Cron cleanup provides guaranteed scheduled cleanup

**Pros:**

- ✅ Maximum reliability (dual redundancy)
- ✅ Handles traffic spikes and lulls
- ✅ Predictable + opportunistic cleanup
- ✅ Best of both worlds

**Cons:**

- ⚠️ Requires cron configuration
- ⚠️ Small overhead on both paths

**Best for:**

- Production environments
- Mission-critical applications
- High-availability requirements
- Variable traffic patterns

### 4. Disabled

**When it runs:** Never (manual only)

**How it works:**

- No automatic cleanup
- Must trigger manually via `/api/storage/cleanup` endpoint
- Useful for testing or custom cleanup scripts

**Pros:**

- ✅ Full control over cleanup timing
- ✅ Useful for debugging
- ✅ Custom cleanup logic possible

**Cons:**

- ⚠️ Database will bloat without manual intervention
- ⚠️ Easy to forget
- ⚠️ Not recommended for production

**Best for:**

- Testing environments
- Development debugging
- Custom cleanup implementations

---

## Configuration

### Environment Variables

```bash
# Cleanup Strategy Selection
SIGNED_URL_CLEANUP_STRATEGY=both  # Options: lazy, cron, both, disabled

# Cron Schedule (if using cron or both)
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *  # Every hour (default)

# Cron Authentication Secret (required for cron or both)
CRON_SECRET=your-random-secret-key-here
```

### Strategy Selection Guide

| Scenario                         | Recommended Strategy | Reason                         |
| -------------------------------- | -------------------- | ------------------------------ |
| Development                      | `lazy`               | Simple, no dependencies        |
| Staging (serverless)             | `both`               | Match production setup         |
| Production (serverless)          | `both`               | Maximum reliability            |
| Production (dedicated server)    | `cron`               | Predictable, no upload latency |
| Low traffic (<100 uploads/day)   | `lazy`               | Sufficient cleanup frequency   |
| High traffic (>1000 uploads/day) | `cron` or `both`     | Consistent performance         |
| Testing/debugging                | `disabled`           | Manual control                 |

### Cron Schedule Examples

```bash
# Every hour (default)
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *

# Every 6 hours
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 */6 * * *

# Daily at 2 AM
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 2 * * *

# Every 30 minutes
SIGNED_URL_CLEANUP_CRON_SCHEDULE=*/30 * * * *

# Twice daily (6 AM and 6 PM)
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 6,18 * * *
```

**Cron Syntax:**

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6, Sunday = 0)
│ │ │ │ │
* * * * *
```

---

## Implementation Details

### Lazy Cleanup Implementation

**Location:** `server/storage/disk/local.ts`

```typescript
async generateUploadSignedUrl(
  filePath: string,
  options: UploadOptions
): Promise<string> {
  const strategy = process.env.SIGNED_URL_CLEANUP_STRATEGY || 'lazy';

  // Lazy cleanup
  if (strategy === 'lazy' || strategy === 'both') {
    try {
      const deleted = await this.signedUrlRepository.deleteExpired();
      logger.info(`Lazy cleanup removed ${deleted} expired signed URLs`);
    } catch (error) {
      logger.warn('Lazy cleanup failed', { error });
      // Continue with token generation
    }
  }

  // Generate token...
}
```

**Performance Impact:**

- Average: 10-50ms per cleanup
- Scales with number of expired tokens
- Non-blocking (doesn't affect upload on failure)

### Cron Cleanup Implementation

**API Route:** `app/api/cron/cleanup-signed-urls/route.ts`

```typescript
import { signedUrlRepository } from "@/server/db/repo";
import { logger } from "@/server/lib/logger";

export async function GET(request: Request) {
  const strategy = process.env.SIGNED_URL_CLEANUP_STRATEGY;

  // Only run if cron is enabled
  if (strategy !== "cron" && strategy !== "both") {
    return Response.json({ error: "Cron cleanup is disabled" }, { status: 403 });
  }

  // Verify authentication
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    logger.warn("Unauthorized cron cleanup attempt");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run cleanup
  try {
    const deleted = await signedUrlRepository.deleteExpired();
    logger.info("Cron cleanup completed", { deleted });

    return Response.json({
      success: true,
      deleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Cron cleanup failed", { error });
    return Response.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
```

### Database Cleanup Query

**Repository:** `server/db/repo/signedUrl.repository.ts`

```typescript
async deleteExpired(): Promise<number> {
  const result = await db
    .delete(signedUrlTable)
    .where(lt(signedUrlTable.expiresAt, new Date()))
    .returning();

  return result.length;
}
```

**SQL Generated:**

```sql
DELETE FROM signed_url
WHERE expires_at < NOW()
RETURNING *;
```

**Performance Characteristics:**

- Uses index `idx_signed_url_expires`
- O(n) where n = number of expired tokens
- Typically <100ms for <10,000 expired records
- Transaction-safe (ACID compliant)

---

## Monitoring & Metrics

### Logging

All cleanup operations are logged:

```typescript
// Lazy cleanup
logger.info("Lazy cleanup removed ${deleted} expired signed URLs", {
  deleted,
  strategy: "lazy",
});

// Cron cleanup
logger.info("Cron cleanup completed", {
  deleted,
  timestamp: new Date(),
  strategy: "cron",
});
```

### Database Queries

**Check expired token count:**

```sql
SELECT COUNT(*) as expired_count
FROM signed_url
WHERE expires_at < NOW();
```

**Check total token count:**

```sql
SELECT COUNT(*) as total_count
FROM signed_url;
```

**Check cleanup effectiveness:**

```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN expires_at < NOW() THEN 1 ELSE 0 END) as expired,
  SUM(CASE WHEN is_used = true THEN 1 ELSE 0 END) as used,
  SUM(CASE WHEN is_used = false AND expires_at > NOW() THEN 1 ELSE 0 END) as active
FROM signed_url;
```

### Monitoring Dashboard

**Recommended metrics:**

1. **Expired token count** (should be near 0 with effective cleanup)
2. **Total token count** (should remain stable or grow slowly)
3. **Cleanup execution frequency** (from logs)
4. **Cleanup duration** (from logs)
5. **Cleanup failure rate** (errors in logs)

**Alert Thresholds:**

```yaml
alerts:
  - name: expired_tokens_high
    condition: expired_count > 10000
    severity: warning

  - name: cleanup_failures
    condition: cleanup_error_rate > 5%
    severity: critical

  - name: database_bloat
    condition: total_count > 100000
    severity: warning
```

---

## Troubleshooting

### Issue: Expired tokens accumulating

**Symptoms:**

- `expired_count` query returns high numbers
- Database size growing steadily
- Slow token claim operations

**Diagnosis:**

```sql
-- Check expired token accumulation
SELECT
  DATE(expires_at) as expiry_date,
  COUNT(*) as count
FROM signed_url
WHERE expires_at < NOW()
GROUP BY DATE(expires_at)
ORDER BY expiry_date DESC
LIMIT 10;
```

**Solutions:**

1. **Verify cleanup is enabled:**

   ```bash
   echo $SIGNED_URL_CLEANUP_STRATEGY
   # Should be: lazy, cron, or both
   ```

2. **Check cleanup logs:**

   ```bash
   grep "cleanup" logs/combined.log | tail -20
   ```

3. **Manual cleanup:**

   ```bash
   curl -X POST http://localhost:3000/api/storage/cleanup
   ```

4. **Switch to more aggressive strategy:**
   ```bash
   # Change from lazy to both
   SIGNED_URL_CLEANUP_STRATEGY=both
   ```

### Issue: Cron cleanup not running

**Symptoms:**

- No cleanup logs from cron
- Expired tokens accumulating
- Manual cleanup works fine

**Diagnosis:**

1. **Check Vercel cron configuration:**

   ```bash
   vercel inspect <deployment-url>
   # Look for cron jobs
   ```

2. **Verify cron secret:**

   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     https://your-domain.com/api/cron/cleanup-signed-urls
   ```

3. **Check cron execution logs:**
   - Vercel: Dashboard → Deployments → Functions → Logs
   - External: Check cron service logs

**Solutions:**

1. **Fix Vercel configuration:**

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

2. **Update cron secret:**

   ```bash
   # Vercel
   vercel env add CRON_SECRET production

   # Or update .env
   CRON_SECRET=new-random-secret-key
   ```

3. **Test endpoint manually:**
   ```bash
   curl -H "Authorization: Bearer your-secret" \
     -X GET https://your-domain.com/api/cron/cleanup-signed-urls
   ```

### Issue: Cleanup taking too long

**Symptoms:**

- Upload URL generation slow (lazy cleanup)
- Cleanup timeout errors
- High database CPU during cleanup

**Diagnosis:**

```sql
-- Check expired token distribution
SELECT
  COUNT(*) as expired_count,
  MIN(expires_at) as oldest_expiry,
  MAX(expires_at) as newest_expiry
FROM signed_url
WHERE expires_at < NOW();
```

**Solutions:**

1. **Switch from lazy to cron:**

   ```bash
   # Remove cleanup from upload path
   SIGNED_URL_CLEANUP_STRATEGY=cron
   ```

2. **Increase cleanup frequency:**

   ```bash
   # Run every 30 minutes instead of hourly
   SIGNED_URL_CLEANUP_CRON_SCHEDULE=*/30 * * * *
   ```

3. **Add database index (if missing):**

   ```sql
   CREATE INDEX IF NOT EXISTS idx_signed_url_expires
   ON signed_url(expires_at);
   ```

4. **Batch cleanup (for very large backlogs):**
   ```sql
   -- Delete in batches of 10,000
   DELETE FROM signed_url
   WHERE id IN (
     SELECT id FROM signed_url
     WHERE expires_at < NOW()
     LIMIT 10000
   );
   ```

---

## Best Practices

### Development

✅ **DO:**

- Use `lazy` strategy for simplicity
- Monitor cleanup logs during testing
- Test with various expiration times

❌ **DON'T:**

- Use `disabled` unless debugging
- Ignore database bloat warnings
- Skip cleanup testing

### Staging

✅ **DO:**

- Use same strategy as production
- Test cron configuration
- Verify cleanup frequency
- Monitor metrics

❌ **DON'T:**

- Use different cleanup strategy than production
- Disable cleanup to "speed up" tests

### Production

✅ **DO:**

- Use `both` strategy for maximum reliability
- Set up monitoring and alerts
- Log all cleanup operations
- Regular database maintenance
- Test cron endpoint after deployment

❌ **DON'T:**

- Use `disabled` strategy
- Ignore cleanup failures
- Skip monitoring setup
- Use weak `CRON_SECRET`

### Security

✅ **DO:**

- Use strong, random `CRON_SECRET` (32+ characters)
- Rotate `CRON_SECRET` periodically
- Verify authentication in cron endpoint
- Log unauthorized access attempts

❌ **DON'T:**

- Use predictable secrets (e.g., "secret123")
- Expose cron endpoint without authentication
- Share `CRON_SECRET` in public repositories
- Reuse secrets across environments

### Performance

✅ **DO:**

- Use indexes on `expires_at` column
- Monitor cleanup duration
- Optimize cleanup frequency for your traffic
- Consider batch deletion for large backlogs

❌ **DON'T:**

- Run cleanup on every request (use lazy strategically)
- Delete millions of records at once
- Ignore slow cleanup queries
- Skip index maintenance

---

## Summary

**Quick Reference:**

| Strategy   | Best For                  | Pros                           | Cons                         |
| ---------- | ------------------------- | ------------------------------ | ---------------------------- |
| `lazy`     | Development, low traffic  | Simple, no dependencies        | Tied to upload activity      |
| `cron`     | Production, high traffic  | Predictable, no upload latency | Requires external trigger    |
| `both`     | Production, critical apps | Maximum reliability            | More complex setup           |
| `disabled` | Testing only              | Full control                   | Manual intervention required |

**Recommended Configuration:**

```bash
# Production
SIGNED_URL_CLEANUP_STRATEGY=both
SIGNED_URL_CLEANUP_CRON_SCHEDULE=0 * * * *
CRON_SECRET=<generate-random-32-char-string>

# Development
SIGNED_URL_CLEANUP_STRATEGY=lazy

# Testing
SIGNED_URL_CLEANUP_STRATEGY=disabled
```

**Key Takeaways:**

- Regular cleanup prevents database bloat and performance degradation
- `both` strategy provides maximum reliability for production
- Monitor cleanup metrics and set up alerts
- Secure cron endpoints with strong authentication
- Test cleanup configuration in staging before production deployment
