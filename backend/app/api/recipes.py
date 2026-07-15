from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.recipe import (
    RecipeDetailResponse,
    RecipeListResponse,
)
from app.services.recipe_service import RecipeService


router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "",
    response_model=RecipeListResponse,
    summary="List recipes",
)
def get_recipes(
    db: DatabaseSession,
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> RecipeListResponse:
    return RecipeService.get_recipes(
        db=db,
        page=page,
        limit=limit,
    )


@router.get(
    "/random",
    response_model=RecipeDetailResponse,
    summary="Get a random recipe",
)
def get_random_recipe(
    db: DatabaseSession,
) -> RecipeDetailResponse:
    return RecipeService.get_random_recipe(db)


@router.get(
    "/{recipe_id}",
    response_model=RecipeDetailResponse,
    summary="Get recipe details",
)
def get_recipe(
    db: DatabaseSession,
    recipe_id: int = Path(
        ...,
        ge=1,
    ),
) -> RecipeDetailResponse:
    return RecipeService.get_recipe(
        db=db,
        recipe_id=recipe_id,
    )