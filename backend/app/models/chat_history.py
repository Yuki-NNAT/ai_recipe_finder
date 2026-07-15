from datetime import datetime
from typing import TYPE_CHECKING, Literal

from sqlalchemy import BigInteger, Enum, ForeignKey, Integer, TIMESTAMP, text
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.recipe import Recipe
    from app.models.user import User


ChatRole = Literal["user", "assistant"]


class ChatHistory(Base):
    __tablename__ = "chat_history"

    chat_id: Mapped[int] = mapped_column(
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

    role: Mapped[ChatRole] = mapped_column(
        Enum(
            "user",
            "assistant",
            name="chat_role",
        ),
        nullable=False,
    )

    message: Mapped[str | None] = mapped_column(
        LONGTEXT,
        nullable=True,
    )

    recipe_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey(
            "recipes.recipe_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User")

    recipe: Mapped["Recipe | None"] = relationship("Recipe")