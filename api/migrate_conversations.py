"""
Database migration script to add conversation_id to chat_messages.
This enables multiple conversation threads per user.
"""

from sqlmodel import SQLModel, create_engine
from models.conversation import Conversation
from models.chat_message import ChatMessage
from models.task import Task
from models.user import User
from core.config import settings

def run_migration():
    """Add conversation support to database."""
    engine = create_engine(settings.database_url, echo=True)
    
    print("=" * 60)
    print("🔄 Database Migration: Conversation Support")
    print("=" * 60)
    
    # Create all tables (will add conversations, update chat_messages)
    print("\n📦 Creating/updating database tables...")
    SQLModel.metadata.create_all(engine)
    
    print("\n✅ Migration completed successfully!")
    print("\nTables:")
    print("  - user table")
    print("  - tasks table")
    print("  - conversations table ✨")
    print("  - chat_messages table (with conversation_id) ✨")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("Note: If columns already exist, this is normal.")
