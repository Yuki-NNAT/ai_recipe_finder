import os
import re
from dataclasses import dataclass, field
from urllib.parse import quote_plus, urlparse

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str = field(repr=False)

    cognito_region: str
    cognito_user_pool_id: str
    cognito_app_client_id: str
    cognito_domain: str

    @property
    def database_url(self) -> str:
        user = quote_plus(self.db_user)
        password = quote_plus(self.db_password)

        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
            "?charset=utf8mb4"
        )

    @property
    def cognito_issuer(self) -> str:
        return (
            f"https://cognito-idp.{self.cognito_region}"
            f".amazonaws.com/{self.cognito_user_pool_id}"
        )

    @property
    def cognito_jwks_url(self) -> str:
        return (
            f"{self.cognito_issuer}"
            "/.well-known/jwks.json"
        )

    @property
    def cognito_userinfo_url(self) -> str:
        return (
            f"{self.cognito_domain}"
            "/oauth2/userInfo"
        )


def get_required_env(name: str) -> str:
    value = os.getenv(name)

    if value is None or not value.strip():
        raise RuntimeError(
            f"Missing required environment variable: {name}"
        )

    return value.strip()


def get_port_env(
    name: str,
    default: int,
) -> int:
    raw_value = os.getenv(name, str(default))

    try:
        port = int(raw_value)
    except ValueError as exc:
        raise RuntimeError(
            f"Environment variable {name} must be an integer."
        ) from exc

    if not 1 <= port <= 65535:
        raise RuntimeError(
            f"Environment variable {name} must be between "
            "1 and 65535."
        )

    return port


def validate_cognito_region(region: str) -> str:
    region_pattern = (
        r"[a-z]{2}(?:-gov)?-[a-z0-9-]+-\d"
    )

    if re.fullmatch(region_pattern, region) is None:
        raise RuntimeError(
            "COGNITO_REGION has an invalid AWS Region format."
        )

    return region


def validate_user_pool_id(
    user_pool_id: str,
    region: str,
) -> str:
    pool_pattern = (
        rf"{re.escape(region)}_[A-Za-z0-9]+"
    )

    if re.fullmatch(pool_pattern, user_pool_id) is None:
        raise RuntimeError(
            "COGNITO_USER_POOL_ID does not match "
            "COGNITO_REGION or has an invalid format."
        )

    return user_pool_id


def validate_app_client_id(
    app_client_id: str,
) -> str:
    if re.fullmatch(
        r"[A-Za-z0-9]+",
        app_client_id,
    ) is None:
        raise RuntimeError(
            "COGNITO_APP_CLIENT_ID has an invalid format."
        )

    return app_client_id


def validate_cognito_domain(
    domain: str,
    region: str,
) -> str:
    normalized_domain = domain.rstrip("/")

    try:
        parsed = urlparse(normalized_domain)
        port = parsed.port
    except ValueError as exc:
        raise RuntimeError(
            "COGNITO_DOMAIN is not a valid URL."
        ) from exc

    if parsed.scheme != "https":
        raise RuntimeError(
            "COGNITO_DOMAIN must use HTTPS."
        )

    if not parsed.hostname:
        raise RuntimeError(
            "COGNITO_DOMAIN must contain a hostname."
        )

    if parsed.username or parsed.password:
        raise RuntimeError(
            "COGNITO_DOMAIN must not contain credentials."
        )

    if port is not None:
        raise RuntimeError(
            "COGNITO_DOMAIN must not specify a custom port."
        )

    if parsed.path not in ("", "/"):
        raise RuntimeError(
            "COGNITO_DOMAIN must not contain a path."
        )

    if parsed.params or parsed.query or parsed.fragment:
        raise RuntimeError(
            "COGNITO_DOMAIN must not contain parameters, "
            "a query, or a fragment."
        )

    hostname = parsed.hostname.lower()
    expected_suffix = (
        f".auth.{region}.amazoncognito.com"
    )

    if not hostname.endswith(expected_suffix):
        raise RuntimeError(
            "COGNITO_DOMAIN does not match the configured "
            "Cognito Region."
        )

    return f"https://{hostname}"


def load_settings() -> Settings:
    cognito_region = validate_cognito_region(
        get_required_env("COGNITO_REGION")
    )

    cognito_user_pool_id = validate_user_pool_id(
        get_required_env("COGNITO_USER_POOL_ID"),
        cognito_region,
    )

    cognito_app_client_id = validate_app_client_id(
        get_required_env("COGNITO_APP_CLIENT_ID")
    )

    cognito_domain = validate_cognito_domain(
        get_required_env("COGNITO_DOMAIN"),
        cognito_region,
    )

    return Settings(
        db_host=get_required_env("DB_HOST"),
        db_port=get_port_env("DB_PORT", 3306),
        db_name=get_required_env("DB_NAME"),
        db_user=get_required_env("DB_USER"),
        db_password=get_required_env("DB_PASSWORD"),
        cognito_region=cognito_region,
        cognito_user_pool_id=cognito_user_pool_id,
        cognito_app_client_id=cognito_app_client_id,
        cognito_domain=cognito_domain,
    )


settings = load_settings()