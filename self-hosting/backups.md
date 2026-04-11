---
title: "Backups"
description: "Backup and restore strategies for your InfraAudit PostgreSQL database."
icon: "hard-drive"
---


InfraAudit's data lives in PostgreSQL. All historical scans, drift findings, costs, and recommendations are stored there. The Supabase project holds user accounts — back that up separately through the Supabase dashboard.

## What to back up

| Data | Location | Backup method |
|---|---|---|
| Scan data, resources, findings | InfraAudit Postgres | `pg_dump` |
| User accounts, OAuth sessions | Supabase Postgres | Supabase dashboard export |
| Cloud credentials (encrypted) | InfraAudit Postgres | Included in `pg_dump` |
| ENCRYPTION_KEY | `.env` / secrets manager | Back up separately — see [Secrets](/self-hosting/secrets-and-encryption) |

## Manual backup with pg_dump

For Docker Compose deployments:

```bash
docker compose exec postgres pg_dump \
  -U infraudit \
  -F c \
  infraudit > backup-$(date +%Y%m%d-%H%M).dump
```

`-F c` produces a custom-format dump, which is faster to restore than SQL text format.

Compress and upload to object storage:

```bash
gzip backup-20240115-1200.dump
aws s3 cp backup-20240115-1200.dump.gz s3://your-backup-bucket/infraudit/
```

## Automated backup script

Create `/etc/cron.daily/infraudit-backup`:

```bash
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d-%H%M)
BACKUP_FILE="/backups/infraudit/pg-$TIMESTAMP.dump"
S3_BUCKET="s3://your-backup-bucket/infraudit/"
RETENTION_DAYS=30

mkdir -p /backups/infraudit

# Dump
docker compose -f /path/to/docker-compose.yml exec -T postgres \
  pg_dump -U infraudit -F c infraudit > "$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_FILE" "$S3_BUCKET"

# Remove local backups older than 30 days
find /backups/infraudit -mtime +$RETENTION_DAYS -delete

echo "Backup complete: $BACKUP_FILE"
```

Make it executable:

```bash
chmod +x /etc/cron.daily/infraudit-backup
```

## Restoring from a backup

Stop the API first to prevent writes during restore:

```bash
docker compose stop api
```

Restore:

```bash
docker compose exec -T postgres pg_restore \
  -U infraudit \
  -d infraudit \
  --clean \
  < backup-20240115-1200.dump
```

Start the API:

```bash
docker compose start api
```

## Point-in-time recovery

For production deployments, use a managed PostgreSQL service with continuous PITR:

- **Amazon RDS:** Enable automated backups with a retention period of 7–35 days. PITR to any second.
- **Cloud SQL:** Automated backups enabled by default. PITR available with binary logging.
- **Azure Database:** Automated backups with geo-redundant storage. PITR to any point within the retention window.

## Testing restores

Run a restore test at least monthly. A backup that's never been tested is not a backup.

A simple test procedure:

1. Spin up a fresh Postgres container.
2. Restore the backup to it.
3. Run a quick sanity check query: `SELECT COUNT(*) FROM resources;`
4. Verify the count is reasonable.

## Backup retention policy

| Backup frequency | Recommended retention |
|---|---|
| Daily | 30 days |
| Weekly | 6 months |
| Monthly | 1 year |

Delete old backups automatically with your object storage's lifecycle policies (S3 Lifecycle, GCS Object Lifecycle, Azure Blob Lifecycle Management).
