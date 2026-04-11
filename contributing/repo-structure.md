---
title: "Repo Structure"
description: "How the InfraAudit Go backend, React frontend, and CLI are organized."
icon: "folder-open"
---


InfraAudit has three source repositories. This page describes how the main backend repo (`infraudit-go`) is laid out.

## Repositories

| Repo | Language | Purpose |
|---|---|---|
| [pratik-mahalle/infraudit-go](https://github.com/pratik-mahalle/infraudit-go) | Go | HTTP API, CLI, background jobs |
| [pratik-mahalle/InfraAudit](https://github.com/pratik-mahalle/InfraAudit) | React/TypeScript | Web frontend |
| [pratik-mahalle/infraudit-docs](https://github.com/pratik-mahalle/infraudit-docs) | Markdown | This documentation |

## Backend (infraudit-go)

```
infraudit-go/
├── cmd/
│   ├── api/              # API server entry point
│   │   └── main.go
│   ├── cli/              # CLI entry point
│   │   └── main.go
│   └── migrate/          # Migration runner tool
│
├── internal/
│   ├── api/
│   │   ├── handlers/     # HTTP handlers, one file per feature domain
│   │   ├── middleware/   # Auth, logging, CORS, rate-limiting
│   │   └── router.go     # Chi router setup
│   │
│   ├── services/         # Business logic layer
│   ├── repository/       # Database queries (one file per entity)
│   │
│   ├── providers/        # Cloud provider clients
│   │   ├── aws/
│   │   ├── gcp/
│   │   ├── azure/
│   │   └── kubernetes/
│   │
│   ├── scanners/
│   │   └── trivy/        # Trivy integration
│   │
│   ├── ai/
│   │   ├── gemini.go     # Gemini API client
│   │   └── rules.go      # Rule-based fallback
│   │
│   ├── jobs/             # Cron job definitions
│   │   ├── scheduler.go
│   │   ├── resource_sync.go
│   │   ├── drift_detection.go
│   │   ├── vulnerability_scan.go
│   │   ├── cost_sync.go
│   │   └── compliance_check.go
│   │
│   ├── compliance/
│   │   ├── engine.go     # Framework evaluation engine
│   │   └── controls/     # Framework control definitions (JSON)
│   │       ├── cis-aws/
│   │       ├── soc2/
│   │       └── ...
│   │
│   └── database/
│       ├── db.go         # Connection pooling
│       └── migrations/   # SQL migration files
│
├── deployments/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml
│   ├── grafana/          # Grafana dashboard JSON
│   └── kubernetes/       # Kubernetes manifests
│
├── .env.example
├── Makefile
└── go.mod
```

## Key conventions

- **Handlers** are thin — they parse requests, call a service method, and format the response. No business logic in handlers.
- **Services** contain all business logic and coordinate between repositories and external clients.
- **Repositories** contain raw SQL queries. No business logic. Return domain models, not raw `sql.Row`.
- **Provider clients** are stateless — they take credentials as input and return resource lists. Each provider implements the `Provider` interface in `internal/providers/interface.go`.

## Makefile targets

```bash
make run          # Run the API in development mode with hot reload
make build        # Build the API binary
make test         # Run all tests
make lint         # Run golangci-lint
make migrate-up   # Apply all pending migrations
make migrate-down # Roll back one migration
make swagger      # Regenerate Swagger docs from code annotations
```
