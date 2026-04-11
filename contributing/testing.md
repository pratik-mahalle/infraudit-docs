---
title: "Testing"
description: "How to run unit tests, integration tests, and end-to-end tests for InfraAudit."
icon: "check-circle"
---


## Running tests

```bash
# All tests
make test

# Or directly
go test ./...

# With verbose output
go test -v ./...

# A specific package
go test ./internal/services/...

# With test coverage
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Test types

### Unit tests

Unit tests live in `_test.go` files alongside the code they test. They test a single function or method in isolation, with external dependencies mocked.

Example: `internal/services/drift_service_test.go`

```go
func TestDetectDrift(t *testing.T) {
  baseline := map[string]any{"encryption": true}
  current := map[string]any{"encryption": false}

  diffs := detectDrift(baseline, current)

  assert.Len(t, diffs, 1)
  assert.Equal(t, "encryption", diffs[0].Path)
  assert.Equal(t, true, diffs[0].BaselineValue)
  assert.Equal(t, false, diffs[0].CurrentValue)
}
```

### Integration tests

Integration tests run against a real (test) Postgres database. They test the full stack from handler to database and back.

```bash
# Integration tests require a running Postgres
DB_DRIVER=postgres DB_NAME=infraudit_test go test ./internal/api/... -tags integration
```

The test database is created automatically using migrations if it doesn't exist. Tests clean up after themselves using transaction rollbacks.

### Provider tests

Provider client tests run against mocked cloud APIs (using `httptest.Server`). No real cloud credentials are needed:

```bash
go test ./internal/providers/...
```

## Test utilities

Common test helpers live in `internal/testutil/`:

- `testutil.NewTestDB()` — spins up an in-memory SQLite database with migrations applied
- `testutil.NewTestServer()` — creates a test HTTP server with the full router configured
- `testutil.SetupProvider()` — creates a test provider record with fake credentials
- `testutil.MockAWSClient()` — returns an AWS client that returns canned responses

## Linting

```bash
make lint
# or
golangci-lint run
```

The lint config lives in `.golangci.yml`. Key checks: `errcheck`, `govet`, `staticcheck`, `godot`, `gofmt`.

## CI

Tests run automatically on every pull request via GitHub Actions. The CI pipeline:

1. Runs `go test ./...` against a Postgres container
2. Runs `golangci-lint`
3. Checks `go vet`
4. Verifies the build compiles

See `.github/workflows/ci.yml` for the full pipeline definition.

## Writing new tests

Guidelines:

- Name test functions `Test<FunctionName>_<scenario>` (e.g. `TestDetectDrift_EmptyBaseline`).
- Use `github.com/stretchr/testify/assert` and `require` for assertions.
- Mock external dependencies (cloud provider APIs, Gemini) using interfaces — don't make real API calls in tests.
- Keep tests deterministic — no sleeps, no reliance on real time.
- Clean up any database state after each test.
