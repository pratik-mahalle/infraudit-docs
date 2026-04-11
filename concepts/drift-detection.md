---
title: "Drift Detection"
description: "How InfraAudit captures baselines, runs comparisons, and classifies drift findings."
icon: "radar"
---


Drift detection is the process of comparing a cloud resource's current configuration against a known baseline and surfacing the differences. This page explains how InfraAudit implements it.

## Baseline capture

A **baseline** is a JSON snapshot of a resource's configuration at a point in time. It contains the complete attribute set returned by the cloud provider API for that resource type — security group rules, encryption settings, tags, network configuration, and more.

Baselines are captured in two ways:

1. **Automatic:** During the initial resource sync after connecting a provider, InfraAudit captures a baseline for every discovered resource.
2. **Manual:** A user can capture a new baseline at any time from the resource detail panel or CLI.

```bash
# Capture a new baseline for a specific resource
infraudit baseline create --resource <resource-id>

# List baselines for a resource
infraudit baseline list --resource <resource-id>
```

## Comparison algorithm

When the drift detection job runs:

1. For each active resource, fetch the current configuration from the cloud provider API.
2. Retrieve the most recent baseline for that resource.
3. Perform a deep JSON diff between the baseline and the current configuration.
4. For each difference found, evaluate its drift type and severity.

The comparison is attribute-aware — some fields are excluded from drift detection by default (e.g. metadata timestamps, internal tracking IDs) to reduce false positives.

## Drift classification

Each detected difference is classified by type and severity:

### Type

| Type | Classification rule |
|---|---|
| **Configuration** | Any change not meeting the security or compliance criteria below |
| **Security** | Changes to ingress/egress rules, encryption settings, public access policies, IAM permissions |
| **Compliance** | Changes that violate a control in an enabled compliance framework |

### Severity

Severity is determined by a set of rules per resource type. Examples:

| Change | Severity |
|---|---|
| S3 bucket `BlockPublicAcls` set to `false` | Critical |
| Security group: inbound 0.0.0.0/0 added on port 22 | High |
| EC2 instance type changed | Medium |
| Resource tag added or removed | Low |

## IaC drift

A separate drift type: **IaC drift** compares live resources against Infrastructure-as-Code declarations (Terraform, CloudFormation, Kubernetes manifests) rather than against baselines.

IaC drift uses static analysis of the uploaded files rather than the provider API, so it runs faster and does not require cloud API calls beyond what's already cached.

See [Integrations: Terraform](/integrations/terraform) and [Integrations: CloudFormation](/integrations/cloudformation).

## Scan frequency

The drift scanner runs on a cron schedule (default: every 4 hours). You can also trigger it manually:

```bash
infraudit drift detect
```

Triggered scans run immediately and store results alongside the scheduled runs.

## Drift lifecycle

```
detected → investigating → resolved
```

- **Detected:** The scanner found a difference. No human has reviewed it yet.
- **Investigating:** A user acknowledged the finding and is investigating.
- **Resolved:** The underlying change was either reverted or the baseline was updated to accept the new configuration.

## Baseline promotion

After a planned change (e.g. a deployment that intentionally changes configuration), you can promote the current live state to a new baseline to clear existing drift:

```bash
infraudit baseline create --resource <resource-id> --promote
```

This closes any existing drift findings for the resource and sets the new configuration as the next comparison target.

## False positive rate

InfraAudit's comparison logic excludes fields that change frequently without operational significance (timestamps, lease durations, generated resource IDs). Provider-specific exclusion lists live in `internal/providers/<provider>/exclude.go`.

If you find that a specific attribute is producing unwanted drift findings, open an issue on GitHub to have it added to the exclusion list, or suppress it with a drift rule in the UI.
