from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.base import TaskStatusEnum, VerificationStatusEnum

# Auth Schemas
class UserRegister(BaseModel):
    username: str
    password: str
    wallet_address: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    rating_avg: float
    rating_count: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: str
    reward: float

class TaskBase(BaseModel):
    id: int
    title: str
    description: str
    reward: float
    status: TaskStatusEnum
    creator_user_id: int
    assignee_user_id: Optional[int] = None
    created_at: datetime
    escrow_app_id: Optional[int] = None
    escrow_tx_id: Optional[str] = None
    funded_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class TaskSubmission(BaseModel):
    repo_url: str
    report: Optional[str] = ""

class SubmissionResponse(BaseModel):
    task_id: int
    repo_url: str
    report: Optional[str] = None
    verification_status: VerificationStatusEnum
    tx_hash: Optional[str] = None
    block_round: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class TaskDetail(TaskBase):
    submission: Optional[SubmissionResponse] = None
    creator: UserResponse
    assignee: Optional[UserResponse] = None
    model_config = ConfigDict(from_attributes=True)
