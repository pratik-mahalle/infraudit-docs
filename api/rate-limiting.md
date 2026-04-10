---
title: "Rate Limiting"
description: "Rate limits for the InfraAudit API and how to handle 429 responses."
icon: "gauge"
---

# Rate limiting

The InfraAudit API applies rate limiting per authenticated user to prevent overload.

## Response headers

Rate limit status is returned in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1712345678
```

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |

## 429 responses

When the limit is exceeded the server returns `429 Too Many Requests`:

```json
{
  "error": "rate limit exceeded",
  "retryAfter": 30
}
```

`retryAfter` is the number of seconds to wait before retrying.

## Handling rate limits

```bash
response=$(curl -s -w "%{http_code}" ...)
if [ "$response" = "429" ]; then
  retry_after=$(curl -s ... | jq '.retryAfter')
  sleep "$retry_after"
  # retry request
fi
```

Rate limit defaults are configured in `internal/api/router/router.go`. Self-hosted deployments can adjust them via environment variables.
