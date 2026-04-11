---
title: "Email"
description: "Configure email notifications for InfraAudit alerts using SMTP or SendGrid."
icon: "envelope"
---


InfraAudit can send alert notifications by email using SMTP or SendGrid.

## Configuration

### SMTP

Add the following to your `.env` file (self-hosted):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=alerts@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=InfraAudit <alerts@example.com>
EMAIL_ENABLED=true
```

For TLS:

```env
SMTP_TLS=true
```

For local development without TLS (e.g. Mailhog):

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_TLS=false
```

### SendGrid

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=alerts@your-domain.com
EMAIL_PROVIDER=sendgrid
EMAIL_ENABLED=true
```

## Adding recipient addresses

After configuring the SMTP or API settings, add recipient email addresses under **Settings → Notifications → Email**. Addresses here receive all alerts by default.

To route specific alert types to specific addresses, use routing rules under **Settings → Notifications → Routing**.

Via the API:

```bash
curl -X POST http://localhost:8080/api/v1/notifications/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "email",
    "email": "security@example.com",
    "alertType": "security",
    "severity": "critical"
  }'
```

## What an email alert includes

- Subject: `[InfraAudit] <severity>: <alert title>`
- Alert type and severity
- Affected resource name and provider
- Description of the finding
- Link to the alert in the InfraAudit UI
- Timestamp

## Testing email delivery

```bash
infraudit notification test --channel email --to test@example.com
```

Or from the UI: **Settings → Notifications → Email → Send test email**.

## Digest mode

If alert volume is high, you can switch from per-alert emails to a daily digest. Enable it under **Settings → Notifications → Email → Digest mode**.

The daily digest sends at 07:00 UTC by default. The send time is configurable in `.env`:

```env
EMAIL_DIGEST_TIME=07:00
```
