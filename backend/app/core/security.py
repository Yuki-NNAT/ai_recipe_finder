import logging
import time
from typing import Any

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from jose import JWTError, jwt

from app.core.config import settings


logger = logging.getLogger(__name__)

bearer_scheme = HTTPBearer(
    scheme_name="CognitoBearer",
    auto_error=False,
)

JWKS_CACHE_TTL_SECONDS = 3600
JWKS_MIN_REFRESH_AGE_SECONDS = 60
JWKS_FORCE_REFRESH_COOLDOWN_SECONDS = 300
JWKS_FAILURE_RETRY_COOLDOWN_SECONDS = 10
JWKS_REQUEST_TIMEOUT_SECONDS = 5.0
MAX_TOKEN_LENGTH = 16_384

_jwks_cache: dict[str, Any] | None = None
_jwks_cached_at = 0.0
_jwks_last_forced_refresh_at = 0.0
_jwks_last_failure_at = 0.0


def authentication_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )


def authentication_service_unavailable() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Authentication service unavailable.",
    )


async def get_cognito_jwks(
    force_refresh: bool = False,
) -> dict[str, Any]:
    global _jwks_cache
    global _jwks_cached_at
    global _jwks_last_forced_refresh_at
    global _jwks_last_failure_at

    now = time.monotonic()

    if (
        _jwks_last_failure_at > 0
        and now - _jwks_last_failure_at
        < JWKS_FAILURE_RETRY_COOLDOWN_SECONDS
    ):
        if _jwks_cache is not None:
            return _jwks_cache

        raise authentication_service_unavailable()

    if _jwks_cache is not None:
        cache_age = now - _jwks_cached_at

        if (
            not force_refresh
            and cache_age < JWKS_CACHE_TTL_SECONDS
        ):
            return _jwks_cache

        if force_refresh:
            forced_refresh_age = (
                now - _jwks_last_forced_refresh_at
            )

            if (
                cache_age < JWKS_MIN_REFRESH_AGE_SECONDS
                or forced_refresh_age
                < JWKS_FORCE_REFRESH_COOLDOWN_SECONDS
            ):
                return _jwks_cache

            _jwks_last_forced_refresh_at = now

    try:
        async with httpx.AsyncClient(
            timeout=JWKS_REQUEST_TIMEOUT_SECONDS,
            follow_redirects=False,
        ) as client:
            response = await client.get(
                settings.cognito_jwks_url,
            )
            response.raise_for_status()

        jwks = response.json()
        keys = jwks.get("keys")

        if not isinstance(keys, list) or not keys:
            raise ValueError(
                "Cognito JWKS response contains no signing keys."
            )

        for key in keys:
            if not isinstance(key, dict):
                raise ValueError(
                    "Cognito JWKS contains an invalid signing key."
                )

        _jwks_cache = jwks
        _jwks_cached_at = time.monotonic()
        _jwks_last_failure_at = 0.0

        return jwks

    except (
        httpx.HTTPError,
        ValueError,
    ) as exc:
        _jwks_last_failure_at = time.monotonic()

        logger.error(
            "Unable to retrieve valid Cognito signing keys.",
            exc_info=exc,
        )

        if _jwks_cache is not None:
            return _jwks_cache

        raise authentication_service_unavailable() from exc


def find_signing_key(
    jwks: dict[str, Any],
    key_id: str,
) -> dict[str, Any] | None:
    keys = jwks.get("keys", [])

    if not isinstance(keys, list):
        return None

    for key in keys:
        if (
            isinstance(key, dict)
            and key.get("kid") == key_id
        ):
            return key

    return None


async def get_signing_key(
    token: str,
) -> dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise authentication_error() from exc

    if header.get("alg") != "RS256":
        raise authentication_error()

    key_id = header.get("kid")

    if not isinstance(key_id, str) or not key_id:
        raise authentication_error()

    jwks = await get_cognito_jwks()
    signing_key = find_signing_key(
        jwks,
        key_id,
    )

    if signing_key is None:
        jwks = await get_cognito_jwks(
            force_refresh=True,
        )
        signing_key = find_signing_key(
            jwks,
            key_id,
        )

    if signing_key is None:
        raise authentication_error()

    return signing_key


async def verify_access_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme
    ),
) -> dict[str, Any]:
    if credentials is None:
        raise authentication_error()

    if credentials.scheme.lower() != "bearer":
        raise authentication_error()

    token = credentials.credentials

    if not token or len(token) > MAX_TOKEN_LENGTH:
        raise authentication_error()

    signing_key = await get_signing_key(token)

    try:
        claims = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.cognito_issuer,
            options={
                "verify_aud": False,
            },
        )
    except JWTError as exc:
        raise authentication_error() from exc

    if claims.get("token_use") != "access":
        raise authentication_error()

    if (
        claims.get("client_id")
        != settings.cognito_app_client_id
    ):
        raise authentication_error()

    subject = claims.get("sub")
    expires_at = claims.get("exp")

    if not isinstance(subject, str) or not subject:
        raise authentication_error()

    if not isinstance(expires_at, int):
        raise authentication_error()

    return claims