# API Contracts: Advanced Organization & UX for the Todo App

## Updated API Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks with optional search and category filtering

**Query Parameters**:
- `search` (optional, string): Keyword to search in task descriptions (case-insensitive)
- `category` (optional, string): Filter tasks by category (case-sensitive)

**Response**:
```json
[
  {
    "id": "string",
    "description": "string",
    "completed": "boolean",
    "category": "string",
    "priority": "string",
    "created_at": "string (ISO 8601 timestamp)",
    "updated_at": "string (ISO 8601 timestamp)"
  }
]
```

**Status Codes**:
- 200: Successful retrieval
- 500: Database error

**Examples**:
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?search=meeting` - Get tasks containing "meeting"
- `GET /api/tasks?category=Work` - Get tasks in "Work" category
- `GET /api/tasks?search=project&category=Work` - Get work tasks containing "project"

### POST /api/tasks
**Description**: Create a new task with optional category and priority

**Request Body**:
```json
{
  "description": "string (required)",
  "category": "string (optional, default: 'General')",
  "priority": "string (optional, default: 'Medium')"
}
```

**Response**:
```json
{
  "id": "string",
  "description": "string",
  "completed": "boolean",
  "category": "string",
  "priority": "string",
  "created_at": "string (ISO 8601 timestamp)",
  "updated_at": "string (ISO 8601 timestamp)"
}
```

**Status Codes**:
- 200: Task created successfully
- 400: Description is required
- 500: Database error

### PUT /api/tasks/{task_id}
**Description**: Update an existing task with optional category and priority

**Path Parameter**:
- `task_id` (integer): The ID of the task to update

**Request Body** (all fields optional):
```json
{
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "category": "string (optional)",
  "priority": "string (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "description": "string",
  "completed": "boolean",
  "category": "string",
  "priority": "string",
  "created_at": "string (ISO 8601 timestamp)",
  "updated_at": "string (ISO 8601 timestamp)"
}
```

**Status Codes**:
- 200: Task updated successfully
- 400: No fields to update or invalid priority value
- 404: Task not found
- 500: Database error

### PATCH /api/tasks/{task_id}/complete
**Description**: Update the completion status of a task (existing endpoint, unchanged)

### DELETE /api/tasks/{task_id}
**Description**: Delete a task (existing endpoint, unchanged)

## Additional Endpoints (Future Considerations)

### GET /api/tasks/categories
**Description**: Retrieve all unique categories from tasks

**Response**:
```json
{
  "categories": ["string"]
}
```

### GET /api/tasks/priorities
**Description**: Retrieve all unique priority levels from tasks

**Response**:
```json
{
  "priorities": ["string"]
}
```

## Validation Rules

### Priority Values
- Only accept: "Low", "Medium", "High"
- Default to "Medium" if invalid value provided
- Case-sensitive validation

### Category Values
- Accept any text value
- Default to "General" if not provided
- No specific validation rules (user-defined)

### Description Validation
- Required field
- Cannot be empty or only whitespace
- Maximum length: No enforced limit (database constraint dependent)

## Error Handling

### Standard Error Response Format
```json
{
  "detail": "string - Error message"
}
```

### Common Error Scenarios
- 400 Bad Request: Invalid input data
- 404 Not Found: Resource does not exist
- 500 Internal Server Error: Database or server issues

## Authentication & Authorization
- All endpoints are currently public (no authentication required)
- Future enhancement: Add authentication for user-specific tasks

## Rate Limiting
- No rate limiting implemented in current version
- Future enhancement: Implement rate limiting per IP/client

## Response Headers
- Content-Type: application/json
- All responses follow RESTful conventions
- Proper HTTP status codes for all scenarios