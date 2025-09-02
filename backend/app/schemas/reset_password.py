from pydantic import BaseModel, EmailStr

from app.schemas import BaseResponse


class ResetPasswordOTPRequest(BaseModel):
    email: EmailStr


class ResetPasswordVerifyRequest(BaseModel):
    email: EmailStr
    OTP: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    password: str


class ResetPasswordResponse(BaseResponse):
    pass
