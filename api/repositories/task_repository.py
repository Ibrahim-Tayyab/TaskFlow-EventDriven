from sqlmodel import Session, select
from typing import List, Optional
from models.task import Task, TaskCreate


class TaskRepository:
    def create_task(self, session: Session, task: TaskCreate, user_id: str) -> Task:
        """Create a new task linked to the authenticated user."""
        db_task = Task(
            description=task.description,
            completed=task.completed,
            category=task.category,
            priority=task.priority,
            tags=task.tags,
            due_date=task.due_date,  # Phase 5: Due date for reminders
            is_recurring=task.is_recurring,  # Phase 5: Recurring task flag
            recurrence_pattern=task.recurrence_pattern,  # Phase 5: daily/weekly/monthly
            notification_sent=False,  # Reset notification flag for new tasks
            user_id=user_id  # Link task to the authenticated user
        )
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task

    def get_task(self, session: Session, task_id: int, user_id: str) -> Optional[Task]:
        """Get a task by ID, but only if it belongs to the user."""
        task = session.get(Task, task_id)
        if task and task.user_id == user_id:
            return task
        return None  # Return None if task doesn't exist or doesn't belong to user

    def get_tasks(
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
        """Get tasks with filtering, searching, and sorting."""
        query = select(Task).where(Task.user_id == user_id)
        
        # 1. Filter by Priority
        if priority:
            query = query.where(Task.priority.ilike(priority))

        # 1b. Filter by Category (Fix for Phase 5)
        if category:
            query = query.where(Task.category.ilike(category))

        # 2. Search (Title/Description)
        # Wait, Task model has 'description', but TaskCreate has 'title'. 
        # In current schema, 'title' is likely stored in description or separate?
        # Looking at Task model: just description. 'title' in TaskCreate is transient?
        # Let's check how create_task uses title. 
        # Answer: It ignores title or appends.
        # So we search description.
        if search:
            query = query.where(
                (Task.description.ilike(f"%{search}%")) | 
                (Task.category.ilike(f"%{search}%"))
            )
            
        # 3. Sort
        if sort_by:
            attr = getattr(Task, sort_by, None)
            if attr:
                if order == "desc":
                    query = query.order_by(attr.desc())
                else:
                    query = query.order_by(attr.asc())
        
        # Execute
        tasks = list(session.exec(query).all())
        
        # 4. Filter by Tags (Python-side filtering for JSON compatibility)
        if tags:
            filtered_tasks = []
            for t in tasks:
                if t.tags and any(tag in t.tags for tag in tags):
                    filtered_tasks.append(t)
            return filtered_tasks
            
        return tasks

    def update_task(self, session: Session, task_id: int, user_id: str, task_data: dict) -> Optional[Task]:
        """Update a task, but only if it belongs to the user."""
        db_task = self.get_task(session, task_id, user_id)
        if db_task:
            for key, value in task_data.items():
                setattr(db_task, key, value)
            session.add(db_task)
            session.commit()
            session.refresh(db_task)
        return db_task

    def delete_task(self, session: Session, task_id: int, user_id: str) -> bool:
        """Delete a task, but only if it belongs to the user."""
        db_task = self.get_task(session, task_id, user_id)
        if db_task:
            session.delete(db_task)
            session.commit()
            return True
        return False

    def search_tasks(self, session: Session, query: str, user_id: str) -> List[Task]:
        """Search tasks by description or category containing the query."""
        # Fetch all users tasks and filter in Python for robustness across DBs (Case-insensitive)
        user_tasks = self.get_tasks(session, user_id)
        query_lower = query.lower()
        return [
            t for t in user_tasks 
            if query_lower in t.description.lower() or query_lower in t.category.lower()
        ]