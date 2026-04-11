---
title: "remediation"
description: "Suggest, approve, execute, and rollback fixes from the CLI."
icon: "square-terminal"
---


Manage automated remediation actions.

## `remediation summary`

```bash
infraudit remediation summary
```

## `remediation pending`

List remediation actions waiting for approval.

```bash
infraudit remediation pending
```

## `remediation suggest-drift <drift-id>`

Generate an AI-powered fix suggestion for a detected drift.

```bash
infraudit remediation suggest-drift 5
```

## `remediation suggest-vuln <vulnerability-id>`

Generate a fix suggestion for a vulnerability.

```bash
infraudit remediation suggest-vuln 7
```

## `remediation approve <action-id>`

Approve a pending remediation action.

```bash
infraudit remediation approve 3
```

## `remediation execute <action-id>`

Execute an approved remediation action.

```bash
infraudit remediation execute 3
```

## `remediation rollback <action-id>`

Rollback a previously executed action.

```bash
infraudit remediation rollback 3
```
