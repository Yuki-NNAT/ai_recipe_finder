from typing import Annotated, Any

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import (
    authentication_error,
    bearer_scheme,
    verify_access_token,
)
from app.database.session import get_db
from app.models.user import User
from app.services.auth_service import AuthService


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

VerifiedTokenClaims = Annotated[
    dict[str, Any],
    Depends(verify_access_token),
]

BearerCredentials = Annotated[
    HTTPAuthorizationCredentials | None,
    Depends(bearer_scheme),
]


def get_current_database_user(
    db: DatabaseSession,
    claims: VerifiedTokenClaims,
    credentials: BearerCredentials,
) -> User:
    if credentials is None:
        raise authentication_error()

    return AuthService.get_current_user(
        db,
        access_token=credentials.credentials,
        claims=claims,
    )


CurrentDatabaseUser = Annotated[
    User,
    Depends(get_current_database_user),
]