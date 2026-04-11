---
title: "Pagination"
description: "How list endpoints handle pagination in the InfraAudit API."
icon: "list-ordered"
---


List endpoints return paginated results using `page` and `pageSize` (or `limit`/`offset`) query parameters.

## Request parameters

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number (1-indexed) |
| `pageSize` | `20` | Items per page (max 100) |

```bash
# Page 2, 50 items per page
curl "http://localhost:8080/api/v1/resources?page=2&pageSize=50" \
  -H "Authorization: Bearer $TOKEN"
```

## Response format

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "pageSize": 50,
    "total": 234,
    "totalPages": 5
  }
}
```

## Fetching all results

To collect all items programmatically:

```bash
page=1
all_items="[]"

while true; do
  response=$(curl -s "http://localhost:8080/api/v1/resources?page=$page&pageSize=100" \
    -H "Authorization: Bearer $TOKEN")
  
  items=$(echo "$response" | jq '.data')
  total_pages=$(echo "$response" | jq '.pagination.totalPages')
  
  all_items=$(echo "$all_items $items" | jq -s 'add')
  
  [ "$page" -ge "$total_pages" ] && break
  page=$((page + 1))
done
```
