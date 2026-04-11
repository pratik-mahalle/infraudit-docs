---
title: "Cost Optimization"
description: "Understand your cloud spend, spot anomalies, and act on savings recommendations."
icon: "circle-dollar-sign"
---


The Cost section ingests billing data from all connected cloud providers and surfaces trends, forecasts, anomalies, and savings recommendations in one view.

## Supported billing sources

| Provider | Data source |
|---|---|
| **AWS** | Cost Explorer API (`GetCostAndUsage`, `GetCostForecast`) |
| **GCP** | BigQuery billing export |
| **Azure** | Cost Management API |

Billing data syncs daily by default. Force an immediate sync from the UI (**Cost → Sync billing data**) or CLI:

```bash
infraudit cost sync
```

## Cost overview

The overview page shows:

- **This month** — estimated spend to date
- **Last month** — final spend
- **Forecast** — projected spend for the rest of the month
- **MoM change** — month-over-month percentage delta

Below the summary cards, a line chart shows daily spend for the last 30 days, broken down by provider.

## Trends

The **Trends** tab lets you explore historical spend:

- Filter by provider, service, and region
- Choose a time window: last 7 days, 30 days, 90 days, or custom range
- Group by provider, service, resource, or tag
- Toggle between daily, weekly, and monthly granularity

## Forecasting

InfraAudit generates 30-, 60-, and 90-day cost forecasts using the billing history from each cloud provider's native forecasting API. The forecast confidence interval is shown as a shaded range on the chart.

Forecasts are most accurate after 3 to 4 weeks of billing history. On a fresh connection, the forecast uses industry averages as a starting point.

## Anomaly detection

InfraAudit flags cost anomalies — days where spend significantly exceeds the expected range based on historical patterns.

An anomaly appears as a spike marker on the trend chart. Click it to see:

- How much over expected the day was
- Which services drove the increase
- A link to the affected resources

Anomaly alerts can be routed to Slack or email. See [Alerts](/platform/alerts).

## Savings recommendations

The **Recommendations** tab in the Cost section shows resource-level savings opportunities:

| Type | Description |
|---|---|
| **Right-sizing** | Instance types that are overprovisioned for their actual CPU/memory usage |
| **Reserved Instances** | On-demand instances running long enough to benefit from 1-year or 3-year RIs |
| **Spot migration** | Workloads suitable for Spot/Preemptible instances (fault-tolerant, interruptible) |
| **Idle resources** | Instances, volumes, or load balancers with near-zero utilization for 7+ days |
| **Unattached volumes** | EBS volumes, GCP disks, or Azure managed disks with no attached instance |

Each recommendation shows an estimated monthly savings and the specific resource to act on.

## CLI

```bash
# Cost overview
infraudit cost overview

# Trend by provider and service
infraudit cost trend --provider 1 --days 30

# 30-day forecast
infraudit cost forecast --days 30

# List anomalies
infraudit cost anomalies

# Savings recommendations
infraudit recommendation list --type cost
```

## Next steps

- [Recommendations](/platform/recommendations) — act on AI-generated suggestions
- [Concepts: Cost forecasting](/concepts/cost-forecasting)
- [Concepts: Anomaly detection](/concepts/anomaly-detection)
- [CLI: cost commands](/cli/commands/cost)
