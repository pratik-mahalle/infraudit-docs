---
title: "Secrets and Encryption"
description: "How InfraAudit encrypts cloud credentials, and best practices for managing secrets in production."
icon: "key"
---


InfraAudit encrypts cloud provider credentials at rest and uses Supabase for JWT signing. This page explains how encryption works and how to manage secrets safely in production.

## Credential encryption

When you connect a cloud account, InfraAudit encrypts the credentials (access keys, service account JSON, kubeconfig) before storing them in the database.

**Algorithm:** AES-256-GCM  
**Key source:** `ENCRYPTION_KEY` environment variable  
**Key format:** 32-byte value, hex-encoded (64 hex characters)

Generate a key:

```bash
openssl rand -hex 32
# e.g.: a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5e6f7a8b9c0d1e2
```

Every credential is encrypted with a unique random nonce prepended to the ciphertext. The `ENCRYPTION_KEY` is not stored in the database.

> If you lose `ENCRYPTION_KEY`, all stored cloud credentials become unreadable and you'll need to reconnect every provider. Back it up securely (e.g., in AWS Secrets Manager or Vault).

## JWT authentication

InfraAudit validates JWTs issued by your Supabase project using `SUPABASE_JWT_SECRET`. Requests with expired or invalid tokens return `401`.

The `SUPABASE_SERVICE_ROLE_KEY` is used server-side for privileged Supabase operations (e.g., looking up users by ID). It must remain confidential — it bypasses Supabase row-level security.

## Production secrets management

### Option 1: Docker Compose + environment variables

Don't put secrets in `.env` when the file is visible to CI or shared servers. Pass them as environment variables directly:

```bash
SUPABASE_JWT_SECRET=secret ENCRYPTION_KEY=key docker compose up -d
```

Or use Docker secrets with Swarm mode.

### Option 2: Kubernetes Secrets

Create a Kubernetes Secret and reference it in the deployment:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: infraudit-secrets
  namespace: infraudit
type: Opaque
stringData:
  SUPABASE_JWT_SECRET: "your-secret"
  ENCRYPTION_KEY: "your-key"
```

Reference in the deployment:

```yaml
envFrom:
  - secretRef:
      name: infraudit-secrets
```

### Option 3: External secrets manager

Use [External Secrets Operator](https://external-secrets.io/) to sync secrets from AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault into Kubernetes Secrets automatically.

## Rotating the encryption key

Rotating `ENCRYPTION_KEY` requires re-encrypting all stored credentials. InfraAudit does not auto-rotate credentials automatically.

Manual rotation steps:

1. Export all current provider credentials (you'll need to re-enter them after rotation).
2. Stop the API.
3. Update `ENCRYPTION_KEY` in your secrets store.
4. Start the API.
5. Re-connect each provider — InfraAudit encrypts the new credentials with the new key.

## Rotating the Supabase JWT secret

Rotating the `SUPABASE_JWT_SECRET` in Supabase invalidates all active user sessions. Update the value in `.env` at the same time.

1. In Supabase, go to **Settings → API → JWT Settings → Rotate JWT Secret**.
2. Copy the new secret.
3. Update `SUPABASE_JWT_SECRET` in `.env`.
4. Restart the API.

## Secure configuration checklist

- [ ] `ENCRYPTION_KEY` is randomized (`openssl rand -hex 32`) and not the default placeholder
- [ ] `DB_PASSWORD` is not the default `infraudit123`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not in version control
- [ ] `ENVIRONMENT=production` is set (disables Swagger UI and debug endpoints)
- [ ] `DB_SSLMODE=require` if your database is not on localhost
- [ ] `ALLOWED_ORIGINS` is set to your frontend URL, not `*`
- [ ] Metrics endpoint (`/metrics`) is protected with `METRICS_AUTH_TOKEN` if internet-exposed
