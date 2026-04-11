---
title: "Quickstart: SaaS"
description: "Sign up for InfraAudit, connect your first cloud account, and run your first scan in about five minutes."
icon: "cloud"
---


This guide gets you from zero to a working InfraAudit account with one connected AWS account and a completed drift scan. It takes about five minutes.

## Sign up

1. Go to [infraaudit.dev](https://infraaudit.dev) and click **Get started**.
2. Sign up with Google, GitHub, or your email and a password.
3. You land on the dashboard. It's empty — no providers are connected yet.

## Connect a cloud account

Cloud accounts are called **providers** in InfraAudit. You connect one on the Cloud Providers page.

### AWS (fastest path)

1. In the sidebar, click **Cloud Providers**.
2. Click **Connect AWS**.
3. Enter:
   - **Access Key ID** — from an IAM user or assumed role
   - **Secret Access Key** — the corresponding secret
   - **Region** — the primary region you want scanned (e.g. `us-east-1`)
   - **Display name** — anything you like (e.g. "Production")
4. Click **Connect**.

InfraAudit validates the credentials and kicks off an initial resource sync. This usually finishes in under a minute for accounts with fewer than a few hundred resources.

### What permissions does InfraAudit need?

Read-only is enough to get started. The minimum IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:List*",
        "s3:GetBucketLocation",
        "rds:Describe*",
        "lambda:List*",
        "cloudfront:List*",
        "ce:GetCostAndUsage",
        "ce:GetCostForecast"
      ],
      "Resource": "*"
    }
  ]
}
```

For vulnerability scanning and IaC drift, no additional permissions are needed — those run against data already pulled into InfraAudit.

### GCP and Azure

The connection flow is similar. See [Integrations: GCP](/integrations/gcp) and [Integrations: Azure](/integrations/azure) for the service account and service principal setup.

## Run your first scan

Once the initial sync finishes, run a drift detection scan:

1. In the sidebar, click **Drift Detection**.
2. Click **Run scan**.
3. The scan compares your current infrastructure against the baseline captured during the initial sync.

On a fresh account the first scan often returns no drift — that's expected, since the baseline was just captured. Make a change in your AWS account (add a tag, change a security group rule) and scan again to see drift appear.

## What to do next

- **Review your resources.** Click **Resources** in the sidebar to browse everything InfraAudit discovered.
- **Enable a compliance framework.** Go to **Compliance** and enable CIS AWS Benchmark to get a scored assessment.
- **Set up alerts.** Go to **Settings → Notifications** and connect a Slack channel or email address.
- **Review cost data.** Billing data syncs daily by default. The **Cost** section shows historical spend, trends, and savings recommendations.

## Next steps

- [Platform guide](/platform/overview) — full walkthrough of every section of the UI
- [Integrations](/integrations/overview) — credential requirements for each cloud provider
- [CLI quickstart](/getting-started/quickstart-cli) — do everything above without leaving the terminal
