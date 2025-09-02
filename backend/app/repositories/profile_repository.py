from datetime import datetime
from typing import Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import PostgresConnector
from app.core.exceptions import NotFoundException
from app.core.monitoring.decorators import monitor_transaction
from app.models.domain import Profile, ProfileCreate, ProfileUpdate


class ProfileRepository:
    def __init__(self, db_connector: PostgresConnector):
        self.db_connector = db_connector

    @monitor_transaction(op="db.profile.create")
    async def create(self, session: AsyncSession, profile_create: ProfileCreate) -> Profile:
        db_profile = Profile(**profile_create.model_dump())
        session.add(db_profile)
        return db_profile

    @monitor_transaction(op="db.profile.get_by_user_id")
    async def get_by_user_id(self, session: AsyncSession, user_id: int) -> Optional[Profile]:
        statement = select(Profile).where(Profile.user_id == user_id)
        result = await session.execute(statement)
        profile = result.scalar_one_or_none()
        if profile is None:
            return None
        return Profile(**profile.model_dump())

    @monitor_transaction(op="db.profile.update")
    async def update(self, session: AsyncSession, user_id: int, profile_data: ProfileUpdate) -> Profile:
        statement = select(Profile).where(Profile.user_id == user_id)
        result = await session.execute(statement)
        profile = result.scalar_one_or_none()
        if profile is None:
            raise NotFoundException(message="Profile not found")

        for field, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
        profile.updated_at = datetime.utcnow()
        session.add(profile)
        return Profile(**profile.model_dump())
