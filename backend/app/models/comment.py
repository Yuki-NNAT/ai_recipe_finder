from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    ForeignKey,
    Index,
    Integer,
    Text,
    TIMESTAMP,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.recipe import Recipe
    from app.models.user import User


class Comment(Base):
    __tablename__ = "comments"

    __table_args__ = (
        CheckConstraint(
            "CHAR_LENGTH(TRIM(content)) BETWEEN 1 AND 2000",
            name="chk_comments_content_length",
        ),
        Index(
            "idx_comments_recipe_created",
            "recipe_id",
            "created_at",
            "comment_id",
        ),
    )

    comment_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.user_id",
            name="fk_comments_user",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    recipe_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "recipes.recipe_id",
            name="fk_comments_recipe",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
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
        back_populates="comments",
    )

    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        back_populates="comments",
    )