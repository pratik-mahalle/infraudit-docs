---
title: "Fetch a Cost Report"
description: "Pull cost trend data and generate a cost report via the InfraAudit API."
icon: "circle-dollar-sign"
---


This example pulls 30 days of cost trend data, checks for anomalies, and generates a PDF cost report.

## Prerequisites

- A connected AWS, GCP, or Azure provider that has completed at least one billing sync

```bash
export TOKEN="eyJhbGciOi..."
export BASE_URL="http://localhost:8080"
export PROVIDER_ID=1
```

## Step 1: Trigger a billing sync

If you haven't synced billing data recently, trigger one:

```bash
curl -s -X POST "$BASE_URL/api/v1/costs/sync" \
  -H "Authorization: Bearer $TOKEN"
# { "job_id": 55, "status": "running" }
```

Wait for it to complete (same polling pattern as the drift scan example).

## Step 2: Get the cost overview

```bash
curl -s "$BASE_URL/api/v1/costs/overview" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Output:

```json
{
  "current_month": {
    "amount": 4231.50,
    "currency": "USD",
    "from": "2024-01-01",
    "to": "2024-01-14"
  },
  "last_month": { "amount": 8450.00, "currency": "USD" },
  "mom_change_percent": -8.2
}
```

## Step 3: Fetch 30-day trend by service

```bash
curl -s "$BASE_URL/api/v1/costs/trend?provider_id=$PROVIDER_ID&days=30&group_by=service" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | last'
```

Output for the most recent day:

```json
{
  "date": "2024-01-14",
  "amount": 285.40,
  "breakdown": { "EC2": 180.00, "S3": 45.00, "RDS": 60.40 }
}
```

## Step 4: Check for anomalies

```bash
curl -s "$BASE_URL/api/v1/costs/anomalies?provider_id=$PROVIDER_ID&days=30" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {date, actual_amount, deviation_percent}'
```

## Step 5: Get 30-day forecast

```bash
curl -s "$BASE_URL/api/v1/costs/forecast?days=30&provider_id=$PROVIDER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '{projected_total, confidence_interval}'
```

Output:

```json
{
  "projected_total": 8750.00,
  "confidence_interval": { "low": 7900.00, "high": 9600.00 }
}
```

## Step 6: Generate a PDF cost report

```bash
# Request report generation
REPORT=$(curl -s -X POST "$BASE_URL/api/reports/generate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"cost_report\",
    \"provider_id\": $PROVIDER_ID,
    \"from\": \"2024-01-01\",
    \"to\": \"2024-01-31\",
    \"format\": \"pdf\"
  }")

REPORT_ID=$(echo $REPORT | jq -r '.report_id')
echo "Report ID: $REPORT_ID"

# Poll until ready
while true; do
  STATUS=$(curl -s "$BASE_URL/api/reports/$REPORT_ID" \
    -H "Authorization: Bearer $TOKEN" | jq -r '.status')
  if [ "$STATUS" = "ready" ]; then break; fi
  sleep 2
done

# Download
curl -s "$BASE_URL/api/reports/$REPORT_ID/download" \
  -H "Authorization: Bearer $TOKEN" \
  --output cost-report-january.pdf

echo "Downloaded cost-report-january.pdf"
```
