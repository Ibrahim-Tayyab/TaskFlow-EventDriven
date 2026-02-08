"""
Database migration script to create chat_messages table.
This creates a new table for storing chat history with user isolation.
"""

from sqlmodel import SQLModel, create_engine, Session
from models.chat_message import ChatMessage
from models.task import Task
from models.user import User
from core.config import settings

def  run_migration():
    """Create all tables including the new chat_messages table."""
    engine = create_engine(settings.database_url, echo=True)
    
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("✅ Database tables created successfully!")
    print("   - user table")
    print("   - tasks table")
    print("   - chat_messages table (NEW)")

if __name__ == "__main__":
    run_migration()
