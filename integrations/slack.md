---
title: "Slack"
description: "Send InfraAudit alerts to Slack channels via incoming webhooks."
icon: "slack"
---


InfraAudit delivers alerts to Slack using incoming webhooks. When a drift, vulnerability, cost anomaly, or compliance failure is detected, InfraAudit posts a formatted message to the configured channel.

## Setting up the Slack webhook

### Step 1: Create an incoming webhook in Slack

1. Go to your Slack workspace's [app directory](https://api.slack.com/apps).
2. Create a new app (or use an existing one).
3. Under **Features → Incoming Webhooks**, enable incoming webhooks.
4. Click **Add New Webhook to Workspace** and pick a channel.
5. Copy the webhook URL (format: `https://hooks.slack.com/services/T.../B.../...`).

### Step 2: Configure InfraAudit

**For self-hosted deployments:**

Add the webhook URL to your `.env` file:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
SLACK_CHANNEL=#alerts
```

Restart the API after changing `.env`.

**For SaaS:**

1. Go to **Settings → Notifications → Slack**.
2. Paste the webhook URL.
3. Select the default channel.
4. Click **Save**.

## Alert routing

By default, all alert types and all severities are sent to the configured channel. To route different alerts to different channels, configure routing rules under **Settings → Notifications → Routing**.

Example routing setup:
- **Critical security alerts** → `#security`
- **Cost anomalies** → `#finops`
- **Compliance failures** → `#compliance`
- **All events** → `#infraudit-all`

Via the API:

```bash
curl -X POST http://localhost:8080/api/v1/notifications/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "slack",
    "alertType": "security",
    "severity": "critical",
    "webhookUrl": "https://hooks.slack.com/services/..."
  }'
```

## What a Slack alert includes

Each alert message contains:

- Alert title and type (security, cost, compliance)
- Severity badge
- Resource name and provider
- Short description of what was detected
- A link to the full alert in the InfraAudit UI

## Testing the integration

After configuring, send a test message:

```bash
infraudit notification test --channel slack
```

Or from the UI, go to **Settings → Notifications → Slack** and click **Send test message**.

## Multiple channels

InfraAudit supports multiple Slack webhook configurations through routing rules. Each rule can point to a different webhook URL (i.e. a different Slack app or channel).
