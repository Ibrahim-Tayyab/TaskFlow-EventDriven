import sys
import os

from dotenv import load_dotenv

# Add the current directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Load environment variables (works locally and on Vercel)
env_path = os.path.join(current_dir, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
    print(f"Loaded env from {env_path}")
else:
    print("Using environment variables from system (Vercel)")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.v1.endpoints import tasks, auth, chat, conversations, cron, events
from core.config import settings

from sqlmodel import SQLModel
from database.session import engine

# Disable redirect_slashes to avoid 307 redirects
app = FastAPI(title="Todo API", version="1.0.0", redirect_slashes=False)


@app.on_event("startup")
def on_startup():
    """Create database tables on startup"""
    try:
        SQLModel.metadata.create_all(engine)
        print("[OK] Database tables created/verified")
    except Exception as e:
        print(f"[WARN] Database initialization warning: {e}")


# CORS middleware - Allow Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
        # "http://192.168.49.2:3000", # Minikube IP (optional, uncomment if needed)
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Include API routes
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(cron.router, prefix="/api/cron", tags=["cron"])
app.include_router(events.router, prefix="/api/events", tags=["events"])

# Dapr Programmatic Subscription
@app.get("/dapr/subscribe")
def dapr_subscribe():
    return [
        {
            "pubsubname": "todo-pubsub",
            "topic": "task-events",
            "route": "/api/events/task-completed"
        },
        {
            "pubsubname": "todo-pubsub",
            "topic": "notifications",
            "route": "/api/events/notifications"
        }
    ]

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "environment": "production" if os.getenv("VERCEL") else "development"}


@app.get("/")
def root():
    return {"message": "Welcome to the Todo API", "docs": "/docs"}


# Vercel serverless handler
# Vercel needs a variable named 'app' or 'handler' that is an ASGI app
# handler = app