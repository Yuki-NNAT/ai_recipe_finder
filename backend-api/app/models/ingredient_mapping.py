from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Float,
    ForeignKey,
    String,
    TIMESTAMP,
    func,
    text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.nutrition import Nutrition


class IngredientMapping(Base):
    __tablename__ = "ingredient_mapping"
    __table_args__ = (
        CheckConstraint(
            (
                "confidence IS NULL OR "
                "(confidence >= 0 AND confidence <= 1)"
            ),
            name=(
                "ck_ingredient_mapping_"
                "confidence_range"
            ),
        ),
    )

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
        index=True,
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
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    nutrition: Mapped["Nutrition"] = relationship(
        "Nutrition",
        back_populates="ingredient_mappings",
    )