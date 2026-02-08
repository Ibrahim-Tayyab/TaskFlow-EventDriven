# API Contract: Authentication and User Management

## Overview
This contract defines the API endpoints for user authentication, registration, and user-specific task management.

## Authentication Endpoints

### POST /api/auth/signup
Creates a new user account and authenticates the user.

#### Request
- **Method**: POST
- **Path**: `/api/auth/signup`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "name": "string (optional)"
}
```

#### Responses
- **201 Created**: User registered and authenticated successfully
- **400 Bad Request**: Invalid request parameters or body
- **409 Conflict**: User with email already exists
- **500 Internal Server Error**: Database or server error

##### Response Body (201 Created)
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "session": {
    "token": "string",
    "expiresAt": "string (ISO 8601 timestamp)"
  }
}
```

### POST /api/auth/login
Authenticates an existing user.

#### Request
- **Method**: POST
- **Path**: `/api/auth/login`
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Responses
- **200 OK**: User authenticated successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Invalid credentials
- **500 Internal Server Error**: Database or server error

##### Response Body (200 OK)
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "session": {
    "token": "string",
    "expiresAt": "string (ISO 8601 timestamp)"
  }
}
```

### POST /api/auth/logout
Logs out the current user and invalidates their session.

#### Request
- **Method**: POST
- **Path**: `/api/auth/logout`
- **Authorization**: Bearer token or session cookie

#### Responses
- **200 OK**: User logged out successfully
- **401 Unauthorized**: Invalid or expired session
- **500 Internal Server Error**: Server error

## User-Specific Task Endpoints

### GET /api/tasks (Authenticated)
Retrieves all tasks belonging to the authenticated user.

#### Request
- **Method**: GET
- **Path**: `/api/tasks`
- **Authorization**: Valid session token or cookie

#### Responses
- **200 OK**: Tasks retrieved successfully
- **401 Unauthorized**: Invalid or expired session
- **500 Internal Server Error**: Database or server error

##### Response Body (200 OK)
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

### POST /api/tasks (Authenticated)
Creates a new task for the authenticated user.

#### Request
- **Method**: POST
- **Path**: `/api/tasks`
- **Authorization**: Valid session token or cookie
- **Content-Type**: `application/json`

##### Request Body
```json
{
  "description": "string (required)",
  "completed": "boolean (optional)",
  "category": "string (optional)",
  "priority": "string (optional)"
}
```

#### Responses
- **201 Created**: Task created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Invalid or expired session
- **500 Internal Server Error**: Database or server error

### GET /api/tasks/{task_id} (Authenticated)
Retrieves a specific task belonging to the authenticated user.

#### Request
- **Method**: GET
- **Path**: `/api/tasks/{task_id}`
- **Authorization**: Valid session token or cookie

#### Responses
- **200 OK**: Task retrieved successfully
- **401 Unauthorized**: Invalid or expired session
- **403 Forbidden**: User does not own the requested task
- **404 Not Found**: Task not found
- **500 Internal Server Error**: Database or server error

## Authorization Requirements

All endpoints that require authentication must validate the user's session before processing the request. The system should:

1. Verify the session token or cookie is valid
2. Ensure the user associated with the session is active
3. For task-related operations, verify the user owns the task being accessed
4. Return appropriate error codes when authorization fails

## Business Rules
1. Users can only access their own tasks
2. New tasks must be associated with the authenticated user
3. Users must be authenticated to access protected endpoints
4. Session tokens must expire after the configured time period
5. Passwords must meet security requirements during registration

## Error Handling
- **Authentication Errors**: Return 401 with appropriate message
- **Authorization Errors**: Return 403 when user lacks permission
- **Resource Not Found**: Return 404 when requested resource doesn't exist
- **Server Errors**: Return 500 with generic error message for security

## Performance Requirements
- Authentication operations: <200ms response time
- Task retrieval: <100ms for 95% of requests
- Concurrency: Support up to 1000 simultaneous authenticated users
- Session validation: <50ms response time