---
title: "Settings"
description: "Manage API keys and team member access."
icon: "settings"
---


Base path: `/api/v1/settings`

## API keys

### List API keys

```http
GET /api/v1/settings/api-keys
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "CI/CD Pipeline",
    "prefix": "ia_live_abc...",
    "created_at": "2024-01-10T10:00:00Z",
    "last_used_at": "2024-01-15T09:12:00Z"
  }
]
```

The full API key is shown only at creation time.

### Create API key

```http
POST /api/v1/settings/api-keys
```

**Request:**

```json
{ "name": "CI/CD Pipeline" }
```

**Response `201`:**

```json
{
  "id": 2,
  "name": "CI/CD Pipeline",
  "key": "ia_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

Store this key — it's shown only once.

### Delete API key

```http
DELETE /api/v1/settings/api-keys/:id
```

Returns `204 No Content`. Invalidates the key immediately.

## Team members

### List members

```http
GET /api/v1/settings/team
```

**Response:**

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    "joined_at": "2024-01-01T00:00:00Z",
    "last_active_at": "2024-01-15T10:00:00Z"
  }
]
```

### Invite member

```http
POST /api/v1/settings/team/invite
```

**Request:**

```json
{
  "email": "newuser@example.com",
  "role": "user"
}
```

Valid roles: `user`, `admin`.

### Update member role

```http
PUT /api/v1/settings/team/:user_id
```

**Request:**

```json
{ "role": "admin" }
```

### Remove member

```http
DELETE /api/v1/settings/team/:user_id
```

Returns `204 No Content`.
