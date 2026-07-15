from sqlalchemy import Boolean, Float, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Recipe(Base):
    __tablename__ = "recipes"

    recipe_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(Text)

    ingredients: Mapped[list[str]] = mapped_column(JSON)

    ingredients_raw: Mapped[list[str]] = mapped_column(JSON)

    steps: Mapped[list[str]] = mapped_column(JSON)

    servings: Mapped[float | None] = mapped_column(Float)

    serving_size: Mapped[str | None] = mapped_column(String(100))

    tags: Mapped[list[str]] = mapped_column(JSON)

    ingredient_count: Mapped[int] = mapped_column(Integer)

    ingredient_raw_count: Mapped[int] = mapped_column(Integer)

    step_count: Mapped[int] = mapped_column(Integer)

    tag_count: Mapped[int] = mapped_column(Integer)

    has_ingredients: Mapped[bool] = mapped_column(Boolean)

    has_ingredients_raw: Mapped[bool] = mapped_column(Boolean)

    has_steps: Mapped[bool] = mapped_column(Boolean)

    has_tags: Mapped[bool] = mapped_column(Boolean)