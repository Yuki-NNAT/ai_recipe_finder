from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.recipe_service import RecipeService

from app.schemas.recipe import RecipeListResponse
from app.schemas.recipe import RecipeDetailResponse

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"]
)


@router.get(
    "",
    response_model=RecipeListResponse
)
def get_recipes(

    page: int = 1,

    limit: int = 20,

    db: Session = Depends(get_db)

):

    return RecipeService.get_recipes(
        db,
        page,
        limit
    )
    
@router.get(
    "/random",
    response_model=RecipeDetailResponse
)
def get_random_recipe(
    db: Session = Depends(get_db)
):

    return RecipeService.get_random_recipe(db)
    
@router.get(
    "/{recipe_id}",
    response_model=RecipeDetailResponse
)
def get_recipe(

    recipe_id: int,

    db: Session = Depends(get_db)

):

    return RecipeService.get_recipe(
        db,
        recipe_id
    )
    
