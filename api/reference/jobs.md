---
title: "Jobs"
description: "Manage scheduled jobs and view execution history."
icon: "clock"
---


Base path: `/api/v1/jobs`

## List jobs

```http
GET /api/v1/jobs
```

**Response:**

```json
[
  {
    "id": 1,
    "type": "drift_detection",
    "schedule": "0 */4 * * *",
    "enabled": true,
    "last_execution_status": "succeeded",
    "last_run_at": "2024-01-15T08:00:00Z",
    "next_run_at": "2024-01-15T12:00:00Z"
  }
]
```

## Get job

```http
GET /api/v1/jobs/:id
```

## Trigger job

```http
POST /api/v1/jobs/:id/trigger
```

Runs the job immediately regardless of its schedule.

**Response `202`:**

```json
{
  "execution_id": 88,
  "status": "running",
  "started_at": "2024-01-15T10:30:00Z"
}
```

## List executions

```http
GET /api/v1/jobs/:id/executions
```

**Query parameters:** `page`, `per_page`, `status` (`running`, `succeeded`, `failed`).

**Response:**

```json
{
  "data": [
    {
      "id": 88,
      "job_id": 1,
      "status": "succeeded",
      "started_at": "2024-01-15T08:00:00Z",
      "ended_at": "2024-01-15T08:03:42Z",
      "duration_ms": 222000,
      "findings_count": 3
    }
  ]
}
```

## Get execution detail

```http
GET /api/v1/jobs/:id/executions/:execution_id
```

Returns the full execution record including the log excerpt.
