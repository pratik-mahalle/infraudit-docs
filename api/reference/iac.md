---
title: "IaC"
description: "Upload Infrastructure-as-Code files and detect drift from live resources."
icon: "code"
---


Base path: `/api/v1/iac`

## Upload IaC definition

```http
POST /api/v1/iac/upload
```

Accepts a multipart/form-data upload.

**Form fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | `.tf`, `.yaml`, `.json`, or `.zip` |
| `type` | string | Yes | `terraform`, `cloudformation`, or `kubernetes` |
| `name` | string | No | Display name for this definition |
| `provider_id` | integer | No | Scope to a specific provider |

**Response `201`:**

```json
{
  "id": 3,
  "name": "main",
  "type": "terraform",
  "status": "parsed",
  "resources_declared": 12,
  "resources_matched": 10,
  "drift_count": 2,
  "uploaded_at": "2024-01-15T10:00:00Z"
}
```

If parse fails:

```json
{
  "id": 3,
  "status": "parse_error",
  "error": "line 42: unexpected token '}'"
}
```

## List IaC definitions

```http
GET /api/v1/iac
```

## Get IaC definition

```http
GET /api/v1/iac/:id
```

## List IaC drift

```http
GET /api/v1/iac/:id/drift
```

Returns the list of drift findings for this IaC definition.

**Response:**

```json
[
  {
    "resource_external_id": "aws_instance.web",
    "resource_id": 15,
    "attribute": "instance_type",
    "declared_value": "t3.medium",
    "live_value": "t3.large"
  }
]
```

## Delete IaC definition

```http
DELETE /api/v1/iac/:id
```

Returns `204 No Content`.
