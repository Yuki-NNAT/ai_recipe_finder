from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.recipe import Recipe
    from app.models.user import User


class PersonalNote(Base):
    __tablename__ = "personal_notes"

    note_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    recipe_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "recipes.recipe_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        server_default=func.current_timestamp(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.current_timestamp(),
        server_onupdate=func.current_timestamp(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="personal_notes",
    )

    recipe: Mapped["Recipe"] = relationship(
        back_populates="personal_notes",
    )