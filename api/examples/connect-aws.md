---
title: "Connect an AWS Account"
description: "Step-by-step API example: connect an AWS account and verify the initial sync."
icon: "aws"
---


This example uses `curl` to connect an AWS account via the InfraAudit API, wait for the initial sync, and list the discovered resources.

## Prerequisites

- InfraAudit running and accessible
- A Bearer token (see [Authentication](/api/authentication))
- An AWS IAM access key pair with the required permissions (see [Integrations: AWS](/integrations/aws))

Set variables:

```bash
export TOKEN="eyJhbGciOi..."
export BASE_URL="http://localhost:8080"
```

## Step 1: Connect the account

```bash
curl -s -X POST "$BASE_URL/api/v1/providers/aws/connect" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production AWS",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "region": "us-east-1"
  }' | jq .
```

Response:

```json
{
  "id": 1,
  "name": "Production AWS",
  "type": "aws",
  "status": "syncing",
  "created_at": "2024-01-15T10:00:00Z"
}
```

Save the provider ID:

```bash
export PROVIDER_ID=1
```

## Step 2: Wait for the initial sync

Poll the provider until status is `synced`:

```bash
while true; do
  STATUS=$(curl -s "$BASE_URL/api/v1/providers/$PROVIDER_ID" \
    -H "Authorization: Bearer $TOKEN" | jq -r '.status')
  echo "Status: $STATUS"
  if [ "$STATUS" = "synced" ]; then break; fi
  if [ "$STATUS" = "error" ]; then echo "Sync failed"; exit 1; fi
  sleep 5
done
```

## Step 3: List discovered resources

```bash
curl -s "$BASE_URL/api/v1/resources?provider_id=$PROVIDER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.meta'
```

Output:

```json
{
  "total": 247,
  "page": 1,
  "per_page": 20
}
```

List EC2 instances:

```bash
curl -s "$BASE_URL/api/v1/resources?provider_id=$PROVIDER_ID&type=ec2_instance" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, name, region, status}'
```

## Step 4: Verify encryption (optional)

Check that credentials are stored encrypted by confirming the access key is not in the API response:

```bash
curl -s "$BASE_URL/api/v1/providers/$PROVIDER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq 'keys'
# ["created_at", "id", "last_synced_at", "name", "resource_count", "status", "type"]
# No access keys in the response
```

The credentials are encrypted in the database and never returned by the API.
