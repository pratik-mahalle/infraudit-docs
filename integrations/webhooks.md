---
title: "Webhooks"
description: "Subscribe to InfraAudit events via outbound webhooks with HMAC-SHA256 signature verification."
icon: "webhook"
---


InfraAudit POSTs a JSON payload to your registered HTTP endpoints when subscribed events fire. Webhooks work for any event InfraAudit generates — drifts, alerts, compliance failures, job completions, and more.

## Creating a webhook

### From the UI

1. Go to **Settings → Webhooks**.
2. Click **Add webhook**.
3. Enter the endpoint URL.
4. Select the event types to subscribe to.
5. Click **Save**. InfraAudit generates a signing secret for this webhook.

### From the CLI

```bash
infraudit webhook create \
  --url https://receiver.example.com/infraudit \
  --events drift.detected,alert.created \
  --name "My Receiver"
```

### Via the API

```bash
curl -X POST http://localhost:8080/api/v1/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Receiver",
    "url": "https://receiver.example.com/infraudit",
    "events": ["drift.detected", "alert.created", "compliance.violation"]
  }'
```

The response includes the webhook `secret` — store it securely. InfraAudit shows it only once.

## Event payload

All event payloads share a common envelope:

```json
{
  "event": "drift.detected",
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "wh_abc123",
  "delivery_id": "del_xyz789",
  "data": {
    ...event-specific fields...
  }
}
```

See [Webhook events](/api/webhooks/events) for the full list of event types and their payload schemas.

## Signature verification

Every delivery includes an `X-InfraAudit-Signature` header containing an HMAC-SHA256 signature of the request body, signed with the webhook secret.

To verify in Go:

```go
import (
  "crypto/hmac"
  "crypto/sha256"
  "encoding/hex"
)

func verifySignature(body []byte, secret, signature string) bool {
  mac := hmac.New(sha256.New, []byte(secret))
  mac.Write(body)
  expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
  return hmac.Equal([]byte(expected), []byte(signature))
}
```

In Node.js:

```javascript
const crypto = require('crypto')

function verifySignature(body, secret, signature) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const expected = 'sha256=' + hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
```

See [Signature verification](/api/webhooks/signing) for more detail.

## Retries

If your endpoint returns a non-2xx status or times out (10-second timeout), InfraAudit retries with exponential backoff — 3 attempts over 30 minutes. After all retries are exhausted, the delivery is marked as failed. See [Retries and delivery](/api/webhooks/retries).

## Supported event types

| Event | Triggered when |
|---|---|
| `drift.detected` | A new drift finding is created |
| `drift.resolved` | A drift finding is resolved |
| `alert.created` | A new alert is created |
| `vulnerability.found` | A new CVE is detected |
| `compliance.violation` | A compliance control fails during an assessment |
| `cost.anomaly` | A cost anomaly is detected |
| `job.completed` | A scheduled job finishes (success or failure) |
| `remediation.completed` | A remediation action completes |

## Testing a webhook

```bash
infraudit webhook test <webhook-id>
```

InfraAudit sends a `ping` event to your endpoint. The delivery shows up in the webhook delivery history.

## Delivery history

Under **Settings → Webhooks**, click a webhook to see its delivery history — the last 100 deliveries with request/response details and status.
