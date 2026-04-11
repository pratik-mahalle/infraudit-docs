---
title: "Kubernetes"
description: "Deploy InfraAudit on Kubernetes using the manifests under deployments/kubernetes/."
icon: "dharmachakra"
---


InfraAudit ships Kubernetes manifests under `deployments/kubernetes/` in the main repo. This page walks through a production-grade deployment.

## Prerequisites

- Kubernetes 1.24+ cluster
- `kubectl` configured to target the cluster
- A Supabase project — see [Supabase setup](/self-hosting/supabase-setup)
- A PostgreSQL instance (RDS, CloudSQL, Azure Database, or self-managed) — or deploy the Postgres manifest from the repo
- (Optional) Redis — the cache degrades gracefully if unavailable

## Directory structure

```
deployments/kubernetes/
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── postgres-deployment.yaml   # optional: in-cluster Postgres
├── redis-deployment.yaml
├── api-deployment.yaml
├── api-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
└── ingress.yaml
```

## Step 1: Create the namespace

```bash
kubectl apply -f deployments/kubernetes/namespace.yaml
```

This creates the `infraudit` namespace.

## Step 2: Create the secret

Copy `deployments/kubernetes/secret.yaml.example` to `secret.yaml` and fill in the values:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: infraudit-secrets
  namespace: infraudit
type: Opaque
stringData:
  SUPABASE_URL: "https://xxxxxxxxxxxxxx.supabase.co"
  SUPABASE_JWT_SECRET: "your-jwt-secret"
  SUPABASE_ANON_KEY: "eyJhbGciOi..."
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOi..."
  DB_PASSWORD: "your-postgres-password"
  ENCRYPTION_KEY: "your-32-byte-hex-key"
  GEMINI_API_KEY: ""
```

Apply it:

```bash
kubectl apply -f deployments/kubernetes/secret.yaml
```

> Do not commit `secret.yaml` to source control. Use a secrets manager (AWS Secrets Manager, Vault, Sealed Secrets) for production.

## Step 3: Apply the ConfigMap

```bash
kubectl apply -f deployments/kubernetes/configmap.yaml
```

Edit the ConfigMap first to set your `FRONTEND_URL`, `SERVER_PORT`, and `ENVIRONMENT`.

## Step 4: Deploy Postgres and Redis

If you're using an external database, skip `postgres-deployment.yaml`. Otherwise:

```bash
kubectl apply -f deployments/kubernetes/postgres-deployment.yaml
kubectl apply -f deployments/kubernetes/redis-deployment.yaml
```

Wait for both to be ready before deploying the API.

## Step 5: Deploy the API

```bash
kubectl apply -f deployments/kubernetes/api-deployment.yaml
kubectl apply -f deployments/kubernetes/api-service.yaml
```

Check the rollout:

```bash
kubectl rollout status deployment/infraudit-api -n infraudit
```

Test the health endpoint from inside the cluster:

```bash
kubectl run test --rm -it --image=curlimages/curl --restart=Never -n infraudit \
  -- curl http://infraudit-api:8080/healthz
```

## Step 6: Deploy the frontend

```bash
kubectl apply -f deployments/kubernetes/frontend-deployment.yaml
kubectl apply -f deployments/kubernetes/frontend-service.yaml
```

## Step 7: Configure ingress

Edit `ingress.yaml` to set your hostname and TLS secret, then apply:

```bash
kubectl apply -f deployments/kubernetes/ingress.yaml
```

The default ingress assumes an nginx ingress controller and cert-manager for TLS. Adjust the annotations if you use Traefik or another controller.

## Resource limits

The default manifests set conservative resource limits. Adjust them based on your resource count and scan frequency:

| Container | Requests | Limits |
|---|---|---|
| `api` | 256Mi / 100m | 1Gi / 500m |
| `frontend` | 64Mi / 50m | 256Mi / 200m |
| `postgres` | 512Mi / 200m | 2Gi / 1000m |
| `redis` | 64Mi / 50m | 256Mi / 100m |

## Scaling

The API is stateless (sessions are in Supabase, shared state in Redis). Scale horizontally:

```bash
kubectl scale deployment infraudit-api --replicas=3 -n infraudit
```

The frontend is also stateless. The Postgres deployment is not designed for horizontal scaling — use a managed database for high availability.

## Next steps

- [Configuration reference](/self-hosting/configuration)
- [Monitoring](/self-hosting/monitoring)
- [Upgrades](/self-hosting/upgrades)
