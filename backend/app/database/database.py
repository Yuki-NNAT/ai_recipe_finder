from sqlalchemy import create_engine
from sqlalchemy.engine import URL

from app.core.config import settings


DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=settings.DB_USER,
    password=settings.DB_PASSWORD,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    database=settings.DB_NAME,
)


engine = create_engine(
    DATABASE_URL,

    # Phát hiện connection đã bị MySQL/RDS đóng
    pool_pre_ping=True,

    # Tái tạo connection định kỳ
    pool_recycle=1800,

    # Giới hạn connection để tránh làm quá tải db.t3.micro
    pool_size=5,
    max_overflow=5,
    pool_timeout=30,

    # Hạn chế lộ parameter trong log lỗi
    hide_parameters=True,

    # Không in câu SQL ra log production
    echo=False,

    connect_args={
        "connect_timeout": 10,
        "read_timeout": 30,
        "write_timeout": 30,
        "charset": "utf8mb4",
    },
)