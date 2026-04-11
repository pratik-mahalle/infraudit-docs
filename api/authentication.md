---
title: "Authentication"
description: "How to authenticate requests to the InfraAudit REST API using Supabase JWTs."
icon: "lock"
---


All protected API endpoints require a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <access_token>
```

## Getting a token

InfraAudit uses [Supabase Auth](https://supabase.com/docs/guides/auth). The access token is a signed JWT issued by your Supabase project.

### Option 1: Sign in via the Supabase client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})

const token = data.session.access_token
```

### Option 2: Sign in via the InfraAudit API

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Response:

```json
{
  "user": { "id": 1, "email": "user@example.com", "role": "user" },
  "token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Option 3: CLI (stores token automatically)

```bash
infraudit auth login --email user@example.com --password password
```

The CLI stores the token in `~/.infraudit/config.yaml`.

## Using the token

Pass the token as a `Bearer` header on every request:

```bash
export TOKEN="eyJhbGciOi..."

curl http://localhost:8080/api/v1/resources \
  -H "Authorization: Bearer $TOKEN"
```

## API keys

Long-lived API keys can be created under **Settings → API Keys** or via `POST /api/v1/settings/api-keys`. API keys authenticate using the same `Authorization: Bearer` header.

## Token format

Tokens are Supabase JWTs signed with either:
- **ES256** — ECDSA with a key pair managed by Supabase (verified via JWKS at `{SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
- **HS256** — HMAC using `SUPABASE_JWT_SECRET`

The auth middleware in `internal/api/middleware/auth.go` accepts either format.

## EventSource / SSE requests

For server-sent events, pass the token as a query parameter:

```
GET /api/ws/drifts?token=eyJhbGciOi...
```

## 401 vs 403

- `401 Unauthorized` — no token provided, token expired, or token is invalid
- `403 Forbidden` — token is valid but the user lacks permission for the resource
