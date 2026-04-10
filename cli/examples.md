---
title: "Examples"
description: "Ready-to-use CLI examples for common InfraAudit workflows."
icon: "code"
---

# CLI examples

## Security audit

```bash
infraudit config init
infraudit auth login

infraudit provider connect aws
infraudit provider sync 1

infraudit drift detect
infraudit vuln scan

infraudit drift list --severity critical
infraudit vuln top
infraudit alert list --severity high

infraudit remediation suggest-drift 1
infraudit remediation approve 1
infraudit remediation execute 1

infraudit drift list --status resolved
infraudit status
```

## Cost optimization

```bash
infraudit cost sync
infraudit cost overview
infraudit cost trends --period 30d
infraudit cost anomalies
infraudit cost forecast --days 90

infraudit rec generate
infraudit rec list --type cost
infraudit rec savings
infraudit rec apply 10
```

## Compliance assessment

```bash
infraudit compliance frameworks
infraudit compliance enable cis-aws
infraudit compliance assess --framework cis-aws
infraudit compliance overview
infraudit compliance failing-controls
infraudit compliance export 1
```

## Kubernetes

```bash
infraudit k8s register --name production --kubeconfig ~/.kube/config
infraudit k8s sync 1
infraudit k8s deployments 1
infraudit k8s stats
```

## JSON scripting

```bash
# All resource IDs
infraudit resource list -o json | jq '.[].id'

# Resources by type
infraudit resource list -o json | jq 'group_by(.resource_type) | map({type: .[0].resource_type, count: length})'

# Total potential savings
infraudit rec list -o json | jq '[.[].estimated_savings] | add'

# Drift list as CSV
infraudit drift list -o json | jq -r '.[] | [.id, .drift_type, .severity, .status] | @csv'
```
