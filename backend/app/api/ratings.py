from typing import Annotated

from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentDatabaseUser
from app.database.session import get_db
from app.schemas.rating import (
    RatingDeleteResponse,
    RatingResponse,
    RatingSummaryResponse,
    RatingUpsertRequest,
)
from app.services.rating_service import RatingService


router = APIRouter(
    tags=["Ratings"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

RecipeIdPath = Annotated[
    int,
    Path(
        ge=1,
        description="Recipe identifier.",
    ),
]


@router.get(
    "/recipes/{recipe_id}/ratings",
    response_model=RatingSummaryResponse,
    summary="Get a recipe's rating summary",
)
def get_rating_summary(
    db: DatabaseSession,
    recipe_id: RecipeIdPath,
) -> RatingSummaryResponse:
    return RatingService.get_summary(
        db,
        recipe_id=recipe_id,
    )


@router.get(
    "/recipes/{recipe_id}/ratings/me",
    response_model=RatingResponse,
    summary="Get the current user's recipe rating",
)
def get_current_user_rating(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
) -> RatingResponse:
    return RatingService.get_current_user_rating(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
    )


@router.put(
    "/recipes/{recipe_id}/ratings/me",
    response_model=RatingResponse,
    summary="Create or update the current user's rating",
)
def upsert_current_user_rating(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
    payload: RatingUpsertRequest,
) -> RatingResponse:
    return RatingService.upsert_rating(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
        payload=payload,
    )


@router.delete(
    "/recipes/{recipe_id}/ratings/me",
    response_model=RatingDeleteResponse,
    summary="Delete the current user's rating",
)
def delete_current_user_rating(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
) -> RatingDeleteResponse:
    return RatingService.delete_rating(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
    )