import random

from sqlalchemy import func, select
from sqlalchemy.orm import Session, load_only

from app.models.recipe import Recipe


class RecipeCRUD:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Recipe]:
        if skip < 0:
            raise ValueError("skip must not be negative")

        if not 1 <= limit <= 100:
            raise ValueError("limit must be between 1 and 100")

        statement = (
            select(Recipe)
            .options(
                load_only(
                    Recipe.recipe_id,
                    Recipe.name,
                )
            )
            .order_by(Recipe.recipe_id)
            .offset(skip)
            .limit(limit)
        )

        return list(
            db.scalars(statement).all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        recipe_id: int,
    ) -> Recipe | None:
        if recipe_id <= 0:
            raise ValueError(
                "recipe_id must be greater than 0"
            )

        return db.get(Recipe, recipe_id)

    @staticmethod
    def get_random(
        db: Session,
    ) -> Recipe | None:
        min_id, max_id = db.execute(
            select(
                func.min(Recipe.recipe_id),
                func.max(Recipe.recipe_id),
            )
        ).one()

        if min_id is None or max_id is None:
            return None

        random_id = random.randint(
            min_id,
            max_id,
        )

        recipe = db.scalar(
            select(Recipe)
            .where(Recipe.recipe_id >= random_id)
            .order_by(Recipe.recipe_id)
            .limit(1)
        )

        if recipe is not None:
            return recipe

        return db.scalar(
            select(Recipe)
            .order_by(Recipe.recipe_id)
            .limit(1)
        )

    @staticmethod
    def count(
        db: Session,
    ) -> int:
        return int(
            db.scalar(
                select(
                    func.count(Recipe.recipe_id)
                )
            )
            or 0
        )