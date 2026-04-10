# Quickstart: Self-host

This guide gets InfraAudit running on your own machine using Docker Compose. Expected time: 15 to 30 minutes, most of which is the Supabase setup.

The end result: a working InfraAudit backend on `http://localhost:8080`, a frontend on `http://localhost:5173`, one connected AWS account, and one completed drift scan.

## Before you start

### 1. Supabase project (required)

InfraAudit's auth layer is backed by Supabase. The backend will not start without a Supabase project and its JWT secret. This is the biggest prerequisite and the most common place new self-hosters get stuck.

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project. Pick any region; the smallest tier is enough for development.
3. Go to **Project Settings → API**. Copy three values:
   - **Project URL** (e.g. `https://xxxxxxxxxxxxxx.supabase.co`) → becomes `SUPABASE_URL`
   - **anon public key** → becomes `SUPABASE_ANON_KEY`
   - **service_role secret** → becomes `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **Project Settings → API → JWT Settings**. Copy the **JWT Secret** → becomes `SUPABASE_JWT_SECRET`.

Keep these four values handy. You'll paste them into `.env` in a moment.

### 2. System requirements

- Docker 24+ and Docker Compose v2
- 4 GB free RAM (8 GB if you also enable the Prometheus/Grafana monitoring profile)
- 10 GB free disk (mostly for Postgres and scan results)
- An AWS, GCP, or Azure account you're willing to point InfraAudit at (read-only credentials are fine and recommended for a first run)

### 3. Gemini API key (optional)

If you want AI-generated recommendations instead of the rule-based fallback, grab a Gemini API key from [ai.google.dev](https://ai.google.dev). The key is not required to boot.

## Install

### 1. Clone the backend repo

```bash
git clone https://github.com/pratik-mahalle/infraudit-go.git
cd infraudit-go
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in at minimum:

```env
# Supabase (required)
SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Server
SERVER_PORT=8080
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development

# Database (Docker Compose provisions this for you)
DB_DRIVER=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=infraudit
DB_USER=infraudit
DB_PASSWORD=infraudit123
DB_SSLMODE=disable

# Encryption for cloud credentials at rest (change this!)
ENCRYPTION_KEY=change-me-32-byte-random-string-here

# Optional: Gemini AI
GEMINI_API_KEY=

# Optional: Slack notifications
SLACK_WEBHOOK_URL=
SLACK_CHANNEL=#alerts
```

Two values you must change before anything beyond a toy deployment:

- `ENCRYPTION_KEY` — used to encrypt cloud provider credentials in the database. Generate with `openssl rand -hex 32`.
- `DB_PASSWORD` — the default is a well-known string and should never reach production.

For the full environment variable reference, see [Configuration reference](../self-hosting/configuration.md).

### 3. Start the stack

```bash
docker compose up -d
```

This brings up four containers:

| Service | Port | Purpose |
|---|---|---|
| `api` | 8080 | InfraAudit Go backend |
| `postgres` | 5432 | Primary database |
| `redis` | 6379 | Cache (optional but enabled by default) |
| `frontend` | 5173 | React web UI |

Watch the logs until the API reports `server starting on :8080`:

```bash
docker compose logs -f api
```

If the API exits immediately with a Supabase error, double-check `SUPABASE_URL` and `SUPABASE_JWT_SECRET` — those two are validated at startup and the process will refuse to boot without them.

### 4. Verify the health endpoints

```bash
curl http://localhost:8080/healthz
# {"status":"ok"}

curl http://localhost:8080/readyz
# {"status":"ready","database":"ok","redis":"ok"}
```

If `database` reports `error`, the Postgres container is still warming up. Wait 10 seconds and try again.

## First login

1. Open `http://localhost:5173` in your browser.
2. Click **Sign up** and create an account with any email and password. Supabase stores the credentials; the Go backend resolves the Supabase UUID to an internal user ID on first login.
3. You land on the dashboard. It's empty because no providers are connected yet.

## Connect your first cloud account

The fastest path is AWS with read-only credentials.

### Option A: Web UI

1. Click **Cloud Providers** in the sidebar.
2. Click **Connect AWS**.
3. Paste your AWS access key ID, secret access key, and pick a region (e.g. `us-east-1`).
4. Click **Connect**. InfraAudit encrypts the credentials using `ENCRYPTION_KEY` and kicks off an initial resource sync.

### Option B: CLI

If you prefer the command line, install the CLI first ([CLI installation](../cli/installation.md)), then:

```bash
infraudit config init
# Enter server URL: http://localhost:8080

infraudit auth login
# Enter your Supabase email/password

infraudit provider connect aws
# Interactive prompts for Access Key, Secret, Region
```

### Option C: API

```bash
curl -X POST http://localhost:8080/api/v1/providers/aws/connect \
  -H "Authorization: Bearer $INFRAUDIT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AWS Production",
    "accessKeyId": "AKIA...",
    "secretAccessKey": "...",
    "region": "us-east-1"
  }'
```

The Bearer token is the Supabase `access_token` you get from signing in. See [API: Authentication](../api/authentication.md) for details.

## Run your first scan

Once the initial resource sync finishes (typically under a minute for a small account), trigger a drift detection scan:

```bash
# CLI
infraudit drift detect

# API
curl -X POST http://localhost:8080/api/v1/drifts/detect \
  -H "Authorization: Bearer $INFRAUDIT_TOKEN"
```

View the results:

```bash
infraudit drift list --severity critical
infraudit drift summary
```

Or open **Drift Detection** in the web UI.

## What to do next

- **Turn on vulnerability scans.** Run `infraudit vuln scan` or enable the scheduled vulnerability scan job. Trivy must be installed on the API container (it is, by default).
- **Set up Slack alerts.** Add `SLACK_WEBHOOK_URL` to `.env`, restart the API, and configure notification preferences.
- **Enable a compliance framework.** Run `infraudit compliance enable cis-aws` and then `infraudit compliance assess`.
- **Review cost data.** Billing data syncs on a daily schedule by default. Force an immediate sync with `infraudit cost sync`.
- **Harden the deployment.** Read [Secrets and encryption](../self-hosting/secrets-and-encryption.md) and [Monitoring](../self-hosting/monitoring.md).

## Troubleshooting

**The API container exits with `SUPABASE_JWT_SECRET is required`.**
You skipped step 1 of the prerequisites or typed the wrong variable name. Check `.env` against `.env.example`.

**I can log in on the frontend but API calls return 401.**
The frontend proxies through `FRONTEND_URL` but the API validates the Supabase token against `SUPABASE_URL`. Make sure both point to the same Supabase project.

**`docker compose up` says port 8080 is already in use.**
Another service is bound to that port. Change `SERVER_PORT` in `.env` and also update the port mapping in `docker-compose.yml`.

**Drift detection runs but never finds anything.**
Drift detection compares against baselines, and a fresh install has none. The first sync captures baselines automatically; subsequent scans will find drift. Make a manual change to a resource in your cloud account and scan again.

For more, see [Self-hosting troubleshooting](../self-hosting/troubleshooting.md).
