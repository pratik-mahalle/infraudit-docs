---
title: "Endpoint Reference"
description: "All InfraAudit REST API endpoints grouped by feature area."
icon: "list"
---

# Endpoint reference

All endpoints require `Authorization: Bearer <token>` unless noted. See [Authentication](/api/authentication) for how to get a token.

The canonical source of truth is the auto-generated OpenAPI spec at `/swagger/index.html`. Each page below summarizes the endpoint group and links to the relevant Swagger tags.

## Endpoint groups

| Group | Base path | Description |
|---|---|---|
| [Auth](/api/reference/auth) | `/api/v1/auth` | User profile, token refresh |
| [Providers](/api/reference/providers) | `/api/v1/providers` | Connect, sync, disconnect cloud accounts |
| [Resources](/api/reference/resources) | `/api/v1/resources` | Cloud resource inventory |
| [Drifts](/api/reference/drifts) | `/api/v1/drifts` | Configuration drift detection |
| [Baselines](/api/reference/baselines) | `/api/v1/baselines` | Resource configuration snapshots |
| [Vulnerabilities](/api/reference/vulnerabilities) | `/api/v1/vulnerabilities` | CVE scanning results |
| [IaC](/api/reference/iac) | `/api/v1/iac` | Infrastructure-as-Code upload and drift |
| [Costs](/api/reference/costs) | `/api/v1/costs` | Billing ingest, trends, forecasts |
| [Compliance](/api/reference/compliance) | `/api/v1/compliance` | Framework assessments |
| [Kubernetes](/api/reference/kubernetes) | `/api/v1/kubernetes` | Cluster and workload management |
| [Recommendations](/api/reference/recommendations) | `/api/v1/recommendations` | AI-generated suggestions |
| [Alerts](/api/reference/alerts) | `/api/v1/alerts` | Alert management |
| [Anomalies](/api/reference/anomalies) | `/api/v1/anomalies` | Cost and performance anomalies |
| [Jobs](/api/reference/jobs) | `/api/v1/jobs` | Scheduled job management |
| [Remediation](/api/reference/remediation) | `/api/v1/remediation` | Fix execution and rollback |
| [Notifications](/api/reference/notifications) | `/api/v1/notifications` | Channel preferences and history |
| [Webhooks](/api/reference/webhooks) | `/api/v1/webhooks` | Outbound webhook subscriptions |
| [Reports](/api/reference/reports) | `/api/reports` | Scan report generation and download |
| [Billing](/api/reference/billing) | `/api/v1/billing` | Subscription and plan management |
| [Settings](/api/reference/settings) | `/api/v1/settings` | API keys and team members |
