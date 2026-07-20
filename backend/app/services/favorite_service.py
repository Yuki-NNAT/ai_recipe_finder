import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.crud.favorite import FavoriteCRUD
from app.crud.recipe import RecipeCRUD
from app.models.favorite import Favorite
from app.models.user import User
from app.schemas.favorite import FavoriteListResponse


logger = logging.getLogger(__name__)


def favorite_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Favorite not found.",
    )


def favorite_conflict_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Recipe is already in favorites.",
    )


def recipe_not_found_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Recipe not found.",
    )


def favorite_database_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unable to process favorite.",
    )


class FavoriteService:
    @staticmethod
    def add_favorite(
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
    ) -> Favorite:
        recipe = RecipeCRUD.get_by_id(
            db,
            recipe_id,
        )

        if recipe is None:
            raise recipe_not_found_error()

        existing_favorite = FavoriteCRUD.get(
            db,
            user_id=current_user.user_id,
            recipe_id=recipe_id,
        )

        if existing_favorite is not None:
            raise favorite_conflict_error()

        try:
            FavoriteCRUD.create(
                db,
                user_id=current_user.user_id,
                recipe_id=recipe_id,
            )

            db.commit()

        except IntegrityError as exc:
            db.rollback()

            raise favorite_conflict_error() from exc

        except SQLAlchemyError as exc:
            db.rollback()

            logger.exception(
                "Failed to create favorite."
            )

            raise favorite_database_error() from exc

        favorite = FavoriteCRUD.get(
            db,
            user_id=current_user.user_id,
            recipe_id=recipe_id,
        )

        if favorite is None:
            logger.error(
                (
                    "Favorite missing after creation: "
                    "user_id=%s recipe_id=%s"
                ),
                current_user.user_id,
                recipe_id,
            )

            raise favorite_database_error()

        return favorite

    @staticmethod
    def get_favorites(
        db: Session,
        *,
        current_user: User,
        page: int = 1,
        limit: int = 20,
    ) -> FavoriteListResponse:
        if page < 1:
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=(
                    "page must be greater than "
                    "or equal to 1"
                ),
            )

        if not 1 <= limit <= 100:
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail="limit must be between 1 and 100",
            )

        skip = (page - 1) * limit

        try:
            favorites = FavoriteCRUD.get_all_by_user(
                db,
                user_id=current_user.user_id,
                skip=skip,
                limit=limit,
            )

            total = FavoriteCRUD.count_by_user(
                db,
                user_id=current_user.user_id,
            )

        except (ValueError, SQLAlchemyError) as exc:
            logger.exception(
                "Failed to list favorites."
            )

            raise favorite_database_error() from exc

        return FavoriteListResponse(
            page=page,
            limit=limit,
            total=total,
            data=favorites,
        )

    @staticmethod
    def remove_favorite(
        db: Session,
        *,
        current_user: User,
        recipe_id: int,
    ) -> None:
        favorite = FavoriteCRUD.get(
            db,
            user_id=current_user.user_id,
            recipe_id=recipe_id,
        )

        if favorite is None:
            raise favorite_not_found_error()

        try:
            FavoriteCRUD.delete(
                db,
                favorite,
            )

            db.commit()

        except SQLAlchemyError as exc:
            db.rollback()

            logger.exception(
                "Failed to delete favorite."
            )

            raise favorite_database_error() from exc