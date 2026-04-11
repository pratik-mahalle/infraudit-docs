---
title: "Errors"
description: "HTTP status codes and error response format for the InfraAudit API."
icon: "triangle-alert"
---


All errors return a JSON body with a consistent structure.

## Error response format

```json
{
  "error": "resource not found",
  "code": "NOT_FOUND",
  "details": "drift with id 99 does not exist"
}
```

| Field | Type | Description |
|---|---|---|
| `error` | string | Human-readable error message |
| `code` | string | Machine-readable error code (optional) |
| `details` | string | Additional context (optional) |

## HTTP status codes

| Status | When it's returned |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created |
| `204 No Content` | Request succeeded with no body (e.g. DELETE) |
| `400 Bad Request` | Malformed JSON, missing required fields, invalid values |
| `401 Unauthorized` | Missing, expired, or invalid auth token |
| `403 Forbidden` | Valid token but insufficient permissions |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | State conflict (e.g. provider already connected) |
| `422 Unprocessable Entity` | Request is valid JSON but fails business validation |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |

## Example: handling errors in curl

```bash
response=$(curl -s -w "\n%{http_code}" http://localhost:8080/api/v1/drifts/99 \
  -H "Authorization: Bearer $TOKEN")

http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$http_code" -ne 200 ]; then
  echo "Error $http_code: $(echo $body | jq -r '.error')"
fi
```
