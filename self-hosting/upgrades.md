---
title: "Upgrades"
description: "How to update InfraAudit to a new release without losing data."
icon: "arrow-up"
---


InfraAudit uses semantic versioning. Minor and patch releases are backward compatible. Major releases may include breaking changes documented in the [Changelog](/resources/changelog).

## Before upgrading

1. **Read the changelog** for the target version — look for migration notes, breaking changes, or required configuration updates.
2. **Back up your database.** See [Backups](/self-hosting/backups).
3. **Note your current version.** Check the running version:

```bash
docker compose exec api ./infraudit-api --version
# InfraAudit v1.2.3
```

## Docker Compose upgrade

Pull the new images and restart:

```bash
# Pull the latest images
docker compose pull

# Restart containers (API handles migrations on startup)
docker compose up -d
```

Watch the API logs during startup to verify migrations ran:

```bash
docker compose logs -f api
```

Expected output:

```
api_1  | Running database migrations...
api_1  | Migration 0012_add_anomaly_table.up.sql applied
api_1  | All migrations applied successfully
api_1  | InfraAudit API starting on :8080
```

If migrations fail, the API will exit with a non-zero code. Check the log for the SQL error and consult the relevant migration file in `internal/database/migrations/`.

## Kubernetes upgrade

Update the image tag in your deployment manifest:

```yaml
# api-deployment.yaml
spec:
  containers:
    - name: api
      image: ghcr.io/pratik-mahalle/infraudit-go:v1.3.0  # update this
```

Apply and wait for rollout:

```bash
kubectl apply -f deployments/kubernetes/api-deployment.yaml
kubectl rollout status deployment/infraudit-api -n infraudit
```

Kubernetes performs a rolling update, keeping old pods running until the new ones pass readiness checks. If a migration fails, the new pod will fail its readiness check and Kubernetes will not route traffic to it — old pods continue serving.

## Downgrading

Downgrading is only supported within the same minor version (e.g. v1.3.2 → v1.3.0). Cross-minor downgrades require running `down` migrations, which may be destructive.

To downgrade:

1. Roll back the image to the previous version.
2. Manually run the down migrations for any files applied during the upgrade:

```bash
docker compose exec api go run ./cmd/migrate down 1  # one migration at a time
```

## Version pinning

For production deployments, pin to a specific image tag rather than `latest`:

```yaml
image: ghcr.io/pratik-mahalle/infraudit-go:v1.3.0
```

This gives you control over when to upgrade and prevents unexpected changes from automatic image pulls.

## Upgrade schedule

There is no forced upgrade schedule. InfraAudit does not phone home or require license renewals. Upgrade at your own pace, but staying within one major version of the latest release is recommended to keep security patches current.
