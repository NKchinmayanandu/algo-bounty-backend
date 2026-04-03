from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.base import User, Task
from app.schemas.base import UserResponse, TaskBase
from app.services.auth import get_current_user

router = APIRouter()

from typing import List

@router.get("/me/history", response_model=List[TaskBase])
def get_user_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    created = db.query(Task).filter(Task.creator_user_id == current_user.id).all()
    assigned = db.query(Task).filter(Task.assignee_user_id == current_user.id).all()
    
    # Return flat array of all related tasks for this user
    return list({t.id: t for t in (created + assigned)}.values())

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
