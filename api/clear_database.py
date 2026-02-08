"""Script to delete all users and tasks from the database"""
import sys
sys.path.insert(0, '.')

from sqlmodel import Session, select
from database.session import engine
from models.user import User
from models.task import Task

def clear_all_data():
    with Session(engine) as session:
        # Delete all tasks
        tasks = session.exec(select(Task)).all()
        for task in tasks:
            session.delete(task)
        
        # Delete all users
        users = session.exec(select(User)).all()
        for user in users:
            session.delete(user)
        
        session.commit()
        
        print(f"✅ Deleted {len(tasks)} tasks")
        print(f"✅ Deleted {len(users)} users")
        print("✅ Database cleared successfully!")

if __name__ == "__main__":
    clear_all_data()
