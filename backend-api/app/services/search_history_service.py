import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.search_history import SearchHistoryCRUD
from app.models.search_history import SearchHistory
from app.models.user import User
from app.schemas.search_history import (
    SearchHistoryClearResponse,
    SearchHistoryListResponse,
)


logger = logging.getLogger(__name__)

MAX_KEYWORD_LENGTH = 255


def search_history_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Search history entry not found.",
    )


def invalid_search_history_error(
    detail: str,
) -> HTTPException:
    return HTTPException(
        status_code=(
            status.HTTP_422_UNPROCESSABLE_ENTITY
        ),
        detail=detail,
    )


def search_history_database_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unable to process search history.",
    )


class SearchHistoryService:
    @staticmethod
    def normalize_keyword(
        keyword: str,
    ) -> str:
        normalized_keyword = " ".join(
            keyword.strip().split()
        )

        if not normalized_keyword:
            raise invalid_search_history_error(
                "keyword must not be empty"
            )

        if (
            len(normalized_keyword)
            > MAX_KEYWORD_LENGTH
        ):
            raise invalid_search_history_error(
                (
                    "keyword must not exceed "
                    f"{MAX_KEYWORD_LENGTH} characters"
                )
            )

        return normalized_keyword

    @classmethod
    def record_search(
        cls,
        db: Session,
        *,
        current_user: User,
        keyword: str,
        total_result: int,
    ) -> SearchHistory:
        normalized_keyword = cls.normalize_keyword(
            keyword
        )

        if total_result < 0:
            raise invalid_search_history_error(
                "total_result must not be negative"
            )

        try:
            history = SearchHistoryCRUD.create(
                db,
                user_id=current_user.user_id,
                keyword=normalized_keyword,
                total_result=total_result,
            )

            db.commit()
            db.refresh(history)

            return history

        except SQLAlchemyError as exc:
            db.rollback()

            logger.exception(
                "Failed to record search history."
            )

            raise search_history_database_error() from exc

    @staticmethod
    def get_search_history(
        db: Session,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 20,
    ) -> SearchHistoryListResponse:
        if page < 1:
            raise invalid_search_history_error(
                (
                    "page must be greater than "
                    "or equal to 1"
                )
            )

        if not 1 <= limit <= 100:
            raise invalid_search_history_error(
                "limit must be between 1 and 100"
            )

        skip = (page - 1) * limit

        try:
            history_entries = (
                SearchHistoryCRUD.get_all_by_user(
                    db,
                    user_id=current_user.user_id,
                    skip=skip,
                    limit=limit,
                )
            )

            total = SearchHistoryCRUD.count_by_user(
                db,
                user_id=current_user.user_id,
            )

        except (ValueError, SQLAlchemyError) as exc:
            logger.exception(
                "Failed to list search history."
            )

            raise search_history_database_error() from exc

        return SearchHistoryListResponse(
            page=page,
            limit=limit,
            total=total,
            data=history_entries,
        )

    @staticmethod
    def delete_search_history_entry(
        db: Session,
        *,
        current_user: User,
        history_id: int,
    ) -> None:
        history = SearchHistoryCRUD.get(
            db,
            user_id=current_user.user_id,
            history_id=history_id,
        )

        if history is None:
            raise search_history_not_found_error()

        try:
            SearchHistoryCRUD.delete(
                db,
                history,
            )

            db.commit()

        except SQLAlchemyError as exc:
            db.rollback()

            logger.exception(
                "Failed to delete search history entry."
            )

            raise search_history_database_error() from exc

    @staticmethod
    def clear_search_history(
        db: Session,
        *,
        current_user: User,
    ) -> SearchHistoryClearResponse:
        try:
            deleted_count = (
                SearchHistoryCRUD.delete_all_by_user(
                    db,
                    user_id=current_user.user_id,
                )
            )

            db.commit()

        except (ValueError, SQLAlchemyError) as exc:
            db.rollback()

            logger.exception(
                "Failed to clear search history."
            )

            raise search_history_database_error() from exc

        return SearchHistoryClearResponse(
            deleted_count=deleted_count,
        )