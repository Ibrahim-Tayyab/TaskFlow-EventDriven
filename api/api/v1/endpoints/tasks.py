from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from sqlmodel import Session
from database.session import get_session
from models.task import Task, TaskCreate, TaskUpdate
from services.task_service import TaskService
from repositories.task_repository import TaskRepository


from core.security import get_current_user_id

router = APIRouter()


def get_task_service():
    repository = TaskRepository()
    return TaskService(repository)


from fastapi import APIRouter, HTTPException, Depends, Query

# ... imports ...

@router.get("", response_model=List[Task])
def read_tasks(
    priority: Optional[str] = Query(None, description="Filter by priority (High, Medium, Low)"),
    category: Optional[str] = Query(None, description="Filter by category (Work, Personal, etc)"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    search: Optional[str] = Query(None, description="Search term for title/category"),
    sort_by: Optional[str] = Query(None, description="Field to sort by (e.g., priority, created_at)"),
    order: str = Query("asc", description="Sort order (asc or desc)"),
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> List[Task]:
    """Get all tasks for the authenticated user."""
    return task_service.get_all_tasks(
        session, 
        user_id, 
        priority=priority, 
        category=category,
        tags=tags, 
        search=search, 
        sort_by=sort_by, 
        order=order
    )


@router.post("", response_model=Task)
def create_task(
    task: TaskCreate,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> Task:
    """Create a new task for the authenticated user."""
    return task_service.create_task(session, task, user_id)


@router.get("/{task_id}", response_model=Task)
def read_task(
    task_id: int,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> Task:
    """Get a specific task (only if it belongs to the user)."""
    task = task_service.get_task(session, task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> Task:
    """Update a task (only if it belongs to the user)."""
    updated_task = task_service.update_task(session, task_id, user_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


from pydantic import BaseModel

class CompleteRequest(BaseModel):
    completed: bool

@router.patch("/{task_id}/complete", response_model=Task)
def complete_task(
    task_id: int,
    request: CompleteRequest,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> Task:
    """Toggle task completion (only if it belongs to the user)."""
    task = task_service.complete_task(session, task_id, user_id, request.completed)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
) -> dict:
    """Delete a task (only if it belongs to the user)."""
    deleted = task_service.delete_task(session, task_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}