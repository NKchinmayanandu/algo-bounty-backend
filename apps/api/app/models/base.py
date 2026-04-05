import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class TaskStatusEnum(str, enum.Enum):
    OPEN = "OPEN"
    FUNDED = "FUNDED"
    CLAIMED = "CLAIMED"
    SUBMITTED = "SUBMITTED"
    VERIFIED = "VERIFIED"
    PAID = "PAID"

class VerificationStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rating_avg = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    wallet = relationship("Wallet", back_populates="user", uselist=False)
    tasks_created = relationship("Task", foreign_keys="Task.creator_user_id", back_populates="creator")
    tasks_assigned = relationship("Task", foreign_keys="Task.assignee_user_id", back_populates="assignee")

class Wallet(Base):
    __tablename__ = "wallets"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    wallet_address = Column(String, unique=True, nullable=False)

    user = relationship("User", back_populates="wallet")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    reward = Column(Float, nullable=False)  # Stored in microAlgos or standard, assume Algos
    status = Column(Enum(TaskStatusEnum), default=TaskStatusEnum.OPEN)
    creator_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assignee_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    escrow_app_id = Column(Integer, nullable=True)
    escrow_tx_id = Column(String, nullable=True)
    funded_at = Column(DateTime(timezone=True), nullable=True)

    creator = relationship("User", foreign_keys=[creator_user_id], back_populates="tasks_created")
    assignee = relationship("User", foreign_keys=[assignee_user_id], back_populates="tasks_assigned")
    submission = relationship("Submission", back_populates="task", uselist=False)
    ratings = relationship("Rating", back_populates="task")

class Submission(Base):
    __tablename__ = "submissions"

    task_id = Column(Integer, ForeignKey("tasks.id"), primary_key=True)
    repo_url = Column(String, nullable=False)
    report = Column(Text, nullable=True)
    verification_status = Column(Enum(VerificationStatusEnum), default=VerificationStatusEnum.PENDING)
    tx_hash = Column(String, nullable=True)
    block_round = Column(Integer, nullable=True)

    task = relationship("Task", back_populates="submission")

class Rating(Base):
    __tablename__ = "ratings"
    
    # We use a composite of task + rater, or just a simple surrogate PK
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    rater_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rated_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stars = Column(Integer, nullable=False)

    task = relationship("Task", back_populates="ratings")
