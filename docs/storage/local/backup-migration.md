# Backup & Migration Strategies

## Overview

This guide covers comprehensive backup strategies, disaster recovery procedures, and migration paths for the local storage provider. Proper backup and migration planning is critical for data safety and operational flexibility.

---

## Table of Contents

- [Backup Strategies](#backup-strategies)
- [Automated Backup Solutions](#automated-backup-solutions)
- [Disaster Recovery](#disaster-recovery)
- [Migration Paths](#migration-paths)
- [Data Integrity](#data-integrity)
- [Testing & Verification](#testing--verification)
- [Best Practices](#best-practices)

---

## Backup Strategies

### Why Backups Are Critical

**Risk Factors:**

- 💥 Hardware failure (disk crashes)
- 🔥 Server failures (power, network, OS)
- 🐛 Software bugs (accidental deletions)
- 👤 Human error (rm -rf accidents)
- 🔒 Ransomware attacks
- 🌊 Physical disasters (fire, flood)

**Without backups:** Complete data loss, no recovery possible.

### Backup Types

#### 1. Full Backup

**What:** Complete copy of all files and database.

**When:** Weekly or monthly.

**Pros:**

- ✅ Complete snapshot
- ✅ Single restore point
- ✅ Simple to restore

**Cons:**

- ⚠️ Large storage requirements
- ⚠️ Time-consuming
- ⚠️ High bandwidth usage

**Script:**

```bash
#!/bin/bash
# full-backup.sh

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backup/cgvs-full-$BACKUP_DATE"
STORAGE_PATH="./cgvs/data/files"
DB_NAME="cgvs"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting full backup: $BACKUP_DATE"

# Backup files
echo "Backing up files..."
rsync -avz --delete \
  "$STORAGE_PATH/" \
  "$BACKUP_DIR/files/" \
  --log-file="$BACKUP_DIR/rsync.log"

# Backup database
echo "Backing up database..."
pg_dump -h localhost -U postgres "$DB_NAME" \
  > "$BACKUP_DIR/database.sql"

# Backup environment configuration
echo "Backing up configuration..."
cp .env "$BACKUP_DIR/env-backup.txt"

# Create manifest
cat > "$BACKUP_DIR/manifest.json" <<EOF
{
  "backupType": "full",
  "timestamp": "$(date -Iseconds)",
  "fileCount": $(find "$STORAGE_PATH" -type f | wc -l),
  "totalSize": $(du -sb "$STORAGE_PATH" | cut -f1),
  "databaseSize": $(stat -f%z "$BACKUP_DIR/database.sql" 2>/dev/null || stat -c%s "$BACKUP_DIR/database.sql")
}
EOF

# Compress backup
echo "Compressing backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C /backup "cgvs-full-$BACKUP_DATE"

# Clean up uncompressed backup
rm -rf "$BACKUP_DIR"

# Calculate checksum
sha256sum "$BACKUP_DIR.tar.gz" > "$BACKUP_DIR.tar.gz.sha256"

echo "Backup completed: $BACKUP_DIR.tar.gz"
echo "Size: $(du -h "$BACKUP_DIR.tar.gz" | cut -f1)"
```

#### 2. Incremental Backup

**What:** Only files changed since last backup.

**When:** Daily.

**Pros:**

- ✅ Fast execution
- ✅ Small storage requirements
- ✅ Minimal bandwidth

**Cons:**

- ⚠️ Complex restore (need all increments)
- ⚠️ Chain dependency (one corrupt backup breaks chain)

**Script:**

```bash
#!/bin/bash
# incremental-backup.sh

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backup/cgvs-incremental-$BACKUP_DATE"
STORAGE_PATH="./cgvs/data/files"
LAST_BACKUP_FILE="/backup/.last-backup-timestamp"

mkdir -p "$BACKUP_DIR"

echo "Starting incremental backup: $BACKUP_DATE"

# Find last backup timestamp
if [ -f "$LAST_BACKUP_FILE" ]; then
  LAST_BACKUP=$(cat "$LAST_BACKUP_FILE")
  echo "Last backup: $LAST_BACKUP"
else
  echo "No previous backup found, performing full backup"
  LAST_BACKUP="1970-01-01 00:00:00"
fi

# Backup only changed files
find "$STORAGE_PATH" -type f -newermt "$LAST_BACKUP" \
  -exec rsync -avR {} "$BACKUP_DIR/" \;

# Backup database (always full)
pg_dump -h localhost -U postgres cgvs > "$BACKUP_DIR/database.sql"

# Update timestamp
date -Iseconds > "$LAST_BACKUP_FILE"

# Compress
tar -czf "$BACKUP_DIR.tar.gz" -C /backup "cgvs-incremental-$BACKUP_DATE"
rm -rf "$BACKUP_DIR"

echo "Incremental backup completed: $BACKUP_DIR.tar.gz"
```

#### 3. Differential Backup

**What:** All changes since last _full_ backup.

**When:** Daily (with weekly full backups).

**Pros:**

- ✅ Easier restore than incremental (only need full + latest differential)
- ✅ Smaller than full backup

**Cons:**

- ⚠️ Grows larger each day until next full backup

**Script:**

```bash
#!/bin/bash
# differential-backup.sh

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backup/cgvs-diff-$BACKUP_DATE"
STORAGE_PATH="./cgvs/data/files"
FULL_BACKUP_TIMESTAMP="/backup/.last-full-backup"

mkdir -p "$BACKUP_DIR"

# Check for full backup reference
if [ ! -f "$FULL_BACKUP_TIMESTAMP" ]; then
  echo "ERROR: No full backup found. Run full-backup.sh first."
  exit 1
fi

REFERENCE_DATE=$(cat "$FULL_BACKUP_TIMESTAMP")
echo "Creating differential backup since: $REFERENCE_DATE"

# Backup changed files
rsync -avz \
  --compare-dest="/backup/cgvs-full-reference/" \
  "$STORAGE_PATH/" \
  "$BACKUP_DIR/files/"

# Backup database
pg_dump -h localhost -U postgres cgvs > "$BACKUP_DIR/database.sql"

# Compress
tar -czf "$BACKUP_DIR.tar.gz" -C /backup "cgvs-diff-$BACKUP_DATE"
rm -rf "$BACKUP_DIR"

echo "Differential backup completed: $BACKUP_DIR.tar.gz"
```

### Database-Consistent Backups

**Critical:** Files and database must be synchronized.

**Problem:**

```
10:00:00 - User uploads file.png
10:00:01 - File written to disk
10:00:02 - Database record created
10:00:01.5 - BACKUP STARTS HERE (files backed up, but not DB record)
  ↓
Backup has file.png but no database metadata
  ↓
Restore = orphaned file
```

**Solution: Coordinated Backup**

```bash
#!/bin/bash
# coordinated-backup.sh

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backup/cgvs-coordinated-$BACKUP_DATE"
STORAGE_PATH="./cgvs/data/files"
DB_NAME="cgvs"

# Step 1: Start database transaction (if using pg_dump with --serializable)
echo "Starting coordinated backup..."

# Step 2: Create backup directory
mkdir -p "$BACKUP_DIR"

# Step 3: Backup database FIRST (with transaction snapshot)
echo "Backing up database (with snapshot)..."
pg_dump -h localhost -U postgres \
  --serializable-deferrable \
  "$DB_NAME" > "$BACKUP_DIR/database.sql"

# Step 4: Get the database transaction timestamp
DB_TIMESTAMP=$(psql -h localhost -U postgres -d "$DB_NAME" -t -c "SELECT NOW();")
echo "Database snapshot timestamp: $DB_TIMESTAMP"

# Step 5: Backup files (now guaranteed to be consistent with or after DB snapshot)
echo "Backing up files..."
rsync -avz "$STORAGE_PATH/" "$BACKUP_DIR/files/"

# Step 6: Create manifest
cat > "$BACKUP_DIR/manifest.json" <<EOF
{
  "backupType": "coordinated",
  "timestamp": "$BACKUP_DATE",
  "databaseSnapshot": "$DB_TIMESTAMP",
  "consistent": true
}
EOF

# Compress
tar -czf "$BACKUP_DIR.tar.gz" -C /backup "cgvs-coordinated-$BACKUP_DATE"
rm -rf "$BACKUP_DIR"

echo "Coordinated backup completed: $BACKUP_DIR.tar.gz"
```

---

## Automated Backup Solutions

### Cron-Based Automation

**Crontab Configuration:**

```bash
# Edit crontab
crontab -e

# Add backup schedules:

# Full backup: Every Sunday at 2 AM
0 2 * * 0 /path/to/full-backup.sh >> /var/log/backup-full.log 2>&1

# Incremental backup: Daily at 2 AM (except Sunday)
0 2 * * 1-6 /path/to/incremental-backup.sh >> /var/log/backup-incremental.log 2>&1

# Database-only backup: Every 6 hours
0 */6 * * * pg_dump cgvs > /backup/db-$(date +\%H\%M).sql

# Cleanup old backups: Keep only last 30 days
0 3 * * * find /backup -name "cgvs-*.tar.gz" -mtime +30 -delete
```

### Systemd Timer (Alternative to Cron)

**Service File:** `/etc/systemd/system/cgvs-backup.service`

```ini
[Unit]
Description=CGVS Full Backup
After=network.target postgresql.service

[Service]
Type=oneshot
User=cgvs
Group=cgvs
ExecStart=/opt/cgvs/scripts/full-backup.sh
StandardOutput=journal
StandardError=journal
```

**Timer File:** `/etc/systemd/system/cgvs-backup.timer`

```ini
[Unit]
Description=CGVS Backup Timer
Requires=cgvs-backup.service

[Timer]
# Run every Sunday at 2 AM
OnCalendar=Sun *-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

**Enable Timer:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable cgvs-backup.timer
sudo systemctl start cgvs-backup.timer

# Check status
sudo systemctl status cgvs-backup.timer
sudo systemctl list-timers
```

### Off-Site Backup

**Critical:** Store backups in a different physical location.

#### Option 1: Cloud Storage (AWS S3)

```bash
#!/bin/bash
# offsite-backup-s3.sh

BACKUP_FILE="/backup/cgvs-full-$(date +%Y%m%d).tar.gz"
S3_BUCKET="s3://your-backup-bucket/cgvs/"

# Upload to S3
aws s3 cp "$BACKUP_FILE" "$S3_BUCKET" \
  --storage-class GLACIER \
  --server-side-encryption AES256

# Verify upload
aws s3 ls "$S3_BUCKET"

echo "Backup uploaded to S3: $BACKUP_FILE"
```

#### Option 2: Remote Server (rsync over SSH)

```bash
#!/bin/bash
# offsite-backup-rsync.sh

BACKUP_FILE="/backup/cgvs-full-$(date +%Y%m%d).tar.gz"
REMOTE_HOST="backup-server.example.com"
REMOTE_USER="backup"
REMOTE_PATH="/backups/cgvs/"

# Upload via rsync over SSH
rsync -avz -e "ssh -i ~/.ssh/backup_key" \
  "$BACKUP_FILE" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

echo "Backup synced to remote server"
```

#### Option 3: GCP Cloud Storage

```bash
#!/bin/bash
# offsite-backup-gcp.sh

BACKUP_FILE="/backup/cgvs-full-$(date +%Y%m%d).tar.gz"
GCS_BUCKET="gs://your-backup-bucket/cgvs/"

# Upload to GCS
gsutil cp "$BACKUP_FILE" "$GCS_BUCKET"

# Set lifecycle policy (delete after 90 days)
gsutil lifecycle set lifecycle.json "$GCS_BUCKET"

echo "Backup uploaded to GCS: $BACKUP_FILE"
```

**Lifecycle Policy (`lifecycle.json`):**

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": { "type": "Delete" },
        "condition": { "age": 90 }
      }
    ]
  }
}
```

### Backup Verification

**Always verify backups!**

```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "Verifying backup: $BACKUP_FILE"

# Verify checksum
if [ -f "$BACKUP_FILE.sha256" ]; then
  sha256sum -c "$BACKUP_FILE.sha256"
  if [ $? -ne 0 ]; then
    echo "ERROR: Checksum verification failed!"
    exit 1
  fi
  echo "✓ Checksum verified"
fi

# Test extraction
TEST_DIR="/tmp/backup-test-$$"
mkdir -p "$TEST_DIR"

tar -tzf "$BACKUP_FILE" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: Backup archive is corrupted!"
  rm -rf "$TEST_DIR"
  exit 1
fi
echo "✓ Archive integrity verified"

# Extract a sample file
tar -xzf "$BACKUP_FILE" -C "$TEST_DIR" --strip-components=1 2>/dev/null
if [ $? -eq 0 ] && [ -d "$TEST_DIR" ]; then
  echo "✓ Extraction successful"
  echo "  Files: $(find "$TEST_DIR" -type f | wc -l)"
  echo "  Size: $(du -sh "$TEST_DIR" | cut -f1)"
else
  echo "ERROR: Extraction failed!"
  rm -rf "$TEST_DIR"
  exit 1
fi

# Cleanup
rm -rf "$TEST_DIR"

echo "✓ Backup verification complete: $BACKUP_FILE"
```

---

## Disaster Recovery

### Recovery Scenarios

#### Scenario 1: Single File Corruption

**Restore single file from backup:**

```bash
# Extract specific file from backup
tar -xzf /backup/cgvs-full-20240115.tar.gz \
  -C /tmp \
  --strip-components=3 \
  "cgvs-full-20240115/files/public/images/logo.png"

# Copy to storage
cp /tmp/logo.png ./storage/public/images/

# Verify file
ls -lh ./storage/public/images/logo.png
```

#### Scenario 2: Complete Data Loss

**Full system restore:**

```bash
#!/bin/bash
# disaster-recovery.sh

BACKUP_FILE="/backup/cgvs-full-20240115.tar.gz"
RESTORE_DIR="/tmp/cgvs-restore"

# Stop application
echo "Stopping application..."
systemctl stop cgvs

# Extract backup
echo "Extracting backup..."
mkdir -p "$RESTORE_DIR"
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Restore files
echo "Restoring files..."
rm -rf ./storage/*
cp -r "$RESTORE_DIR"/cgvs-full-*/files/* ./storage/

# Restore database
echo "Restoring database..."
dropdb cgvs
createdb cgvs
psql cgvs < "$RESTORE_DIR"/cgvs-full-*/database.sql

# Verify restoration
echo "Verifying restoration..."
FILE_COUNT=$(find ./cgvs/data/files -type f | wc -l)
DB_COUNT=$(psql -d cgvs -t -c "SELECT COUNT(*) FROM storage_files;")

echo "Files restored: $FILE_COUNT"
echo "Database records: $DB_COUNT"

# Restart application
echo "Restarting application..."
systemctl start cgvs

# Cleanup
rm -rf "$RESTORE_DIR"

echo "Disaster recovery complete!"
```

#### Scenario 3: Database Corruption (Files Intact)

**Restore database only:**

```bash
# Extract database from backup
tar -xzf /backup/cgvs-full-20240115.tar.gz \
  -C /tmp \
  cgvs-full-20240115/database.sql

# Restore database
dropdb cgvs
createdb cgvs
psql cgvs < /tmp/cgvs-full-20240115/database.sql

# Cleanup
rm -rf /tmp/cgvs-full-20240115
```

### Recovery Time Objective (RTO)

**Target:** Maximum acceptable downtime.

| Backup Type   | Extraction Time | Restore Time | Total RTO       |
| ------------- | --------------- | ------------ | --------------- |
| Full (1 GB)   | ~2 minutes      | ~5 minutes   | **~7 minutes**  |
| Full (10 GB)  | ~10 minutes     | ~20 minutes  | **~30 minutes** |
| Full (100 GB) | ~1 hour         | ~2 hours     | **~3 hours**    |

**Reduce RTO:**

- Use faster compression (gzip → lz4)
- Store backups on SSD
- Maintain hot standby server
- Use incremental restores

### Recovery Point Objective (RPO)

**Target:** Maximum acceptable data loss.

| Backup Frequency      | RPO       | Risk       |
| --------------------- | --------- | ---------- |
| Real-time replication | 0 seconds | ✅ Minimal |
| Hourly backups        | 1 hour    | ✅ Low     |
| Daily backups         | 24 hours  | ⚠️ Medium  |
| Weekly backups        | 7 days    | ❌ High    |

**Recommendation:** Daily backups + hourly database snapshots.

---

## Migration Paths

### Local to GCP

**Use Case:** Moving from dedicated server to serverless/cloud deployment.

#### Step 1: Prepare GCP Bucket

```bash
# Create bucket
gsutil mb gs://your-production-bucket

# Set permissions
gsutil iam ch allUsers:objectViewer gs://your-production-bucket/public/

# Enable versioning (optional, for safety)
gsutil versioning set on gs://your-production-bucket
```

#### Step 2: Upload Files

```bash
# Upload with metadata preservation
gsutil -m cp -r ./storage/* gs://your-production-bucket/ \
  -h "Cache-Control:public, max-age=31536000"

# Verify upload
gsutil du -sh gs://your-production-bucket
```

#### Step 3: Update Database (if paths changed)

```sql
-- Only needed if bucket path differs from local path
UPDATE storage_files
SET path = REPLACE(path, 'local-prefix/', 'gcp-prefix/')
WHERE path LIKE 'local-prefix/%';
```

#### Step 4: Switch Storage Provider

```bash
# Update .env
STORAGE_PROVIDER=gcp
GCP_BUCKET_NAME=your-production-bucket
GCP_PROJECT_ID=your-project-id
GCP_CREDENTIALS_JSON='...'

# Deploy application
git add .env
git commit -m "Switch to GCP storage"
vercel --prod
```

#### Step 5: Verify Migration

```bash
# Test file access
curl https://your-domain.com/api/storage/files/public/test.png

# Compare file counts
LOCAL_COUNT=$(find ./cgvs/data/files -type f | wc -l)
GCP_COUNT=$(gsutil ls -r gs://your-production-bucket/** | grep -v "/$" | wc -l)

echo "Local files: $LOCAL_COUNT"
echo "GCP files: $GCP_COUNT"
```

### GCP to Local

**Use Case:** Moving from cloud to dedicated server, or cost reduction.

#### Step 1: Download Files

```bash
# Download all files
gsutil -m cp -r gs://your-bucket/* ./storage/

# Verify download
du -sh ./storage/
```

#### Step 2: Switch Storage Provider

```bash
# Update .env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./storage/
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

#### Step 3: Update Application

```bash
# Restart application
systemctl restart cgvs

# Verify file access
curl http://localhost:3000/api/storage/files/public/test.png
```

### Local to S3 (Future Implementation)

**Preparation:**

```bash
# Upload files to S3
aws s3 sync ./storage/ s3://your-bucket/ \
  --storage-class INTELLIGENT_TIERING

# Verify
aws s3 ls --recursive s3://your-bucket/ --summarize
```

**Note:** Requires implementing `S3Adapter` class.

---

## Data Integrity

### Checksum Verification

**Generate checksums for all files:**

```bash
#!/bin/bash
# generate-checksums.sh

STORAGE_PATH="./cgvs/data/files"
CHECKSUM_FILE="./checksums.sha256"

echo "Generating checksums..."
find "$STORAGE_PATH" -type f -exec sha256sum {} \; > "$CHECKSUM_FILE"

echo "Checksum file created: $CHECKSUM_FILE"
echo "Total files: $(wc -l < "$CHECKSUM_FILE")"
```

**Verify checksums:**

```bash
#!/bin/bash
# verify-checksums.sh

CHECKSUM_FILE="./checksums.sha256"

if [ ! -f "$CHECKSUM_FILE" ]; then
  echo "ERROR: Checksum file not found"
  exit 1
fi

echo "Verifying file integrity..."
sha256sum -c "$CHECKSUM_FILE" --quiet

if [ $? -eq 0 ]; then
  echo "✓ All files verified successfully"
else
  echo "✗ Some files failed verification!"
  sha256sum -c "$CHECKSUM_FILE" | grep FAILED
fi
```

### Database-File Consistency Check

**Verify all database records have corresponding files:**

```bash
#!/bin/bash
# consistency-check.sh

STORAGE_PATH="./cgvs/data/files"

echo "Checking database-file consistency..."

# Get all file paths from database
psql -d cgvs -t -c "SELECT path FROM storage_files;" | while read -r path; do
  if [ ! -f "$STORAGE_PATH/$path" ]; then
    echo "MISSING FILE: $path (in DB, not on disk)"
  fi
done

# Get all files from disk
find "$STORAGE_PATH" -type f | while read -r file; do
  REL_PATH="${file#$STORAGE_PATH/}"
  EXISTS=$(psql -d cgvs -t -c "SELECT COUNT(*) FROM storage_files WHERE path = '$REL_PATH';")
  if [ "$EXISTS" -eq 0 ]; then
    echo "ORPHANED FILE: $REL_PATH (on disk, not in DB)"
  fi
done

echo "Consistency check complete"
```

---

## Testing & Verification

### Test Restore Procedure

**Monthly test restore (required!):**

```bash
#!/bin/bash
# test-restore.sh

LATEST_BACKUP=$(ls -t /backup/cgvs-full-*.tar.gz | head -1)
TEST_DIR="/tmp/restore-test-$(date +%s)"

echo "Testing restore from: $LATEST_BACKUP"

# Extract to temporary location
mkdir -p "$TEST_DIR"
tar -xzf "$LATEST_BACKUP" -C "$TEST_DIR"

# Create test database
createdb cgvs_restore_test
psql cgvs_restore_test < "$TEST_DIR"/cgvs-full-*/database.sql

# Verify database
RECORD_COUNT=$(psql -d cgvs_restore_test -t -c "SELECT COUNT(*) FROM storage_files;")
echo "Database records: $RECORD_COUNT"

# Verify files
FILE_COUNT=$(find "$TEST_DIR"/cgvs-full-*/files -type f | wc -l)
echo "Files restored: $FILE_COUNT"

# Cleanup
dropdb cgvs_restore_test
rm -rf "$TEST_DIR"

echo "✓ Test restore successful"
```

### Backup Monitoring

**Monitor backup health:**

```bash
#!/bin/bash
# backup-health-check.sh

BACKUP_DIR="/backup"
MAX_AGE_HOURS=25  # Alert if no backup in 25 hours

# Check last backup
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/cgvs-*.tar.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "CRITICAL: No backups found!"
  exit 2
fi

# Check backup age
BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 3600 ))

if [ "$BACKUP_AGE" -gt "$MAX_AGE_HOURS" ]; then
  echo "WARNING: Last backup is $BACKUP_AGE hours old (max: $MAX_AGE_HOURS)"
  exit 1
else
  echo "OK: Last backup is $BACKUP_AGE hours old"
  echo "File: $LATEST_BACKUP"
  echo "Size: $(du -h "$LATEST_BACKUP" | cut -f1)"
  exit 0
fi
```

---

## Best Practices

### Backup Best Practices

✅ **DO:**

- Automate backups (cron, systemd timers)
- Store backups off-site (cloud, remote server)
- Test restores monthly
- Monitor backup health
- Document restore procedures
- Keep multiple backup versions (3-2-1 rule)
- Verify checksums
- Encrypt backups for sensitive data

❌ **DON'T:**

- Rely on single backup location
- Skip testing restores
- Delete old backups without verification
- Store backups on same disk as data
- Ignore backup failures
- Assume backups work without testing

### 3-2-1 Backup Rule

- **3** copies of data (original + 2 backups)
- **2** different media types (disk + cloud)
- **1** off-site copy (different physical location)

**Example Implementation:**

1. Original: Production server (`./cgvs/data/files`)
2. Backup 1: Local backup disk (`/backup`)
3. Backup 2: Cloud storage (AWS S3 or GCP)

### Retention Policy

**Recommended retention:**

| Backup Type      | Retention Period | Reason                                    |
| ---------------- | ---------------- | ----------------------------------------- |
| Hourly snapshots | 24 hours         | Quick recovery from recent errors         |
| Daily backups    | 30 days          | Monthly rollback capability               |
| Weekly backups   | 3 months         | Quarterly compliance                      |
| Monthly backups  | 1 year           | Annual compliance, long-term recovery     |
| Yearly archives  | 7 years          | Legal compliance (varies by jurisdiction) |

**Script:**

```bash
#!/bin/bash
# cleanup-old-backups.sh

BACKUP_DIR="/backup"

# Delete hourly backups older than 24 hours
find "$BACKUP_DIR" -name "cgvs-hourly-*.tar.gz" -mtime +1 -delete

# Delete daily backups older than 30 days
find "$BACKUP_DIR" -name "cgvs-daily-*.tar.gz" -mtime +30 -delete

# Delete weekly backups older than 90 days
find "$BACKUP_DIR" -name "cgvs-weekly-*.tar.gz" -mtime +90 -delete

# Delete monthly backups older than 365 days
find "$BACKUP_DIR" -name "cgvs-monthly-*.tar.gz" -mtime +365 -delete

echo "Old backups cleaned up"
```

---

## Summary

### Critical Action Items

1. ✅ Set up automated daily backups
2. ✅ Configure off-site backup storage
3. ✅ Test restore procedure monthly
4. ✅ Monitor backup health
5. ✅ Document recovery procedures
6. ✅ Implement 3-2-1 backup rule
7. ✅ Verify backup integrity

### Quick Reference

**Daily Backups:**

```bash
0 2 * * * /opt/cgvs/scripts/full-backup.sh
```

**Weekly Off-Site Sync:**

```bash
0 3 * * 0 /opt/cgvs/scripts/offsite-backup.sh
```

**Monthly Restore Test:**

```bash
0 4 1 * * /opt/cgvs/scripts/test-restore.sh
```

**Disaster Recovery:**

```bash
/opt/cgvs/scripts/disaster-recovery.sh /backup/latest.tar.gz
```

### Further Reading

- [Local Storage Provider Overview](../local-storage-provider.md)
- [Cleanup Strategies](./cleanup-strategies.md)
- [Serverless Restrictions](./serverless-restrictions.md)
- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
