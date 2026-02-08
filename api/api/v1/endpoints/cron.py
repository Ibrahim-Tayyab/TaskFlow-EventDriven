from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List, Optional
import requests
import json

from database.session import get_session
from models.task import Task
from core.config import settings

router = APIRouter()

DAPR_HTTP_PORT = 3500
PUBSUB_NAME = "todo-pubsub"
NOTIFICATIONS_TOPIC = "notifications"

@router.post("/check-reminders")
def check_reminders(db: Session = Depends(get_session)):
    """
    Called by Dapr Cron Binding every 5 minutes.
    Checks for tasks due in the next 15 minutes.
    """
    import traceback
    print("[Cron] Checking for reminders...")
    
    try:
        # Logic: due_date <= now (Exact time or overdue) AND notification_sent = False
        now = datetime.now()
        print(f"[Cron] Server Time: {now}")
        
        # We'll fetch all pending un-notified tasks and filter by date in Python
        statement = select(Task).where(
            Task.completed == False,
            Task.notification_sent == False,
            Task.due_date != None
        )
        tasks = db.exec(statement).all()
        print(f"   found {len(tasks)} candidate tasks")
        
        reminders_sent = 0
        
        for task in tasks:
            try:
                # print(f"   checking task {task.id}: due_date='{task.due_date}'") # Reduced spam
                if not task.due_date: continue
                
                due_at = datetime.fromisoformat(task.due_date)
                
                # Debug time delta
                delta = (due_at - now).total_seconds()
                # print(f"   Task {task.id} due in {delta}s")
                
                # Check if EXACTLY due or overdue (no lookahead)
                if due_at <= now:
                    print(f"   [TRIGGER] Task {task.id} is due! ({due_at} <= {now})")
                    # Publish Event
                    payload = {
                        "type": "reminder",
                        "user_id": task.user_id,
                        "task_id": task.id,
                        "title": f"TaskFlow: {task.description}",
                        "body": f"This task is due at {task.due_date}!"
                    }
                    
                    print(f"   posting to dapr: {PUBSUB_NAME}/{NOTIFICATIONS_TOPIC}")
                    publish_url = f"http://localhost:{DAPR_HTTP_PORT}/v1.0/publish/{PUBSUB_NAME}/{NOTIFICATIONS_TOPIC}"
                    try:
                        resp = requests.post(publish_url, json=payload, timeout=2)
                        print(f"   dapr response: {resp.status_code} {resp.text}")
                        
                        if resp.status_code >= 200 and resp.status_code < 300:
                            # Mark as sent and COMMIT IMMEDIATELY for safety
                            task.notification_sent = True
                            db.add(task)
                            db.commit() 
                            db.refresh(task)
                            reminders_sent += 1
                            print(f"   [OK] Sent reminder for task {task.id}")
                        else:
                             print(f"   [ERR] Dapr returned error: {resp.status_code}")
                    except Exception as e:
                        print(f"   [ERR] Failed to publish reminder: {e}")

            except ValueError as ve:
                print(f"   [ERR] Date parse error for task {task.id}: {ve}")
                continue # Skip bad date formats
        
        return {"status": "ok", "reminders_sent": reminders_sent}
        
    except Exception as e:
        print(f"[CRITICAL] ERROR in check_reminders: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Dapr Cron Binding Endpoint - Called directly by Dapr based on cron.yaml schedule
@router.post("/reminder-cron")
def reminder_cron_trigger(db: Session = Depends(get_session)):
    """
    Dapr Input Binding endpoint for 'reminder-cron'.
    Dapr calls this endpoint based on the schedule in cron.yaml (@every 5m).
    """
    print("[Dapr] Cron Binding Triggered!")
    return check_reminders(db)

