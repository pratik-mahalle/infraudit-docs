---
title: "Vulnerabilities"
description: "List vulnerability findings and manage their status."
icon: "shield-exclamation"
---


Base path: `/api/v1/vulnerabilities`

## Trigger vulnerability scan

```http
POST /api/v1/vulnerabilities/scan
```

Starts a vulnerability scan. Optionally scoped to a provider or resource.

**Request (optional):**

```json
{
  "provider_id": 1,
  "resource_id": 42
}
```

**Response `202`:**

```json
{ "job_id": 55, "status": "running" }
```

## List vulnerabilities

```http
GET /api/v1/vulnerabilities
```

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `provider_id` | integer | Filter by provider |
| `resource_id` | integer | Filter by resource |
| `severity` | string | `critical`, `high`, `medium`, `low` |
| `status` | string | `open`, `fixed`, `ignored` |
| `cve_id` | string | Filter by CVE ID |
| `page` | integer | Page number |
| `per_page` | integer | Results per page |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "cve_id": "CVE-2024-12345",
      "severity": "critical",
      "cvss_score": 9.8,
      "package_name": "openssl",
      "installed_version": "1.1.1t",
      "fix_version": "1.1.1u",
      "resource_id": 42,
      "resource_name": "api-pod",
      "status": "open",
      "detected_at": "2024-01-15T02:00:00Z"
    }
  ],
  "meta": { "total": 8, "page": 1, "per_page": 20 }
}
```

## Get vulnerability

```http
GET /api/v1/vulnerabilities/:id
```

Returns full details including NVD description and references.

## Update vulnerability status

```http
PATCH /api/v1/vulnerabilities/:id
```

**Request:**

```json
{
  "status": "ignored",
  "reason": "Not exploitable in this deployment"
}
```

## Get vulnerability summary

```http
GET /api/v1/vulnerabilities/summary
```

Returns aggregate counts by severity and status.
