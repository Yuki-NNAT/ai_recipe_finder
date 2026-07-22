import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.rating import RatingCRUD
from app.crud.recipe import RecipeCRUD
from app.models.user import User
from app.schemas.rating import (
    RatingDeleteResponse,
    RatingResponse,
    RatingSummaryResponse,
    RatingUpsertRequest,
)


logger = logging.getLogger(__name__)


def recipe_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Recipe not found.",
    )


def rating_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Rating not found.",
    )


class RatingService:
    @staticmethod
    def ensure_recipe_exists(
        db: Session,
        recipe_id: int,
    ) -> None:
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

    @classmethod
    def get_summary(
        cls,
        db: Session,
        *,
        recipe_id: int,
    ) -> RatingSummaryResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id,
        )

        average_rating, rating_count = (
            RatingCRUD.get_summary(
                db,
                recipe_id=recipe_id,
            )
        )

        return RatingSummaryResponse(
            recipe_id=recipe_id,
            average_rating=(
                round(average_rating, 2)
                if average_rating is not None
                else None
            ),
            rating_count=rating_count,
        )

    @classmethod
    def get_current_user_rating(
        cls,
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
    ) -> RatingResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id,
        )

        rating_entry = (
            RatingCRUD.get_by_user_and_recipe(
                db,
                user_id=current_user.user_id,
                recipe_id=recipe_id,
            )
        )

        if rating_entry is None:
            raise rating_not_found_error()

        return RatingResponse.model_validate(
            rating_entry
        )

    @classmethod
    def upsert_rating(
        cls,
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
        payload: RatingUpsertRequest,
    ) -> RatingResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id,
        )

        rating_entry = (
            RatingCRUD.get_by_user_and_recipe(
                db,
                user_id=current_user.user_id,
                recipe_id=recipe_id,
            )
        )

        try:
            if rating_entry is None:
                rating_entry = RatingCRUD.create(
                    db,
                    user_id=current_user.user_id,
                    recipe_id=recipe_id,
                    rating=payload.rating,
                )
            else:
                rating_entry = RatingCRUD.update(
                    db,
                    rating_entry=rating_entry,
                    rating=payload.rating,
                )

            db.commit()
            db.refresh(rating_entry)

        except IntegrityError:
            db.rollback()

            # Bảo vệ trường hợp hai request tạo rating
            # đồng thời cho cùng user và recipe.
            rating_entry = (
                RatingCRUD.get_by_user_and_recipe(
                    db,
                    user_id=current_user.user_id,
                    recipe_id=recipe_id,
                )
            )

            if rating_entry is None:
                logger.exception(
                    "Rating upsert integrity conflict."
                )
                raise

            try:
                rating_entry = RatingCRUD.update(
                    db,
                    rating_entry=rating_entry,
                    rating=payload.rating,
                )

                db.commit()
                db.refresh(rating_entry)

            except SQLAlchemyError:
                db.rollback()

                logger.exception(
                    "Failed to retry rating update."
                )

                raise

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to create or update rating."
            )

            raise

        return RatingResponse.model_validate(
            rating_entry
        )

    @classmethod
    def delete_rating(
        cls,
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
    ) -> RatingDeleteResponse:
        cls.ensure_recipe_exists(
            db,
            recipe_id,
        )

        rating_entry = (
            RatingCRUD.get_by_user_and_recipe(
                db,
                user_id=current_user.user_id,
                recipe_id=recipe_id,
            )
        )

        if rating_entry is None:
            raise rating_not_found_error()

        try:
            RatingCRUD.delete(
                db,
                rating_entry,
            )

            db.commit()

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Failed to delete rating."
            )

            raise

        return RatingDeleteResponse(
            detail="Rating deleted.",
        )