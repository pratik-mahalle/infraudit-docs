---
title: "Alerts"
description: "Manage your alert inbox and configure notification routing for drifts, vulnerabilities, and cost anomalies."
icon: "bell"
---


Alerts are user-facing notifications about findings that need attention. InfraAudit creates them automatically from drift detections, vulnerability scans, cost anomalies, and compliance failures. You can also create manual alerts.

## Alert types and sources

| Type | Generated from |
|---|---|
| **Security** | Drifts (configuration and security), critical/high vulnerabilities |
| **Cost** | Cost anomalies, budget threshold breaches |
| **Compliance** | Failed compliance controls during an assessment run |
| **Performance** | Resource utilization anomalies |

## Alert list

In the sidebar, click **Alerts**. The inbox shows all open alerts, newest first.

| Column | Description |
|---|---|
| **Title** | Short description of what triggered the alert |
| **Type** | Security, cost, compliance, or performance |
| **Severity** | Critical, high, medium, or low |
| **Resource** | The affected resource |
| **Created** | Timestamp |
| **Status** | Open, acknowledged, or resolved |

Use the filter bar to narrow by type, severity, provider, or status.

## Managing alerts

### Acknowledge

Acknowledging an alert marks it as seen but does not close it. It stays in the list until resolved. Useful for on-call workflows where you want to signal "I'm on it" to teammates.

Click **Acknowledge** on the alert, or:

```bash
infraudit alert acknowledge <alert-id>
```

### Resolve

Resolving closes the alert. Do this once the underlying issue is fixed.

Click **Resolve** on the alert, or:

```bash
infraudit alert resolve <alert-id>
```

Resolving a drift alert also prompts you to mark the underlying drift as resolved.

### Bulk actions

Select multiple alerts using the checkboxes and use the **Bulk actions** dropdown to acknowledge or resolve them all at once. Useful for clearing a backlog after a maintenance window.

## Notification channels

Alerts are delivered to the notification channels configured under **Settings → Notifications**:

| Channel | How to configure |
|---|---|
| **Slack** | Set `SLACK_WEBHOOK_URL` in `.env` (self-hosted) or under Settings (SaaS), then pick which alert types to send |
| **Email** | Add email addresses under Settings → Notifications → Email |
| **Webhook** | Add HTTP endpoints under Settings → Webhooks; InfraAudit POSTs a signed JSON payload for each event |

### Alert routing rules

You can set routing rules to target different channels for different severities or types:

- Critical security alerts → `#security-critical` Slack channel
- All cost anomalies → FinOps email list
- All events → audit webhook endpoint

Routing rules are configured under **Settings → Notifications → Routing**.

## Alert history

Resolved alerts move to the **History** tab. History is retained for 90 days on Starter/Professional plans and 1 year on Enterprise.

## CLI

```bash
# List open alerts
infraudit alert list

# Filter by severity
infraudit alert list --severity critical

# Acknowledge
infraudit alert acknowledge <alert-id>

# Resolve
infraudit alert resolve <alert-id>

# List with JSON output (for scripting)
infraudit alert list -o json | jq '.[].title'
```

## Next steps

- [Integrations: Slack](/integrations/slack)
- [Integrations: Webhooks](/integrations/webhooks)
- [Remediation](/platform/remediation) — act on security alerts
