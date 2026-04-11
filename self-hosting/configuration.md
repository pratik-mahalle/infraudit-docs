---
title: "Configuration Reference"
description: "Every environment variable the InfraAudit backend accepts, with defaults and descriptions."
icon: "sliders"
---


InfraAudit is configured entirely through environment variables. Set them in `.env` for Docker Compose or in Kubernetes Secrets and ConfigMaps.

## Required

These variables must be set. The backend will not start without them.

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxxx.supabase.co`) |
| `SUPABASE_JWT_SECRET` | JWT secret from Project Settings → API → JWT Settings |
| `SUPABASE_ANON_KEY` | anon/public key from Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from Project Settings → API |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-GCM encryption of cloud credentials. Generate: `openssl rand -hex 32` |

## Server

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `8080` | Port the HTTP API listens on |
| `ENVIRONMENT` | `development` | `development` or `production`. Production disables Swagger UI and enables stricter error handling |
| `FRONTEND_URL` | `http://localhost:5173` | URL of the frontend (used for CORS and auth redirects) |
| `ALLOWED_ORIGINS` | `*` | Comma-separated CORS origins. Set to your frontend URL in production |

## Database

| Variable | Default | Description |
|---|---|---|
| `DB_DRIVER` | `postgres` | `postgres` or `sqlite` |
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_NAME` | `infraudit` | Database name |
| `DB_USER` | `infraudit` | Database user |
| `DB_PASSWORD` | — | Database password (required for Postgres) |
| `DB_SSLMODE` | `disable` | Postgres SSL mode: `disable`, `require`, `verify-full` |
| `DB_MAX_OPEN_CONNS` | `25` | Max open DB connections |
| `DB_MAX_IDLE_CONNS` | `5` | Max idle DB connections |
| `SQLITE_PATH` | `./infraudit.db` | Path to SQLite file when `DB_DRIVER=sqlite` |

## Redis

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `REDIS_PASSWORD` | — | Redis password (if any) |
| `REDIS_DB` | `0` | Redis database index |

Redis is optional. If it's unavailable, the API disables caching but continues to function.

## Job scheduler

| Variable | Default | Description |
|---|---|---|
| `JOB_RESOURCE_SYNC_SCHEDULE` | `0 */6 * * *` | Cron for resource inventory sync |
| `JOB_DRIFT_DETECTION_SCHEDULE` | `0 */4 * * *` | Cron for drift detection scan |
| `JOB_VULNERABILITY_SCAN_SCHEDULE` | `0 2 * * *` | Cron for vulnerability scan |
| `JOB_COST_SYNC_SCHEDULE` | `0 3 * * *` | Cron for billing data sync |
| `JOB_COMPLIANCE_CHECK_SCHEDULE` | `0 4 * * *` | Cron for compliance assessment |
| `JOB_TIMEOUT_SECONDS` | `300` | Max runtime per job execution |

## Notifications

| Variable | Default | Description |
|---|---|---|
| `SLACK_WEBHOOK_URL` | — | Slack incoming webhook URL |
| `SLACK_CHANNEL` | `#alerts` | Default Slack channel for alerts |
| `SMTP_HOST` | — | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASSWORD` | — | SMTP password |
| `SMTP_FROM` | — | From address for email notifications |
| `SMTP_TLS` | `true` | Enable STARTTLS |
| `EMAIL_ENABLED` | `false` | Enable email notifications |
| `SENDGRID_API_KEY` | — | SendGrid API key (used instead of SMTP when set) |

## AI

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | — | Google Gemini API key. When not set, rule-based recommendations are used |
| `GEMINI_MODEL` | `gemini-2.5-pro` | Gemini model to use |

## Vulnerability scanning

| Variable | Default | Description |
|---|---|---|
| `VULN_SEVERITY_THRESHOLD` | `medium` | Minimum severity to store: `critical`, `high`, `medium`, `low` |
| `TRIVY_CACHE_DIR` | `/tmp/trivy-cache` | Directory for the Trivy vulnerability database |
| `TRIVY_DB_REPOSITORY` | — | Custom Trivy DB OCI image (for air-gapped environments) |
| `NVD_API_KEY` | — | NVD API key for faster CVE enrichment |

## Logging

| Variable | Default | Description |
|---|---|---|
| `LOG_LEVEL` | `info` | Log level: `debug`, `info`, `warn`, `error` |
| `LOG_FORMAT` | `text` | Log format: `text` or `json` |

## Metrics

| Variable | Default | Description |
|---|---|---|
| `METRICS_ENABLED` | `true` | Enable the `/metrics` Prometheus endpoint |
| `METRICS_AUTH_TOKEN` | — | Bearer token to protect the metrics endpoint |

## Remediation

| Variable | Default | Description |
|---|---|---|
| `REMEDIATION_REQUIRE_APPROVAL` | `true` | Require explicit approval before executing remediation actions |
| `REMEDIATION_ROLLBACK_WINDOW_MINUTES` | `30` | How long the rollback window stays open after a remediation |
