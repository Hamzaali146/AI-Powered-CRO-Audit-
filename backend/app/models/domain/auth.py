from app.models.domain.profile import ProfileCreate
from app.models.domain.user import UserCreate


class SignupRequest(UserCreate):
    class Config:
        from_attributes = True
