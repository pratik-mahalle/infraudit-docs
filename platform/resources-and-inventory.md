---
title: "Resources and Inventory"
description: "Browse and filter the cloud resources InfraAudit discovers across your connected accounts."
icon: "server"
---


The **Resources** section lists every cloud resource InfraAudit has discovered across your connected providers. It's the inventory layer everything else builds on — drifts, vulnerabilities, costs, and compliance findings all reference a specific resource.

## Resource list

The resource table shows:

| Column | Description |
|---|---|
| **Name** | Resource's display name or ID |
| **Type** | Resource type: `ec2_instance`, `s3_bucket`, `rds_instance`, etc. |
| **Provider** | The cloud account it belongs to |
| **Region** | AWS region, GCP zone, Azure location, or cluster name |
| **Status** | `active`, `stopped`, or `deleted` |
| **Last seen** | When InfraAudit last synced this resource |

## Filtering

Use the filter bar above the table to narrow down by:

- **Provider** — one or more connected accounts
- **Type** — resource type (multi-select)
- **Region** — one or more regions
- **Status** — active, stopped, deleted
- **Tag** — key/value tag search (AWS tags, GCP labels, Azure tags)

Filters are applied client-side, so results update without a page reload.

## Resource detail

Click any resource to open the detail panel. It shows:

### Overview tab

- External ID (ARN, URI, or provider ID)
- Region and account
- Tags / labels
- Last configuration snapshot (raw JSON)
- Status history

### Drifts tab

A timeline of drift findings for this resource. Each drift shows the type (configuration, security, compliance), severity, detected time, and status.

### Vulnerabilities tab

CVEs matched against this resource, sorted by CVSS score. Each row links to the NVD advisory.

### Cost tab

Monthly spend attributed to this resource for the last 6 months, if billing data is available for the resource type.

### Recommendations tab

AI-generated or rule-based suggestions specific to this resource.

## Supported resource types

| Provider | Resource types |
|---|---|
| **AWS** | EC2 instances, S3 buckets, RDS instances, Lambda functions, CloudFront distributions, VPCs, subnets, security groups |
| **GCP** | Compute instances, Cloud Storage buckets, BigQuery datasets, GKE clusters |
| **Azure** | Virtual machines, Storage accounts, SQL servers |
| **Kubernetes** | Deployments, pods, services, namespaces |

## Exporting the inventory

From the resource list, click **Export** to download a CSV of the current filtered view. The CSV includes all visible columns plus the resource's external ID and tags.

## Manual resource actions

From the resource detail panel you can:

- **Capture baseline** — snapshot the current configuration as a new baseline
- **Run vulnerability scan** — scan this resource immediately
- **Request recommendation** — generate an AI recommendation for this resource

## Next steps

- [Drift detection](/platform/drift-detection)
- [Vulnerabilities](/platform/vulnerabilities)
- [CLI: resource commands](/cli/commands/resource)
