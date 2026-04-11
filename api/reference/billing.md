---
title: "Billing"
description: "Manage subscription plan and billing information (SaaS only)."
icon: "credit-card"
---


Base path: `/api/v1/billing`

These endpoints are available on SaaS editions only. Self-hosted Community deployments skip billing management entirely.

## Get current plan

```http
GET /api/v1/billing/plan
```

**Response:**

```json
{
  "plan": "professional",
  "status": "active",
  "resource_limit": 200,
  "resource_count": 147,
  "billing_period_start": "2024-01-01",
  "billing_period_end": "2024-01-31",
  "next_invoice_date": "2024-02-01"
}
```

## List invoices

```http
GET /api/v1/billing/invoices
```

**Response:**

```json
[
  {
    "id": "inv_abc123",
    "amount": 299.00,
    "currency": "USD",
    "status": "paid",
    "period": "2024-01-01 to 2024-01-31",
    "paid_at": "2024-01-01T00:00:00Z",
    "download_url": "https://..."
  }
]
```

## Get usage

```http
GET /api/v1/billing/usage
```

Returns current-period resource usage against plan limits.

**Response:**

```json
{
  "resources": { "used": 147, "limit": 200 },
  "providers": { "used": 3, "limit": null },
  "api_requests": { "used": 45230, "limit": null }
}
```

## Upgrade plan

To upgrade, use the billing portal link:

```http
GET /api/v1/billing/portal
```

Returns a short-lived URL to the Stripe billing portal where plan changes and payment methods are managed.
