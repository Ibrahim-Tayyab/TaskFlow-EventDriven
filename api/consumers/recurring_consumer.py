from datetime import datetime, timedelta
import logging
from sqlmodel import Session, select
from database.session import engine
from models.task import Task
from services.task_service import TaskService
from repositories.task_repository import TaskRepository

# Setup Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("recurring-consumer")

def process_task_event(event_data: dict, db: Session):
    """
    Handles 'task-completed' events.
    If task is recurring, creates the next instance.
    """
    event_type = event_data.get("event_type")
    task_id = event_data.get("task_id")
    
    if event_type != "completed":
        return

    logger.info(f"Processing completion event for task {task_id}")
    
    task = db.get(Task, task_id)
    if not task:
        logger.warning(f"Task {task_id} not found")
        return

    if not task.is_recurring:
        logger.info(f"Task {task_id} is not recurring. Skipping.")
        return

    # Generate Next Occurrence
    # Simple logic: Daily, Weekly
    # For complex Cron, we'd use a library like 'croniter' (not installed yet, sticking to simple strings for MVP)
    
    next_due = None
    pattern = task.recurrence_pattern.lower() if task.recurrence_pattern else ""
    current_due = datetime.fromisoformat(task.due_date) if task.due_date else datetime.now()

    if "daily" in pattern:
        next_due = current_due + timedelta(days=1)
    elif "weekly" in pattern:
        next_due = current_due + timedelta(weeks=1)
    elif "monthly" in pattern:
        next_due = current_due + timedelta(days=30) # Approximation
    else:
        logger.info(f"Unknown recurrence pattern: {pattern}")
        return

    # Idempotency Check: Prevent Creating Duplicate Task
    # Check if a task with same description, user_id, and due_date already exists (uncompleted)
    # This handles retry loops from Dapr without creating spam
    next_due_iso = next_due.isoformat()
    existing_duplicate = db.exec(select(Task).where(
        Task.description == task.description,
        Task.user_id == task.user_id,
        Task.due_date == next_due_iso,
        Task.completed == False
    )).first()
    
    if existing_duplicate:
        logger.info(f"⚠️ Duplicate task detected (ID: {existing_duplicate.id}). Skipping creation.")
        return

    # Create Next Task
    new_task = Task(
        description=task.description,
        user_id=task.user_id,
        category=task.category,
        priority=task.priority,
        tags=task.tags,
        is_recurring=True,
        recurrence_pattern=task.recurrence_pattern,
        due_date=next_due_iso,
        completed=False,
        notification_sent=False
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    logger.info(f"♻️ Created next recurring task: {new_task.id} due at {new_task.due_date}")

