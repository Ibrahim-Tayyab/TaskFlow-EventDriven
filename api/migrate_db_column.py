
import sys
import os

# Ensure we can import from local modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from sqlalchemy import create_engine, text
from core.config import settings

def migrate():
    print(f"🔌 Connecting to database...")
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("🛠️  Adding conversation_id column...")
        try:
            conn.execute(text("ALTER TABLE chat_messages ADD COLUMN conversation_id INTEGER"))
            conn.commit()
            print("✅ Added column conversation_id")
        except Exception as e:
            print(f"⚠️ Column might already exist or error: {e}")

        print("🛠️  Adding index...")
        try:
            conn.execute(text("CREATE INDEX idx_chat_messages_conversation_id ON chat_messages (conversation_id)"))
            conn.commit()
            print("✅ Added index")
        except Exception as e:
            print(f"⚠️ Index might already exist or error: {e}")

if __name__ == "__main__":
    try:
        migrate()
        print("\n🎉 Migration script finished.")
    except Exception as e:
        print(f"\n❌ Migration script failed: {e}")
