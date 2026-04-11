---
title: "Resources"
description: "List and inspect discovered cloud resources."
icon: "server"
---


Base path: `/api/v1/resources`

## List resources

```http
GET /api/v1/resources
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `provider_id` | integer | Filter by provider |
| `type` | string | Resource type (e.g. `ec2_instance`) |
| `region` | string | Cloud region |
| `status` | string | `active`, `stopped`, `deleted` |
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Results per page (default: 20, max: 100) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "external_id": "i-0abc123def456",
      "name": "web-server-01",
      "resource_type": "ec2_instance",
      "provider_id": 1,
      "region": "us-east-1",
      "status": "active",
      "tags": { "env": "production" },
      "last_seen_at": "2024-01-15T06:00:00Z"
    }
  ],
  "meta": {
    "total": 247,
    "page": 1,
    "per_page": 20
  }
}
```

## Get resource

```http
GET /api/v1/resources/:id
```

Returns the full resource record including the current configuration snapshot.

## Get resource configuration

```http
GET /api/v1/resources/:id/config
```

Returns the raw configuration snapshot JSON.

## List resource drifts

```http
GET /api/v1/resources/:id/drifts
```

## List resource vulnerabilities

```http
GET /api/v1/resources/:id/vulnerabilities
```

## List resource recommendations

```http
GET /api/v1/resources/:id/recommendations
```

## Get resource cost

```http
GET /api/v1/resources/:id/cost
```

**Query parameters:** `months` (default: 6) — number of months of cost history to return.
