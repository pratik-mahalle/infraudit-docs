---
title: "Troubleshooting"
description: "Common startup and runtime issues when self-hosting InfraAudit, and how to fix them."
icon: "wrench"
---


Common issues when self-hosting InfraAudit, organized by symptom.

## API won't start

### `SUPABASE_JWT_SECRET is required`

The API validates the Supabase JWT secret at startup and refuses to boot without it.

- Check that `SUPABASE_JWT_SECRET` is in your `.env` file.
- Verify you copied it from **Project Settings → API → JWT Settings** in Supabase (not the `anon` key or `service_role` key).
- Make sure the variable name is spelled exactly right — no trailing spaces.

### `failed to connect to database`

```
api_1  | FATAL: failed to connect to database: dial tcp postgres:5432: connect: connection refused
```

- The Postgres container is still starting up. Wait 10–15 seconds and try again, or run `docker compose up -d` again (it's idempotent).
- Check that `DB_HOST`, `DB_PORT`, `DB_USER`, and `DB_PASSWORD` in `.env` match the Postgres container configuration.

### Port 8080 already in use

```
Error: listen tcp :8080: bind: address already in use
```

Change `SERVER_PORT` in `.env` and update the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "9090:9090"  # change left side to new host port
```

### Migration failure at startup

```
api_1  | migration 0012_add_anomaly_table.up.sql: ERROR: column "threshold" already exists
```

A migration was partially applied. To reset:

1. Drop the migration tracking table (careful — this marks all migrations as unapplied):

```bash
docker compose exec postgres psql -U infraudit infraudit \
  -c "DROP TABLE IF EXISTS schema_migrations;"
```

2. Restart the API. It will re-run all migrations.

If the error is a conflict (column already exists), skip the broken migration by marking it as applied:

```bash
docker compose exec postgres psql -U infraudit infraudit \
  -c "INSERT INTO schema_migrations (version, dirty) VALUES (12, false);"
```

## Authentication issues

### `401 Unauthorized` on all requests

- Check that `SUPABASE_URL` and `SUPABASE_JWT_SECRET` are correct.
- Make sure the frontend and API point to the **same** Supabase project. A common mistake: the frontend uses a different Supabase project than the one in the API `.env`.
- If you recently rotated the JWT secret in Supabase, update `SUPABASE_JWT_SECRET` and restart the API.

### Can't log in via the frontend (redirect issues)

- Set **Site URL** in Supabase **Authentication → URL Configuration** to `http://localhost:5173` (or your frontend URL).
- Add your frontend URL to the **Redirect URLs** allow list in Supabase.

## Scans don't find anything

### Drift detection returns zero findings on first run

This is expected. InfraAudit captures baselines during the initial resource sync. The drift scanner compares against those baselines, so on the first scan there is nothing to compare against. Make a change in your cloud account (add a tag, modify a security group rule), wait for or trigger a resource sync, then run drift detection.

### Provider shows "Error" status after connecting

- The credentials are invalid or the IAM policy is missing required permissions.
- For AWS, ensure the IAM user or role has the permissions in the [AWS integration guide](/integrations/aws).
- Check the provider sync log: click the provider in **Cloud Providers** and look at the **Sync history** for the error message.

## Performance issues

### Slow resource sync

- Large accounts (1,000+ resources) can take 5–10 minutes for the initial sync. This is normal.
- If syncs consistently exceed `JOB_TIMEOUT_SECONDS` (default: 300), increase the timeout in `.env`.

### High memory usage

- If the API container exceeds 1 GB of RAM, most likely a large vulnerability scan or compliance assessment is running. This is expected behavior.
- If memory stays elevated after the job finishes, restart the API container (`docker compose restart api`).

## Log locations

```bash
# API logs
docker compose logs api

# Follow live
docker compose logs -f api

# Postgres logs
docker compose logs postgres

# Filter by level
docker compose logs api | grep ERROR
```

Set `LOG_LEVEL=debug` in `.env` for verbose output during troubleshooting. Remember to set it back to `info` afterward.

## Getting help

If you can't resolve an issue with this page, open an issue on [GitHub](https://github.com/pratik-mahalle/infraudit-go/issues) with:

1. InfraAudit version (`docker compose exec api ./infraudit-api --version`)
2. The full error log output
3. Your `.env` file contents with secrets redacted
