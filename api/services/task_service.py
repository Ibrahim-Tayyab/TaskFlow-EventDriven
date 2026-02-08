from typing import List, Optional
from sqlmodel import Session
from models.task import Task, TaskCreate, TaskUpdate
from repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def create_task(self, session: Session, task: TaskCreate, user_id: str) -> Task:
        """Create a new task for the authenticated user."""
        return self.repository.create_task(session, task, user_id)

    def get_task(self, session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """Get a task if it belongs to the user."""
        return self.repository.get_task(session, task_id, user_id)

    def get_all_tasks(
        self, 
        session: Session, 
        user_id: str,
        priority: Optional[str] = None,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        order: str = "asc"
    ) -> List[Task]:
        """Get all tasks for the authenticated user with optional filtering."""
        return self.repository.get_tasks(
            session, 
            user_id, 
            priority=priority, 
            category=category,
            tags=tags, 
            search=search, 
            sort_by=sort_by, 
            order=order
        )

    def update_task(self, session: Session, task_id: int, user_id: str, task_update: TaskUpdate) -> Optional[Task]:
        """Update a task if it belongs to the user."""
        task_data = task_update.model_dump(exclude_unset=True)
        return self.repository.update_task(session, task_id, user_id, task_data)

    def delete_task(self, session: Session, task_id: int, user_id: str) -> bool:
        """Delete a task if it belongs to the user."""
        return self.repository.delete_task(session, task_id, user_id)

    def complete_task(self, session: Session, task_id: int, user_id: str, completed: bool) -> Optional[Task]:
        """Toggle task completion if it belongs to the user."""
        updated_task = self.repository.update_task(session, task_id, user_id, {"completed": completed})
        
        # Publish Event if completed
        if updated_task and completed:
            try:
                import requests
                import time
                payload = {
                    "event_type": "completed",
                    "task_id": updated_task.id,
                    "user_id": updated_task.user_id,
                    "timestamp": str(time.time()),
                    "data": updated_task.model_dump()
                }
                requests.post(
                    "http://localhost:3500/v1.0/publish/todo-pubsub/task-events",
                    json=payload,
                    timeout=1
                )
            except Exception as e:
                print(f"⚠️ Failed to publish task event: {e}")
                
        return updated_task

    def search_tasks(self, session: Session, query: str, user_id: str) -> List[Task]:
        """Search for tasks."""
        return self.repository.search_tasks(session, query, user_id)

    def get_task_analytics(self, session: Session, user_id: str) -> dict:
        """Get counts and statistics for tasks."""
        tasks = self.get_all_tasks(session, user_id)
        total = len(tasks)
        completed = sum(1 for t in tasks if t.completed)
        pending = total - completed
        
        # Priority Stats (Case-insensitive safety)
        high = sum(1 for t in tasks if str(t.priority).lower() == 'high')
        medium = sum(1 for t in tasks if str(t.priority).lower() == 'medium')
        low = sum(1 for t in tasks if str(t.priority).lower() == 'low')
        
        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "priority_breakdown": {
                "high": high,
                "medium": medium,
                "low": low
            }
        }

    def clear_completed_tasks(self, session: Session, user_id: str) -> int:
        """Delete all completed tasks."""
        tasks = self.get_all_tasks(session, user_id)
        count = 0
        for t in tasks:
            if t.completed:
                if self.repository.delete_task(session, t.id, user_id):
                    count += 1
        return count