import os
from dataclasses import dataclass
from urllib.parse import quote_plus

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str

    @property
    def database_url(self) -> str:
        user = quote_plus(self.db_user)
        password = quote_plus(self.db_password)

        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
            "?charset=utf8mb4"
        )


def get_required_env(name: str) -> str:
    value = os.getenv(name)

    if value is None or not value.strip():
        raise RuntimeError(
            f"Missing required environment variable: {name}"
        )

    return value.strip()


def get_port_env(
    name: str,
    default: int,
) -> int:
    raw_value = os.getenv(name, str(default))

    try:
        port = int(raw_value)
    except ValueError as exc:
        raise RuntimeError(
            f"Environment variable {name} must be an integer."
        ) from exc

    if not 1 <= port <= 65535:
        raise RuntimeError(
            f"Environment variable {name} must be between 1 and 65535."
        )

    return port


def load_settings() -> Settings:
    return Settings(
        db_host=get_required_env("DB_HOST"),
        db_port=get_port_env("DB_PORT", 3306),
        db_name=get_required_env("DB_NAME"),
        db_user=get_required_env("DB_USER"),
        db_password=get_required_env("DB_PASSWORD"),
    )


settings = load_settings()