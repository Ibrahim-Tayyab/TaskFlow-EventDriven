from typing import List, Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON

# SQLModel table that maps to the existing 'tasks' table in Neon DB
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    completed: bool = False
    category: str = Field(default="General", index=True)
    priority: str = "Medium"
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    # Recurring Task Fields
    due_date: Optional[str] = None  # ISO8601 string
    is_recurring: bool = False
    recurrence_pattern: Optional[str] = None  # e.g., "daily", "cron: 0 9 * * *"
    next_occurrence: Optional[str] = None
    notification_sent: bool = Field(default=False)
    user_id: Optional[str] = Field(default=None, index=True)

    # Pydantic models for API request/response
    # ...
class TaskCreate(BaseModel):
    title: Optional[str] = None  # User-friendly title
    description: str
    completed: bool = False
    category: str = "General"
    priority: str = "Medium"
    tags: List[str] = []
    due_date: Optional[str] = None
    is_recurring: bool = False
    recurrence_pattern: Optional[str] = None


class TaskRead(BaseModel):
    id: int
    description: str
    completed: bool
    category: str
    priority: str
    tags: List[str] = []
    due_date: Optional[str] = None
    is_recurring: bool
    recurrence_pattern: Optional[str] = None
    notification_sent: bool = False
    user_id: Optional[str] = None


class TaskUpdate(BaseModel):
    description: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[str] = None
    is_recurring: Optional[bool] = None
    recurrence_pattern: Optional[str] = None