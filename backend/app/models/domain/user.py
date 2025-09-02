from datetime import datetime
from typing import Literal, Optional

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    full_name: str = Field(..., description="The full name of the user")
    email: EmailStr = Field(..., description="The email of the user")
    password: str = Field(..., description="The password of the user")  



class UserUpdate(SQLModel):
    full_name: Optional[str] = Field(None, description="The full name of the user")
    onboarding_completed: Optional[bool] = Field(None, description="Profile completion status")
    token_creation_at: Optional[datetime] = Field(
        None, description="The time when token was created"
    )
    last_login: Optional[datetime] = Field(None, description="The last time when token was created")
    updated_at: Optional[datetime] = Field(
        None, description="The time when token was created"
    )



class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int = Field(default=None, primary_key=True)
    email: str = Field(..., description="The email of the user", unique=True)
    password: str = Field(..., description="The password of the user")
    onboarding_completed: bool = Field(default=False, description="Profile completion status")
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())
    last_login: Optional[datetime] = Field(None, description="The last time when token was created")
    token_creation_at: Optional[datetime] = Field(
        default=datetime.utcnow(), description="The time when token was created"
    )
