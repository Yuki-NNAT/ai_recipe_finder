import json
import random

from sqlalchemy import func, select
from sqlalchemy.orm import Session, load_only

from app.models.recipe import Recipe


class RecipeCRUD:
    @staticmethod
    def get_by_collection(
        db: Session,
        *,
        after_recipe_id: int | None = None,
        limit: int = 20,
        tag: str | None = None,
        max_ingredient_count: int | None = None,
    ) -> list[Recipe]:
        if after_recipe_id is not None and after_recipe_id < 1:
            raise ValueError(
                "after_recipe_id must be greater than 0"
            )

        if not 1 <= limit <= 101:
            raise ValueError("limit must be between 1 and 101")

        if tag is None and max_ingredient_count is None:
            raise ValueError(
                "a collection filter must be provided"
            )

        if tag is not None and not tag.strip():
            raise ValueError("tag must not be empty")

        if (
            max_ingredient_count is not None
            and max_ingredient_count < 1
        ):
            raise ValueError(
                "max_ingredient_count must be greater than 0"
            )

        statement = select(Recipe).options(
            load_only(
                Recipe.recipe_id,
                Recipe.name,
            )
        )

        if after_recipe_id is not None:
            statement = statement.where(
                Recipe.recipe_id > after_recipe_id
            )

        if tag is not None:
            statement = statement.where(
                func.json_contains(
                    Recipe.tags,
                    json.dumps(tag),
                )
                == 1
            )

        if max_ingredient_count is not None:
            statement = statement.where(
                Recipe.ingredient_count
                <= max_ingredient_count
            )

        statement = (
            statement
            .order_by(Recipe.recipe_id)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

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

        return list(db.scalars(statement).all())

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
        *,
        tag: str | None = None,
        max_ingredient_count: int | None = None,
    ) -> Recipe | None:
        if tag is not None and not tag.strip():
            raise ValueError("tag must not be empty")

        if (
            max_ingredient_count is not None
            and max_ingredient_count < 1
        ):
            raise ValueError(
                "max_ingredient_count must be greater than 0"
            )

        bounds_statement = select(
            func.min(Recipe.recipe_id),
            func.max(Recipe.recipe_id),
        )

        if tag is not None:
            bounds_statement = bounds_statement.where(
                func.json_contains(
                    Recipe.tags,
                    json.dumps(tag),
                )
                == 1
            )

        if max_ingredient_count is not None:
            bounds_statement = bounds_statement.where(
                Recipe.ingredient_count
                <= max_ingredient_count
            )

        min_id, max_id = db.execute(
            bounds_statement
        ).one()

        if min_id is None or max_id is None:
            return None

        random_id = random.randint(
            min_id,
            max_id,
        )

        recipe_statement = select(Recipe)

        if tag is not None:
            recipe_statement = recipe_statement.where(
                func.json_contains(
                    Recipe.tags,
                    json.dumps(tag),
                )
                == 1
            )

        if max_ingredient_count is not None:
            recipe_statement = recipe_statement.where(
                Recipe.ingredient_count
                <= max_ingredient_count
            )

        recipe = db.scalar(
            recipe_statement
            .where(Recipe.recipe_id >= random_id)
            .order_by(Recipe.recipe_id)
            .limit(1)
        )

        if recipe is not None:
            return recipe

        fallback_statement = select(Recipe)

        if tag is not None:
            fallback_statement = fallback_statement.where(
                func.json_contains(
                    Recipe.tags,
                    json.dumps(tag),
                )
                == 1
            )

        if max_ingredient_count is not None:
            fallback_statement = fallback_statement.where(
                Recipe.ingredient_count
                <= max_ingredient_count
            )

        return db.scalar(
            fallback_statement
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