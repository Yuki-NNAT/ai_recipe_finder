from fastapi import APIRouter

from app.api.dependencies import CurrentDatabaseUser
from app.models.user import User
from app.schemas.auth import CurrentUserResponse


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