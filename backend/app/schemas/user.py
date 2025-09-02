from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field

from app.models.domain import UserStatus
from app.schemas import BaseResponse
from app.schemas.profile import ProfileDetail


class UserDetailResponse(BaseModel):
    id: str = Field(alias="_id", default_factory=lambda: str(ObjectId()))
    email: EmailStr
    status: UserStatus
    email_verified: bool
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileDetail] = None


class UserResponse(BaseResponse[UserDetailResponse]):
    data: UserDetailResponse


class UserDetailListResponse(BaseModel):
    users: List[UserDetailResponse]
    page: int
    total_pages: int
    total_users: int


class UserListResponse(BaseResponse[UserDetailListResponse]):
    data: UserDetailListResponse


class UserUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    status: Optional[UserStatus] = None
    email_verified: Optional[bool] = None
