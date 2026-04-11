---
title: "Integrations"
description: "Connect InfraAudit to your cloud accounts, IaC tooling, and notification channels."
icon: "plug"
---


InfraAudit connects to cloud providers, IaC tools, vulnerability scanners, and notification systems.

## Cloud providers

- [AWS](/integrations/aws) — access key credentials, Cost Explorer, EC2, S3, RDS, Lambda
- [GCP](/integrations/gcp) — service account JSON, Compute, Cloud Storage, BigQuery billing
- [Azure](/integrations/azure) — service principal, VMs, Storage Accounts, Cost Management
- [Kubernetes](/integrations/kubernetes) — kubeconfig upload, multi-cluster management

## Infrastructure as Code

- [Terraform](/integrations/terraform) — upload `.tf` files, compare live state vs declared state
- [CloudFormation](/integrations/cloudformation) — upload YAML/JSON templates, detect IaC drift

## Notifications

- [Slack](/integrations/slack) — webhook-based alerts routed to any channel
- [Email](/integrations/email) — SMTP or SendGrid for alert delivery
- [Webhooks](/integrations/webhooks) — custom HTTP endpoints for any event type

## Security scanning

- [Trivy and NVD](/integrations/trivy-and-nvd) — container image scanning, CVE enrichment
