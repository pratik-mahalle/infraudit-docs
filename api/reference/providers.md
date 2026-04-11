---
title: "Providers"
description: "Connect, list, sync, and disconnect cloud provider accounts."
icon: "plug"
---


Base path: `/api/v1/providers`

All endpoints require `Authorization: Bearer <token>`.

## Connect AWS

```http
POST /api/v1/providers/aws/connect
```

**Request:**

```json
{
  "name": "Production AWS",
  "accessKeyId": "AKIA...",
  "secretAccessKey": "...",
  "region": "us-east-1"
}
```

**Response `201`:**

```json
{
  "id": 1,
  "name": "Production AWS",
  "type": "aws",
  "status": "syncing",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## Connect GCP

```http
POST /api/v1/providers/gcp/connect
```

**Request:**

```json
{
  "name": "GCP Production",
  "serviceAccountJson": "{ \"type\": \"service_account\", ... }",
  "projectId": "my-project",
  "billingDataset": "billing_export"
}
```

## Connect Azure

```http
POST /api/v1/providers/azure/connect
```

**Request:**

```json
{
  "name": "Azure Production",
  "clientId": "...",
  "clientSecret": "...",
  "tenantId": "...",
  "subscriptionId": "..."
}
```

## Connect Kubernetes

```http
POST /api/v1/providers/kubernetes/connect
```

**Request:**

```json
{
  "name": "Production EKS",
  "kubeconfig": "apiVersion: v1\nkind: Config\n..."
}
```

## List providers

```http
GET /api/v1/providers
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Production AWS",
    "type": "aws",
    "status": "synced",
    "resource_count": 247,
    "last_synced_at": "2024-01-15T06:00:00Z"
  }
]
```

## Get provider

```http
GET /api/v1/providers/:id
```

## Sync provider

```http
POST /api/v1/providers/:id/sync
```

Triggers an immediate resource sync. Returns `202 Accepted`.

## Disconnect provider

```http
DELETE /api/v1/providers/:id
```

Removes credentials but retains historical data. Returns `204 No Content`.
