from fastapi import (
    APIRouter,
    Path,
    Query,
    Response,
    status,
)

from app.api.dependencies import (
    CurrentDatabaseUser,
    DatabaseSession,
)
from app.models.favorite import Favorite
from app.schemas.favorite import (
    FavoriteListResponse,
    FavoriteResponse,
)
from app.services.favorite_service import FavoriteService

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"],
)


@router.post(
    "/{recipe_id}",
    response_model=FavoriteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a recipe to favorites",
)
def add_favorite(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: int = Path(
        ...,
        ge=1,
    ),
) -> Favorite:
    return FavoriteService.add_favorite(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
    )


@router.get(
    "",
    response_model=FavoriteListResponse,
    summary="List the current user's favorites",
)
def get_favorites(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> FavoriteListResponse:
    return FavoriteService.get_favorites(
        db,
        current_user=current_user,
        page=page,
        limit=limit,
    )


@router.delete(
    "/{recipe_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a recipe from favorites",
)
def remove_favorite(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: int = Path(
        ...,
        ge=1,
    ),
) -> Response:
    FavoriteService.remove_favorite(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )