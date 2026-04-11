---
title: "Webhook Events"
description: "All event types InfraAudit can send to registered webhook endpoints, with payload schemas."
icon: "webhook"
---


Every webhook delivery shares a common envelope. The `data` field contains event-specific payload.

## Common envelope

```json
{
  "event": "drift.detected",
  "timestamp": "2024-01-15T14:30:00Z",
  "webhook_id": "wh_abc123",
  "delivery_id": "del_xyz789",
  "data": { ... }
}
```

## Event types

### `drift.detected`

Fired when a new drift finding is created.

```json
{
  "event": "drift.detected",
  "data": {
    "drift_id": 55,
    "drift_type": "security",
    "severity": "critical",
    "resource_id": 5,
    "resource_name": "data-lake-bucket",
    "resource_type": "s3_bucket",
    "provider_id": 1,
    "summary": "BlockPublicAcls changed from true to false",
    "detected_at": "2024-01-15T14:30:00Z"
  }
}
```

### `drift.resolved`

```json
{
  "event": "drift.resolved",
  "data": {
    "drift_id": 55,
    "resolved_by": 1,
    "resolved_at": "2024-01-15T15:00:00Z"
  }
}
```

### `alert.created`

```json
{
  "event": "alert.created",
  "data": {
    "alert_id": 12,
    "title": "S3 bucket made public",
    "type": "security",
    "severity": "critical",
    "resource_id": 5,
    "resource_name": "data-lake-bucket",
    "created_at": "2024-01-15T14:31:00Z"
  }
}
```

### `vulnerability.found`

```json
{
  "event": "vulnerability.found",
  "data": {
    "vulnerability_id": 8,
    "cve_id": "CVE-2024-12345",
    "severity": "critical",
    "cvss_score": 9.8,
    "package_name": "openssl",
    "fix_version": "1.1.1u",
    "resource_id": 42,
    "resource_name": "api-pod"
  }
}
```

### `compliance.violation`

```json
{
  "event": "compliance.violation",
  "data": {
    "assessment_id": 3,
    "framework_id": "cis-aws",
    "control_id": "cis-aws-2.1.1",
    "control_title": "Ensure S3 encryption-at-rest",
    "severity": "high",
    "failed_resources": [
      { "resource_id": 5, "resource_name": "data-lake-bucket" }
    ]
  }
}
```

### `cost.anomaly`

```json
{
  "event": "cost.anomaly",
  "data": {
    "anomaly_id": 2,
    "provider_id": 1,
    "date": "2024-01-14",
    "actual_amount": 452.30,
    "expected_amount": 290.00,
    "deviation_percent": 56.0,
    "currency": "USD"
  }
}
```

### `job.completed`

```json
{
  "event": "job.completed",
  "data": {
    "job_id": 1,
    "job_type": "drift_detection",
    "execution_id": 88,
    "status": "succeeded",
    "duration_ms": 222000,
    "findings_count": 3
  }
}
```

### `remediation.completed`

```json
{
  "event": "remediation.completed",
  "data": {
    "remediation_id": 1,
    "status": "completed",
    "resource_id": 5,
    "resource_name": "data-lake-bucket",
    "executed_by": 1,
    "executed_at": "2024-01-15T15:00:00Z"
  }
}
```

### `ping`

Sent when you create a new webhook or click **Send test message**. Use it to verify the endpoint is reachable:

```json
{
  "event": "ping",
  "data": {
    "webhook_id": "wh_abc123",
    "message": "Webhook endpoint verified"
  }
}
```
