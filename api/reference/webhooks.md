---
title: "Webhooks"
description: "Create and manage outbound webhook subscriptions."
icon: "webhook"
---


Base path: `/api/v1/webhooks`

## List webhooks

```http
GET /api/v1/webhooks
```

**Response:**

```json
[
  {
    "id": "wh_abc123",
    "name": "My Receiver",
    "url": "https://receiver.example.com/infraudit",
    "events": ["drift.detected", "alert.created"],
    "enabled": true,
    "created_at": "2024-01-10T10:00:00Z",
    "last_delivery_status": "success",
    "last_delivery_at": "2024-01-15T14:35:00Z"
  }
]
```

## Create webhook

```http
POST /api/v1/webhooks
```

**Request:**

```json
{
  "name": "My Receiver",
  "url": "https://receiver.example.com/infraudit",
  "events": ["drift.detected", "alert.created"],
  "enabled": true
}
```

**Response `201`:**

```json
{
  "id": "wh_abc123",
  "name": "My Receiver",
  "url": "https://receiver.example.com/infraudit",
  "events": ["drift.detected", "alert.created"],
  "secret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxx"
}
```

The `secret` is returned only in the creation response. Store it securely — it cannot be retrieved again.

## Get webhook

```http
GET /api/v1/webhooks/:id
```

The `secret` field is not returned after creation.

## Update webhook

```http
PUT /api/v1/webhooks/:id
```

## Delete webhook

```http
DELETE /api/v1/webhooks/:id
```

Returns `204 No Content`.

## Send test delivery

```http
POST /api/v1/webhooks/:id/test
```

Sends a `ping` event to the endpoint and returns the delivery result.

## List deliveries

```http
GET /api/v1/webhooks/:id/deliveries
```

**Query parameters:** `page`, `per_page`, `status` (`success`, `failed`).

Returns the last 100 deliveries with request/response details.
