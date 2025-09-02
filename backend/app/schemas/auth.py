from pydantic import BaseModel, EmailStr

from app.schemas.base import BaseResponse


class RefreshTokenRequest(BaseModel):
    access_token: str
    refresh_token: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseResponse):
    pass


class VerificationTokenResponse(BaseResponse):
    pass


class MagicLinkRequest(BaseModel):
    email: EmailStr
