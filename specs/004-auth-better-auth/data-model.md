# Data Model: Better Auth Integration

## Key Entities

### User Entity
- **id**: Unique identifier for the user (primary key)
- **email**: User's email address (unique, indexed)
- **password**: Hashed password for authentication
- **name**: User's display name
- **email_verified**: Boolean indicating if email has been verified
- **created_at**: Timestamp when user account was created
- **updated_at**: Timestamp when user account was last updated

### Session Entity
- **id**: Unique identifier for the session (primary key)
- **user_id**: Foreign key linking to user (references users.id)
- **expires_at**: Expiration timestamp for the session
- **created_at**: Timestamp when session was created
- **ip_address**: IP address of the device that created the session
- **user_agent**: Browser/device information

### Account Entity
- **id**: Unique identifier for the account (primary key)
- **user_id**: Foreign key linking to user (references users.id)
- **provider_id**: Identifier for the authentication provider
- **provider_account_id**: Account identifier from the provider
- **created_at**: Timestamp when account was linked
- **updated_at**: Timestamp when account was last updated

### Verification Entity
- **id**: Unique identifier for the verification (primary key)
- **identifier**: The identifier being verified (email, phone, etc.)
- **value**: The value to verify (email address, phone number, etc.)
- **expires_at**: Expiration timestamp for the verification token
- **type**: Type of verification (email_verification, password_reset, etc.)

### Task Entity (Updated)
- **id**: Unique identifier for the task (primary key)
- **user_id**: Foreign key linking to user (references users.id)
- **description**: Text content of the task
- **completed**: Boolean indicating completion status
- **category**: Category classification of the task
- **priority**: Priority level of the task
- **created_at**: Timestamp when task was created
- **updated_at**: Timestamp when task was last updated

## Validation Rules

### User Validation
- Email must be unique and in valid format
- Password must meet security requirements (length, complexity)
- Email must be verified before certain actions

### Session Validation
- Sessions must expire after configured time period
- Session tokens must be cryptographically secure
- Concurrent session limits may be enforced

### Task Validation
- Users can only access tasks associated with their user_id
- Task creation requires authenticated user context
- Task updates/deletes require ownership verification

## Relationships

### User-Task Relationship
- One-to-many relationship: One user can have many tasks
- Foreign key constraint: tasks.user_id references users.id
- Cascade behavior: Deleting a user should handle associated tasks appropriately

### User-Session Relationship
- One-to-many relationship: One user can have multiple active sessions
- Foreign key constraint: sessions.user_id references users.id

### User-Account Relationship
- One-to-many relationship: One user can link multiple accounts
- Foreign key constraint: accounts.user_id references users.id

## State Transitions

### User States
1. **Unverified** → **Verified**: Email verification completed
2. **Active** → **Suspended**: Account suspended due to policy violation
3. **Suspended** → **Active**: Account reactivated

### Session States
1. **Active** → **Expired**: Session expiration time reached
2. **Active** → **Terminated**: User initiated logout
3. **Inactive** → **Active**: New session created after authentication