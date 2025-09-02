from typing import Optional
import dotenv
from pydantic_settings import BaseSettings

dotenv.load_dotenv()


class DatabaseSettings(BaseSettings):
    POSTGRES_URL: str = dotenv.get_key(".env", "POSTGRES_URL")
    POOL_SIZE: Optional[int] = 10
    MAX_OVERFLOW: Optional[int] = 20
    POOL_TIMEOUT: Optional[int] = 30  # seconds
    POOL_RECYCLE: Optional[int] = 1800  # seconds

    @property
    def postgres_connection_params(self) -> dict:
        return {
            "pool_size": self.POOL_SIZE,
            "max_overflow": self.MAX_OVERFLOW,
            "pool_timeout": self.POOL_TIMEOUT,
            "pool_recycle": self.POOL_RECYCLE,
        }

    class Config:
        env_prefix = "DB_"
