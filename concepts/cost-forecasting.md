---
title: "Cost Forecasting"
description: "How InfraAudit ingests billing data and generates cost forecasts."
icon: "chart-line"
---


InfraAudit ingests billing data from each connected cloud provider and generates forecasts for the next 30, 60, or 90 days. This page explains how ingest and forecasting work.

## Billing data ingest

Each cloud provider has a different billing API:

| Provider | Source | Granularity |
|---|---|---|
| AWS | Cost Explorer (`GetCostAndUsage`) | Daily |
| GCP | BigQuery billing export table | Daily |
| Azure | Cost Management API | Daily |

The cost sync job runs daily (default: `0 3 * * *`) and pulls the previous day's finalized billing data. Intraday estimates are available for AWS via Cost Explorer's `GetCostAndUsageWithResources` but are not yet shown in the current UI.

**AWS note:** Cost Explorer data has a 24-hour lag. Data for day D is available by ~08:00 UTC on day D+1.

**GCP note:** BigQuery billing export requires setup. See [Integrations: GCP](/integrations/gcp). Once configured, data appears within 2–4 hours of the billing period.

## Data model

Cost data is stored at the daily grain:

```
cost_records
  provider_id    → which cloud account
  date           → YYYY-MM-DD
  service        → "EC2", "S3", "Cloud Run", etc.
  amount         → decimal
  currency       → "USD"
  region         → optional
  resource_id    → optional (linked to resource table)
```

Resource-level attribution is available for AWS via tag-based Cost Allocation Tags and for GCP via the BigQuery export's `resource.global_name`.

## Forecasting methodology

InfraAudit uses two layers of forecasting:

### Layer 1: Provider-native forecast

For AWS and Azure, the forecast is sourced from the provider's own forecasting API:
- **AWS:** `GetCostForecast` with a 90-day horizon and daily granularity
- **Azure:** Cost Management forecast API

These forecasts use the provider's proprietary models trained on your account's historical data. InfraAudit caches the results and displays them as the primary forecast.

### Layer 2: InfraAudit trend model

For GCP (which doesn't have a native forecasting API) and as a secondary validation for AWS/Azure, InfraAudit runs a simple linear trend model over the last 30 days of billing data. The trend model:

1. Computes the 7-day rolling average to smooth day-of-week effects.
2. Fits a linear regression to the last 30 days.
3. Projects forward using the regression slope.

The confidence interval widens with forecast horizon — the 90-day forecast has significantly more uncertainty than the 30-day one.

## What the forecast shows

The Cost section displays:

- **This month to date** — actual spend through yesterday
- **Remaining days** — forecast spend for the rest of the current month
- **End-of-month estimate** — sum of actuals + forecast
- **30/60/90-day outlook** — three forecast horizons with confidence bands

## Improving forecast accuracy

Forecast accuracy improves with more billing history. Expect rough estimates for the first 2 weeks, reasonable estimates after 4 weeks, and reliable forecasts after 8+ weeks.

For AWS, applying **Cost Allocation Tags** improves resource-level attribution. InfraAudit can break down forecasts by tag when tags are available.

## Anomaly detection

See [Anomaly detection](/concepts/anomaly-detection) for how InfraAudit identifies unexpected cost spikes against the forecast baseline.
