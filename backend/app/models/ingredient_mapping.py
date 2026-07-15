from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Float,
    ForeignKey,
    String,
    TIMESTAMP,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.nutrition import Nutrition


class IngredientMapping(Base):
    __tablename__ = "ingredient_mapping"

    ingredient_name: Mapped[str] = mapped_column(
        String(255),
        primary_key=True,
    )

    fdc_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey(
            "nutrition.fdc_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    nutrition: Mapped["Nutrition"] = relationship("Nutrition")