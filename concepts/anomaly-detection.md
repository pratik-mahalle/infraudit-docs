---
title: "Anomaly Detection"
description: "How InfraAudit detects unexpected cost spikes and flags them as anomalies."
icon: "triangle-alert"
---


InfraAudit flags cost anomalies — days where actual spend significantly exceeds the expected range based on recent historical patterns. Anomalies are shown on the Cost trend chart and can trigger alerts.

## Detection method

After each daily billing sync, InfraAudit runs an anomaly check on the new data point:

1. Compute the **expected range** for that calendar day using a rolling baseline of the previous 14 days:
   - **Expected value:** 7-day exponentially weighted moving average (EWMA)
   - **Upper bound:** Expected value × (1 + threshold)

2. If `actual spend > upper bound`, flag it as an anomaly.

The default threshold is **30%** above the expected value. Adjust it per provider under **Settings → Cost → Anomaly threshold**.

## Why EWMA?

Simple moving averages treat all past days equally. EWMA weights recent days more heavily, which makes the model adapt faster to genuine spend increases (like a new production workload) without false-flagging them as anomalies after they stabilize.

## Day-of-week effect

Cloud billing often varies by day of week (lower spend on weekends for bursty compute). InfraAudit's model compares each day against the same day of week from previous weeks to reduce false positives from predictable weekly patterns.

## What triggers an anomaly

| Scenario | Anomaly? |
|---|---|
| AWS bill spikes 50% due to accidental EC2 over-provisioning | Yes |
| Billing increases 15% after a planned deployment (within threshold) | No |
| Daily spend is 35% above the EWMA baseline | Yes |
| Gradual increase over 3 weeks (line of best fit stays within bounds) | No |

## Anomaly alerts

Configure Slack or email alerts for cost anomalies under **Settings → Notifications**. A common setup: email all anomalies above $50/day to the FinOps team.

Each anomaly alert includes:
- The affected provider and service breakdown
- The actual vs expected spend
- Percentage over expected
- A link to the Cost Trend chart zoomed to the anomaly date

## Viewing anomalies

In the **Cost** section, anomalies appear as colored spike markers on the trend chart. Click a marker to open the anomaly detail:

- Which services drove the increase
- Comparison to the previous 7-day average
- Related resources (if resource-level attribution is available)

CLI:

```bash
infraudit cost anomalies
infraudit cost anomalies --provider 1 --days 30
```

## Suppressing false positives

If a cost increase is expected (e.g. after a planned migration), suppress the anomaly to prevent alert noise:

```bash
infraudit cost anomaly dismiss <anomaly-id> --reason "planned migration to larger instances"
```

Dismissed anomalies are hidden from the alert list but remain visible in the Cost chart with a "dismissed" label.

## Tuning the threshold

For accounts with high natural variance (e.g. event-driven workloads), increase the threshold to reduce noise:

```env
ANOMALY_COST_THRESHOLD=0.5  # 50% above expected before flagging
```

For accounts with stable, predictable spend (e.g. reserved instances only), lower the threshold for earlier detection:

```env
ANOMALY_COST_THRESHOLD=0.15  # 15% above expected
```
