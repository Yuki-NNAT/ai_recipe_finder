import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.comment import CommentCRUD
from app.crud.recipe import RecipeCRUD
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import (
    CommentCreateRequest,
    CommentDeleteResponse,
    CommentListResponse,
    CommentResponse,
    CommentUpdateRequest,
)


logger = logging.getLogger(__name__)


def recipe_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Recipe not found.",
    )


def comment_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Comment not found.",
    )


def comment_forbidden_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You are not allowed to modify this comment.",
    )


class CommentService:
    @staticmethod
    def ensure_recipe_exists(
        db: Session,
        *,
        recipe_id: int,
    ) -> None:
        recipe = RecipeCRUD.get_by_id(
            db,
            recipe_id,
        )

        if recipe is None:
            raise recipe_not_found_error()

    @staticmethod
    def build_response(
        comment: Comment,
        *,
        current_user: User | None,
    ) -> CommentResponse:
        return CommentResponse(
            comment_id=comment.comment_id,
            recipe_id=comment.recipe_id,
            username=(
                comment.user.username
                if comment.user is not None
                else None
            ),
            content=comment.content,
            created_at=comment.created_at,
            updated_at=comment.updated_at,
            is_owner=(
                current_user is not None
                and comment.user_id == current_user.user_id
            ),
        )

    @classmethod
    def get_comments(
        cls,
        db: Session,
        *,
        recipe_id: int,
        skip: int,
        limit: int,
        current_user: User | None = None,
    ) -> CommentListResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id=recipe_id,
        )

        comments = CommentCRUD.get_by_recipe(
            db,
            recipe_id=recipe_id,
            skip=skip,
            limit=limit,
        )

        total = CommentCRUD.count_by_recipe(
            db,
            recipe_id=recipe_id,
        )

        return CommentListResponse(
            items=[
                cls.build_response(
                    comment,
                    current_user=current_user,
                )
                for comment in comments
            ],
            total=total,
            skip=skip,
            limit=limit,
        )

    @classmethod
    def create_comment(
        cls,
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
        payload: CommentCreateRequest,
    ) -> CommentResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id=recipe_id,
        )

        try:
            comment = CommentCRUD.create(
                db,
                user_id=current_user.user_id,
                recipe_id=recipe_id,
                content=payload.content,
            )

            db.commit()
            db.refresh(comment)

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to create comment."
            )

            raise

        # Tránh thêm truy vấn chỉ để lấy lại user.
        comment.user = current_user

        return cls.build_response(
            comment,
            current_user=current_user,
        )

    @classmethod
    def update_comment(
        cls,
        db: Session,
        *,
        current_user: User,
        comment_id: int,
        payload: CommentUpdateRequest,
    ) -> CommentResponse:
        comment = CommentCRUD.get_by_id(
            db,
            comment_id=comment_id,
        )

        if comment is None:
            raise comment_not_found_error()

        if comment.user_id != current_user.user_id:
            raise comment_forbidden_error()

        try:
            comment = CommentCRUD.update(
                db,
                comment=comment,
                content=payload.content,
            )

            db.commit()
            db.refresh(comment)

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to update comment."
            )

            raise

        comment.user = current_user

        return cls.build_response(
            comment,
            current_user=current_user,
        )

    @staticmethod
    def delete_comment(
        db: Session,
        *,
        current_user: User,
        comment_id: int,
    ) -> CommentDeleteResponse:
        comment = CommentCRUD.get_by_id(
            db,
            comment_id=comment_id,
        )

        if comment is None:
            raise comment_not_found_error()

        if comment.user_id != current_user.user_id:
            raise comment_forbidden_error()

        try:
            CommentCRUD.delete(
                db,
                comment=comment,
            )

            db.commit()

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to delete comment."
            )

            raise

        return CommentDeleteResponse(
            detail="Comment deleted.",
        )