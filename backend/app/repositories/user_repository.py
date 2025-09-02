from datetime import datetime, timedelta
from typing import Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import PostgresConnector
from app.core.exceptions import NotFoundException
from app.core.monitoring.decorators import monitor_transaction
from app.models.domain import User, UserCreate, UserUpdate


class UserRepository:
    def __init__(self, db_connector: PostgresConnector):
        self.db_connector = db_connector

    @monitor_transaction(op="db.user.create")
    async def create(self, session: AsyncSession, user_create: UserCreate) -> User:

        db_user = User(**user_create.dict())
        session.add(db_user)
        return db_user

    @monitor_transaction(op="db.user.get_by_id")
    async def get_by_id(self, session: AsyncSession, user_id: int) -> Optional[User]:
        statement = select(User).where(User.id == user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            return None
        return User(**user.dict())

    @monitor_transaction(op="db.user.get_by_email")
    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[User]:
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            return None
        return User(**user.dict())

    @monitor_transaction(op="db.user.update")
    async def update(self, session: AsyncSession, user_id: int, user_data: UserUpdate) -> User:
        statement = select(User).where(User.id == user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            raise NotFoundException(message="User not found")

        for field, value in user_data.model_dump(exclude_unset=True).items():
            setattr(user, field, value)
        user.updated_at = datetime.utcnow()
        session.add(user)
        return User(**user.dict())
    
    @monitor_transaction(op="db.user.update_token_creation_at")
    async def update_token_creation_at(self, session: AsyncSession, user_id: int, token_creation_at: datetime) -> datetime:
        statement = select(User).where(User.id == user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            raise NotFoundException(message="User not found")

        user.token_creation_at = token_creation_at
        user.updated_at = datetime.utcnow()
        session.add(user)
        return token_creation_at


    @monitor_transaction(op="db.user.update_last_login")
    async def update_last_login(self, session: AsyncSession, user_id: int) -> None:
        statement = select(User).where(User.id == user_id)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            raise NotFoundException(message="User not found")

        user.last_login = datetime.utcnow()
        user.updated_at = datetime.utcnow()
        session.add(user)
        await session.commit()

    
    @monitor_transaction(op="db.user.get_by_token_creation_at")
    async def get_by_token_creation_at(
        self, session: AsyncSession, user_id: int, token_creation_at: datetime
    ) -> Optional[User]:
        start_time = token_creation_at
        end_time = start_time + timedelta(seconds=1)
        
        statement = select(User).where(
            User.id == user_id,
            User.token_creation_at >= start_time,
            User.token_creation_at < end_time
        )
        result = await session.execute(statement)
        user = result.scalar_one_or_none()
        if user is None:
            return None
        return User(**user.dict())