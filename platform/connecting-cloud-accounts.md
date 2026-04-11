---
title: "Connecting Cloud Accounts"
description: "Connect your AWS, GCP, Azure, or Kubernetes accounts to InfraAudit from the Cloud Providers page."
icon: "plug"
---


Cloud accounts in InfraAudit are called **providers**. Each provider stores encrypted credentials, a display name, and sync metadata. One InfraAudit account can run multiple providers simultaneously.

## Adding a provider

1. In the sidebar, click **Cloud Providers**.
2. Click **Connect provider** and choose your cloud.
3. Fill in the credential form (details per cloud below).
4. Click **Connect**. InfraAudit validates the credentials and starts the initial resource sync.

## AWS

You need an IAM user or role with read access.

**Required permissions (minimum):**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:GetBucketLocation",
        "s3:ListAllMyBuckets",
        "rds:Describe*",
        "lambda:ListFunctions",
        "lambda:GetFunctionConfiguration",
        "cloudfront:ListDistributions",
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues"
      ],
      "Resource": "*"
    }
  ]
}
```

**Credential form fields:**
- Access Key ID
- Secret Access Key
- Default region (e.g. `us-east-1`)
- Display name

Credentials are encrypted at rest using AES-GCM with the server's `ENCRYPTION_KEY`.

## GCP

You need a service account with the following roles:
- `roles/viewer` (basic read access)
- `roles/bigquery.dataViewer` (for BigQuery billing export)

**Steps:**
1. In the GCP console, go to **IAM & Admin → Service Accounts**.
2. Create a service account and assign the roles above.
3. Download the JSON key file.
4. Paste the JSON contents into the **Service Account JSON** field in InfraAudit.

**Credential form fields:**
- Service Account JSON (the full key file content)
- Project ID
- Display name

## Azure

You need a service principal with the Reader role on your subscription.

**Create a service principal with the Azure CLI:**

```bash
az ad sp create-for-rbac \
  --name infraudit-reader \
  --role Reader \
  --scopes /subscriptions/<subscription-id>
```

Copy the output — it contains `clientId`, `clientSecret`, `tenantId`, and `subscriptionId`.

**Credential form fields:**
- Client ID (`clientId`)
- Client Secret (`clientSecret`)
- Tenant ID (`tenantId`)
- Subscription ID (`subscriptionId`)
- Display name

## Kubernetes

You connect a Kubernetes cluster by uploading a kubeconfig file or pasting its contents.

**Requirements:**
- The kubeconfig must grant at least `get`, `list`, and `watch` on pods, deployments, services, and namespaces.
- The service account or user in the kubeconfig should be read-only.

**Credential form fields:**
- Kubeconfig (file upload or paste)
- Cluster display name

## Sync status

After connecting, the provider card shows one of these statuses:

| Status | Meaning |
|---|---|
| **Syncing** | Initial or recurring sync in progress |
| **Synced** | Last sync completed successfully |
| **Error** | Last sync failed — hover for the error message |
| **Disconnected** | Provider is paused; credentials removed |

The default sync schedule is every 6 hours for resources and daily for billing data. You can trigger a manual sync by clicking **Sync now** on the provider card, or via the CLI:

```bash
infraudit provider sync 1
```

## Disconnecting a provider

Click the provider card, then **Disconnect**. This removes the stored credentials but keeps all historical scan data (resources, drifts, costs, compliance results). Historical data is not deleted unless you explicitly delete the provider.

## Next steps

- [Integrations: AWS](/integrations/aws) — full IAM policy and advanced setup
- [Integrations: GCP](/integrations/gcp) — service account detailed guide
- [Integrations: Azure](/integrations/azure) — service principal advanced configuration
- [Resources and inventory](/platform/resources-and-inventory) — browse discovered resources
