---
title: "Database"
description: "InfraAudit supports PostgreSQL and SQLite. Learn how to run migrations and manage the database."
icon: "database"
---


InfraAudit supports two database backends: **PostgreSQL** (recommended for production) and **SQLite** (suitable for local development and single-node evaluations).

## PostgreSQL

PostgreSQL is the default and recommended backend. The Docker Compose setup provisions a Postgres container automatically. For production deployments, use a managed database service (Amazon RDS, Cloud SQL, Azure Database for PostgreSQL) for high availability and automated backups.

### Minimum version

PostgreSQL 14 or later.

### Connection configuration

```env
DB_DRIVER=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=infraudit
DB_USER=infraudit
DB_PASSWORD=your-password
DB_SSLMODE=require
```

For a production database, set `DB_SSLMODE=require` or `verify-full` to enforce TLS.

### Creating the database

If you're using an external managed Postgres instance, create the database manually before starting InfraAudit:

```sql
CREATE DATABASE infraudit;
CREATE USER infraudit WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE infraudit TO infraudit;
```

InfraAudit creates all tables on startup via the migration system.

## SQLite

SQLite requires no external database service. It's suitable for local development, testing, and single-user evaluations.

```env
DB_DRIVER=sqlite
SQLITE_PATH=./infraudit.db
```

SQLite limitations:
- No concurrent write support — avoid SQLite with more than one API instance
- No built-in backup tooling (use `sqlite3` `.backup` command)
- Not recommended for environments with more than ~50 resources

## Migrations

InfraAudit uses [golang-migrate](https://github.com/golang-migrate/migrate) for schema migrations. Migrations run automatically at startup.

Migration files live in `internal/database/migrations/`. They follow the `NNNN_description.up.sql` / `NNNN_description.down.sql` naming convention.

### Running migrations manually

```bash
# Inside the repo
go run ./cmd/migrate up

# Check current migration version
go run ./cmd/migrate version

# Roll back one migration
go run ./cmd/migrate down 1
```

### Checking migration status

```bash
# Via Docker
docker compose exec api go run ./cmd/migrate version
```

If the API exits with `migration failed`, check the migration logs:

```bash
docker compose logs api | grep -i migration
```

## Connection pooling

Default pool settings:

```env
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=5
```

For high-throughput deployments (many concurrent scans), increase `DB_MAX_OPEN_CONNS` to 50–100. Watch `infraudit_db_connections_active` in Prometheus if you enable the monitoring profile.

## Backup strategy

For Docker Compose deployments, use `pg_dump`:

```bash
docker compose exec postgres pg_dump -U infraudit infraudit > backup-$(date +%Y%m%d).sql
```

Restore:

```bash
docker compose exec -T postgres psql -U infraudit infraudit < backup-20240115.sql
```

See [Backups](/self-hosting/backups) for a full backup and restore guide.

## Database size

Rough growth estimates depending on infrastructure size and scan frequency:

| Resources | Scans/day | 30-day DB size |
|---|---|---|
| 100 | 6 | ~500 MB |
| 500 | 6 | ~2 GB |
| 2,000 | 6 | ~8 GB |

Vulnerability scan results and cost data are the largest contributors. If disk is a concern, set a retention policy for old scan data (pruning job available in future releases).
