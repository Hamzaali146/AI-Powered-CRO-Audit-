from pydantic_settings import BaseSettings

from .application import ApplicationSettings
from .aws import AWSSettings
from .cache import CacheSettings
from .database import DatabaseSettings
from .email import EmailSettings
from .logging import LoggingSettings
from .security import SecuritySettings


class Settings(BaseSettings):
    app: ApplicationSettings = ApplicationSettings()
    db: DatabaseSettings = DatabaseSettings()
    security: SecuritySettings = SecuritySettings()
    logging: LoggingSettings = LoggingSettings()
    cache: CacheSettings = CacheSettings()
    email: EmailSettings = EmailSettings()
    aws: AWSSettings = AWSSettings()

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"
        extra = "allow"


def get_settings() -> Settings:
    return Settings()


settings = get_settings()
