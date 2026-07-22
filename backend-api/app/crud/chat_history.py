from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.chat_history import ChatHistory, ChatRole


class ChatHistoryCRUD:
    @staticmethod
    def create(
        db: Session,
        *,
        user_id: int,
        role: ChatRole,
        message: str,
        recipe_id: int | None = None,
    ) -> ChatHistory:
        chat_entry = ChatHistory(
            user_id=user_id,
            role=role,
            message=message,
            recipe_id=recipe_id,
        )

        db.add(chat_entry)
        db.flush()

        return chat_entry

    @staticmethod
    def get_by_id_and_user(
        db: Session,
        *,
        chat_id: int,
        user_id: int,
    ) -> ChatHistory | None:
        statement = select(ChatHistory).where(
            ChatHistory.chat_id == chat_id,
            ChatHistory.user_id == user_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_user(
        db: Session,
        *,
        user_id: int,
        before_chat_id: int | None = None,
        limit: int = 50,
    ) -> list[ChatHistory]:
        statement = select(ChatHistory).where(
            ChatHistory.user_id == user_id,
        )

        if before_chat_id is not None:
            statement = statement.where(
                ChatHistory.chat_id < before_chat_id,
            )

        statement = (
            statement
            .order_by(ChatHistory.chat_id.desc())
            .limit(limit)
        )

        entries = list(
            db.scalars(statement).all()
        )

        # Database lấy tin mới nhất trước để phân trang hiệu quả.
        # Đảo lại để API trả đúng thứ tự hội thoại cũ -> mới.
        entries.reverse()

        return entries

    @staticmethod
    def delete_entry(
        db: Session,
        chat_entry: ChatHistory,
    ) -> None:
        db.delete(chat_entry)

    @staticmethod
    def delete_all_by_user(
        db: Session,
        *,
        user_id: int,
    ) -> int:
        statement = delete(ChatHistory).where(
            ChatHistory.user_id == user_id,
        )

        result = db.execute(statement)

        return int(result.rowcount or 0)