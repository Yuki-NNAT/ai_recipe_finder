from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.rating import Rating


class RatingCRUD:
    @staticmethod
    def get_by_user_and_recipe(
        db: Session,
        *,
        user_id: int,
        recipe_id: int,
    ) -> Rating | None:
        statement = select(Rating).where(
            Rating.user_id == user_id,
            Rating.recipe_id == recipe_id,
        )

        return db.scalar(statement)

    @staticmethod
    def create(
        db: Session,
        *,
        user_id: int,
        recipe_id: int,
        rating: int,
    ) -> Rating:
        rating_entry = Rating(
            user_id=user_id,
            recipe_id=recipe_id,
            rating=rating,
        )

        db.add(rating_entry)
        db.flush()

        return rating_entry

    @staticmethod
    def update(
        db: Session,
        *,
        rating_entry: Rating,
        rating: int,
    ) -> Rating:
        rating_entry.rating = rating

        db.flush()

        return rating_entry

    @staticmethod
    def delete(
        db: Session,
        rating_entry: Rating,
    ) -> None:
        db.delete(rating_entry)

    @staticmethod
    def get_summary(
        db: Session,
        *,
        recipe_id: int,
    ) -> tuple[float | None, int]:
        statement = select(
            func.avg(Rating.rating),
            func.count(Rating.user_id),
        ).where(
            Rating.recipe_id == recipe_id,
        )

        average_rating, rating_count = db.execute(
            statement
        ).one()

        normalized_average = (
            float(average_rating)
            if average_rating is not None
            else None
        )

        return (
            normalized_average,
            int(rating_count or 0),
        )