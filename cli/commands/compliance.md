---
title: "compliance"
description: "Enable frameworks and run compliance assessments from the CLI."
icon: "square-terminal"
---


Compliance framework management and assessment.

## `compliance overview`

```bash
infraudit compliance overview
```

## `compliance frameworks`

List available frameworks (CIS, SOC2, NIST, PCI-DSS, HIPAA).

```bash
infraudit compliance frameworks
```

## `compliance enable <id>` / `compliance disable <id>`

```bash
infraudit compliance enable cis-aws
infraudit compliance disable cis-aws
```

## `compliance assess`

```bash
# All enabled frameworks
infraudit compliance assess

# One specific framework
infraudit compliance assess --framework cis-aws
```

## `compliance assessments`

```bash
infraudit compliance assessments
```

## `compliance export <assessment-id>`

Export an assessment as PDF or CSV.

```bash
infraudit compliance export 3
```

## `compliance failing-controls`

```bash
infraudit compliance failing-controls
```
