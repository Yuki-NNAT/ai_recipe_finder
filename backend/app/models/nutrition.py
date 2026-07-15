from sqlalchemy import BigInteger, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Nutrition(Base):
    __tablename__ = "nutrition"

    fdc_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    food_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    data_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    calories: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )