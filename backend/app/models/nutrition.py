from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Float,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.ingredient_mapping import (
        IngredientMapping,
    )


class Nutrition(Base):
    __tablename__ = "nutrition"
    __table_args__ = (
        CheckConstraint(
            "fdc_id > 0",
            name="ck_nutrition_fdc_id_positive",
        ),
        CheckConstraint(
            "calories IS NULL OR calories >= 0",
            name="ck_nutrition_calories_nonnegative",
        ),
    )

    fdc_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
    )

    food_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    data_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    calories: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    ingredient_mappings: Mapped[
        list["IngredientMapping"]
    ] = relationship(
        "IngredientMapping",
        back_populates="nutrition",
        passive_deletes=True,
    )