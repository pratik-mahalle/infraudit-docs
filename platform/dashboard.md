---
title: "Dashboard"
description: "Understand the InfraAudit dashboard: summary metrics, recent findings, and quick actions."
icon: "chart-line"
---


The dashboard is the first screen after logging in. It shows a snapshot of your infrastructure health across all connected cloud accounts.

## Summary cards

At the top of the dashboard, four cards give a quick status read:

| Card | What it shows |
|---|---|
| **Providers** | Number of connected cloud accounts and their sync status |
| **Resources** | Total discovered resources across all providers |
| **Open drifts** | Active drift findings by severity |
| **Compliance score** | Average compliance score across all enabled frameworks |

Click any card to jump to the corresponding section.

## Recent alerts

The **Recent alerts** panel lists the last 10 alerts by creation time. Each row shows the alert type, severity, affected resource, and time. Click an alert to open the full detail view where you can acknowledge or resolve it.

## Cost snapshot

The cost snapshot shows:

- Estimated spend this month (to date)
- Spend last month
- Month-over-month delta as a percentage
- A sparkline of daily spend for the last 30 days

If billing data hasn't synced yet, this panel shows "Waiting for billing data" with a button to trigger a manual sync.

## Drift activity

A bar chart shows drift detections per day for the last 14 days, broken down by severity (critical, high, medium, low). A spike in this chart usually corresponds to a deployment or configuration change in your cloud environment.

Below the chart, a table shows the five most recent drift findings with their status and a quick **Resolve** action.

## Quick actions

The top-right corner of the dashboard has three quick-action buttons:

- **Run scan** — triggers a drift detection scan across all providers
- **Connect provider** — shortcut to the Cloud Providers page
- **View recommendations** — opens the AI recommendations list

## Customizing the dashboard

The dashboard layout is fixed. Individual panels can be collapsed by clicking the chevron in the panel header; the collapsed state is saved per user.
