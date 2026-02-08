from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel
from typing import Optional
import os

# Define models
class TaskBase(SQLModel):
    description: str = Field(min_length=1)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime

class TaskUpdate(BaseModel):
    description: Optional[str] = None
    completed: Optional[bool] = None

# Create SQLite database
DATABASE_URL = "sqlite:///./todo_app.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)

def get_session():
    with Session(engine) as session:
        yield session

# Create FastAPI app
app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins like http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# API routes
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "Welcome to the Todo API"}

@app.get("/api/tasks", response_model=List[TaskRead])
def read_tasks(session: Session = Depends(get_session)) -> List[TaskRead]:
    tasks = session.exec(select(Task)).all()
    return tasks

@app.post("/api/tasks", response_model=TaskRead)
def create_task(task: TaskCreate, session: Session = Depends(get_session)) -> TaskRead:
    db_task = Task.from_orm(task) if hasattr(Task, 'from_orm') else Task(**task.dict())
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/api/tasks/{task_id}", response_model=TaskRead)
def read_task(task_id: str, session: Session = Depends(get_session)) -> TaskRead:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/api/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: str, task_update: TaskUpdate, session: Session = Depends(get_session)) -> TaskRead:
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.patch("/api/tasks/{task_id}/complete", response_model=TaskRead)
def complete_task(task_id: str, completed: bool, session: Session = Depends(get_session)) -> TaskRead:
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.completed = completed
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, session: Session = Depends(get_session)) -> dict:
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(db_task)
    session.commit()
    return {"message": "Task deleted successfully"}