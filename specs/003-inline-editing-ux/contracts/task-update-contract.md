# API Contract: Task Update Operations

## Overview
This contract defines the API endpoints for updating task properties, specifically focusing on category and priority updates that will be triggered by the inline editing feature.

## Endpoints

### PATCH /api/tasks/{task_id}
Updates specific properties of a task, including category and priority fields.

#### Request
- **Method**: PATCH
- **Path**: `/api/tasks/{task_id}`
- **Content-Type**: `application/json`

##### Parameters
- `task_id` (path, integer, required): The ID of the task to update

##### Request Body
```json
{
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "category": "string (optional)",
  "priority": "string (optional)"
}
```

#### Responses
- **200 OK**: Task updated successfully
- **400 Bad Request**: Invalid request parameters or body
- **404 Not Found**: Task with specified ID not found
- **500 Internal Server Error**: Database or server error

##### Response Body (200 OK)
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

### PUT /api/tasks/{task_id}
Full replacement of task data, supporting bulk updates of category and priority.

#### Request
- **Method**: PUT
- **Path**: `/api/tasks/{task_id}`
- **Content-Type**: `application/json`

##### Parameters
- `task_id` (path, integer, required): The ID of the task to update

##### Request Body
```json
{
  "description": "string (required)",
  "completed": "boolean (required)",
  "category": "string (required)",
  "priority": "string (required)"
}
```

#### Responses
- **200 OK**: Task updated successfully
- **400 Bad Request**: Invalid request parameters or body
- **404 Not Found**: Task with specified ID not found
- **500 Internal Server Error**: Database or server error

## Business Rules
1. Category must be one of: "Work", "Personal", "Shopping", "General" or other predefined values
2. Priority must be one of: "Low", "Medium", "High"
3. Updates should maintain optimistic UI patterns where possible
4. Failed updates should trigger appropriate error handling in the UI

## Error Handling
- **Validation Errors**: Return 400 with detailed error messages
- **Resource Not Found**: Return 404 when task ID doesn't exist
- **Server Errors**: Return 500 with generic error message for security

## Performance Requirements
- Response time: <200ms for 95% of requests
- Concurrency: Support up to 100 simultaneous update requests
- Retry mechanism: Client should implement exponential backoff for failed requests