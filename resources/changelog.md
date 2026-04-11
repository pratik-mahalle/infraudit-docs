---
title: "Changelog"
description: "Version history and release notes for InfraAudit."
icon: "list-check"
---


All notable changes to InfraAudit are recorded here. Dates are in UTC.

## v1.0.0 — 2024-01-15

Initial public release of InfraAudit Community edition.

### Features

- **Multi-cloud support:** AWS, GCP, Azure, and Kubernetes provider integrations
- **Drift detection:** Baseline capture and configuration diff engine with severity classification
- **Vulnerability scanning:** Trivy integration with NVD enrichment for CVE lookup
- **Cost optimization:** Multi-cloud billing ingest (AWS Cost Explorer, GCP BigQuery, Azure Cost Management), trend visualization, 30/60/90-day forecasting, and anomaly detection
- **Compliance:** CIS AWS/GCP/Azure Foundations Benchmark, SOC2, NIST 800-53, PCI-DSS, and HIPAA framework engine with PDF/CSV export
- **AI recommendations:** Google Gemini integration for cost, security, and performance suggestions; rule-based fallback for offline deployments
- **IaC drift:** Terraform and CloudFormation file upload with live resource comparison
- **Job scheduler:** Cron-based background jobs for resource sync, drift detection, vulnerability scan, cost sync, and compliance checks
- **Alerts:** Slack, email, and custom webhook notification delivery with routing rules
- **Remediation:** Suggest, approve, execute, and rollback automated fixes
- **CLI:** Full-featured `infraudit` CLI covering every API endpoint
- **Self-hosting:** Docker Compose and Kubernetes manifests with Prometheus/Grafana monitoring profile

### Supported resource types (v1.0.0)

- **AWS:** EC2 instances, S3 buckets, RDS instances/clusters, Lambda functions, CloudFront distributions, VPCs, security groups
- **GCP:** Compute instances, Cloud Storage buckets, BigQuery datasets, GKE clusters
- **Azure:** Virtual machines, Storage accounts, SQL servers, resource groups
- **Kubernetes:** Deployments, pods, services, namespaces, jobs, ingresses

---

For older versions (pre-release), see the GitHub [releases page](https://github.com/pratik-mahalle/infraudit-go/releases).
