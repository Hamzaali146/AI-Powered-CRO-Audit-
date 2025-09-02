from typing import Any, Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import PostgresConnector
from app.core.exceptions import DatabaseException
from app.core.monitoring.decorators import monitor_transaction
from app.models.domain.reset_password import ResetPasswordInDB


class ResetPasswordRepository:
    def __init__(self, db_connector: PostgresConnector):
        self.db_connector = db_connector

    @monitor_transaction(op="db.reset_password.create")
    async def create(self, session: AsyncSession, reset_password_data: ResetPasswordInDB) -> ResetPasswordInDB:
        try:
            session.add(reset_password_data)
            await session.commit()
            await session.refresh(reset_password_data)
            return reset_password_data
        except Exception as e:
            await session.rollback()
            raise DatabaseException(f"Failed to create reset_password: {str(e)}")

    @monitor_transaction(op="db.reset_password.get_by_email")
    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[ResetPasswordInDB]:
        try:
            statement = (
                select(ResetPasswordInDB)
                .where(ResetPasswordInDB.email == email)
                .order_by(ResetPasswordInDB.created_at.desc())
                .limit(1)
            )
            result = await session.execute(statement)
            return result.scalar_one_or_none()
        except Exception as e:
            raise DatabaseException(f"Failed to get reset_password by email: {str(e)}")

    @monitor_transaction(op="db.reset_password.delete")
    async def delete(self, session: AsyncSession, email: str) -> None:
        try:
            statement = select(ResetPasswordInDB).where(ResetPasswordInDB.email == email)
            result = await session.execute(statement)
            reset_password = result.scalar_one_or_none()
            if reset_password:
                await session.delete(reset_password)
                await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseException(f"Failed to delete reset_password: {str(e)}")
