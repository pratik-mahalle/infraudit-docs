---
title: "Adding a Compliance Framework"
description: "How to add a new compliance framework and its controls to InfraAudit."
icon: "clipboard-plus"
---


Compliance frameworks in InfraAudit are defined as JSON files. Adding a new framework means writing the control definitions and registering the framework with the engine.

## Framework file structure

Each framework lives in `internal/compliance/controls/<framework-id>/`:

```
internal/compliance/controls/
├── cis-aws/
│   ├── metadata.json
│   └── controls.json
├── soc2/
│   ├── metadata.json
│   └── controls.json
└── my-custom-framework/    # new
    ├── metadata.json
    └── controls.json
```

## metadata.json

```json
{
  "id": "my-framework",
  "name": "My Custom Framework",
  "description": "Internal security baseline for our organization",
  "version": "1.0",
  "categories": ["IAM", "Storage", "Networking", "Encryption"]
}
```

## controls.json

Each control is a JSON object:

```json
[
  {
    "id": "my-framework-1.1",
    "category": "Storage",
    "title": "S3 buckets must have encryption enabled",
    "description": "All S3 buckets must have server-side encryption enabled to protect data at rest.",
    "severity": "high",
    "resource_types": ["s3_bucket"],
    "check": "configuration.Server_Side_Encryption_Configuration != null",
    "remediation": "Enable SSE-S3 or SSE-KMS encryption on the bucket via the AWS console or CLI: aws s3api put-bucket-encryption --bucket <name> --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'",
    "references": [
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html"
    ]
  }
]
```

### Check expression syntax

The `check` field is a boolean expression evaluated against the `configuration` object (the resource's JSON snapshot). Use dot notation to access nested fields.

Examples:

```
# Simple equality
configuration.encryption == "AES256"

# Null check
configuration.backup_retention_period != null

# Comparison
configuration.backup_retention_period >= 7

# Nested access
configuration.logging.enabled == true

# Boolean flag
configuration.multi_az == true
```

The expression engine is implemented in `internal/compliance/engine.go`. If you need a more complex check, add a custom evaluator function there and reference it by name:

```json
"check": "custom:s3_has_public_access_block"
```

## Registering the framework

The framework is auto-discovered from the `controls/` directory at API startup. No code changes are needed — drop the files in the right place and restart the API.

Verify registration:

```bash
curl http://localhost:8080/api/v1/compliance/frameworks | jq '.[].id'
```

Your framework ID should appear in the list.

## Testing controls

Write a test in `internal/compliance/engine_test.go`:

```go
func TestMyFrameworkControl(t *testing.T) {
  resource := &models.Resource{
      Type: "s3_bucket",
      Configuration: map[string]any{
        "Server_Side_Encryption_Configuration": nil,
      },
  }

  result := evaluateControl("my-framework-1.1", resource)
  assert.Equal(t, "failed", result.Status)
}
```

## Documenting the framework

Add the framework to the [Compliance frameworks](/concepts/compliance-frameworks) page in the docs and note which resource types it covers.

Open a pull request following the [PR process](/contributing/pull-request-process).
