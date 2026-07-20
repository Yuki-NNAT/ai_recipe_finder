from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.favorite import Favorite


class FavoriteCRUD:
    @staticmethod
    def get(
        db: Session,
        *,
        user_id: int,
        recipe_id: int,
    ) -> Favorite | None:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        if recipe_id <= 0:
            raise ValueError(
                "recipe_id must be greater than 0"
            )

        statement = (
            select(Favorite)
            .options(
                joinedload(Favorite.recipe)
            )
            .where(
                Favorite.user_id == user_id,
                Favorite.recipe_id == recipe_id,
            )
        )

        return db.scalar(statement)

    @staticmethod
    def get_all_by_user(
        db: Session,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Favorite]:
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
            select(Favorite)
            .options(
                joinedload(Favorite.recipe)
            )
            .where(
                Favorite.user_id == user_id
            )
            .order_by(
                Favorite.created_at.desc(),
                Favorite.recipe_id.desc(),
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
        recipe_id: int,
    ) -> Favorite:
        if user_id <= 0:
            raise ValueError(
                "user_id must be greater than 0"
            )

        if recipe_id <= 0:
            raise ValueError(
                "recipe_id must be greater than 0"
            )

        favorite = Favorite(
            user_id=user_id,
            recipe_id=recipe_id,
        )

        db.add(favorite)
        db.flush()

        return favorite

    @staticmethod
    def delete(
        db: Session,
        favorite: Favorite,
    ) -> None:
        db.delete(favorite)
        db.flush()

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
            func.count(Favorite.recipe_id)
        ).where(
            Favorite.user_id == user_id
        )

        return int(
            db.scalar(statement)
            or 0
        )