# Phase 2: Modern Web Application Implementation Plan

## Overview
This plan outlines the implementation of the full-stack web application based on the Phase 2 specification. The plan includes detailed steps for setting up the database, implementing FastAPI backend routes, creating the Next.js frontend structure, and connecting all components.

## Phase 1: Project Setup

### 1.1 Initialize Backend (FastAPI)
- Create `backend/` directory
- Set up Python virtual environment
- Install dependencies: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-dotenv, alembic
- Create project structure:
  ```
  backend/
  ├── main.py
  ├── models/
  │   ├── __init__.py
  │   └── task.py
  ├── schemas/
  │   ├── __init__.py
  │   └── task.py
  ├── repositories/
  │   ├── __init__.py
  │   └── task_repository.py
  ├── services/
  │   ├── __init__.py
  │   └── task_service.py
  ├── database/
  │   ├── __init__.py
  │   └── session.py
  ├── api/
  │   ├── __init__.py
  │   └── v1/
  │       ├── __init__.py
  │       └── endpoints/
  │           ├── __init__.py
  │           └── tasks.py
  ├── core/
  │   ├── __init__.py
  │   └── config.py
  └── requirements.txt
  ```

### 1.2 Initialize Frontend (Next.js)
- Create `web-app/` directory
- Set up Next.js project with TypeScript and Tailwind CSS
- Install dependencies: next, react, react-dom, typescript, @types/react, @types/node, tailwindcss, postcss, autoprefixer
- Create project structure:
  ```
  web-app/
  ├── package.json
  ├── next.config.js
  ├── tsconfig.json
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── public/
  │   └── favicon.ico
  └── src/
      ├── app/
      │   ├── layout.tsx
      │   ├── page.tsx
      │   └── globals.css
      ├── components/
      │   ├── TaskForm.tsx
      │   ├── TaskList.tsx
      │   └── TaskItem.tsx
      ├── lib/
      │   └── api.ts
      ├── types/
      │   └── task.ts
      └── styles/
          └── globals.css
  ```

## Phase 2: Database Implementation

### 2.1 Database Schema for Tasks
Create the SQLModel-based database model for tasks:
```python
# backend/models/task.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class TaskBase(SQLModel):
    description: str = Field(min_length=1)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

class TaskUpdate(SQLModel):
    description: Optional[str] = None
    completed: Optional[bool] = None
```

### 2.2 Database Configuration
- Configure Neon PostgreSQL connection in `core/config.py`
- Set up database session management in `database/session.py`
- Initialize Alembic for database migrations
- Create initial migration for the Task table

## Phase 3: Backend Implementation

### 3.1 Repository Layer
Implement repository pattern for database operations:
```python
# backend/repositories/task_repository.py
from sqlmodel import Session, select
from typing import List, Optional
from backend.models.task import Task, TaskCreate

class TaskRepository:
    def create_task(self, session: Session, task: TaskCreate) -> Task:
        db_task = Task.from_orm(task)
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task

    def get_task(self, session: Session, task_id: UUID) -> Optional[Task]:
        return session.get(Task, task_id)

    def get_tasks(self, session: Session) -> List[Task]:
        return session.exec(select(Task)).all()

    def update_task(self, session: Session, task_id: UUID, task_data: dict) -> Optional[Task]:
        db_task = session.get(Task, task_id)
        if db_task:
            for key, value in task_data.items():
                setattr(db_task, key, value)
            session.add(db_task)
            session.commit()
            session.refresh(db_task)
        return db_task

    def delete_task(self, session: Session, task_id: UUID) -> bool:
        db_task = session.get(Task, task_id)
        if db_task:
            session.delete(db_task)
            session.commit()
            return True
        return False
```

### 3.2 Service Layer
Adapt the existing TaskService logic from Phase 1:
```python
# backend/services/task_service.py
from typing import List, Optional
from backend.models.task import Task, TaskCreate, TaskUpdate
from backend.repositories.task_repository import TaskRepository
from sqlmodel import Session

class TaskService:
    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def create_task(self, session: Session, task: TaskCreate) -> Task:
        return self.repository.create_task(session, task)

    def get_task(self, session: Session, task_id: UUID) -> Optional[Task]:
        return self.repository.get_task(session, task_id)

    def get_all_tasks(self, session: Session) -> List[Task]:
        return self.repository.get_tasks(session)

    def update_task(self, session: Session, task_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
        task_data = task_update.dict(exclude_unset=True)
        return self.repository.update_task(session, task_id, task_data)

    def delete_task(self, session: Session, task_id: UUID) -> bool:
        return self.repository.delete_task(session, task_id)

    def complete_task(self, session: Session, task_id: UUID, completed: bool) -> Optional[Task]:
        return self.repository.update_task(session, task_id, {"completed": completed})
```

### 3.3 FastAPI Routes Implementation
Implement all required API endpoints:

#### 3.3.1 GET Routes
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/{id}` - Retrieve a specific task

#### 3.3.2 POST Routes
- `POST /api/tasks` - Create a new task

#### 3.3.3 PUT Routes
- `PUT /api/tasks/{id}` - Update a task

#### 3.3.4 PATCH Routes
- `PATCH /api/tasks/{id}/complete` - Update task completion status

#### 3.3.5 DELETE Routes
- `DELETE /api/tasks/{id}` - Delete a task

```python
# backend/api/v1/endpoints/tasks.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlmodel import Session
from backend.database.session import get_session
from backend.models.task import Task, TaskCreate, TaskUpdate
from backend.services.task_service import TaskService
from backend.repositories.task_repository import TaskRepository

router = APIRouter()

def get_task_service(session: Session = Depends(get_session)):
    repository = TaskRepository()
    return TaskService(repository)

@router.get("/", response_model=List[Task])
def read_tasks(
    task_service: TaskService = Depends(get_task_service)
) -> List[Task]:
    return task_service.get_all_tasks(task_service.repository.session)

@router.post("/", response_model=Task)
def create_task(
    task: TaskCreate,
    task_service: TaskService = Depends(get_task_service)
) -> Task:
    return task_service.create_task(task_service.repository.session, task)

@router.get("/{task_id}", response_model=Task)
def read_task(
    task_id: UUID,
    task_service: TaskService = Depends(get_task_service)
) -> Task:
    task = task_service.get_task(task_service.repository.session, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    task_service: TaskService = Depends(get_task_service)
) -> Task:
    updated_task = task_service.update_task(
        task_service.repository.session, task_id, task_update
    )
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.patch("/{task_id}/complete", response_model=Task)
def complete_task(
    task_id: UUID,
    completed: bool,
    task_service: TaskService = Depends(get_task_service)
) -> Task:
    task = task_service.complete_task(
        task_service.repository.session, task_id, completed
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}")
def delete_task(
    task_id: UUID,
    task_service: TaskService = Depends(get_task_service)
) -> dict:
    if not task_service.delete_task(task_service.repository.session, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
```

## Phase 4: Frontend Implementation

### 4.1 Next.js Folder Structure
The frontend will follow this structure:
```
web-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Tailwind styling
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── api/                # API routes (if needed)
│   │   └── tasks/              # Task-specific routes
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── TaskForm.tsx        # Component for adding/updating tasks
│   │   ├── TaskList.tsx        # Component to display task list
│   │   ├── TaskItem.tsx        # Individual task display component
│   │   └── TaskFilter.tsx      # Component for filtering tasks
│   ├── hooks/
│   │   ├── useTasks.ts         # Custom hook for task operations
│   │   └── useApi.ts           # Custom hook for API calls
│   ├── lib/
│   │   ├── api.ts              # API client configuration
│   │   └── utils.ts            # Utility functions
│   ├── services/
│   │   └── taskService.ts      # Task-related API service
│   ├── types/
│   │   └── task.ts             # TypeScript interfaces for tasks
│   └── styles/
│       └── globals.css         # Global styles
```

### 4.2 TypeScript Types
```typescript
// web-app/src/types/task.ts
export interface Task {
  id: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  description: string;
}

export interface TaskUpdate {
  description?: string;
  completed?: boolean;
}
```

### 4.3 API Service Layer
```typescript
// web-app/src/services/taskService.ts
import { Task, TaskCreate, TaskUpdate } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  }

  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  }

  async updateTask(id: string, taskData: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  }

  async completeTask(id: string, completed: boolean): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task completion status');
    }
    return response.json();
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
}

export const taskService = new TaskService();
```

### 4.4 Core Components
- **TaskForm.tsx**: Form component for creating and updating tasks
- **TaskList.tsx**: Component to display all tasks with filtering options
- **TaskItem.tsx**: Individual task display with completion toggle and delete functionality

## Phase 5: Connection Between Apps

### 5.1 Environment Configuration
- Configure backend API URL in frontend environment variables
- Set up CORS middleware in FastAPI to allow frontend domain
- Ensure proper authentication headers if implemented

### 5.2 API Integration
- Frontend makes HTTP requests to backend API endpoints
- Error handling for network failures and API errors
- Loading states during API operations
- Real-time updates using polling or WebSockets (optional enhancement)

### 5.3 Data Flow
1. User interacts with Next.js frontend
2. Frontend sends requests to FastAPI backend via API endpoints
3. FastAPI processes requests using service and repository layers
4. Database operations performed using SQLModel
5. Responses sent back to frontend
6. Frontend updates UI based on responses

## Phase 6: Testing and Validation

### 6.1 Backend Testing
- Unit tests for repository and service layers
- Integration tests for API endpoints
- Database integration tests

### 6.2 Frontend Testing
- Component tests for UI components
- Integration tests for API service
- End-to-end tests for user flows

## Phase 7: Deployment Preparation

### 7.1 Backend Deployment
- Containerize with Docker
- Prepare for deployment on cloud platform
- Set up environment variables for production

### 7.2 Frontend Deployment
- Build for production
- Optimize assets
- Deploy to hosting platform (Vercel, Netlify)

### 7.3 Database Migration
- Set up production database
- Run initial schema migration
- Plan for future schema changes

## Success Criteria
- All CRUD operations work through the web interface
- Data persists in Neon PostgreSQL database
- Frontend and backend communicate correctly
- Responsive design works across devices
- Error handling is implemented properly
- Code follows established patterns from Phase 1