from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class GenderEnum(str, Enum):
    male = "male"
    female = "female"


class ProfileCreate(SQLModel):
    user_id: int = Field(foreign_key="users.id", description="The id of the user")
    full_name: str = Field(..., description="The full name of the user")
    gender: GenderEnum
    country: str = Field(..., description="The country of the user")
    state: Optional[str] = Field(default=None, description="The state of the user")
    city: Optional[str] = Field(default=None, description="The city of the user")
    favorite_meal_style: Optional[str] = Field(default=None, description="The favorite meal style of the user")
    favorite_region_fields: Optional[str] = Field(default=None, description="The favorite region fields of the user")
    bio: Optional[str] = Field(default=None, description="The bio of the user")


class ProfileUpdate(SQLModel):
    full_name: Optional[str] = Field(None, description="The full name of the user")
    gender: Optional[GenderEnum] = Field(None, description="The gender of the user")
    country: Optional[str] = Field(None, description="The country of the user")
    state: Optional[str] = Field(None, description="The state of the user")
    city: Optional[str] = Field(None, description="The city of the user")
    favorite_meal_style: Optional[str] = Field(None, description="The favorite meal style of the user")
    favorite_region_fields: Optional[str] = Field(None, description="The favorite region fields of the user")
    bio: Optional[str] = Field(None, description="The bio of the user")



class Profile(SQLModel, table=True):
    __tablename__ = "profiles"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", description="The id of the user")
    full_name: str = Field(..., description="The full name of the user")
    gender: GenderEnum
    country: str = Field(..., description="The country of the user")
    state: Optional[str] = Field(default=None, description="The state of the user")
    city: Optional[str] = Field(default=None, description="The city of the user")
    favorite_meal_style: Optional[str] = Field(default=None, description="The favorite meal style of the user")
    favorite_region_fields: Optional[str] = Field(default=None, description="The favorite region fields of the user")
    bio: Optional[str] = Field(default=None, description="The bio of the user")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
