---
title: "webhook"
description: "Manage outbound webhooks from the CLI."
icon: "square-terminal"
---

# `infraudit webhook`

Manage outbound webhooks.

## `webhook list`

```bash
infraudit webhook list
```

## `webhook create`

```bash
infraudit webhook create \
  --name "Slack Alerts" \
  --url https://hooks.slack.com/... \
  --events drift.detected,alert.created
```

| Flag | Description |
|---|---|
| `--name` | Webhook display name |
| `--url` | Destination endpoint URL |
| `--secret` | Signing secret for HMAC verification |
| `--events` | Comma-separated event list |

## `webhook get <id>`

```bash
infraudit webhook get 1
```

## `webhook delete <id>`

```bash
infraudit webhook delete 1
```

## `webhook test <id>`

Send a test payload to a webhook endpoint.

```bash
infraudit webhook test 1
```

## `webhook events`

List all available event types.

```bash
infraudit webhook events
```
