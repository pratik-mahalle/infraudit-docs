---
title: "Retries and Delivery"
description: "How InfraAudit retries failed webhook deliveries and what to expect from delivery guarantees."
icon: "clock-rotate-left"
---


InfraAudit delivers webhook events with at-least-once semantics and retries failed deliveries using exponential backoff.

## Delivery guarantees

- **At-least-once:** InfraAudit may deliver the same event more than once (e.g. if your endpoint acknowledges after a network timeout). Design your handler to be idempotent — use `delivery_id` to deduplicate.
- **No ordering guarantees:** Events may arrive out of order if retries from one delivery overlap with a later successful delivery.

## Success and failure

A delivery is a success if your endpoint returns any `2xx` status code within the timeout window.

A delivery fails if:
- The endpoint returns a `4xx` or `5xx` status
- The endpoint does not respond within **10 seconds** (timeout)
- The connection is refused or the DNS lookup fails

InfraAudit does not inspect the response body — only the status code matters.

## Retry schedule

| Attempt | Delay after previous attempt |
|---|---|
| 1st retry | 5 minutes |
| 2nd retry | 30 minutes |
| 3rd retry | 2 hours |

After all 3 retries are exhausted (about 2.5 hours from the initial attempt), the delivery is marked `failed` and no further retries happen.

## Viewing delivery history

From the UI: **Settings → Webhooks → [webhook name] → Deliveries**.

Each delivery record shows:
- Event type and delivery ID
- Attempt number
- HTTP status code returned
- Response time
- Request and response headers (for debugging)

Via the API:

```http
GET /api/v1/webhooks/:id/deliveries
```

## Handling delivery failures

If deliveries are consistently failing:

1. Check the delivery history for the HTTP status code — a `401` means your endpoint is rejecting the signature, a `500` means your application is erroring.
2. Fix the issue on your receiver side within the retry window (2.5 hours).
3. For events that exhausted all retries: re-fetch the data from InfraAudit's API directly if you need to process the missed event.

## Manually retrying a failed delivery

Not yet available in the UI or API. To reprocess a failed event, query the corresponding data from the InfraAudit API (e.g. `GET /api/v1/drifts/:id` for a missed `drift.detected` event).

## Disabling a webhook during maintenance

If your endpoint is undergoing planned maintenance, disable the webhook temporarily to suppress retries:

```http
PUT /api/v1/webhooks/:id
{ "enabled": false }
```

Re-enable it after maintenance. Events that fired while the webhook was disabled are not replayed — query the API for any missed data.
