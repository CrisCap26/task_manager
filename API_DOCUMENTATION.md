# API Documentation - Task Manager

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Get All Tasks (with pagination and filters)

```http
GET /tasks
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 100) |
| sortBy | string | 'createdAt' | Field to sort by |
| sortOrder | 'ASC' \| 'DESC' | 'DESC' | Sort direction |
| completed | boolean | - | Filter by completion status |
| dueDateFrom | string (ISO) | - | Filter tasks due after this date |
| dueDateTo | string (ISO) | - | Filter tasks due before this date |
| responsible | string | - | Filter by responsible person |
| tags | string | - | Comma-separated tags |
| search | string | - | Search in title and description |

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID for authentication |

**Example:**

```bash
curl -X GET "http://localhost:3000/tasks?page=1&limit=10&completed=false&sortBy=dueDate&sortOrder=ASC" \
  -H "user-id: user123"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Tarea 1",
      "completed": false,
      "dueDate": "2024-12-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 2. Get Public Tasks

```http
GET /tasks/public
```

**Query Parameters:** Same as GET /tasks (no user-id header required)

**Example:**

```bash
curl -X GET "http://localhost:3000/tasks/public?page=1&limit=10&completed=true"
```

### 3. Get Task by ID

```http
GET /tasks/:id
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Example:**

```bash
curl -X GET "http://localhost:3000/tasks/1" \
  -H "user-id: user123"
```

### 4. Create Task

```http
POST /tasks
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Body:**

```json
{
  "title": "Tarea importante",
  "description": "Descripción de la tarea",
  "completed": false,
  "dueDate": "2024-12-31",
  "isPublic": true,
  "comments": "Notas adicionales",
  "responsible": "Juan",
  "tags": ["urgente", "importante"]
}
```

**Example:**

```bash
curl -X POST "http://localhost:3000/tasks" \
  -H "user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción",
    "completed": false,
    "dueDate": "2024-12-31",
    "isPublic": true,
    "comments": "Notas",
    "responsible": "Juan",
    "tags": ["urgente"]
  }'
```

### 5. Update Task

```http
PUT /tasks/:id
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Body:** (all fields optional)

```json
{
  "title": "Título actualizado",
  "completed": true,
  "isPublic": false,
  "responsible": "Pedro"
}
```

**Example:**

```bash
curl -X PUT "http://localhost:3000/tasks/1" \
  -H "user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{"completed": true, "isPublic": false}'
```

### 6. Delete Task

```http
DELETE /tasks/:id
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Example:**

```bash
curl -X DELETE "http://localhost:3000/tasks/1" \
  -H "user-id: user123"
```

### 7. Upload File to Task

```http
POST /tasks/:id/file
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Body:** multipart/form-data

**Constraints:**

- Max file size: 5MB
- Allowed formats: .pdf, .png, .jpg

**Example:**

```bash
curl -X POST "http://localhost:3000/tasks/1/file" \
  -H "user-id: user123" \
  -F "file=@documento.pdf"
```

### 8. Download File

```http
GET /tasks/:id/download
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

### 9. Remove File from Task

```http
DELETE /tasks/:id/file
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| user-id | Yes | User ID |

**Example:**

```bash
curl -X DELETE "http://localhost:3000/tasks/1/file" \
  -H "user-id: user123"
```

## Advanced Filter Examples

### Filter by date range

```bash
GET "/tasks?dueDateFrom=2024-01-01&dueDateTo=2024-12-31"
```

### Filter by multiple tags

```bash
GET "/tasks?tags=urgente,importante"
```

### Search in title/description

```bash
GET "/tasks?search=reunión"
```

### Combined filters

```bash
GET "/tasks?page=1&limit=5&completed=false&sortBy=dueDate&sortOrder=ASC&responsible=Juan"
```

## Response Codes

| Code | Description                    |
| ---- | ------------------------------ |
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request (validation error) |
| 404  | Not Found                      |
| 500  | Internal Server Error          |
