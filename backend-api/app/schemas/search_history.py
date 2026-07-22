from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SearchHistoryResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    history_id: int = Field(
        gt=0,
    )
    keyword: str | None
    total_result: int | None = Field(
        default=None,
        ge=0,
    )
    searched_at: datetime


class SearchHistoryListResponse(BaseModel):
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
    data: list[SearchHistoryResponse]


class SearchHistoryClearResponse(BaseModel):
    deleted_count: int = Field(
        ge=0,
    )