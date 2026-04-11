---
title: "Compliance"
description: "Manage compliance frameworks, run assessments, and retrieve results."
icon: "clipboard-check"
---


Base path: `/api/v1/compliance`

## List frameworks

```http
GET /api/v1/compliance/frameworks
```

Returns all available frameworks.

**Response:**

```json
[
  { "id": "cis-aws", "name": "CIS AWS Foundations Benchmark", "version": "2.0", "enabled": true },
  { "id": "soc2", "name": "SOC 2 Type II", "version": null, "enabled": false }
]
```

## Enable framework

```http
POST /api/v1/compliance/frameworks/:framework_id/enable
```

**Request (optional):**

```json
{ "provider_ids": [1, 2] }
```

If `provider_ids` is omitted, all connected providers are in scope.

## Disable framework

```http
DELETE /api/v1/compliance/frameworks/:framework_id/enable
```

## Run assessment

```http
POST /api/v1/compliance/assess
```

**Request (optional):**

```json
{
  "framework_id": "cis-aws",
  "provider_id": 1
}
```

If no body, runs all enabled frameworks against all providers.

**Response `202`:**

```json
{ "job_id": 67, "status": "running" }
```

## List assessments

```http
GET /api/v1/compliance/assessments
```

**Query parameters:** `framework_id`, `provider_id`, `page`, `per_page`.

## Get assessment

```http
GET /api/v1/compliance/assessments/:id
```

Returns the full assessment including all control results.

**Response:**

```json
{
  "id": 1,
  "framework_id": "cis-aws",
  "provider_id": 1,
  "score": 0.724,
  "total_controls": 58,
  "passed": 42,
  "failed": 16,
  "created_at": "2024-01-15T04:00:00Z",
  "controls": [
    {
      "id": "cis-aws-2.1.1",
      "category": "Storage",
      "title": "Ensure S3 encryption-at-rest",
      "severity": "high",
      "status": "failed",
      "failed_resources": [
        { "resource_id": 5, "name": "data-lake-bucket" }
      ]
    }
  ]
}
```

## Export assessment

```http
GET /api/v1/compliance/assessments/:id/export
```

**Query parameters:** `format` (`pdf` or `csv`).

Returns the file with the appropriate content type (`application/pdf` or `text/csv`).
