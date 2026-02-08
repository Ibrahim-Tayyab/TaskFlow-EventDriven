# Phase 2: Modern Web Application Specification

## Overview
Develop a full-stack web application that provides a modern user interface for the todo application, replacing the console-based interface from Phase 1. The application will feature a Next.js frontend with TypeScript and Tailwind CSS, a FastAPI backend, and persistent storage using Neon Serverless PostgreSQL.

## Project Structure
```
todo-hackathon/
├── web-app/                 # Next.js frontend application
├── backend/                 # FastAPI backend application
├── specs/                   # Project specifications
│   └── phase-2/
│       └── spec.md          # This specification file
└── apps/
    └── console_app/         # Phase 1 console application (preserved)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm or yarn
- **Runtime**: Node.js

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Database**: Neon Serverless PostgreSQL
- **Database ORM**: SQLModel or SQLAlchemy
- **API Documentation**: Automatic OpenAPI/Swagger docs

### Database
- **Provider**: Neon Serverless PostgreSQL
- **Connection**: Environment-based configuration
- **Migration Tool**: Alembic (for database schema management)

## Architecture

### Frontend Architecture
- **Pages Router**: Next.js App Router for routing
- **Component Structure**: Organized by features and shared components
- **State Management**: React state/hooks with potential for Redux Toolkit if needed
- **API Integration**: Custom hooks for API calls
- **Form Handling**: React Hook Form with validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Architecture
- **API Layer**: FastAPI with Pydantic models for request/response validation
- **Service Layer**: Adapted TaskService logic from Phase 1
- **Repository Layer**: Updated Repository pattern for database persistence
- **Dependency Injection**: FastAPI's built-in dependency injection
- **Authentication**: JWT-based authentication (planned for future enhancement)
- **Error Handling**: Custom HTTP exceptions with proper status codes

## Features Specification

### Core Todo Operations
1. **Add Task**
   - Input: Task description (text)
   - UI: Form with text input and submit button
   - Validation: Non-empty description required
   - Backend: POST /api/tasks endpoint

2. **List Tasks**
   - UI: Responsive grid/list view showing all tasks
   - Display: Task description, completion status, creation date
   - Sorting: Default by creation date (newest first)
   - Backend: GET /api/tasks endpoint

3. **Update Task**
   - Input: Task ID and updated description
   - UI: Editable fields with save/cancel options
   - Backend: PUT /api/tasks/{id} endpoint

4. **Delete Task**
   - Input: Task ID
   - UI: Delete button with confirmation dialog
   - Backend: DELETE /api/tasks/{id} endpoint

5. **Complete/Incomplete Task**
   - Input: Task ID and completion status
   - UI: Checkbox toggle for completion status
   - Backend: PATCH /api/tasks/{id}/complete endpoint

### UI/UX Requirements
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized for fast loading and smooth interactions

## API Specification

### Backend Endpoints
```
GET    /api/tasks          # Get all tasks
POST   /api/tasks          # Create a new task
GET    /api/tasks/{id}     # Get a specific task
PUT    /api/tasks/{id}     # Update a task
PATCH  /api/tasks/{id}/complete # Update task completion status
DELETE /api/tasks/{id}     # Delete a task
GET    /api/health         # Health check endpoint
```

### Data Models
- **Task Model**:
  - id: UUID (auto-generated)
  - description: string (required)
  - completed: boolean (default: false)
  - created_at: datetime (auto-generated)
  - updated_at: datetime (auto-generated)

## Database Schema

### Task Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Implementation Strategy

### Backend Implementation
1. Set up FastAPI project structure
2. Configure Neon PostgreSQL connection
3. Implement database models using SQLModel
4. Create repository layer (extending Phase 1 patterns)
5. Implement service layer (adapting Phase 1 TaskService)
6. Create API endpoints with proper validation
7. Add error handling and logging
8. Implement database migrations with Alembic

### Frontend Implementation
1. Set up Next.js project with TypeScript and Tailwind CSS
2. Create API service layer for backend communication
3. Implement task management components
4. Create responsive UI with Tailwind CSS
5. Add form validation and error handling
6. Implement loading states and user feedback
7. Add responsive design for all screen sizes

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Development Workflow
1. Start backend server: `uvicorn main:app --reload`
2. Start frontend development server: `npm run dev`
3. Database migrations: `alembic upgrade head`

## Testing Strategy
- **Backend**: Pytest for API and service layer tests
- **Frontend**: Jest/React Testing Library for component tests
- **Integration**: End-to-end tests with Playwright/Cypress

## Deployment Considerations
- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Railway, Heroku, or similar cloud platforms
- **Database**: Neon Serverless PostgreSQL
- **Environment**: Separate configurations for dev, staging, and production

## Success Criteria
- All Phase 1 features implemented in web interface
- Responsive and accessible UI
- Proper error handling and validation
- Fast API response times
- Clean, maintainable code following established patterns
- Proper separation of concerns between frontend and backend