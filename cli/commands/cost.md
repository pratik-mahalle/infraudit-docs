---
title: "cost"
description: "View cost overviews, trends, forecasts, and anomalies from the CLI."
icon: "square-terminal"
---

# `infraudit cost`

Cloud cost analytics, forecasting, and optimization.

## `cost overview`

```bash
infraudit cost overview
```

## `cost trends`

```bash
infraudit cost trends
infraudit cost trends --provider aws --period 30d
```

| Flag | Description |
|---|---|
| `--provider` | `aws`, `gcp`, `azure` |
| `--period` | `7d`, `30d`, `90d` |

## `cost forecast`

```bash
infraudit cost forecast
infraudit cost forecast --provider aws --days 90
```

## `cost sync`

Pull billing data from cloud providers.

```bash
infraudit cost sync
infraudit cost sync --provider aws
```

## `cost anomalies`

```bash
infraudit cost anomalies
```

## `cost detect-anomalies`

```bash
infraudit cost detect-anomalies
```

## `cost optimizations`

```bash
infraudit cost optimizations
```

## `cost savings`

```bash
infraudit cost savings
```
