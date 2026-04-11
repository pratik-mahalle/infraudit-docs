---
title: "Anomalies"
description: "List and manage cost and performance anomalies."
icon: "triangle-alert"
---


Base path: `/api/v1/anomalies`

## List anomalies

```http
GET /api/v1/anomalies
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `provider_id` | integer | Filter by provider |
| `type` | string | `cost` or `performance` |
| `status` | string | `active` or `dismissed` |
| `days` | integer | Look back N days (default: 30) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "type": "cost",
      "provider_id": 1,
      "date": "2024-01-14",
      "actual_amount": 452.30,
      "expected_amount": 290.00,
      "expected_upper": 377.00,
      "deviation_percent": 56.0,
      "top_services": [
        { "service": "EC2", "amount": 380.00, "vs_expected": 180.00 }
      ],
      "status": "active",
      "detected_at": "2024-01-15T03:30:00Z"
    }
  ]
}
```

## Get anomaly

```http
GET /api/v1/anomalies/:id
```

## Dismiss anomaly

```http
POST /api/v1/anomalies/:id/dismiss
```

**Request:**

```json
{ "reason": "Planned deployment caused spend increase" }
```
