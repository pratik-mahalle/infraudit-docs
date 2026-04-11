---
title: "Prerequisites"
description: "What you need before deploying InfraAudit: Supabase, Docker, and system requirements."
icon: "list-check"
---


Before deploying InfraAudit, you need three things: a Supabase project, Docker, and enough system resources. The Supabase requirement is the most common blocker for new self-hosters.

## 1. Supabase project (required)

InfraAudit's authentication layer is backed by Supabase. The backend validates every incoming JWT against your Supabase project and will refuse to start without the connection details.

**Steps:**

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project. Any region works; the smallest tier (Free) is sufficient for development. For production, the Pro tier is recommended.
3. From **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
4. From **Project Settings → API → JWT Settings**, copy:
   - **JWT Secret** → `SUPABASE_JWT_SECRET`

Keep all four values. You'll paste them into `.env` during installation.

**Why Supabase?**

Supabase handles user accounts, OAuth flows (Google, GitHub), session management, and JWT signing. InfraAudit does not maintain its own user store — it resolves Supabase UUIDs to internal user IDs on first login.

## 2. Docker

InfraAudit runs as Docker containers. You need:

- **Docker 24.0+**
- **Docker Compose v2** (`docker compose` subcommand, not the legacy `docker-compose`)

Verify:

```bash
docker --version
# Docker version 24.x.x, ...

docker compose version
# Docker Compose version v2.x.x
```

If you're deploying to Kubernetes instead, you can skip Docker Compose — see [Self-hosting: Kubernetes](/self-hosting/kubernetes).

## 3. System requirements

| Resource | Minimum | Recommended |
|---|---|---|
| RAM | 2 GB | 4 GB |
| CPU | 1 core | 2 cores |
| Disk | 10 GB | 20 GB |
| OS | Linux, macOS | Linux |

The RAM minimum covers the API, Postgres, and Redis containers running simultaneously. The Prometheus + Grafana monitoring profile adds another ~512 MB.

## 4. Optional: Gemini API key

For AI-generated recommendations, you need a Google Gemini API key:

1. Go to [ai.google.dev](https://ai.google.dev).
2. Create a project and generate an API key.
3. Add it to `.env` as `GEMINI_API_KEY`.

Without this key, InfraAudit uses the rule-based recommendation fallback. All other features work normally.

## 5. Optional: cloud credentials

To actually scan infrastructure, you'll need credentials for at least one cloud provider. Read-only credentials are sufficient and recommended for initial setup:

- **AWS:** IAM user access keys or a role ARN — see [Integrations: AWS](/integrations/aws)
- **GCP:** Service account JSON key — see [Integrations: GCP](/integrations/gcp)
- **Azure:** Service principal credentials — see [Integrations: Azure](/integrations/azure)
- **Kubernetes:** kubeconfig with read-only access — see [Integrations: Kubernetes](/integrations/kubernetes)

## Next step

Once you have a Supabase project and Docker installed, follow the [Docker Compose](/self-hosting/docker-compose) or [Kubernetes](/self-hosting/kubernetes) deployment guide.
