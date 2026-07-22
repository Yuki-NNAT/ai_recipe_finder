from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Index,
    Integer,
    TIMESTAMP,
    text,
)
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.recipe import Recipe
    from app.models.user import User


class Rating(Base):
    __tablename__ = "ratings"

    __table_args__ = (
        CheckConstraint(
            "rating BETWEEN 1 AND 5",
            name="chk_ratings_value",
        ),
        Index(
            "ix_ratings_recipe_id",
            "recipe_id",
        ),
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    recipe_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "recipes.recipe_id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    rating: Mapped[int] = mapped_column(
        TINYINT(unsigned=True),
        nullable=False,
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

    user: Mapped["User"] = relationship(
        "User",
        back_populates="ratings",
    )

    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        back_populates="ratings",
    )