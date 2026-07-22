from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    ForeignKey,
    Index,
    Integer,
    String,
    TIMESTAMP,
    text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class SearchHistory(Base):
    __tablename__ = "search_history"
    __table_args__ = (
        CheckConstraint(
            (
                "total_result IS NULL OR "
                "total_result >= 0"
            ),
            name=(
                "ck_search_history_"
                "total_result_nonnegative"
            ),
        ),
        Index(
            "ix_search_history_user_searched",
            "user_id",
            "searched_at",
            "history_id",
        ),
    )

    history_id: Mapped[int] = mapped_column(
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

    keyword: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    total_result: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    searched_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="search_history_entries",
    )