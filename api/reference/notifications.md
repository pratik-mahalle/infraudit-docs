---
title: "Notifications"
description: "Configure notification channel preferences and view delivery history."
icon: "bell"
---


Base path: `/api/v1/notifications`

## List preferences

```http
GET /api/v1/notifications/preferences
```

Returns the user's notification preferences per channel and alert type.

**Response:**

```json
[
  {
    "id": 1,
    "channel": "slack",
    "alert_type": "security",
    "severity": "critical",
    "webhook_url": "https://hooks.slack.com/...",
    "enabled": true
  }
]
```

## Create preference

```http
POST /api/v1/notifications/preferences
```

**Request:**

```json
{
  "channel": "slack",
  "alert_type": "security",
  "severity": "critical",
  "webhook_url": "https://hooks.slack.com/services/..."
}
```

Valid channels: `slack`, `email`, `webhook`.
Valid alert types: `security`, `cost`, `compliance`, `performance`, `all`.
Valid severities: `critical`, `high`, `medium`, `low`, `all`.

## Update preference

```http
PUT /api/v1/notifications/preferences/:id
```

## Delete preference

```http
DELETE /api/v1/notifications/preferences/:id
```

## Send test notification

```http
POST /api/v1/notifications/test
```

**Request:**

```json
{
  "channel": "slack",
  "webhook_url": "https://hooks.slack.com/..."
}
```

Sends a test `ping` event to the specified channel.

## List notification history

```http
GET /api/v1/notifications/history
```

**Query parameters:** `channel`, `days` (default: 7), `status` (`sent`, `failed`, `pending`).

Returns the last N days of notification delivery records.
