# Quickstart Guide: Better Auth Integration

## Development Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- npm/yarn package manager
- Access to Neon PostgreSQL database

### Environment Setup
```bash
# Clone the repository
git clone <repo-url>
cd todo-hackathon

# Install frontend dependencies
cd web-app
npm install
npm install better-auth

# Install backend dependencies
cd ../api
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Configure DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL in .env
```

## Configuration

### Better Auth Setup
```javascript
// web-app/src/lib/auth.ts
import { initClient } from "better-auth/react";

export const authClient = initClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000",
  // Configuration options
});
```

### Environment Variables
```bash
# api/.env
DATABASE_URL="postgresql://username:password@host:port/database"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:8000"
```

## Running the Application

### Start Backend Server
```bash
cd api
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend Server
```bash
cd web-app
npm run dev
```

## Key Files to Modify

### Frontend Components
- `web-app/src/app/login/page.tsx`: Login page component
- `web-app/src/app/signup/page.tsx`: Signup page component
- `web-app/src/app/dashboard/page.tsx`: Protected dashboard page
- `web-app/src/components/auth/LoginForm.tsx`: Authentication form component
- `web-app/src/services/auth.ts`: Authentication service
- `web-app/src/middleware.ts`: Route protection middleware

### Backend Files
- `api/main.py`: Update API endpoints to verify authentication
- `api/auth.py`: Authentication endpoints and middleware
- `api/migrations/`: Database migration files

## Feature Implementation Steps

### 1. Database Schema Updates
```sql
-- Create authentication tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to tasks table
ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);
```

### 2. Better Auth Integration
```typescript
// Integrate Better Auth client-side
import { authClient } from "@/lib/auth";

// Use in components
const { signIn, signUp, getSession } = authClient;
```

### 3. Route Protection
```typescript
// Protect dashboard route
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.redirect('/login');
  }

  // Return protected content
}
```

## Testing the Feature

### Guest Access Test
1. Navigate to the application
2. Attempt to access `/dashboard` without authentication
3. Verify redirect to `/login` page

### Authentication Flow Test
1. Visit `/signup` page
2. Register with valid credentials
3. Verify account creation and authentication
4. Create a task and verify it's linked to the user

## Troubleshooting

### Common Issues
- If authentication fails, ensure `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are properly configured
- If route protection doesn't work, verify middleware is correctly implemented
- If database migrations fail, check connection settings and permissions

### Security Considerations
- Use strong secrets for `BETTER_AUTH_SECRET`
- Ensure HTTPS in production environments
- Validate all user inputs to prevent injection attacks
- Regularly rotate authentication secrets