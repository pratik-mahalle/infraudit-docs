---
title: "provider"
description: "Connect, sync, and disconnect cloud provider accounts with the CLI."
icon: "square-terminal"
---


Manage cloud provider connections: AWS, GCP, and Azure.

## `provider list`

List all connected providers.

```bash
infraudit provider list
```

## `provider connect <aws|gcp|azure>`

Connect a new cloud provider. Prompts interactively for credentials.

```bash
# Connect AWS
infraudit provider connect aws
# > AWS Access Key ID: AKIA...
# > AWS Secret Access Key: ********
# > AWS Region [us-east-1]: us-west-2

# Connect GCP
infraudit provider connect gcp
# > GCP Project ID: my-project
# > Path to service account JSON: /path/to/key.json

# Connect Azure
infraudit provider connect azure
# > Azure Tenant ID: ...
# > Azure Client ID: ...
# > Azure Client Secret: ********
# > Azure Subscription ID: ...
```

## `provider sync <provider-id>`

Trigger a resource sync from a connected provider.

```bash
infraudit provider sync 1
# Syncing resources...
# Sync complete: 47 found, 12 created, 35 updated
```

## `provider disconnect <provider-id>`

Disconnect and remove a provider. Credential data is deleted; historical scan data is kept.

```bash
infraudit provider disconnect 1
```

## `provider status`

Show sync status for all connected providers.

```bash
infraudit provider status
```
