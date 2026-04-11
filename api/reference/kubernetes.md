---
title: "Kubernetes"
description: "Register clusters and list workloads via the API."
icon: "dharmachakra"
---


Base path: `/api/v1/kubernetes`

## Register cluster

```http
POST /api/v1/kubernetes/clusters
```

**Request:**

```json
{
  "name": "Production EKS",
  "kubeconfig": "apiVersion: v1\nkind: Config\n..."
}
```

**Response `201`:**

```json
{
  "id": 1,
  "name": "Production EKS",
  "status": "syncing",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## List clusters

```http
GET /api/v1/kubernetes/clusters
```

## Get cluster

```http
GET /api/v1/kubernetes/clusters/:id
```

## List namespaces

```http
GET /api/v1/kubernetes/clusters/:id/namespaces
```

## List deployments

```http
GET /api/v1/kubernetes/clusters/:id/deployments
```

**Query parameters:** `namespace`.

**Response:**

```json
[
  {
    "name": "api-deployment",
    "namespace": "production",
    "replicas": 3,
    "ready_replicas": 3,
    "image": "myapp:1.24.0"
  }
]
```

## List pods

```http
GET /api/v1/kubernetes/clusters/:id/pods
```

**Query parameters:** `namespace`.

## List services

```http
GET /api/v1/kubernetes/clusters/:id/services
```

## Delete cluster

```http
DELETE /api/v1/kubernetes/clusters/:id
```

Returns `204 No Content`. Removes credentials and stops syncing; historical data is retained.
