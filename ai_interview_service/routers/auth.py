from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from request_model.AuthRequest import LoginRequest, SignupRequest
from response_model.AuthResponse import TokenResponse, UserResponse
from utils.auth_dependency import get_current_user
from utils.security import create_access_token, hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    email = req.email.lower()

    already_exists = db.scalar(select(User).where(User.email == email))
    if already_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This email is already registered. Try logging in.")

    user = User(name=req.name.strip(), email=email, password_hash=hash_password(req.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"access_token": create_access_token(user.id), "user": user}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == req.email.lower()))

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.")

    return {"access_token": create_access_token(user.id), "user": user}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
