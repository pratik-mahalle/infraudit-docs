---
title: "Webhooks"
description: "Subscribe to InfraAudit events and receive real-time HTTP callbacks."
icon: "webhook"
---

# Webhooks

InfraAudit can POST a JSON payload to any HTTP endpoint when an event fires — a detected drift, a cost anomaly, a compliance violation, and more.

- [Event types](/api/webhooks/events) — full list of events you can subscribe to
- [Signature verification](/api/webhooks/signing) — validate that payloads come from InfraAudit using HMAC-SHA256
- [Retries and delivery](/api/webhooks/retries) — retry policy, failure handling, and test delivery
