---
title: "API Overview"
description: "Base URL, versioning, authentication, and conventions for the InfraAudit REST API."
icon: "code"
---

# API overview

InfraAudit exposes a REST API over HTTP. All responses are JSON. The API is served by the Go backend (`cmd/api`) using the [Chi](https://github.com/go-chi/chi) router.

## Base URL

For self-hosted deployments the default base URL is:

```
http://localhost:8080
```

For SaaS:

```
https://api.infraaudit.dev
```

## API versioning

Most endpoints are under `/api/v1/`. A small set of older endpoints (auth, providers, resources, drifts, baselines, alerts, Kubernetes, IaC) are also available without the `/v1/` prefix for frontend compatibility. New integrations should always use the `/api/v1/` paths.

## Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

The token is a Supabase JWT. See [Authentication](/api/authentication) for how to obtain one.

## Content type

All request bodies must be `application/json`. Responses are always `application/json` unless noted (e.g. file downloads return `application/pdf` or `text/csv`).

## Health endpoints (no auth required)

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness check |
| `GET /healthz` | Liveness check (alias) |
| `GET /readyz` | Readiness check (checks DB and Redis) |
| `GET /metrics` | Prometheus metrics |
| `GET /swagger/index.html` | Interactive API explorer |

## OpenAPI spec

The full API surface is documented in an auto-generated OpenAPI 3.0 spec. See [OpenAPI spec](/api/openapi) for how to use it with Postman, OpenAPI Generator, or the built-in Swagger UI.

## Next steps

- [Authentication](/api/authentication)
- [Errors](/api/errors)
- [Pagination](/api/pagination)
- [Rate limiting](/api/rate-limiting)
- [Endpoint reference](/api/reference/overview)
