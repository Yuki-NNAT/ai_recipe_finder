from fastapi import APIRouter

from app.api.dependencies import (
    CurrentDatabaseUser,
    DatabaseSession,
)
from app.models.user import User
from app.schemas.auth import (
    CurrentUserResponse,
    UsernameUpdateRequest,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get(
    "/me",
    response_model=CurrentUserResponse,
    summary="Get the current authenticated user",
)
def get_current_user(
    current_user: CurrentDatabaseUser,
) -> User:
    return current_user


@router.patch(
    "/me/username",
    response_model=CurrentUserResponse,
    summary="Update current user's username",
)
def update_current_username(
    current_user: CurrentDatabaseUser,
    db: DatabaseSession,
    payload: UsernameUpdateRequest,
) -> User:
    return AuthService.update_username(
        db,
        user=current_user,
        username=payload.username,
    )