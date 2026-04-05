from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.base import User, Wallet
from app.schemas.base import UserRegister, UserLogin, Token, UserResponse
from app.services.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    hashed_password = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if user_data.wallet_address:
        new_wallet = Wallet(user_id=new_user.id, wallet_address=user_data.wallet_address)
        db.add(new_wallet)
        db.commit()
        
    return new_user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Wallet linking
from pydantic import BaseModel

class WalletConnectPayload(BaseModel):
    wallet_address: str
    signature: str = "" # To be verified ideally

@router.post("/wallet/connect")
def connect_wallet(payload: WalletConnectPayload, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.wallet:
        new_wallet = Wallet(user_id=current_user.id, wallet_address=payload.wallet_address)
        db.add(new_wallet)
    else:
        current_user.wallet.wallet_address = payload.wallet_address
    db.commit()
    return {"status": "connected", "wallet": payload.wallet_address}

@router.get("/wallet/me")
def get_my_wallet(current_user: User = Depends(get_current_user)):
    if current_user.wallet:
        return {"wallet_address": current_user.wallet.wallet_address}
    raise HTTPException(status_code=404, detail="No wallet connected")

@router.delete("/wallet/disconnect")
def disconnect_wallet(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.wallet:
        db.delete(current_user.wallet)
        db.commit()
    return {"status": "disconnected"}

