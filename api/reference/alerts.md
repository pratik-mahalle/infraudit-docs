---
title: "Alerts"
description: "List, acknowledge, and resolve alert findings."
icon: "bell"
---


Base path: `/api/v1/alerts`

## List alerts

```http
GET /api/v1/alerts
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `severity` | string | `critical`, `high`, `medium`, `low` |
| `type` | string | `security`, `cost`, `compliance`, `performance` |
| `status` | string | `open`, `acknowledged`, `resolved` |
| `provider_id` | integer | Filter by provider |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "S3 bucket made public",
      "type": "security",
      "severity": "critical",
      "status": "open",
      "resource_id": 5,
      "resource_name": "data-lake-bucket",
      "created_at": "2024-01-15T14:35:00Z"
    }
  ],
  "meta": { "total": 7, "page": 1, "per_page": 20 }
}
```

## Get alert

```http
GET /api/v1/alerts/:id
```

## Create alert (manual)

```http
POST /api/v1/alerts
```

**Request:**

```json
{
  "title": "Manual security review required",
  "type": "security",
  "severity": "high",
  "resource_id": 15,
  "description": "Audit requested by CISO"
}
```

## Acknowledge alert

```http
POST /api/v1/alerts/:id/acknowledge
```

Returns `200` with the updated alert.

## Resolve alert

```http
POST /api/v1/alerts/:id/resolve
```

**Request (optional):**

```json
{ "resolution_note": "Reverted security group change" }
```

## Bulk update

```http
POST /api/v1/alerts/bulk
```

**Request:**

```json
{
  "ids": [1, 2, 3],
  "action": "acknowledge"
}
```

Valid actions: `acknowledge`, `resolve`.
