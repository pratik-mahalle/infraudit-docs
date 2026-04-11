---
title: "Docker Compose"
description: "Deploy InfraAudit locally or on a server using Docker Compose."
icon: "docker"
---


Docker Compose is the fastest way to get InfraAudit running. It brings up the API, database, Redis, and frontend in four containers with a single command.

## Clone the repo

```bash
git clone https://github.com/pratik-mahalle/infraudit-go.git
cd infraudit-go
```

## Create `.env`

```bash
cp .env.example .env
```

Open `.env` and set the required values:

```env
# Supabase (required — see /self-hosting/supabase-setup)
SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Server
SERVER_PORT=8080
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development

# Database — Docker Compose provisions this automatically
DB_DRIVER=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=infraudit
DB_USER=infraudit
DB_PASSWORD=change-me-production-password
DB_SSLMODE=disable

# Credential encryption — generate with: openssl rand -hex 32
ENCRYPTION_KEY=change-me-32-byte-random-string-here

# Optional: AI recommendations
GEMINI_API_KEY=

# Optional: Slack notifications
SLACK_WEBHOOK_URL=
```

**Two values you must change before any real deployment:**

- `ENCRYPTION_KEY` — used to encrypt cloud provider credentials in Postgres. Generate with `openssl rand -hex 32`.
- `DB_PASSWORD` — the default is well-known and not safe for internet-exposed deployments.

For the complete environment variable reference, see [Configuration reference](/self-hosting/configuration).

## Start the stack

```bash
docker compose up -d
```

This starts four containers:

| Container | Port | Purpose |
|---|---|---|
| `api` | 8080 | InfraAudit Go backend |
| `postgres` | 5432 | Primary database |
| `redis` | 6379 | Cache |
| `frontend` | 5173 | React web UI |

Watch the log until the API reports ready:

```bash
docker compose logs -f api
```

Expected output:

```
api_1  | InfraAudit API starting on :8080
api_1  | Database connected (postgres)
api_1  | Redis connected
api_1  | Supabase auth configured
```

If the API exits immediately with `SUPABASE_JWT_SECRET is required`, the Supabase values in `.env` are missing or wrong.

## Verify

```bash
curl http://localhost:8080/healthz
# {"status":"ok"}

curl http://localhost:8080/readyz
# {"status":"ready","database":"ok","redis":"ok"}
```

Open `http://localhost:5173` and sign up.

## Optional: monitoring profile

Enable Prometheus and Grafana:

```bash
docker compose --profile monitoring up -d
```

| Container | Port | Purpose |
|---|---|---|
| `prometheus` | 9090 | Metrics scraper |
| `grafana` | 3000 | Dashboard UI |

Grafana ships with a pre-built InfraAudit dashboard. Log in with `admin/admin` and change the password on first login.

## Stopping and restarting

```bash
# Stop without removing volumes
docker compose down

# Stop and remove all data (destructive — use with care)
docker compose down -v
```

## Updating

Pull the latest images and restart:

```bash
docker compose pull
docker compose up -d
```

See [Upgrades](/self-hosting/upgrades) for migration steps between versions.

## Production considerations

- Put secrets in environment variables, not the `.env` file, if you're deploying on a server.
- Add a reverse proxy (nginx, Caddy) in front of port 8080 to terminate TLS.
- Set `ENVIRONMENT=production` — this enables stricter error handling and disables the Swagger UI.
- Read [Secrets and encryption](/self-hosting/secrets-and-encryption) before going to production.
