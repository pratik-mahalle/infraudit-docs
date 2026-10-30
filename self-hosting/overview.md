---
title: "Self-Hosting"
description: "Run InfrAudit on your own infrastructure with Docker Compose or Kubernetes (Enterprise plan)."
icon: "server"
---


Self-hosting is available on the Enterprise plan. InfrAudit ships as container images and a release bundle (Docker Compose files, Kubernetes manifests, and `.env.example`). You can deploy it with Docker Compose for a quick start or with Kubernetes for production. [Contact sales](https://infraudit.com/contact) for access to the Enterprise self-hosted bundle.

**Before anything else, read [Prerequisites](/self-hosting/prerequisites).** A Supabase project is required — the backend will not start without `SUPABASE_URL` and `SUPABASE_JWT_SECRET`.

## Deployment options

- [Docker Compose](/self-hosting/docker-compose) — fastest path; Postgres, Redis, API, and frontend in one command
- [Kubernetes](/self-hosting/kubernetes) — production-grade using the manifests under `deployments/kubernetes/`

## Configuration and security

- [Configuration reference](/self-hosting/configuration) — full environment variable table
- [Secrets and encryption](/self-hosting/secrets-and-encryption) — credential encryption, secret rotation
- [Database](/self-hosting/database) — PostgreSQL vs SQLite, running migrations

## Operations

- [Monitoring](/self-hosting/monitoring) — Prometheus and Grafana setup
- [Backups](/self-hosting/backups) — database backup strategy
- [Upgrades](/self-hosting/upgrades) — how to update to a new release
- [Troubleshooting](/self-hosting/troubleshooting) — common startup and runtime issues
