---
title: "Architecture"
description: "The components that make up InfraAudit: backend, frontend, database, auth, and how they fit together."
icon: "sitemap"
---


InfraAudit is a multi-service application. The components interact as shown below.

## Components

| Component | Technology | Purpose |
|---|---|---|
| **API** | Go 1.24+, Chi router | HTTP API, job scheduler, background workers |
| **Frontend** | React 18, TypeScript, Vite, Radix UI | Web UI |
| **Database** | PostgreSQL 14+ (or SQLite) | Primary data store |
| **Cache** | Redis | Session cache, API response cache |
| **Auth** | Supabase Auth | JWT signing, OAuth, user management |
| **AI** | Google Gemini API | AI-powered recommendations |
| **Scanning** | Trivy (embedded) | Vulnerability scanning |

## Request flow

A typical authenticated API request follows this path:

```
Client
  │
  ▼
Chi HTTP router (cmd/api/main.go)
  │
  ├── Auth middleware (internal/api/middleware/auth.go)
  │     Validates Bearer JWT against SUPABASE_JWT_SECRET
  │     Resolves Supabase UUID to internal user ID
  │
  ├── Handler (internal/api/handlers/<feature>.go)
  │     Reads request, validates input
  │
  ├── Service layer (internal/services/<feature>.go)
  │     Business logic, calls repository and external APIs
  │
  └── Repository (internal/repository/<feature>.go)
        SQL queries against PostgreSQL
```

## Directory structure (backend)

```
infraudit-go/
├── cmd/
│   ├── api/          # API server entrypoint
│   └── cli/          # CLI entrypoint
├── internal/
│   ├── api/
│   │   ├── handlers/ # HTTP handlers by feature
│   │   └── middleware/
│   ├── services/     # Business logic
│   ├── repository/   # Database access layer
│   ├── providers/    # Cloud provider clients (AWS, GCP, Azure, K8s)
│   ├── scanners/     # Trivy integration
│   ├── ai/           # Gemini integration and rule-based fallback
│   ├── jobs/         # Cron job definitions
│   └── database/
│       └── migrations/
├── deployments/
│   ├── docker-compose.yml
│   └── kubernetes/
└── .env.example
```

## Data model

The core entity relationships:

```
Provider (cloud account)
  └── Resource (discovered cloud resource)
        ├── Baseline (configuration snapshot)
        ├── Drift (detected difference from baseline)
        ├── Vulnerability (CVE finding)
        ├── Recommendation (AI or rule-based suggestion)
        └── Remediation (proposed or applied fix)

Provider
  └── CostRecord (daily billing data)

ComplianceFramework
  └── Assessment
        └── ControlResult (pass/fail per control)
```

## Authentication flow

1. User signs in through the InfraAudit frontend (or directly via Supabase client).
2. Supabase issues a JWT signed with `SUPABASE_JWT_SECRET`.
3. The JWT is sent as `Authorization: Bearer <token>` on every API request.
4. The auth middleware in the Go API verifies the signature and expiry.
5. The middleware resolves the Supabase user UUID to an internal integer user ID for database queries.

## Job scheduler

Background jobs run via `robfig/cron/v3`. The scheduler starts with the API and runs five job types on configurable cron expressions:

- `resource_sync` — pulls inventory from cloud provider APIs
- `drift_detection` — compares current state against baselines
- `vulnerability_scan` — runs Trivy against scannable artifacts
- `cost_sync` — fetches billing data
- `compliance_check` — runs compliance frameworks

Jobs write execution history (start time, duration, status, log) to the `job_executions` table.

## Scaling

The API scales horizontally — it is stateless (no in-memory session state). The database and Redis are the shared state layer. The job scheduler is leader-elected: only one API instance runs scheduled jobs at a time (via a database lock). Additional instances handle only HTTP traffic.
