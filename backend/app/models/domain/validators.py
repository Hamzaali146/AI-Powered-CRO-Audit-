import re
from typing import Any, Optional, Self

from bson import ObjectId
from pydantic import field_validator, model_validator


class PhoneValidatorMixin:
    @field_validator("phone")
    def validate_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        if not re.match(r"^\+?1?\d{9,15}$", value):
            raise ValueError("Invalid phone number format")
        return value


class PasswordValidatorMixin:
    @field_validator("password")
    def validate_password(cls, password: str) -> str:
        if not any(character.isalpha() for character in password):
            raise ValueError("Password must contain at least one letter")
        if not any(character.isdigit() for character in password):
            raise ValueError("Password must contain at least one digit")
        if not any(character in "@$!%*#?&^" for character in password):
            raise ValueError("Password must contain at least one special character (@$!%*#?&)")
        return password


class TermsValidatorMixin:
    accept_terms: bool

    @model_validator(mode="after")
    def validate_terms(self) -> Self:
        if not self.accept_terms:
            raise ValueError("Terms must be accepted")
        return self


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> dict:
        """Define the schema used by Pydantic v2."""
        return {"type": "string", "format": "objectid", "validate": cls.validate}

    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        """Validate and convert input to a valid ObjectId."""
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, str) and ObjectId.is_valid(value):
            return ObjectId(value)
        raise ValueError(f"Invalid ObjectId: {value}")
