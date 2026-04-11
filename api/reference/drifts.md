---
title: "Drifts"
description: "Trigger drift detection, list findings, and manage drift status."
icon: "radar"
---


Base path: `/api/v1/drifts`

## Trigger drift detection

```http
POST /api/v1/drifts/detect
```

Starts a drift detection scan across all providers. Returns immediately with a job ID.

**Response `202`:**

```json
{
  "job_id": 42,
  "status": "running",
  "message": "Drift detection scan started"
}
```

## List drifts

```http
GET /api/v1/drifts
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `provider_id` | integer | Filter by provider |
| `resource_id` | integer | Filter by resource |
| `severity` | string | `critical`, `high`, `medium`, `low` |
| `type` | string | `configuration`, `security`, `compliance` |
| `status` | string | `detected`, `investigating`, `resolved` |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "resource_id": 15,
      "resource_name": "my-bucket",
      "resource_type": "s3_bucket",
      "drift_type": "security",
      "severity": "critical",
      "status": "detected",
      "summary": "S3 bucket BlockPublicAcls changed from true to false",
      "baseline_value": true,
      "current_value": false,
      "detected_at": "2024-01-15T14:30:00Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "per_page": 20 }
}
```

## Get drift

```http
GET /api/v1/drifts/:id
```

Returns the full drift record including the JSON diff between baseline and current configuration.

## Update drift status

```http
PATCH /api/v1/drifts/:id
```

**Request:**

```json
{
  "status": "investigating"
}
```

Valid status transitions: `detected → investigating → resolved`.

## Resolve drift

```http
POST /api/v1/drifts/:id/resolve
```

Marks the drift as resolved. Optionally captures a new baseline:

```json
{
  "capture_baseline": true
}
```

## Get drift summary

```http
GET /api/v1/drifts/summary
```

Returns aggregate drift counts by severity and status.

```json
{
  "total": 12,
  "by_severity": {
    "critical": 1,
    "high": 4,
    "medium": 5,
    "low": 2
  },
  "by_status": {
    "detected": 8,
    "investigating": 3,
    "resolved": 1
  }
}
```
