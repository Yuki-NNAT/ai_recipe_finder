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

        return (
            db.query(Recipe)
            .options(
                load_only(
                    Recipe.recipe_id,
                    Recipe.name,
                )
            )
            .order_by(Recipe.recipe_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        recipe_id: int,
    ) -> Recipe | None:
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

        random_id = random.randint(min_id, max_id)

        recipe = db.scalar(
            select(Recipe)
            .where(Recipe.recipe_id >= random_id)
            .order_by(Recipe.recipe_id)
            .limit(1)
        )

        if recipe is None:
            recipe = db.scalar(
                select(Recipe)
                .order_by(Recipe.recipe_id)
                .limit(1)
            )

        return recipe

    @staticmethod
    def count(
        db: Session,
    ) -> int:
        return db.scalar(
            select(func.count(Recipe.recipe_id))
        ) or 0