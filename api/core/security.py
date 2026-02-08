"""
Pure JWT Authentication Security Module
Verifies JWT tokens without database lookups for fast authentication.
"""
from typing import Optional
import os
from fastapi import HTTPException, Request
from jose import jwt, JWTError
from datetime import datetime

# JWT settings - must match auth.py
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"


def verify_jwt_token(token: str) -> dict:
    """
    Verify JWT token signature and return payload.
    No database lookup - pure cryptographic verification.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(request: Request) -> str:
    """
    Extract and verify user_id from JWT token in Authorization header.
    
    Flow:
    1. Extract Bearer token from Authorization header
    2. Verify JWT signature (no DB lookup)
    3. Extract user_id from 'sub' claim
    4. Return user_id for data filtering
    
    This ensures each user only accesses their own data.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    
    # Verify JWT and extract payload
    payload = verify_jwt_token(token)
    
    # Get user_id from 'sub' claim (standard JWT claim for subject)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token: missing user ID",
        )
    
    # Check expiration (jose library handles this, but double-check)
    exp = payload.get("exp")
    if exp and datetime.utcnow().timestamp() > exp:
        raise HTTPException(
            status_code=401,
            detail="Token expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return str(user_id)
