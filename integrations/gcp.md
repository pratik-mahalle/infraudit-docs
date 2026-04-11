---
title: "GCP"
description: "Connect a Google Cloud project to InfraAudit using a service account."
icon: "google"
---


InfraAudit connects to Google Cloud using a service account JSON key. It discovers Compute Engine instances, Cloud Storage buckets, BigQuery datasets, and GKE clusters, and ingests billing data from BigQuery billing export.

## Prerequisites

- A GCP project with the resources you want to monitor
- A service account with the required roles (see below)
- A JSON key file for the service account

## Creating the service account

```bash
# Create the service account
gcloud iam service-accounts create infraudit-reader \
  --display-name="InfraAudit Reader" \
  --project=your-project-id

# Grant required roles
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:infraudit-reader@your-project-id.iam.gserviceaccount.com" \
  --role="roles/viewer"

gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:infraudit-reader@your-project-id.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Create the key file
gcloud iam service-accounts keys create infraudit-key.json \
  --iam-account="infraudit-reader@your-project-id.iam.gserviceaccount.com"
```

## Required roles

| Role | Purpose |
|---|---|
| `roles/viewer` | Read access to Compute, Storage, and other resource types |
| `roles/bigquery.dataViewer` | Read billing export tables in BigQuery |

## Billing data setup

To ingest billing data, you need to enable BigQuery billing export first:

1. In the GCP console, go to **Billing → Billing export**.
2. Under **BigQuery export**, enable **Standard usage cost** export.
3. Choose or create a BigQuery dataset to receive the export (e.g. `billing_export`).
4. Note the **Project ID** and **Dataset name** — you'll need them when connecting.

Billing data export has a 1-to-2 day lag from GCP.

## Connecting from the UI

1. Click **Cloud Providers → Connect GCP**.
2. Paste the contents of `infraudit-key.json` into the **Service Account JSON** field.
3. Enter the **Project ID**.
4. (Optional) Enter the **Billing BigQuery dataset** name if you set up billing export.
5. Click **Connect**.

## Connecting from the CLI

```bash
infraudit provider connect gcp \
  --service-account-key "$(cat infraudit-key.json)" \
  --project-id your-project-id \
  --billing-dataset billing_export \
  --name "GCP Production"
```

## Connecting via the API

```bash
curl -X POST http://localhost:8080/api/v1/providers/gcp/connect \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GCP Production",
    "serviceAccountJson": "{ \"type\": \"service_account\", ... }",
    "projectId": "your-project-id",
    "billingDataset": "billing_export"
  }'
```

## What gets synced

| Resource type | Internal type name |
|---|---|
| Compute Engine instances | `gcp_compute_instance` |
| Cloud Storage buckets | `gcp_storage_bucket` |
| BigQuery datasets | `gcp_bigquery_dataset` |
| GKE clusters | `gcp_gke_cluster` |

Billing data is synced daily from BigQuery.

## Security notes

- The service account JSON key is encrypted at rest with AES-GCM.
- InfraAudit never writes to your GCP project. All API calls are read-only.
- The `roles/viewer` role grants read access across all GCP services in the project. If you want a narrower scope, you can replace it with a custom role that includes only the specific APIs InfraAudit needs.
