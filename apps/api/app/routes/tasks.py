from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel
from app.db.session import get_db
from app.models.base import Task, TaskStatusEnum, User, Submission, VerificationStatusEnum
from app.schemas.base import TaskCreate, TaskDetail, TaskBase, TaskSubmission, SubmissionResponse
from app.services.auth import get_current_user
from app.services.algorand import assign_worker, release_payment
from app.services.github import verify_github_repo
from app.realtime.tasks import manager

router = APIRouter()

class FundPayload(BaseModel):
    tx_hash: str
    escrow_app_id: int

@router.get("/", response_model=List[TaskBase])
def get_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.created_at.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=TaskBase)
async def create_task(task_data: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        reward=task_data.reward,
        creator_user_id=current_user.id,
        status=TaskStatusEnum.OPEN
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    await manager.broadcast({"event": "task_created", "task_id": new_task.id})
    return new_task

@router.post("/{task_id}/fund", response_model=TaskBase)
async def fund_task(task_id: int, payload: FundPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.creator_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if task.status != TaskStatusEnum.OPEN:
        raise HTTPException(status_code=400, detail="Task is not in OPEN state")
        
    task.status = TaskStatusEnum.FUNDED
    task.escrow_app_id = payload.escrow_app_id
    task.escrow_tx_id = payload.tx_hash
    task.funded_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    await manager.broadcast({"event": "task_funded", "task_id": task.id})
    return task

@router.get("/{task_id}", response_model=TaskDetail)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/{task_id}/claim", response_model=TaskBase)
async def claim_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != TaskStatusEnum.FUNDED:
        raise HTTPException(status_code=400, detail="Task is not available for claiming")
    if task.creator_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot claim your own task")
        
    task.assignee_user_id = current_user.id
    task.status = TaskStatusEnum.CLAIMED
    db.commit()
    db.refresh(task)
    
    await manager.broadcast({"event": "task_claimed", "task_id": task.id})
    return task

@router.post("/{task_id}/submit", response_model=SubmissionResponse)
async def submit_task(task_id: int, payload: TaskSubmission, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.assignee_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not assigned to this task")
    if task.status != TaskStatusEnum.CLAIMED:
        raise HTTPException(status_code=400, detail="Task is not in claimed state")
        
    submission = Submission(
        task_id=task.id,
        repo_url=payload.repo_url,
        report=payload.report,
        verification_status=VerificationStatusEnum.PENDING
    )
    db.add(submission)
    
    task.status = TaskStatusEnum.SUBMITTED
    db.commit()
    db.refresh(submission)
    
    await manager.broadcast({"event": "task_completed", "task_id": task.id})
    return submission

@router.post("/{task_id}/verify", response_model=TaskBase)
async def verify_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.creator_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only creator can verify")
    if task.status != TaskStatusEnum.SUBMITTED:
        raise HTTPException(status_code=400, detail="Task is not SUBMITTED")
        
    is_valid = verify_github_repo(task.submission.repo_url)
    if is_valid:
        task.submission.verification_status = VerificationStatusEnum.VERIFIED
        task.status = TaskStatusEnum.VERIFIED
    else:
        task.submission.verification_status = VerificationStatusEnum.FAILED
        
    db.commit()
    db.refresh(task)
    await manager.broadcast({"event": "task_verified", "task_id": task.id, "status": is_valid})
    return task

@router.post("/{task_id}/release", response_model=TaskBase)
async def perform_release_payment(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.creator_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only creator can release payment")
    if task.status != TaskStatusEnum.VERIFIED:
        raise HTTPException(status_code=400, detail="Task is not VERIFIED")
        
    # The frontend is mostly handling transactions according to user specs, but we log the state change.
    task.status = TaskStatusEnum.PAID
    db.commit()
    db.refresh(task)
    
    await manager.broadcast({"event": "payment_released", "task_id": task.id})
    return task
