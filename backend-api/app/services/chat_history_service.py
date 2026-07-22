import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.chat_history import ChatHistoryCRUD
from app.crud.recipe import RecipeCRUD
from app.models.chat_history import ChatHistory, ChatRole
from app.models.user import User
from app.schemas.chat_history import (
    ChatHistoryClearResponse,
    ChatHistoryDeleteResponse,
    ChatHistoryItemResponse,
    ChatHistoryListResponse,
)


logger = logging.getLogger(__name__)

MAX_CHAT_MESSAGE_LENGTH = 20_000


def chat_entry_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Chat history entry not found.",
    )


def recipe_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Recipe not found.",
    )


class ChatHistoryService:
    @staticmethod
    def record_message(
        db: Session,
        *,
        user_id: int,
        role: ChatRole,
        message: str,
        recipe_id: int | None = None,
    ) -> ChatHistory:
        normalized_message = message.strip()

        if (
            not normalized_message
            or len(normalized_message)
            > MAX_CHAT_MESSAGE_LENGTH
        ):
            raise ValueError(
                "message must contain between 1 and "
                f"{MAX_CHAT_MESSAGE_LENGTH} characters"
            )

        if role not in {"user", "assistant"}:
            raise ValueError(
                "role must be user or assistant"
            )

        if recipe_id is not None:
            if recipe_id <= 0:
                raise ValueError(
                    "recipe_id must be greater than 0"
                )

            recipe = RecipeCRUD.get_by_id(
                db,
                recipe_id,
            )

            if recipe is None:
                raise recipe_not_found_error()

        try:
            chat_entry = ChatHistoryCRUD.create(
                db,
                user_id=user_id,
                role=role,
                message=normalized_message,
                recipe_id=recipe_id,
            )

            db.commit()
            db.refresh(chat_entry)

            return chat_entry

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to record chat history."
            )

            raise

    @staticmethod
    def get_history(
        db: Session,
        *,
        current_user: User,
        before_chat_id: int | None = None,
        limit: int = 50,
    ) -> ChatHistoryListResponse:
        if before_chat_id is not None and before_chat_id <= 0:
            raise ValueError(
                "before_chat_id must be greater than 0"
            )

        if not 1 <= limit <= 100:
            raise ValueError(
                "limit must be between 1 and 100"
            )

        entries = ChatHistoryCRUD.get_by_user(
            db,
            user_id=current_user.user_id,
            before_chat_id=before_chat_id,
            limit=limit + 1,
        )

        has_more = len(entries) > limit

        if has_more:
            entries = entries[1:]

        next_cursor = (
            entries[0].chat_id
            if has_more and entries
            else None
        )

        return ChatHistoryListResponse(
            items=[
                ChatHistoryItemResponse.model_validate(
                    entry
                )
                for entry in entries
            ],
            next_cursor=next_cursor,
            has_more=has_more,
        )

    @staticmethod
    def delete_entry(
        db: Session,
        *,
        current_user: User,
        chat_id: int,
    ) -> ChatHistoryDeleteResponse:
        if chat_id <= 0:
            raise ValueError(
                "chat_id must be greater than 0"
            )

        chat_entry = (
            ChatHistoryCRUD.get_by_id_and_user(
                db,
                chat_id=chat_id,
                user_id=current_user.user_id,
            )
        )

        if chat_entry is None:
            raise chat_entry_not_found_error()

        try:
            ChatHistoryCRUD.delete_entry(
                db,
                chat_entry,
            )

            db.commit()

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to delete chat history entry."
            )

            raise

        return ChatHistoryDeleteResponse(
            detail="Chat history entry deleted.",
        )

    @staticmethod
    def clear_history(
        db: Session,
        *,
        current_user: User,
    ) -> ChatHistoryClearResponse:
        try:
            deleted_count = (
                ChatHistoryCRUD.delete_all_by_user(
                    db,
                    user_id=current_user.user_id,
                )
            )

            db.commit()

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to clear chat history."
            )

            raise

        return ChatHistoryClearResponse(
            detail="Chat history cleared.",
            deleted_count=deleted_count,
        )