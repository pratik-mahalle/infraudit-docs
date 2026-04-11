---
title: "OpenAPI Spec"
description: "Use the auto-generated OpenAPI 3.0 spec with Postman, Swagger UI, or code generators."
icon: "file-code"
---


InfraAudit's Go backend auto-generates an OpenAPI 3.0 spec from handler annotations using [swaggo/swag](https://github.com/swaggo/swag).

## Viewing the spec

### Swagger UI (when server is running)

```
http://localhost:8080/swagger/index.html
```

### Raw JSON

```bash
curl http://localhost:8080/swagger/doc.json > openapi.json
```

The file is also committed at `docs/swagger.json` in the backend repo.

## Regenerating

After adding or changing handler annotations:

```bash
make swagger
# or
swag init -g cmd/api/main.go -o docs --parseDependency --parseInternal
```

The generated files in `docs/` are committed to source control and validated in CI.

## Using with external tools

| Tool | How to use |
|---|---|
| **Postman** | File → Import → select `swagger.json` |
| **Swagger Editor** | Paste into [editor.swagger.io](https://editor.swagger.io) |
| **OpenAPI Generator** | `openapi-generator generate -i swagger.json -g python -o ./client` |
| **Stoplight** | Import `swagger.json` or `swagger.yaml` |

## Handler annotation example

```go
// List returns all drifts
// @Summary List drifts
// @Description Get paginated drift detections
// @Tags Drifts
// @Produce json
// @Param severity query string false "Filter by severity"
// @Success 200 {object} utils.PaginatedResponse{data=[]dto.DriftDTO}
// @Failure 401 {object} utils.ErrorResponse
// @Security BearerAuth
// @Router /api/v1/drifts [get]
func (h *DriftHandler) List(w http.ResponseWriter, r *http.Request) {
```

See `docs/README.md` in the backend repo for the full annotation reference.
