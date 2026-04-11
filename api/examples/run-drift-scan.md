---
title: "Run a Drift Scan"
description: "Trigger a drift scan via the API, wait for results, and list the findings."
icon: "radar"
---


This example triggers a drift detection scan, polls for completion, and retrieves the findings.

## Prerequisites

- A connected provider with at least one synced resource (see [Connect an AWS account](/api/examples/connect-aws))

```bash
export TOKEN="eyJhbGciOi..."
export BASE_URL="http://localhost:8080"
```

## Step 1: Trigger the scan

```bash
JOB=$(curl -s -X POST "$BASE_URL/api/v1/drifts/detect" \
  -H "Authorization: Bearer $TOKEN" | jq .)

echo $JOB
# { "job_id": 42, "status": "running", "message": "Drift detection scan started" }

JOB_ID=$(echo $JOB | jq -r '.job_id')
```

## Step 2: Wait for the job to complete

```bash
while true; do
  EXEC=$(curl -s "$BASE_URL/api/v1/jobs/1/executions/$JOB_ID" \
    -H "Authorization: Bearer $TOKEN")
  STATUS=$(echo $EXEC | jq -r '.status')
  echo "Job status: $STATUS"
  if [ "$STATUS" = "succeeded" ] || [ "$STATUS" = "failed" ]; then break; fi
  sleep 3
done
```

## Step 3: Get the summary

```bash
curl -s "$BASE_URL/api/v1/drifts/summary" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Output:

```json
{
  "total": 5,
  "by_severity": {
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1
  },
  "by_status": {
    "detected": 5,
    "investigating": 0,
    "resolved": 0
  }
}
```

## Step 4: List critical drifts

```bash
curl -s "$BASE_URL/api/v1/drifts?severity=critical" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, summary, resource_name}'
```

Output:

```json
{
  "id": 1,
  "summary": "BlockPublicAcls changed from true to false",
  "resource_name": "data-lake-bucket"
}
```

## Step 5: Get drift detail with diff

```bash
curl -s "$BASE_URL/api/v1/drifts/1" \
  -H "Authorization: Bearer $TOKEN" | jq '{summary, baseline_value, current_value}'
```

## Step 6: Resolve a drift

After fixing the issue in your cloud account, re-sync and resolve:

```bash
# Trigger a resource sync to pull the current state
curl -s -X POST "$BASE_URL/api/v1/providers/1/sync" \
  -H "Authorization: Bearer $TOKEN"

# Resolve the drift
curl -s -X POST "$BASE_URL/api/v1/drifts/1/resolve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"capture_baseline": true}'
```
