from enum import Enum
from typing import Optional

from pydantic_settings import BaseSettings


class CacheBackend(str, Enum):
    REDIS = "redis"
    MEMCACHED = "memcached"
    IN_MEMORY = "memory"


class CacheSettings(BaseSettings):
    # General Cache Settings
    ENABLED: bool = True
    BACKEND: CacheBackend = CacheBackend.REDIS
    KEY_PREFIX: str = "fastapi_cache"
    DEFAULT_TIMEOUT: int = 300

    # Redis Settings
    REDIS_URL: Optional[str] = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_SSL: bool = False
    REDIS_POOL_MIN_SIZE: int = 1
    REDIS_POOL_MAX_SIZE: int = 10

    class Config:
        env_prefix = "CACHE_"
