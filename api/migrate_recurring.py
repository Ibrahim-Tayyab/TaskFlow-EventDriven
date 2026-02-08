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
        print("🛠️  Adding recurring task columns...")
        
        # Add due_date
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN due_date VARCHAR"))
            print("   ✅ Added due_date")
        except Exception as e:
            print(f"   ⚠️  due_date might exist: {e}")

        # Add is_recurring
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE"))
            print("   ✅ Added is_recurring")
        except Exception as e:
            print(f"   ⚠️  is_recurring might exist: {e}")

        # Add recurrence_pattern
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN recurrence_pattern VARCHAR"))
            print("   ✅ Added recurrence_pattern")
        except Exception as e:
            print(f"   ⚠️  recurrence_pattern might exist: {e}")

        # Add next_occurrence
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN next_occurrence VARCHAR"))
            print("   ✅ Added next_occurrence")
        except Exception as e:
            print(f"   ⚠️  next_occurrence might exist: {e}")
            
        # Add notification_sent
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE"))
            print("   ✅ Added notification_sent")
        except Exception as e:
            print(f"   ⚠️  notification_sent might exist: {e}")
            
        conn.commit()
    print("✅ Migration finished.")

if __name__ == "__main__":
    migrate()
