---
title: "Glossary"
description: "Definitions for terms used across InfraAudit documentation, CLI, and API."
icon: "book"
---


Reference definitions for terms used across the InfraAudit UI, CLI, and API.

| Term | Definition |
|---|---|
| **Alert** | A user-facing notification about a finding that needs attention. Generated automatically from drifts, vulnerabilities, cost anomalies, and compliance failures. |
| **Anomaly** | A cost spike that exceeds the expected range based on recent historical patterns. |
| **Assessment** | A single run of a compliance framework against your connected resources. Produces a score and control-level results. |
| **Baseline** | A saved snapshot of a resource's configuration at a point in time. Drift detection compares live state against baselines. |
| **Compliance framework** | A set of controls that your infrastructure is evaluated against (e.g. CIS Benchmarks, SOC2, NIST 800-53). |
| **Control** | A single rule within a compliance framework (e.g. "S3 buckets must have encryption enabled"). |
| **CVE** | Common Vulnerabilities and Exposures — an identifier for a publicly known security vulnerability. |
| **CVSS** | Common Vulnerability Scoring System — a numeric score (0–10) quantifying CVE severity. |
| **Drift** | A detected difference between a resource's current configuration and its baseline. |
| **External ID** | The cloud provider's identifier for a resource (e.g. AWS ARN, GCP resource URI, Azure resource ID). |
| **IaC** | Infrastructure as Code — configuration files (Terraform, CloudFormation, Kubernetes manifests) that declare the desired state of infrastructure. |
| **IaC drift** | Difference between live resource state and the configuration declared in an IaC file. |
| **Job** | A scheduled background task (resource sync, drift detection, vulnerability scan, cost sync, compliance check). |
| **Job execution** | A single run of a job, with start/end time, status, and log output. |
| **NVD** | National Vulnerability Database — the US government's repository of CVE data including CVSS scores and descriptions. |
| **Provider** | A connected cloud account. Each provider has a type (aws, gcp, azure, kubernetes) and stores encrypted credentials. |
| **Recommendation** | An AI-generated or rule-based suggestion for cost savings, security hardening, or performance improvements. |
| **Remediation** | A proposed or applied fix to a finding. Goes through a suggest → approve → execute lifecycle with optional rollback. |
| **Resource** | A single cloud resource discovered by a provider sync (e.g. EC2 instance, S3 bucket, GCS bucket). |
| **Resource type** | The category of a resource (e.g. `ec2_instance`, `s3_bucket`, `rds_instance`). |
| **Severity** | A classification of a finding's risk: critical, high, medium, or low. |
| **Supabase** | The authentication backend InfraAudit uses for user accounts, JWT signing, and OAuth. |
| **Trivy** | The open-source vulnerability scanner used by InfraAudit to find CVEs in container images and OS packages. |
| **Webhook** | An outbound HTTP endpoint that InfraAudit POSTs to when subscribed events fire. |
