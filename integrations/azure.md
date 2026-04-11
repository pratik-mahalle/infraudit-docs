---
title: "Azure"
description: "Connect an Azure subscription to InfraAudit using a service principal."
icon: "microsoft"
---


InfraAudit connects to Azure using a service principal. It discovers Virtual Machines, Storage Accounts, SQL Servers, and resource groups, and ingests billing data from the Azure Cost Management API.

## Prerequisites

- An Azure subscription
- A service principal with Reader permissions on the subscription
- Azure CLI or the Azure portal to create the service principal

## Creating the service principal

Using the Azure CLI:

```bash
az ad sp create-for-rbac \
  --name "infraudit-reader" \
  --role Reader \
  --scopes /subscriptions/<subscription-id> \
  --output json
```

Output:

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

Keep this output. You'll need all four values when connecting.

## Required permissions

| Role | Scope | Purpose |
|---|---|---|
| `Reader` | Subscription | Read all resource metadata |
| Cost Management Reader (optional) | Subscription | Read billing data via Cost Management API |

If you want billing data, also assign the **Cost Management Reader** role:

```bash
az role assignment create \
  --assignee <clientId> \
  --role "Cost Management Reader" \
  --scope /subscriptions/<subscription-id>
```

## Connecting from the UI

1. Click **Cloud Providers → Connect Azure**.
2. Enter:
   - **Client ID** (`clientId`)
   - **Client Secret** (`clientSecret`)
   - **Tenant ID** (`tenantId`)
   - **Subscription ID** (`subscriptionId`)
   - **Display name**
3. Click **Connect**.

## Connecting from the CLI

```bash
infraudit provider connect azure \
  --client-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --client-secret "..." \
  --tenant-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --subscription-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
  --name "Azure Production"
```

## Connecting via the API

```bash
curl -X POST http://localhost:8080/api/v1/providers/azure/connect \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Azure Production",
    "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "clientSecret": "...",
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }'
```

## What gets synced

| Resource type | Internal type name |
|---|---|
| Virtual Machines | `azure_virtual_machine` |
| Storage Accounts | `azure_storage_account` |
| SQL Servers | `azure_sql_server` |
| Resource Groups | `azure_resource_group` |

Billing data is synced daily from the Azure Cost Management API.

## Security notes

- Credentials are encrypted at rest with AES-GCM.
- InfraAudit never writes to your Azure subscription. All API calls are read-only.
- Client secrets expire (by default, in 2 years for Azure AD app registrations). Set a reminder to rotate the secret before it expires, then update the provider credentials in InfraAudit.
