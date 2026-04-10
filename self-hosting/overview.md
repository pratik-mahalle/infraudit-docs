---
title: "Self-Hosting"
description: "Run InfraAudit on your own infrastructure with Docker Compose or Kubernetes."
icon: "server"
---

# Self-hosting

The InfraAudit Community edition is MIT-licensed and designed to run on your own infrastructure. You can deploy it with Docker Compose for a quick start or with Kubernetes for production.

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
