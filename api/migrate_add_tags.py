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
        print("🛠️  Adding tags column...")
        try:
            # Add JSON columns for tags
            conn.execute(text("ALTER TABLE tasks ADD COLUMN tags JSONB DEFAULT '[]'::jsonb"))
            conn.commit()
            print("✅ Added column tags")
        except Exception as e:
            print(f"⚠️ Column tags might already exist or error: {e}")

if __name__ == "__main__":
    try:
        migrate()
        print("\n🎉 Migration script finished.")
    except Exception as e:
        print(f"\n❌ Migration script failed: {e}")
