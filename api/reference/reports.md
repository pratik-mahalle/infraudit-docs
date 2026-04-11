---
title: "Reports"
description: "Generate and download scan reports in PDF or CSV format."
icon: "file-text"
---


Base path: `/api/reports`

## Generate report

```http
POST /api/reports/generate
```

**Request:**

```json
{
  "type": "drift_summary",
  "provider_id": 1,
  "from": "2024-01-01",
  "to": "2024-01-31",
  "format": "pdf"
}
```

Valid types: `drift_summary`, `vulnerability_report`, `compliance_assessment`, `cost_report`.
Valid formats: `pdf`, `csv`.

**Response `202`:**

```json
{
  "report_id": "rpt_abc123",
  "status": "generating",
  "estimated_seconds": 15
}
```

## Get report status

```http
GET /api/reports/:id
```

**Response when complete:**

```json
{
  "report_id": "rpt_abc123",
  "status": "ready",
  "download_url": "/api/reports/rpt_abc123/download",
  "expires_at": "2024-01-16T10:00:00Z"
}
```

## Download report

```http
GET /api/reports/:id/download
```

Returns the report file. Content-Type is `application/pdf` or `text/csv` depending on the format requested.

The download link expires after 24 hours.

## List recent reports

```http
GET /api/reports
```

Returns reports generated in the last 30 days.

**Query parameters:** `type`, `status` (`generating`, `ready`, `failed`).
