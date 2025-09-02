from enum import Enum
from typing import List
import os
from pydantic_settings import BaseSettings


class EnvironmentType(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class ApplicationSettings(BaseSettings):
    # Basic Application Settings
    PROJECT_NAME: str = "FastAPI Boilerplate"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Production-grade FastAPI boilerplate with MongoDB"
    API_V1_STR: str = "/api/v1"

    # Environment Settings
    ENVIRONMENT: EnvironmentType = EnvironmentType.DEVELOPMENT
    DEBUG: bool = False

    # Server Settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = os.getenv("PORT", 8000)
    WORKERS_COUNT: int = os.getenv("WORKERS_COUNT", 1)
    RELOAD: bool = os.getenv("RELOAD", False)

    # CORS Settings (TODO: add only allowed ones)
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    ALLOWED_HOSTS: List[str] = os.getenv("ALLOWED_HOSTS", ["*"])

    # Rate Limiting
    RATE_LIMIT_WINDOW_SIZE: int = 60
    RATE_LIMIT_BURST: int = 100
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_EXCLUDED_PATHS: List[str] = ["/health", "/metrics"]

    # Documentation Settings
    DOCS_URL: str = "/api/docs"
    REDOC_URL: str = "/api/redoc"
    OPENAPI_URL: str = "/api/openapi.json"

    # Middleware Settings
    MIDDLEWARE_GZIP_MINIMUM_SIZE: int = 1000

    class Config:
        env_prefix = "APP_"
