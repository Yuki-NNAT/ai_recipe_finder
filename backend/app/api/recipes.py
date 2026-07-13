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


@router.get(
    "",
    response_model=RecipeListResponse,
)
def get_recipes(
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    return RecipeService.get_recipes(
        db,
        page,
        limit,
    )


@router.get(
    "/random",
    response_model=RecipeDetailResponse,
)
def get_random_recipe(
    db: Session = Depends(get_db),
):
    return RecipeService.get_random_recipe(db)


@router.get(
    "/{recipe_id}",
    response_model=RecipeDetailResponse,
)
def get_recipe(
    recipe_id: int = Path(
        ...,
        ge=1,
    ),
    db: Session = Depends(get_db),
):
    return RecipeService.get_recipe(
        db,
        recipe_id,
    )