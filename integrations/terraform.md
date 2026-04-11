---
title: "Terraform"
description: "Upload Terraform files to InfraAudit and detect drift between your declared and live infrastructure."
icon: "code"
---


InfraAudit can ingest Terraform configuration files and compare them against the live state of your cloud infrastructure. This catches IaC drift — cases where someone changed a resource in the cloud console without updating the Terraform code.

## How IaC drift works

1. Upload a `.tf` file (or multiple files as a ZIP) to InfraAudit.
2. InfraAudit parses the file and extracts the resources it declares — their types, names, and configuration attributes.
3. InfraAudit matches declared resources to live resources discovered by your connected providers.
4. For each matched resource, it diffs the declared configuration against the live configuration.
5. Differences become IaC drift findings.

## Uploading Terraform files

### From the UI

1. In the sidebar, click **IaC**.
2. Click **Upload IaC definition**.
3. Choose **Terraform** as the type.
4. Upload your `.tf` file or a ZIP containing multiple `.tf` files.
5. (Optional) tag the upload with a name like "main/vpc" for easy identification.
6. Click **Upload**. InfraAudit parses the file and immediately runs a drift comparison.

### From the CLI

```bash
# Upload a single file
infraudit iac upload --provider terraform --file main.tf

# Upload a directory as a ZIP
zip -r infra.zip .
infraudit iac upload --provider terraform --file infra.zip --name "main"

# Upload and wait for drift results
infraudit iac upload --provider terraform --file main.tf --wait
```

### Via the API

```bash
curl -X POST http://localhost:8080/api/v1/iac/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@main.tf" \
  -F "type=terraform" \
  -F "name=main"
```

## Viewing IaC drift

After uploading, go to **IaC** in the sidebar. Each uploaded definition shows:

- Upload timestamp
- Parse status (success or parse error with line details)
- Number of resources declared
- Number of matched live resources
- Number of drift findings

Click a definition to see the drift detail — a table of declared vs live values for each drifted attribute.

## Supported resource types for matching

InfraAudit matches Terraform resources by type and identifier:

| Terraform resource type | Matched on |
|---|---|
| `aws_instance` | Instance ID (`instance_id` tag or name) |
| `aws_s3_bucket` | Bucket name |
| `aws_db_instance` | DB identifier |
| `aws_lambda_function` | Function name |
| `aws_security_group` | Group ID |
| `google_compute_instance` | Instance name |
| `azurerm_virtual_machine` | VM name |

Resources that can't be matched are shown as "unmatched" and don't produce drift findings.

## CI/CD integration

Run IaC drift detection in your Terraform pipeline:

```yaml
# GitHub Actions example
- name: Check IaC drift
  run: |
    infraudit iac upload --provider terraform --file main.tf --wait
    DRIFT_COUNT=$(infraudit iac drift list -o json | jq length)
    if [ "$DRIFT_COUNT" -gt 0 ]; then
      echo "IaC drift detected: $DRIFT_COUNT findings"
      infraudit iac drift list
      exit 1
    fi
  env:
    INFRAUDIT_SERVER_URL: ${{ secrets.INFRAUDIT_URL }}
    INFRAUDIT_TOKEN: ${{ secrets.INFRAUDIT_TOKEN }}
```

## Notes

- InfraAudit parses `.tf` files statically. It does not run `terraform plan` or interact with your Terraform state backend.
- Variables and dynamic references in `.tf` files are resolved where possible (literal values) and left unmatched otherwise.
- Sensitive attributes (passwords, secrets) are redacted in drift reports.
