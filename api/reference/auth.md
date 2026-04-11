---
title: "Auth"
description: "User profile and token endpoints."
icon: "user"
---


Base path: `/api/v1/auth`

## Get current user

```http
GET /api/v1/auth/me
```

Returns the authenticated user's profile.

**Response:**

```json
{
  "id": 1,
  "supabase_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user",
  "plan": "starter",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## Refresh token

```http
POST /api/login
```

Signs in and returns a new access token. Used by the CLI for the `auth login` command.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOi..."
}
```

## Register

```http
POST /api/register
```

Creates a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:** Same as login.
