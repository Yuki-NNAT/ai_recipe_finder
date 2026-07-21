from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.shopping_list import ShoppingListCRUD
from app.models.recipe import Recipe
from app.schemas.shopping_list import (
    ShoppingListCheckedDeleteResponse,
    ShoppingListClearResponse,
    ShoppingListItemCreate,
    ShoppingListItemResponse,
    ShoppingListItemUpdate,
    ShoppingListRecipeAddResponse,
    ShoppingListRecipeDeleteResponse,
    ShoppingListResponse,
)


class ShoppingListService:
    @staticmethod
    def get_items(
        db: Session,
        user_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> ShoppingListResponse:
        if skip < 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="skip must be greater than or equal to 0",
            )

        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="limit must be between 1 and 100",
            )

        items = ShoppingListCRUD.get_items(
            db,
            user_id,
            skip=skip,
            limit=limit,
        )
        total = ShoppingListCRUD.count_items(db, user_id)

        return ShoppingListResponse(
            items=[
                ShoppingListItemResponse.model_validate(item)
                for item in items
            ],
            total=total,
        )

    @staticmethod
    def create_item(
        db: Session,
        user_id: int,
        data: ShoppingListItemCreate,
    ) -> ShoppingListItemResponse:
        if data.recipe_id is not None:
            recipe = db.get(Recipe, data.recipe_id)

            if recipe is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Recipe not found",
                )

        item = ShoppingListCRUD.create_item(
            db,
            user_id,
            data,
        )

        return ShoppingListItemResponse.model_validate(item)

    @staticmethod
    def update_item(
        db: Session,
        user_id: int,
        item_id: int,
        data: ShoppingListItemUpdate,
    ) -> ShoppingListItemResponse:
        if not data.model_fields_set:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="At least one field must be provided",
            )

        item = ShoppingListCRUD.get_item(
            db,
            user_id,
            item_id,
        )

        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shopping list item not found",
            )

        item = ShoppingListCRUD.update_item(
            db,
            item,
            data,
        )

        return ShoppingListItemResponse.model_validate(item)

    @staticmethod
    def delete_item(
        db: Session,
        user_id: int,
        item_id: int,
    ) -> None:
        item = ShoppingListCRUD.get_item(
            db,
            user_id,
            item_id,
        )

        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shopping list item not found",
            )

        ShoppingListCRUD.delete_item(db, item)

    @staticmethod
    def clear_items(
        db: Session,
        user_id: int,
    ) -> ShoppingListClearResponse:
        deleted_count = ShoppingListCRUD.clear_items(
            db,
            user_id,
        )

        return ShoppingListClearResponse(
            deleted_count=deleted_count,
        )

    @staticmethod
    def add_recipe(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> ShoppingListRecipeAddResponse:
        recipe = db.get(Recipe, recipe_id)

        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found",
            )

        if ShoppingListCRUD.recipe_exists(
            db,
            user_id,
            recipe_id,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Recipe is already in the shopping list",
            )

        raw_ingredients = recipe.ingredients_raw

        if not isinstance(raw_ingredients, list):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Recipe ingredients are unavailable",
            )

        ingredient_texts = [
            ingredient.strip()
            for ingredient in raw_ingredients
            if isinstance(ingredient, str) and ingredient.strip()
        ]

        if not ingredient_texts:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Recipe has no valid ingredients",
            )

        items = ShoppingListCRUD.create_recipe_items(
            db,
            user_id,
            recipe_id,
            ingredient_texts,
        )

        return ShoppingListRecipeAddResponse(
            recipe_id=recipe.recipe_id,
            recipe_name=recipe.name,
            added_count=len(items),
            items=[
                ShoppingListItemResponse.model_validate(item)
                for item in items
            ],
        )


    @staticmethod
    def delete_recipe(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> ShoppingListRecipeDeleteResponse:
        deleted_count = ShoppingListCRUD.delete_recipe_items(
            db,
            user_id,
            recipe_id,
        )

        if deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe is not in the shopping list",
            )

        return ShoppingListRecipeDeleteResponse(
            recipe_id=recipe_id,
            deleted_count=deleted_count,
        )


    @staticmethod
    def delete_checked_items(
        db: Session,
        user_id: int,
    ) -> ShoppingListCheckedDeleteResponse:
        deleted_count = ShoppingListCRUD.delete_checked_items(
            db,
            user_id,
        )

        return ShoppingListCheckedDeleteResponse(
            deleted_count=deleted_count,
        )