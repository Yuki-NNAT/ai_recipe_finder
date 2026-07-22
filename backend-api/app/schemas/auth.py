from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CurrentUserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    user_id: int = Field(
        ge=1,
    )

    username: str | None = Field(
        default=None,
        max_length=100,
    )

    email: str = Field(
        min_length=3,
        max_length=255,
    )

    created_at: datetime

class UsernameUpdateRequest(BaseModel):
    username: str = Field(
        min_length=2,
        max_length=50,
        examples=["User"],
    )

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        normalized = " ".join(value.strip().split())

        if len(normalized) < 2:
            raise ValueError(
                "Username must contain at least 2 characters.",
            )

        return normalized