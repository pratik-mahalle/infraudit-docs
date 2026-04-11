---
title: "Signature Verification"
description: "Verify the HMAC-SHA256 signature on InfraAudit webhook deliveries."
icon: "lock"
---


Every webhook delivery includes an `X-InfraAudit-Signature` header. Verify this header before processing the payload to confirm the request came from InfraAudit and wasn't tampered with.

## Header format

```
X-InfraAudit-Signature: sha256=<hex-encoded-hmac>
```

The signature is an HMAC-SHA256 of the raw request body, computed with the webhook's secret key.

## How to verify

### Go

```go
import (
  "crypto/hmac"
  "crypto/sha256"
  "encoding/hex"
  "net/http"
)

func verifySignature(r *http.Request, body []byte, secret string) bool {
  signature := r.Header.Get("X-InfraAudit-Signature")
  if signature == "" {
    return false
  }

  mac := hmac.New(sha256.New, []byte(secret))
  mac.Write(body)
  expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))

  return hmac.Equal([]byte(signature), []byte(expected))
}
```

### Node.js

```javascript
const crypto = require('crypto')

function verifySignature(body, secret, signature) {
  if (!signature) return false

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body, 'utf8')
  const expected = 'sha256=' + hmac.digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'utf8'),
    Buffer.from(signature, 'utf8')
  )
}

// Express middleware example
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-infraaudit-signature']
  if (!verifySignature(req.body, process.env.WEBHOOK_SECRET, sig)) {
    return res.status(401).send('Invalid signature')
  }
  const payload = JSON.parse(req.body)
  // process payload...
  res.sendStatus(200)
})
```

### Python

```python
import hashlib
import hmac

def verify_signature(body: bytes, secret: str, signature: str) -> bool:
    if not signature:
        return False

    mac = hmac.new(secret.encode(), body, hashlib.sha256)
    expected = 'sha256=' + mac.hexdigest()

    return hmac.compare_digest(expected, signature)

# Flask example
from flask import Flask, request, abort

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    body = request.get_data()
    signature = request.headers.get('X-InfraAudit-Signature', '')
    if not verify_signature(body, WEBHOOK_SECRET, signature):
        abort(401)
    payload = request.get_json(force=True)
    # process payload...
    return '', 200
```

## Important: use the raw body

The signature is computed against the **raw** request body bytes, before JSON parsing. If your framework parses the body before you verify (which many do by default), re-read the raw bytes from the buffer before verifying.

In Express: use `express.raw({ type: 'application/json' })` on the route before parsing.

In Flask: use `request.get_data()` before `request.get_json()`.

## Timing-safe comparison

Always use a timing-safe comparison function (`hmac.Equal` in Go, `crypto.timingSafeEqual` in Node.js, `hmac.compare_digest` in Python) to prevent timing attacks. Standard string equality (`==`) is not safe here.

## Rotating the webhook secret

To rotate a webhook secret:

1. Delete the existing webhook.
2. Create a new webhook with the same URL and event subscriptions. A new secret is generated.
3. Update your receiver to use the new secret.

Or contact support (SaaS) to rotate the secret without recreating the webhook.
