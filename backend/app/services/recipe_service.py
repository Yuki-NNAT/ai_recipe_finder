from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.recipe import RecipeCRUD


class RecipeService:

    @staticmethod
    def get_recipes(
        db: Session,
        page: int = 1,
        limit: int = 20
    ):

        skip = (page - 1) * limit

        recipes = RecipeCRUD.get_all(
            db,
            skip,
            limit
        )

        total = RecipeCRUD.count(db)

        return {
            "page": page,
            "limit": limit,
            "total": total,
            "data": recipes
        }

    @staticmethod
    def get_recipe(
        db: Session,
        recipe_id: int
    ):

        recipe = RecipeCRUD.get_by_id(
            db,
            recipe_id
        )

        if recipe is None:
            raise HTTPException(
                status_code=404,
                detail="Recipe not found"
            )

        return recipe

    @staticmethod
    def get_random_recipe(
        db: Session
    ):

        recipe = RecipeCRUD.get_random(db)

        if recipe is None:
            raise HTTPException(
                status_code=404,
                detail="No recipe found"
            )

        return recipe
    @staticmethod
    def get_random_recipe(
        db: Session
    ):

        return RecipeCRUD.get_random(db)