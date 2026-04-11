---
title: "Recommendations"
description: "Generate and manage AI-powered recommendations."
icon: "sparkles"
---


Base path: `/api/v1/recommendations`

## List recommendations

```http
GET /api/v1/recommendations
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `type` | string | `cost`, `security`, or `performance` |
| `status` | string | `pending`, `applied`, `dismissed` |
| `resource_id` | integer | Filter by resource |
| `provider_id` | integer | Filter by provider |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "type": "cost",
      "title": "Downsize overprovisioned EC2 instance",
      "description": "Instance web-server-01 uses 8% average CPU over 30 days. Downsizing from t3.large to t3.small saves approximately $42/month.",
      "estimated_monthly_savings": 42.00,
      "resource_id": 15,
      "resource_name": "web-server-01",
      "status": "pending",
      "created_at": "2024-01-15T04:30:00Z"
    }
  ],
  "meta": { "total": 8, "page": 1, "per_page": 20 }
}
```

## Get recommendation

```http
GET /api/v1/recommendations/:id
```

Returns full details including step-by-step remediation instructions.

## Generate recommendation

```http
POST /api/v1/recommendations/generate
```

**Request:**

```json
{
  "resource_id": 15
}
```

Returns the new recommendation record or updates an existing pending one.

## Apply recommendation

```http
POST /api/v1/recommendations/:id/apply
```

Marks the recommendation as applied and optionally creates a remediation action.

## Dismiss recommendation

```http
POST /api/v1/recommendations/:id/dismiss
```

**Request (optional):**

```json
{ "reason": "Not applicable — instance is reserved" }
```
