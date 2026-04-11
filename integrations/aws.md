---
title: "AWS"
description: "Connect an AWS account to InfraAudit: IAM policy, credentials, and what gets synced."
icon: "aws"
---


InfraAudit connects to AWS using IAM credentials. It discovers and monitors EC2 instances, S3 buckets, RDS instances, Lambda functions, CloudFront distributions, VPCs, security groups, and billing data.

## Credential options

### Option 1: IAM user access keys (simplest)

Create an IAM user with read-only permissions and generate an access key pair.

1. In the AWS console, go to **IAM → Users → Create user**.
2. Attach the InfraAudit policy (see below).
3. Go to **Security credentials → Create access key**.
4. Copy the Access Key ID and Secret Access Key.

### Option 2: Assumed role (recommended for production)

Create an IAM role that InfraAudit can assume. This avoids long-lived user credentials.

1. Create an IAM role with a Trust Policy that allows the InfraAudit service account or your IAM user to assume it.
2. Attach the InfraAudit policy to the role.
3. Pass the role ARN when connecting.

### Option 3: IAM Identity Center (SSO)

For organizations using AWS IAM Identity Center (formerly SSO), use the SSO portal to create temporary credentials and pass them to InfraAudit.

## Required IAM policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InfraAuditReadOnly",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs",
        "ec2:DescribeSubnets",
        "ec2:DescribeRegions",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "s3:GetBucketEncryption",
        "s3:GetBucketVersioning",
        "s3:GetBucketPublicAccessBlock",
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters",
        "lambda:ListFunctions",
        "lambda:GetFunctionConfiguration",
        "cloudfront:ListDistributions",
        "iam:GetAccountPasswordPolicy",
        "iam:ListUsers",
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues"
      ],
      "Resource": "*"
    }
  ]
}
```

For vulnerability scanning of EC2 instances (AMI-based scans), also add:

```json
"ec2:DescribeImages",
"ec2:DescribeSnapshots"
```

## Connecting from the UI

1. Click **Cloud Providers → Connect AWS**.
2. Enter:
   - **Access Key ID**
   - **Secret Access Key**
   - **Region** — primary sync region (resources in other regions are also discovered)
   - **Display name**
3. Click **Connect**.

## Connecting from the CLI

```bash
infraudit provider connect aws
# Access Key ID: AKIA...
# Secret Access Key: ••••••••
# Region [us-east-1]: us-east-1
# Display name: Production

# Or pass flags directly
infraudit provider connect aws \
  --access-key-id AKIA... \
  --secret-access-key "..." \
  --region us-east-1 \
  --name "Production"
```

## Connecting via the API

```bash
curl -X POST http://localhost:8080/api/v1/providers/aws/connect \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production",
    "accessKeyId": "AKIA...",
    "secretAccessKey": "...",
    "region": "us-east-1"
  }'
```

## What gets synced

| Resource type | Internal type name |
|---|---|
| EC2 instances | `ec2_instance` |
| S3 buckets | `s3_bucket` |
| RDS instances | `rds_instance` |
| RDS clusters | `rds_cluster` |
| Lambda functions | `lambda_function` |
| CloudFront distributions | `cloudfront_distribution` |
| VPCs | `vpc` |
| Security groups | `security_group` |

Billing data comes from Cost Explorer and is synced daily.

## Multi-region support

InfraAudit discovers resources across all enabled regions in your AWS account. The `region` field in the connect form sets the primary region for API calls, but the sync job iterates all accessible regions automatically.

## Multi-account support

Connect each AWS account as a separate provider. You can connect as many as your plan allows. All accounts appear in a unified resource inventory.

## Security notes

- Credentials are encrypted at rest with AES-GCM using the server's `ENCRYPTION_KEY`.
- InfraAudit never writes to your AWS account. All API calls are read-only.
- For extra security, scope the IAM policy to specific regions or resource ARN prefixes.
