import os

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.core.config import settings


def build_connect_args() -> dict:
    connect_args = {
        "connect_timeout": 10,
        "read_timeout": 30,
        "write_timeout": 30,
        "charset": "utf8mb4",
    }

    ssl_ca = os.getenv("DB_SSL_CA")

    if ssl_ca:
        connect_args["ssl"] = {
            "ca": ssl_ca,
        }

    return connect_args


def create_database_engine() -> Engine:
    return create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=5,
        max_overflow=5,
        pool_timeout=30,
        hide_parameters=True,
        echo=False,
        connect_args=build_connect_args(),
    )


engine = create_database_engine()