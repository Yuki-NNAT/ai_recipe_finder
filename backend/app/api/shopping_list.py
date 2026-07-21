from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Path,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentDatabaseUser
from app.database.session import get_db

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
from app.services.shopping_list import ShoppingListService


router = APIRouter(
    prefix="/shopping-list",
    tags=["Shopping List"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

ItemIdPath = Annotated[
    int,
    Path(
        ge=1,
        description="Shopping list item identifier.",
    ),
]

RecipeIdPath = Annotated[
    int,
    Path(
        ge=1,
        description="Recipe identifier.",
    ),
]

SkipQuery = Annotated[
    int,
    Query(
        ge=0,
        description="Number of items to skip.",
    ),
]

LimitQuery = Annotated[
    int,
    Query(
        ge=1,
        le=100,
        description="Maximum number of items to return.",
    ),
]


@router.get(
    "",
    response_model=ShoppingListResponse,
    summary="Get the current user's shopping list",
)
def get_shopping_list(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    skip: SkipQuery = 0,
    limit: LimitQuery = 100,
) -> ShoppingListResponse:
    return ShoppingListService.get_items(
        db,
        user_id=current_user.user_id,
        skip=skip,
        limit=limit,
    )


@router.post(
    "/items",
    response_model=ShoppingListItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add an item to the current user's shopping list",
)
def create_shopping_list_item(
    payload: ShoppingListItemCreate,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> ShoppingListItemResponse:
    return ShoppingListService.create_item(
        db,
        user_id=current_user.user_id,
        data=payload,
    )


@router.patch(
    "/items/{item_id}",
    response_model=ShoppingListItemResponse,
    summary="Update a shopping list item",
)
def update_shopping_list_item(
    payload: ShoppingListItemUpdate,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    item_id: ItemIdPath,
) -> ShoppingListItemResponse:
    return ShoppingListService.update_item(
        db,
        user_id=current_user.user_id,
        item_id=item_id,
        data=payload,
    )


@router.delete(
    "/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Delete a shopping list item",
)
def delete_shopping_list_item(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    item_id: ItemIdPath,
) -> Response:
    ShoppingListService.delete_item(
        db,
        user_id=current_user.user_id,
        item_id=item_id,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "",
    response_model=ShoppingListClearResponse,
    summary="Clear the current user's shopping list",
)
def clear_shopping_list(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> ShoppingListClearResponse:
    return ShoppingListService.clear_items(
        db,
        user_id=current_user.user_id,
    )

@router.post(
    "/recipes/{recipe_id}",
    response_model=ShoppingListRecipeAddResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add all ingredients from a recipe",
)
def add_recipe_to_shopping_list(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
) -> ShoppingListRecipeAddResponse:
    return ShoppingListService.add_recipe(
        db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
    )


@router.delete(
    "/recipes/{recipe_id}",
    response_model=ShoppingListRecipeDeleteResponse,
    summary="Remove all items belonging to a recipe",
)
def delete_recipe_from_shopping_list(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
) -> ShoppingListRecipeDeleteResponse:
    return ShoppingListService.delete_recipe(
        db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
    )


@router.delete(
    "/checked",
    response_model=ShoppingListCheckedDeleteResponse,
    summary="Delete all checked shopping list items",
)
def delete_checked_shopping_list_items(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> ShoppingListCheckedDeleteResponse:
    return ShoppingListService.delete_checked_items(
        db,
        user_id=current_user.user_id,
    )