from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import uuid
import os

from database.session import get_session
from models.user import User, UserSignup, UserLogin, AuthResponse, UserResponse

router = APIRouter()

# Password hashing - pbkdf2_sha256 is built into passlib, no external deps
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str) -> str:
    """Hash password using bcrypt_sha256."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_jwt_token(user_id: str, email: str) -> str:
    """Create JWT token with user_id and email"""
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserSignup, session: Session = Depends(get_session)):
    """
    Create a new user account and return JWT token.
    """
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    # now = datetime.utcnow().isoformat() # REMOVED: using datetime object directly
    new_user = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
        emailVerified=False
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Generate JWT token
    token = create_jwt_token(user_id, user_data.email)
    
    return AuthResponse(
        token=token,
        user=UserResponse(id=user_id, email=new_user.email, name=new_user.name),
        message="Account created successfully"
    )


@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin, session: Session = Depends(get_session)):
    """
    Login with email and password, return JWT token.
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == credentials.email)
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user has password_hash (old Better Auth users won't have it)
    if not user.password_hash:
        raise HTTPException(
            status_code=401, 
            detail="Account requires password reset. Please sign up again with the same email."
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate JWT token
    token = create_jwt_token(user.id, user.email)
    
    return AuthResponse(
        token=token,
        user=UserResponse(id=user.id, email=user.email, name=user.name),
        message="Login successful"
    )


@router.get("/me", response_model=UserResponse)
def get_current_user(session: Session = Depends(get_session)):
    """Get current user info - requires valid JWT in Authorization header"""
    # This will be implemented with the security dependency
    pass


@router.delete("/admin/clear-all")
def clear_all_data(session: Session = Depends(get_session)):
    """
    ADMIN ENDPOINT: Delete all users and tasks from the database.
    WARNING: This will permanently delete all data!
    """
    from models.task import Task
    
    try:
        # Delete all tasks first (due to potential foreign key constraints)
        tasks_deleted = session.exec(select(Task)).all()
        for task in tasks_deleted:
            session.delete(task)
        
        # Delete all users
        users_deleted = session.exec(select(User)).all()
        for user in users_deleted:
            session.delete(user)
        
        session.commit()
        
        return {
            "message": "All data cleared successfully",
            "users_deleted": len(users_deleted),
            "tasks_deleted": len(tasks_deleted)
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear data: {str(e)}")
