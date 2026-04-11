---
title: "Subscribe to Webhook Events"
description: "Create a webhook subscription, verify the signature, and handle incoming events."
icon: "webhook"
---


This example creates a webhook, verifies the signature on incoming events, and handles a `drift.detected` event.

## Prerequisites

- A publicly accessible HTTP endpoint (or use [ngrok](https://ngrok.com) for local testing)

```bash
export TOKEN="eyJhbGciOi..."
export BASE_URL="http://localhost:8080"
export RECEIVER_URL="https://receiver.example.com/infraudit"
```

## Step 1: Create the webhook

```bash
WEBHOOK=$(curl -s -X POST "$BASE_URL/api/v1/webhooks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Production receiver\",
    \"url\": \"$RECEIVER_URL\",
    \"events\": [\"drift.detected\", \"alert.created\", \"vulnerability.found\"],
    \"enabled\": true
  }")

echo $WEBHOOK | jq .

WEBHOOK_ID=$(echo $WEBHOOK | jq -r '.id')
WEBHOOK_SECRET=$(echo $WEBHOOK | jq -r '.secret')

echo "Webhook ID: $WEBHOOK_ID"
echo "Secret (save this): $WEBHOOK_SECRET"
```

The `secret` is returned only once. Store it in your deployment secrets.

## Step 2: Send a test delivery

```bash
curl -s -X POST "$BASE_URL/api/v1/webhooks/$WEBHOOK_ID/test" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Your endpoint should receive a `ping` event.

## Step 3: Implement the receiver (Node.js)

```javascript
// receiver.js
const express = require('express')
const crypto = require('crypto')

const app = express()
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET // set from env

function verifySignature(body, signature) {
  if (!signature) return false
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  hmac.update(body, 'utf8')
  const expected = 'sha256=' + hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

// Use express.raw to get the raw body for signature verification
app.post('/infraudit', express.raw({ type: '*/*' }), (req, res) => {
  const signature = req.headers['x-infraaudit-signature']

  if (!verifySignature(req.body, signature)) {
    console.error('Invalid signature')
    return res.status(401).send('Unauthorized')
  }

  const payload = JSON.parse(req.body.toString())
  const { event, delivery_id, data } = payload

  console.log(`Received ${event} (delivery: ${delivery_id})`)

  switch (event) {
    case 'drift.detected':
      console.log(`Drift on ${data.resource_name}: ${data.summary}`)
      console.log(`Severity: ${data.severity}`)
      // Add to your ticketing system, alert your team, etc.
      break

    case 'alert.created':
      console.log(`Alert: ${data.title} (${data.severity})`)
      break

    case 'vulnerability.found':
      console.log(`CVE ${data.cve_id} found on ${data.resource_name}`)
      break

    case 'ping':
      console.log('Ping received — endpoint verified')
      break
  }

  res.sendStatus(200)
})

app.listen(3000, () => console.log('Receiver running on :3000'))
```

## Step 4: Check delivery history

```bash
curl -s "$BASE_URL/api/v1/webhooks/$WEBHOOK_ID/deliveries" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {event: .event_type, status, response_code}'
```

## Step 5: Local testing with ngrok

If your receiver runs locally:

```bash
ngrok http 3000
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

Use the ngrok URL when creating the webhook. InfraAudit can reach local endpoints through the ngrok tunnel.
