from fastapi import APIRouter, Request, Depends, Query
from sqlmodel import Session
from database.session import get_session
from consumers.recurring_consumer import process_task_event
from consumers.notification_consumer import process_notification, get_recent_notifications

router = APIRouter()

@router.post("/task-completed")
async def handle_task_completed(request: Request, db: Session = Depends(get_session)):
    """
    Dapr Subscriber for 'task-events' topic.
    Content-Type: application/cloudevents+json
    """
    try:
        body = await request.json()
        # Dapr wraps the message in a CloudEvent envelope. The actual data is in 'data'.
        # However, sometimes Dapr unwraps it if configured.
        # Let's inspect 'data' field.
        data = body.get("data", body)
        
        process_task_event(data, db)
        return {"status": "ok"}
    except Exception as e:
        print(f"Error handling task event: {e}")
        return {"status": "error"}

@router.post("/notifications")
async def handle_notifications(request: Request):
    """
    Dapr Subscriber for 'notifications' topic.
    """
    try:
        body = await request.json()
        data = body.get("data", body)
        process_notification(data)
        return {"status": "ok"}
    except Exception as e:
        print(f"Error handling notification: {e}")
        return {"status": "error"}


@router.get("/notifications")
def get_notifications(user_id: str = Query(None), limit: int = Query(20)):
    """
    API endpoint to retrieve recent notifications.
    Frontend can poll this to show notification toasts.
    """
    notifications = get_recent_notifications(user_id, limit)
    return {"notifications": notifications, "count": len(notifications)}

