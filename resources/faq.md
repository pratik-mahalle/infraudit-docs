---
title: "FAQ"
description: "Frequently asked questions about InfraAudit."
icon: "circle-question"
---


## General

**Is there a free version?**

Yes. The Community edition is free, MIT-licensed, and self-hosted. It includes every feature documented here — unlimited resources, all cloud providers, all compliance frameworks, AI recommendations (with a Gemini API key), and all CLI and API access.

**What's the difference between Community and SaaS editions?**

The features are identical. SaaS editions (Starter, Professional, Enterprise) add managed hosting, longer data retention, priority support, enterprise SSO, and resource limits that scale with the plan.

**Does InfraAudit write to my cloud accounts?**

Only through remediation actions, and only when you explicitly approve and execute one. Discovery, drift detection, vulnerability scanning, and compliance assessments are all read-only. No scans modify your infrastructure.

## Setup

**Why does the backend require Supabase?**

Supabase handles authentication — JWT signing, OAuth with Google/GitHub, and user sessions. InfraAudit doesn't maintain its own user database. This makes the auth layer production-ready without custom code.

**Can I use InfraAudit without Supabase?**

Not in the current release. A community PR to add an alternative auth backend (e.g. Keycloak, native user table) would be welcome.

**Can I use SQLite instead of PostgreSQL?**

Yes, for development and small single-user deployments. Set `DB_DRIVER=sqlite` and `SQLITE_PATH=./infraudit.db`. SQLite is not recommended for production — it doesn't support concurrent writes and has no managed backup tooling.

## Features

**What cloud providers are supported?**

AWS, Google Cloud Platform, Microsoft Azure, and Kubernetes. See the [Integrations](/integrations/overview) section for setup details.

**Does InfraAudit support multiple AWS accounts?**

Yes. Connect each account as a separate provider. There's no limit on the number of connected accounts (Community edition), or limits vary by plan (SaaS editions).

**How does InfraAudit handle drift on resources that change frequently?**

Some resource attributes change on every API call (timestamps, lease tokens, internal IDs). InfraAudit maintains per-resource-type exclusion lists for these fields to avoid false positives. If a specific attribute is causing false drift findings, open a GitHub issue to have it added to the exclusion list.

**Does the AI recommendation feature require an internet connection?**

For Gemini-powered recommendations, yes. For the rule-based fallback (when `GEMINI_API_KEY` is not set), no — it runs entirely offline. All other InfraAudit features work without internet access, as long as the API can reach your cloud provider APIs.

## Security

**How are cloud credentials stored?**

All credentials (AWS access keys, GCP service account JSON, Azure service principal secrets) are encrypted at rest using AES-256-GCM before being stored in the database. The encryption key is the `ENCRYPTION_KEY` environment variable, which is never written to the database.

**What happens if I lose the ENCRYPTION_KEY?**

The stored credentials become unreadable. You'll need to reconnect each provider. Back up `ENCRYPTION_KEY` in a secrets manager.

**Are API keys and JWTs the same?**

No. JWTs are issued by Supabase and expire (default: 1 hour). API keys are long-lived InfraAudit-generated tokens created under Settings → API Keys — they're useful for CI/CD pipelines. Both authenticate using the same `Authorization: Bearer` header.

## Troubleshooting

**I connected a provider but no resources appear.**

The initial resource sync takes up to a minute for small accounts and up to 10 minutes for large ones. Check the provider status in **Cloud Providers** — it will show "syncing" during the sync and "synced" when done. If it shows "error", click the provider to see the error message.

**Drift detection finds nothing after first setup.**

Drift detection compares against baselines captured during the initial sync. With no prior baseline, there's nothing to compare against. Make a change in your cloud account, wait for or trigger a resource sync, then run drift detection.

See [Troubleshooting](/self-hosting/troubleshooting) for more.
