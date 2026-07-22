from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.comment import Comment


class CommentCRUD:
    @staticmethod
    def get_by_id(
        db: Session,
        *,
        comment_id: int,
    ) -> Comment | None:
        statement = (
            select(Comment)
            .options(joinedload(Comment.user))
            .where(Comment.comment_id == comment_id)
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_recipe(
        db: Session,
        *,
        recipe_id: int,
        skip: int,
        limit: int,
    ) -> list[Comment]:
        statement = (
            select(Comment)
            .options(joinedload(Comment.user))
            .where(Comment.recipe_id == recipe_id)
            .order_by(
                Comment.created_at.desc(),
                Comment.comment_id.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def count_by_recipe(
        db: Session,
        *,
        recipe_id: int,
    ) -> int:
        from sqlalchemy import func

        statement = (
            select(func.count(Comment.comment_id))
            .where(Comment.recipe_id == recipe_id)
        )

        return int(db.scalar(statement) or 0)

    @staticmethod
    def create(
        db: Session,
        *,
        user_id: int,
        recipe_id: int,
        content: str,
    ) -> Comment:
        comment = Comment(
            user_id=user_id,
            recipe_id=recipe_id,
            content=content,
        )

        db.add(comment)
        db.flush()

        return comment

    @staticmethod
    def update(
        db: Session,
        *,
        comment: Comment,
        content: str,
    ) -> Comment:
        comment.content = content
        db.flush()

        return comment

    @staticmethod
    def delete(
        db: Session,
        *,
        comment: Comment,
    ) -> None:
        db.delete(comment)