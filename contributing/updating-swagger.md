---
title: "Updating Swagger Docs"
description: "How to regenerate the OpenAPI spec after modifying API handlers."
icon: "file-code"
---


InfraAudit uses [swaggo/swag](https://github.com/swaggo/swag) to generate an OpenAPI 3.0 spec from Go code annotations. After adding or modifying an endpoint, regenerate the spec.

## Install swag

```bash
go install github.com/swaggo/swag/cmd/swag@latest
```

## Add annotations

Add swaggo annotations to your handler function. Example:

```go
// GetDrift godoc
//
// @Summary Get a drift finding by ID
// @Description Returns a single drift finding with baseline/current diff
// @Tags drifts
// @Produce json
// @Param id path int true "Drift ID"
// @Success 200 {object} models.Drift
// @Failure 404 {object} api.ErrorResponse
// @Failure 401 {object} api.ErrorResponse
// @Router /api/v1/drifts/{id} [get]
// @Security BearerAuth
func (h *DriftHandler) GetDrift(w http.ResponseWriter, r *http.Request) {
  // ...
}
```

Key annotation fields:

| Field | Description |
|---|---|
| `@Summary` | Short one-line description (shown in Swagger UI) |
| `@Description` | Longer description (optional) |
| `@Tags` | Groups the endpoint in the Swagger UI |
| `@Param` | Request parameters (path, query, body) |
| `@Success` | Success response schema |
| `@Failure` | Error response schemas |
| `@Router` | Path and HTTP method |
| `@Security` | Auth requirement |

## Regenerate the spec

```bash
# From the repo root
make swagger

# Or directly
swag init -g cmd/api/main.go -o docs/swagger
```

This updates `docs/swagger/swagger.json` and `docs/swagger/swagger.yaml`.

## View in Swagger UI

With the API running, open `http://localhost:8080/swagger/index.html`. The UI reads the spec at runtime.

## Common errors

**`swag: command not found`**

Add the Go bin directory to your PATH:

```bash
export PATH=$PATH:$(go env GOPATH)/bin
```

**Missing model in the spec**

Add the model to the `@Success` annotation:

```go
// @Success 200 {object} models.Drift
```

And ensure the `models.Drift` struct has JSON tags and is exported.

**Spec doesn't reflect your changes**

Re-run `make swagger` and restart the API. The Swagger UI serves the spec from the built binary, not live from disk.

## CI validation

A CI check compares the committed `docs/swagger/swagger.json` against the freshly generated spec. If they differ, the check fails. Always commit the updated spec after running `make swagger`.
