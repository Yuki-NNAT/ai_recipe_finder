from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


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