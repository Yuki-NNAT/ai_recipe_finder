from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.recipe import RecipeCRUD
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeListResponse


class RecipeService:

    @staticmethod
    def get_recipes(
        db: Session,
        page: int = 1,
        limit: int = 20,
    ) -> RecipeListResponse:

        if page < 1:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="page must be greater than or equal to 1",
            )

        if not 1 <= limit <= 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="limit must be between 1 and 100",
            )

        skip = (page - 1) * limit

        recipes = RecipeCRUD.get_all(
            db,
            skip,
            limit,
        )

        total = RecipeCRUD.count(db)

        return RecipeListResponse(
            page=page,
            limit=limit,
            total=total,
            data=recipes,
        )

    @staticmethod
    def get_recipe(
        db: Session,
        recipe_id: int,
    ) -> Recipe:

        recipe = RecipeCRUD.get_by_id(
            db,
            recipe_id,
        )

        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found",
            )

        return recipe

    @staticmethod
    def get_random_recipe(
        db: Session,
    ) -> Recipe:

        recipe = RecipeCRUD.get_random(db)

        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No recipe found",
            )

        return recipe