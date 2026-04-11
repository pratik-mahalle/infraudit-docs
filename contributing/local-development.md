---
title: "Local Development"
description: "Set up a local InfraAudit development environment for the Go backend and React frontend."
icon: "laptop"
---


## Prerequisites

- Go 1.24+
- Node.js 18+
- Docker and Docker Compose v2 (for Postgres and Redis)
- A Supabase project with credentials (see [Supabase setup](/self-hosting/supabase-setup))
- `make` (optional, simplifies common tasks)

## Backend

### 1. Clone and configure

```bash
git clone https://github.com/pratik-mahalle/infraudit-go.git
cd infraudit-go
cp .env.example .env
```

Edit `.env` with your Supabase credentials and generate an `ENCRYPTION_KEY`:

```bash
openssl rand -hex 32  # copy output to ENCRYPTION_KEY in .env
```

### 2. Start Postgres and Redis

```bash
docker compose up -d postgres redis
```

### 3. Run the API

```bash
# Using make
make run

# Or directly
go run ./cmd/api
```

The API starts on `http://localhost:8080` with hot reload (via `air` if installed, or restart manually after changes).

To install `air` for hot reload:

```bash
go install github.com/air-verse/air@latest
air
```

### 4. Verify

```bash
curl http://localhost:8080/healthz
# {"status":"ok"}
```

## Frontend

```bash
git clone https://github.com/pratik-mahalle/InfraAudit.git
cd InfraAudit
npm install
```

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Start the dev server:

```bash
npm run dev
# Frontend available at http://localhost:5173
```

## Running both together

With both the backend and frontend running:

1. Open `http://localhost:5173`.
2. Sign up or log in.
3. The frontend makes API calls to `http://localhost:8080`.

## Useful development flags

```bash
# More verbose logging
LOG_LEVEL=debug go run ./cmd/api

# Use SQLite instead of Postgres (no Docker needed)
DB_DRIVER=sqlite SQLITE_PATH=./dev.db go run ./cmd/api

# Disable scheduled jobs (run scans manually only)
JOB_RESOURCE_SYNC_SCHEDULE="" go run ./cmd/api
```

## Swagger UI

With `ENVIRONMENT=development` (the default), the Swagger UI is available at `http://localhost:8080/swagger/index.html`. Regenerate the spec after changing handler annotations:

```bash
make swagger
```

## Environment variable for quick setup

To run a completely local stack without Supabase, set:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

And run a local Supabase instance with `npx supabase start`.
