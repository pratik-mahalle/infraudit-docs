---
title: "iac"
description: "Upload Terraform and CloudFormation manifests and detect IaC drift."
icon: "square-terminal"
---


Infrastructure as Code management. Supports Terraform, CloudFormation, and Kubernetes manifests.

## `iac upload <file>`

Upload an IaC file for analysis.

```bash
infraudit iac upload main.tf
infraudit iac upload cloudformation.yaml
infraudit iac upload k8s-deployment.yaml
```

## `iac definitions`

List uploaded IaC definitions.

```bash
infraudit iac definitions
```

## `iac detect-drift`

Compare live infrastructure against uploaded IaC definitions.

```bash
infraudit iac detect-drift
```

## `iac drifts`

```bash
infraudit iac drifts
```

## `iac drift-summary`

```bash
infraudit iac drift-summary
```
