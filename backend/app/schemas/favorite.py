from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FavoriteRecipeSummary(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    recipe_id: int
    name: str


class FavoriteResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    recipe_id: int
    created_at: datetime
    recipe: FavoriteRecipeSummary


class FavoriteListResponse(BaseModel):
    page: int = Field(
        ge=1,
    )
    limit: int = Field(
        ge=1,
        le=100,
    )
    total: int = Field(
        ge=0,
    )
    data: list[FavoriteResponse]