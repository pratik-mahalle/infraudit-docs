---
title: "notification"
description: "Configure notification channels from the CLI."
icon: "square-terminal"
---

# `infraudit notification`

Alias: `notif`

Manage notification channel preferences and history.

## `notif preferences`

Show current notification settings.

```bash
infraudit notif preferences
```

## `notif update <channel>`

Enable or disable a notification channel.

```bash
infraudit notif update email --enabled true
infraudit notif update slack --enabled false
```

Channels: `email`, `slack`, `webhook`

## `notif history`

Show notification delivery history.

```bash
infraudit notif history
```

## `notif send`

Send a test notification.

```bash
infraudit notif send --channel email --message "Test notification"
```
