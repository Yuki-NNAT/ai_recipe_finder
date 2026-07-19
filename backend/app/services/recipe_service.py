from dataclasses import dataclass

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.recipe import RecipeCRUD
from app.models.recipe import Recipe
from app.schemas.recipe import (
    RecipeCollectionResponse,
    RecipeCollectionSummary,
    RecipeListResponse,
)


@dataclass(frozen=True)
class RecipeCollectionDefinition:
    slug: str
    title: str
    description: str
    tag: str | None = None
    max_ingredient_count: int | None = None


RECIPE_COLLECTIONS = {
    collection.slug: collection
    for collection in (
        RecipeCollectionDefinition(
            slug="few-ingredients",
            title="Few Ingredients",
            description=(
                "Recipes that use no more than five "
                "normalized ingredients."
            ),
            max_ingredient_count=5,
        ),
        RecipeCollectionDefinition(
            slug="healthy",
            title="Healthy",
            description=(
                "Recipes labeled healthy in the source dataset."
            ),
            tag="healthy",
        ),
        RecipeCollectionDefinition(
            slug="beverages",
            title="Beverages",
            description=(
                "Drink recipes labeled as beverages "
                "in the source dataset."
            ),
            tag="beverages",
        ),
    )
}

class RecipeService:
    @staticmethod
    def get_collections() -> list[RecipeCollectionSummary]:
        return [
            RecipeCollectionSummary(
                slug=collection.slug,
                title=collection.title,
                description=collection.description,
            )
            for collection in RECIPE_COLLECTIONS.values()
        ]

    @staticmethod
    def get_collection(
        db: Session,
        slug: str,
        cursor: int | None = None,
        limit: int = 20,
    ) -> RecipeCollectionResponse:
        collection = RECIPE_COLLECTIONS.get(slug)

        if collection is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe collection not found",
            )

        if cursor is not None and cursor < 1:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="cursor must be greater than 0",
            )

        if not 1 <= limit <= 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="limit must be between 1 and 100",
            )

        try:
            recipes = RecipeCRUD.get_by_collection(
                db=db,
                after_recipe_id=cursor,
                limit=limit + 1,
                tag=collection.tag,
                max_ingredient_count=(
                    collection.max_ingredient_count
                ),
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            ) from exc

        has_more = len(recipes) > limit
        page_data = recipes[:limit]
        next_cursor = (
            page_data[-1].recipe_id
            if has_more and page_data
            else None
        )

        return RecipeCollectionResponse(
            collection=RecipeCollectionSummary(
                slug=collection.slug,
                title=collection.title,
                description=collection.description,
            ),
            limit=limit,
            has_more=has_more,
            next_cursor=next_cursor,
            data=page_data,
        )

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

        try:
            recipes = RecipeCRUD.get_all(
                db=db,
                skip=skip,
                limit=limit,
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            ) from exc

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
        try:
            recipe = RecipeCRUD.get_by_id(
                db=db,
                recipe_id=recipe_id,
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            ) from exc

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