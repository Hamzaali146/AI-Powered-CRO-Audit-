from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from .validators import PasswordValidatorMixin


class ResetPassword(BaseModel):
    email: EmailStr


class ResetPasswordOTPCreation(ResetPassword):
    OTP: str


class ResetPasswordVerify(ResetPassword):
    OTP: str


class NewPassword(ResetPassword, PasswordValidatorMixin):
    password: Optional[str] = None


class ResetPasswordInDB(ResetPassword):
    email: EmailStr
    OTP: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expire_at: datetime = Field(default_factory=datetime.utcnow)
