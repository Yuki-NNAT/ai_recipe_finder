import logging
from typing import Any

import httpx
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import authentication_error
from app.crud.user import UserCRUD
from app.models.user import User


logger = logging.getLogger(__name__)

USERINFO_TIMEOUT_SECONDS = 5.0

REQUIRED_IDENTITY_SCOPES = {
    "openid",
    "email",
}

MAX_COGNITO_SUB_LENGTH = 100
MAX_USERNAME_LENGTH = 100
MAX_EMAIL_LENGTH = 255


def insufficient_scope_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Insufficient authentication scope.",
        headers={
            "WWW-Authenticate": (
                'Bearer scope="openid email"'
            ),
        },
    )


def verified_email_required_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="A verified email address is required.",
    )


def identity_provider_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Invalid response from identity provider.",
    )


def identity_service_unavailable_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Authentication service unavailable.",
    )


def identity_conflict_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Unable to link the authenticated account.",
    )


class AuthService:
    @staticmethod
    def validate_required_scopes(
        claims: dict[str, Any],
    ) -> None:
        scope_claim = claims.get("scope")

        if not isinstance(scope_claim, str):
            raise insufficient_scope_error()

        granted_scopes = set(
            scope_claim.split()
        )

        if not REQUIRED_IDENTITY_SCOPES.issubset(
            granted_scopes
        ):
            raise insufficient_scope_error()

    @staticmethod
    def fetch_user_info(
        access_token: str,
    ) -> dict[str, Any]:
        try:
            with httpx.Client(
                timeout=USERINFO_TIMEOUT_SECONDS,
                follow_redirects=False,
            ) as client:
                response = client.get(
                    settings.cognito_userinfo_url,
                    headers={
                        "Authorization": (
                            f"Bearer {access_token}"
                        ),
                        "Accept": "application/json",
                    },
                )

        except httpx.HTTPError:
            logger.exception(
                "Cognito UserInfo request failed."
            )

            raise identity_service_unavailable_error()

        if response.status_code in {
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        }:
            raise authentication_error()

        if response.status_code != status.HTTP_200_OK:
            logger.error(
                "Cognito UserInfo returned status=%s.",
                response.status_code,
            )

            raise identity_service_unavailable_error()

        try:
            user_info = response.json()
        except ValueError as exc:
            logger.error(
                "Cognito UserInfo returned invalid JSON."
            )

            raise identity_provider_error() from exc

        if not isinstance(user_info, dict):
            raise identity_provider_error()

        return user_info

    @staticmethod
    def normalize_email(
        value: Any,
    ) -> str:
        if not isinstance(value, str):
            raise identity_provider_error()

        email = value.strip().lower()

        if (
            not email
            or len(email) > MAX_EMAIL_LENGTH
            or email.count("@") != 1
            or any(character.isspace() for character in email)
        ):
            raise identity_provider_error()

        local_part, domain = email.rsplit(
            "@",
            maxsplit=1,
        )

        if (
            not local_part
            or not domain
            or len(local_part) > 64
            or domain.startswith(".")
            or domain.endswith(".")
        ):
            raise identity_provider_error()

        return email

    @staticmethod
    def normalize_username(
        value: Any,
    ) -> str | None:
        if value is None:
            return None

        if not isinstance(value, str):
            raise identity_provider_error()

        username = value.strip()

        if not username:
            return None

        if len(username) > MAX_USERNAME_LENGTH:
            raise identity_provider_error()

        return username

    @classmethod
    def validate_identity(
        cls,
        claims: dict[str, Any],
        user_info: dict[str, Any],
    ) -> tuple[str, str, str | None]:
        token_subject = claims.get("sub")
        user_info_subject = user_info.get("sub")

        if (
            not isinstance(token_subject, str)
            or not token_subject
            or len(token_subject)
            > MAX_COGNITO_SUB_LENGTH
        ):
            raise authentication_error()

        if user_info_subject != token_subject:
            raise authentication_error()

        if user_info.get("email_verified") is not True:
            raise verified_email_required_error()

        email = cls.normalize_email(
            user_info.get("email")
        )

        username = cls.normalize_username(
            user_info.get("preferred_username")
        )

        return token_subject, email, username

    @staticmethod
    def synchronize_user(
        db: Session,
        *,
        cognito_sub: str,
        email: str,
        username: str | None,
    ) -> User:
        user = UserCRUD.get_by_cognito_sub(
            db,
            cognito_sub,
        )

        email_owner = UserCRUD.get_by_email(
            db,
            email,
        )

        if (
            email_owner is not None
            and (
                user is None
                or email_owner.user_id != user.user_id
            )
        ):
            raise identity_conflict_error()

        if user is None:
            user = UserCRUD.create(
                db,
                cognito_sub=cognito_sub,
                email=email,
                username=username,
            )
        else:
            user = UserCRUD.update_identity(
                user,
                email=email,
                username=username,
            )

        try:
            db.commit()
            db.refresh(user)

            return user

        except IntegrityError as exc:
            db.rollback()

            existing_user = UserCRUD.get_by_cognito_sub(
                db,
                cognito_sub,
            )

            if (
                existing_user is not None
                and existing_user.email == email
            ):
                return existing_user

            logger.warning(
                "User synchronization conflict."
            )

            raise identity_conflict_error() from exc

    @classmethod
    def get_current_user(
        cls,
        db: Session,
        *,
        access_token: str,
        claims: dict[str, Any],
    ) -> User:
        cls.validate_required_scopes(
            claims
        )

        user_info = cls.fetch_user_info(
            access_token
        )

        (
            cognito_sub,
            email,
            username,
        ) = cls.validate_identity(
            claims,
            user_info,
        )

        return cls.synchronize_user(
            db,
            cognito_sub=cognito_sub,
            email=email,
            username=username,
        )