---
title: "Costs"
description: "Retrieve billing data, trends, forecasts, and cost anomalies."
icon: "circle-dollar-sign"
---


Base path: `/api/v1/costs`

## Trigger cost sync

```http
POST /api/v1/costs/sync
```

Fetches the latest billing data from all providers. Returns `202 Accepted` with a job ID.

## Get cost overview

```http
GET /api/v1/costs/overview
```

**Response:**

```json
{
  "current_month": {
    "amount": 4231.50,
    "currency": "USD",
    "from": "2024-01-01",
    "to": "2024-01-14"
  },
  "last_month": {
    "amount": 8450.00,
    "currency": "USD"
  },
  "mom_change_percent": -8.2,
  "by_provider": [
    { "provider_id": 1, "name": "AWS Production", "amount": 3800.00 },
    { "provider_id": 2, "name": "GCP Production", "amount": 431.50 }
  ]
}
```

## Get cost trend

```http
GET /api/v1/costs/trend
```

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `provider_id` | integer | all | Filter by provider |
| `days` | integer | 30 | Number of days of history |
| `granularity` | string | `day` | `day`, `week`, or `month` |
| `group_by` | string | `provider` | `provider`, `service`, or `region` |

**Response:**

```json
{
  "data": [
    { "date": "2024-01-14", "amount": 285.40, "breakdown": { "EC2": 180, "S3": 45, "RDS": 60.40 } }
  ]
}
```

## Get forecast

```http
GET /api/v1/costs/forecast
```

**Query parameters:** `days` (30, 60, or 90), `provider_id`.

**Response:**

```json
{
  "forecast_days": 30,
  "projected_total": 8750.00,
  "confidence_interval": { "low": 7900, "high": 9600 },
  "daily": [
    { "date": "2024-01-15", "amount": 291.67, "lower": 260, "upper": 320 }
  ]
}
```

## List cost anomalies

```http
GET /api/v1/costs/anomalies
```

**Query parameters:** `provider_id`, `days`, `status` (`active`, `dismissed`).

## Dismiss anomaly

```http
POST /api/v1/costs/anomalies/:id/dismiss
```

**Request:**

```json
{ "reason": "Planned migration" }
```
