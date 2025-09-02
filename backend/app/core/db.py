import logging
from typing import Any, Optional, AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlmodel import SQLModel
from contextlib import asynccontextmanager


logger = logging.getLogger(__name__)


class MongoDBConnector:
    client: Optional[AsyncIOMotorClient] = None

    async def connect_to_mongodb(self, db_url: str, **kwargs: Any) -> None:
        logger.info("Connecting to MongoDB...")
        try:
            self.client = AsyncIOMotorClient(db_url, **kwargs)
            await self.client.admin.command("ping")
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    async def close_mongodb_connection(self) -> None:
        logger.info("Closing MongoDB connection...")
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")


mongodb = MongoDBConnector()


class PostgresConnector:
    client: Optional[AsyncEngine] = None

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        if not self.client:
            raise RuntimeError(
                "Database connection is not initialized. Call `connect_to_db` first."
            )

        async with AsyncSession(bind=self.client, expire_on_commit=False) as session:
            yield session

    async def connect_to_db(self, db_url: str, **kwargs: dict) -> None:
        """Initialize database connection."""
        self.client = create_async_engine(url=db_url, **kwargs)
        async with self.client.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

    async def close_db_connection(self) -> None:
        """Close database connection."""
        if self.client:
            await self.client.dispose()
            logger.info("Database connection closed")


postgres_db = PostgresConnector()
