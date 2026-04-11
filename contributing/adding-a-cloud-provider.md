---
title: "Adding a Cloud Provider"
description: "How to implement a new cloud provider integration in the InfraAudit Go backend."
icon: "cloud-plus"
---


Implementing a new cloud provider in InfraAudit requires four parts: a provider client, a connect endpoint, resource sync logic, and (optionally) cost ingestion.

## Step 1: Define the provider type

Add the new provider type string to `internal/models/provider.go`:

```go
const (
  ProviderTypeAWS        = "aws"
  ProviderTypeGCP        = "gcp"
  ProviderTypeAzure      = "azure"
  ProviderTypeKubernetes = "kubernetes"
  ProviderTypeOracle     = "oracle"  // new
)
```

## Step 2: Create the provider package

Create `internal/providers/oracle/`:

```
internal/providers/oracle/
├── client.go       # Provider client (implements Provider interface)
├── resources.go    # Resource discovery functions
├── cost.go         # Billing data ingest (optional)
└── client_test.go
```

### Implement the Provider interface

```go
// internal/providers/interface.go
type Provider interface {
  Connect(ctx context.Context, creds map[string]string) error
  SyncResources(ctx context.Context, providerID int) ([]models.Resource, error)
  GetResourceConfig(ctx context.Context, externalID string) (map[string]any, error)
  ValidateCredentials(ctx context.Context, creds map[string]string) error
}
```

### client.go example

```go
package oracle

import (
  "context"
  "internal/models"
)

type OracleClient struct {
  tenancyID  string
  userID     string
  privateKey string
  region     string
}

func New(creds map[string]string) (*OracleClient, error) {
  return &OracleClient{
    tenancyID:  creds["tenancyId"],
    userID:     creds["userId"],
    privateKey: creds["privateKey"],
    region:     creds["region"],
  }, nil
}

func (c *OracleClient) ValidateCredentials(ctx context.Context, creds map[string]string) error {
  // Try a lightweight API call to verify the credentials work
  // Return an error with a human-readable message if they don't
  return nil
}
```

## Step 3: Add the connect endpoint

In `internal/api/handlers/providers.go`, add a case for the new provider type:

```go
case "oracle":
  client, err := oracle.New(credentials)
  if err != nil {
    return nil, err
  }
  if err := client.ValidateCredentials(ctx, credentials); err != nil {
    return nil, fmt.Errorf("invalid credentials: %w", err)
  }
```

Add a route in `internal/api/router.go`:

```go
r.Post("/api/v1/providers/oracle/connect", h.ConnectOracleProvider)
```

## Step 4: Resource type mapping

Define the resource type constants for the new provider:

```go
// internal/models/resource_type.go
const (
  ResourceTypeOracleInstance = "oracle_compute_instance"
  ResourceTypeOracleBucket   = "oracle_object_storage_bucket"
)
```

## Step 5: Register the provider in the job scheduler

In `internal/jobs/resource_sync.go`, add the new provider to the sync loop:

```go
case models.ProviderTypeOracle:
  client, err = oracle.New(decryptedCreds)
```

## Step 6: Write tests

Create `internal/providers/oracle/client_test.go` with tests that use a `httptest.Server` to mock the Oracle API responses.

```go
func TestSyncResources(t *testing.T) {
  server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(mockOracleInstanceList)
  }))
  defer server.Close()

  client := &OracleClient{endpoint: server.URL}
  resources, err := client.SyncResources(context.Background(), 1)
  require.NoError(t, err)
  assert.Len(t, resources, 2)
}
```

## Step 7: Document the integration

Add a page to `integrations/<provider>.md` following the structure of `integrations/aws.md`. Include:

- Credential requirements
- IAM/permission setup instructions
- What resource types get synced
- A curl connect example

Open a pull request following the [PR process](/contributing/pull-request-process).
