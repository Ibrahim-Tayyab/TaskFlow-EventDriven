import logging
from datetime import datetime

# Setup Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("notification-consumer")

# In-memory store for recent notifications (for API retrieval)
# In production, this would go to a database or push to WebSocket
recent_notifications: list = []
MAX_NOTIFICATIONS = 100

def process_notification(event_data: dict):
    """
    Handles 'SendNotification' events from the notifications Kafka topic.
    In production, this would:
    - Send push notifications via Firebase/OneSignal
    - Send emails via SendGrid/Mailgun
    - Broadcast via WebSocket for real-time UI
    """
    logger.info(f"🔔 RECEIVED NOTIFICATION EVENT: {event_data}")
    
    notification_type = event_data.get("type", "reminder")
    title = event_data.get("title", "Task Reminder")
    body = event_data.get("body", "")
    user_id = event_data.get("user_id")
    task_id = event_data.get("task_id")
    
    # Create notification record
    notification = {
        "id": len(recent_notifications) + 1,
        "type": notification_type,
        "title": title,
        "body": body,
        "user_id": user_id,
        "task_id": task_id,
        "created_at": datetime.now().isoformat(),
        "read": False
    }
    
    # Store in memory (FIFO buffer)
    recent_notifications.insert(0, notification)
    if len(recent_notifications) > MAX_NOTIFICATIONS:
        recent_notifications.pop()
    
    # Log the notification
    # Log the notification
    print(f"""
+--------------------------------------------------------------+
|                    NOTIFICATION                              |
+--------------------------------------------------------------+
|  To:      {user_id or 'All Users':<50} |
|  Type:    {notification_type:<50} |
|  Title:   {title[:50]:<50} |
|  Body:    {body[:50]:<50} |
|  Task ID: {str(task_id):<50} |
+--------------------------------------------------------------+
    """)
    
    # TODO: Integrate with real notification services:
    # - WebSocket broadcast for real-time UI updates
    # - Firebase Cloud Messaging for mobile push
    # - Email via SMTP/SendGrid for important reminders
    
    return notification


def get_recent_notifications(user_id: str = None, limit: int = 20):
    """Get recent notifications, optionally filtered by user."""
    if user_id:
        return [n for n in recent_notifications if n.get("user_id") == user_id][:limit]
    return recent_notifications[:limit]

