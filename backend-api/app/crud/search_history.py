from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models.search_history import SearchHistory


class SearchHistoryCRUD:
    @staticmethod
    def get(
        db: Session,
        *,
        user_id: int,
        history_id: int,
    ) -> SearchHistory | None:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        if history_id <= 0:
            raise ValueError(
                "history_id must be greater than 0"
            )

        statement = select(
            SearchHistory
        ).where(
            SearchHistory.user_id == user_id,
            SearchHistory.history_id == history_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_all_by_user(
        db: Session,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> list[SearchHistory]:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        if skip < 0:
            raise ValueError(
                "skip must not be negative"
            )

        if not 1 <= limit <= 100:
            raise ValueError(
                "limit must be between 1 and 100"
            )

        statement = (
            select(SearchHistory)
            .where(
                SearchHistory.user_id == user_id
            )
            .order_by(
                SearchHistory.searched_at.desc(),
                SearchHistory.history_id.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(
            db.scalars(statement).all()
        )

    @staticmethod
    def create(
        db: Session,
        *,
        user_id: int,
        keyword: str,
        total_result: int,
    ) -> SearchHistory:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        if not keyword:
            raise ValueError(
                "keyword must not be empty"
            )

        if len(keyword) > 255:
            raise ValueError(
                (
                    "keyword must not exceed "
                    "255 characters"
                )
            )

        if total_result < 0:
            raise ValueError(
                "total_result must not be negative"
            )

        history = SearchHistory(
            user_id=user_id,
            keyword=keyword,
            total_result=total_result,
        )

        db.add(history)
        db.flush()

        return history

    @staticmethod
    def delete(
        db: Session,
        history: SearchHistory,
    ) -> None:
        db.delete(history)
        db.flush()

    @staticmethod
    def delete_all_by_user(
        db: Session,
        *,
        user_id: int,
    ) -> int:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        statement = delete(
            SearchHistory
        ).where(
            SearchHistory.user_id == user_id
        )

        result = db.execute(statement)

        return int(
            result.rowcount
            or 0
        )

    @staticmethod
    def count_by_user(
        db: Session,
        *,
        user_id: int,
    ) -> int:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        statement = select(
            func.count(SearchHistory.history_id)
        ).where(
            SearchHistory.user_id == user_id
        )

        return int(
            db.scalar(statement)
            or 0
        )