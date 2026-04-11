---
title: "CloudFormation"
description: "Upload CloudFormation templates to InfraAudit and detect drift from your declared stack state."
icon: "aws"
---


InfraAudit parses CloudFormation templates (YAML or JSON) and compares them against the live state of matched AWS resources. This surfaces cases where someone modified a resource in the console without updating the stack.

## Uploading a template

### From the UI

1. In the sidebar, click **IaC**.
2. Click **Upload IaC definition**.
3. Choose **CloudFormation** as the type.
4. Upload your `.yaml` or `.json` template file.
5. (Optional) add a name for the definition.
6. Click **Upload**.

### From the CLI

```bash
# Upload a YAML template
infraudit iac upload --provider cloudformation --file template.yaml

# Upload a JSON template
infraudit iac upload --provider cloudformation --file template.json --name "network-stack"
```

### Via the API

```bash
curl -X POST http://localhost:8080/api/v1/iac/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@template.yaml" \
  -F "type=cloudformation" \
  -F "name=network-stack"
```

## How resource matching works

InfraAudit matches CloudFormation `Resources` of known types to the corresponding live InfraAudit resources. Matching uses the logical resource ID and the physical resource ID (where resolvable).

| CloudFormation resource type | Matched on |
|---|---|
| `AWS::EC2::Instance` | Instance ID |
| `AWS::S3::Bucket` | Bucket name |
| `AWS::RDS::DBInstance` | DB identifier |
| `AWS::Lambda::Function` | Function name |
| `AWS::EC2::SecurityGroup` | Security group ID |

## Viewing drift

After upload, click the definition in the **IaC** list. You see:

- Parse status (success or parse error with line number)
- Resources declared in the template
- Resources matched to live inventory
- Drift findings: declared attribute vs. live value

## Parameters and intrinsic functions

InfraAudit resolves CloudFormation intrinsic functions (`!Ref`, `!Sub`, `!Join`) where the values are static or can be inferred from the template. Dynamic values (cross-stack references via `!ImportValue`, runtime parameters) are left unresolved and excluded from drift comparison.

## Notes

- InfraAudit does not interact with the CloudFormation service directly. It does not create, update, or delete stacks.
- Drift detection compares template-declared attributes against live resource configuration — not CloudFormation stack drift detection (which compares stack state to actual resource state).
- For continuous monitoring, upload updated templates as part of your CI/CD pipeline after each deployment.
