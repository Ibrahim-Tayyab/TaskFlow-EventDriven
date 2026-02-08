import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from sqlalchemy import create_engine, text
from core.config import settings

def migrate():
    print(f"🔌 Connecting to database...")
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        print("🛠️  Adding notification_sent column...")
        try:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE"))
            print("   ✅ Added notification_sent")
        except Exception as e:
            print(f"   ⚠️  notification_sent might exist: {e}")
            
        conn.commit()
    print("✅ Migration finished.")

if __name__ == "__main__":
    migrate()
