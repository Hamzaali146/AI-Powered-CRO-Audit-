from bson import ObjectId
from pydantic import BaseModel, Field


class ProfileDetail(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    first_name: str
    last_name: str
    address_one: str
    address_two: str
    state: str
    country: str
    phone: str
