from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RatingUpsertRequest(BaseModel):
    rating: int = Field(
        ge=1,
        le=5,
        description="Rating value from 1 to 5.",
    )


class RatingResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    recipe_id: int
    rating: int
    created_at: datetime
    updated_at: datetime


class RatingSummaryResponse(BaseModel):
    recipe_id: int

    average_rating: float | None = Field(
        default=None,
        ge=1,
        le=5,
    )

    rating_count: int = Field(
        ge=0,
    )


class RatingDeleteResponse(BaseModel):
    detail: str