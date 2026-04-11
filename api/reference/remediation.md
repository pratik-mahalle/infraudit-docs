---
title: "Remediation"
description: "Create, approve, execute, and roll back remediation actions."
icon: "wrench"
---


Base path: `/api/v1/remediation`

## List remediation actions

```http
GET /api/v1/remediation
```

**Query parameters:** `status`, `resource_id`, `provider_id`, `page`, `per_page`.

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Enable S3 server-side encryption",
      "resource_id": 5,
      "resource_name": "data-lake-bucket",
      "finding_type": "drift",
      "finding_id": 12,
      "status": "pending_approval",
      "risk": "low",
      "created_at": "2024-01-15T14:40:00Z"
    }
  ]
}
```

## Get remediation action

```http
GET /api/v1/remediation/:id
```

Returns full details including pre-execution snapshot and estimated risk.

## Create remediation

```http
POST /api/v1/remediation
```

**Request:**

```json
{
  "finding_type": "drift",
  "finding_id": 12
}
```

## Approve

```http
POST /api/v1/remediation/:id/approve
```

**Request (optional):**

```json
{ "comment": "Approved — coordinated with infra team" }
```

## Execute

```http
POST /api/v1/remediation/:id/execute
```

Requires status `approved`. Executes the fix against the cloud provider API.

**Response `202`:**

```json
{ "status": "executing", "started_at": "2024-01-15T15:00:00Z" }
```

## Rollback

```http
POST /api/v1/remediation/:id/rollback
```

Available within the rollback window after `completed` status. Reverses the change.

## Reject

```http
POST /api/v1/remediation/:id/reject
```

**Request (optional):**

```json
{ "reason": "Change not approved by change management" }
```
