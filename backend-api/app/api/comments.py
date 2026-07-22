from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import (
    CurrentDatabaseUser,
    OptionalCurrentDatabaseUser,
)
from app.database.session import get_db
from app.schemas.comment import (
    CommentCreateRequest,
    CommentDeleteResponse,
    CommentListResponse,
    CommentResponse,
    CommentUpdateRequest,
)
from app.services.comment_service import CommentService


router = APIRouter(
    tags=["Comments"],
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

CommentIdPath = Annotated[
    int,
    Path(
        ge=1,
        description="Comment identifier.",
    ),
]

SkipQuery = Annotated[
    int,
    Query(
        ge=0,
        description="Number of comments to skip.",
    ),
]

LimitQuery = Annotated[
    int,
    Query(
        ge=1,
        le=100,
        description="Maximum number of comments to return.",
    ),
]


@router.get(
    "/recipes/{recipe_id}/comments",
    response_model=CommentListResponse,
    summary="List a recipe's comments",
)
def get_recipe_comments(
    db: DatabaseSession,
    current_user: OptionalCurrentDatabaseUser,
    recipe_id: RecipeIdPath,
    skip: SkipQuery = 0,
    limit: LimitQuery = 20,
) -> CommentListResponse:
    return CommentService.get_comments(
        db,
        recipe_id=recipe_id,
        skip=skip,
        limit=limit,
        current_user=current_user,
    )


@router.post(
    "/recipes/{recipe_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a recipe comment",
)
def create_recipe_comment(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    recipe_id: RecipeIdPath,
    payload: CommentCreateRequest,
) -> CommentResponse:
    return CommentService.create_comment(
        db,
        current_user=current_user,
        recipe_id=recipe_id,
        payload=payload,
    )


@router.patch(
    "/comments/{comment_id}",
    response_model=CommentResponse,
    summary="Update the current user's comment",
)
def update_comment(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    comment_id: CommentIdPath,
    payload: CommentUpdateRequest,
) -> CommentResponse:
    return CommentService.update_comment(
        db,
        current_user=current_user,
        comment_id=comment_id,
        payload=payload,
    )


@router.delete(
    "/comments/{comment_id}",
    response_model=CommentDeleteResponse,
    summary="Delete the current user's comment",
)
def delete_comment(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    comment_id: CommentIdPath,
) -> CommentDeleteResponse:
    return CommentService.delete_comment(
        db,
        current_user=current_user,
        comment_id=comment_id,
    )