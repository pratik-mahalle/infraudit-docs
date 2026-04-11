---
title: "Monitoring"
description: "Set up Prometheus metrics and Grafana dashboards for your InfraAudit deployment."
icon: "chart-bar"
---


InfraAudit exposes a Prometheus-compatible `/metrics` endpoint. The Docker Compose monitoring profile includes a pre-configured Prometheus scraper and Grafana dashboards.

## Enabling the monitoring profile

```bash
docker compose --profile monitoring up -d
```

This adds two containers:

| Container | Port | Purpose |
|---|---|---|
| `prometheus` | 9090 | Scrapes `/metrics` every 15 seconds |
| `grafana` | 3000 | Dashboard UI |

Grafana default credentials: `admin` / `admin`. Change the password on first login.

## Available metrics

InfraAudit exposes metrics under the `infraudit_` prefix:

### HTTP

| Metric | Type | Labels | Description |
|---|---|---|---|
| `infraudit_http_requests_total` | Counter | `method`, `path`, `status` | Total HTTP requests |
| `infraudit_http_request_duration_seconds` | Histogram | `method`, `path` | Request latency |

### Jobs

| Metric | Type | Labels | Description |
|---|---|---|---|
| `infraudit_job_executions_total` | Counter | `job_type`, `status` | Job execution count by type and status |
| `infraudit_job_duration_seconds` | Histogram | `job_type` | Job execution duration |
| `infraudit_job_last_success_timestamp` | Gauge | `job_type` | UNIX timestamp of last successful run |

### Infrastructure findings

| Metric | Type | Labels | Description |
|---|---|---|---|
| `infraudit_drifts_total` | Gauge | `severity`, `status` | Current drift count by severity and status |
| `infraudit_vulnerabilities_total` | Gauge | `severity`, `status` | Current vulnerability count |
| `infraudit_alerts_open_total` | Gauge | `severity`, `type` | Open alert count |
| `infraudit_providers_total` | Gauge | `type`, `status` | Connected provider count |
| `infraudit_resources_total` | Gauge | `provider_type` | Discovered resource count |

### Database

| Metric | Type | Description |
|---|---|---|
| `infraudit_db_connections_open` | Gauge | Open DB connections |
| `infraudit_db_connections_idle` | Gauge | Idle DB connections |
| `infraudit_db_query_duration_seconds` | Histogram | Query execution time |

## Accessing the raw metrics

```bash
curl http://localhost:8080/metrics
```

To restrict access to the metrics endpoint in production:

```env
METRICS_AUTH_TOKEN=your-secret-token
```

Then pass the token when scraping:

```bash
curl http://localhost:8080/metrics -H "Authorization: Bearer your-secret-token"
```

## Grafana dashboards

The pre-built Grafana dashboard includes panels for:

- Active drifts by severity (last 24 hours)
- Open vulnerabilities by severity
- HTTP request rate and error rate
- Job success/failure over time
- DB connection pool saturation
- Resource discovery count by provider

Import the dashboard from `deployments/grafana/infraudit-dashboard.json` if you're using an existing Grafana instance.

## Alerting

Set up Grafana alerts for:

- **Job failures:** `rate(infraudit_job_executions_total{status="failed"}[1h]) > 0`
- **High drift count:** `infraudit_drifts_total{severity="critical"} > 0`
- **API errors:** `rate(infraudit_http_requests_total{status=~"5.."}[5m]) > 0.01`

Route Grafana alerts to the same Slack channel or PagerDuty as your InfraAudit alerts.

## Prometheus configuration (external)

If you already have a Prometheus instance, add this scrape config:

```yaml
scrape_configs:
  - job_name: infraudit
    static_configs:
      - targets: ["infraudit-api:8080"]
    metrics_path: /metrics
    bearer_token: "your-metrics-auth-token"  # if METRICS_AUTH_TOKEN is set
```
