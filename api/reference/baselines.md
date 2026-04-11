---
title: "Baselines"
description: "Create, list, and manage resource configuration baselines."
icon: "bookmark"
---


Base path: `/api/v1/baselines`

## Create baseline

```http
POST /api/v1/baselines
```

Captures the current configuration of a resource as a new baseline.

**Request:**

```json
{
  "resource_id": 15
}
```

**Response `201`:**

```json
{
  "id": 7,
  "resource_id": 15,
  "configuration": { ...current resource config... },
  "captured_at": "2024-01-15T14:00:00Z",
  "created_by": 1
}
```

## List baselines

```http
GET /api/v1/baselines
```

**Query parameters:** `resource_id` (required).

## Get baseline

```http
GET /api/v1/baselines/:id
```

## Compare baselines

```http
GET /api/v1/baselines/:id/compare/:other_id
```

Returns a JSON diff between two baselines for the same resource.

**Response:**

```json
{
  "baseline_a": 5,
  "baseline_b": 7,
  "diff": [
    {
      "path": "encryption.enabled",
      "baseline_a_value": true,
      "baseline_b_value": false
    }
  ]
}
```

## Delete baseline

```http
DELETE /api/v1/baselines/:id
```

Returns `204 No Content`. Cannot delete the only baseline for a resource with drift detection enabled.
