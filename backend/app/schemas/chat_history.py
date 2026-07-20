from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ChatRole = Literal["user", "assistant"]


class ChatHistoryItemResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    chat_id: int
    role: ChatRole
    message: str
    recipe_id: int | None
    created_at: datetime


class ChatHistoryListResponse(BaseModel):
    items: list[ChatHistoryItemResponse]
    next_cursor: int | None = None
    has_more: bool


class ChatHistoryDeleteResponse(BaseModel):
    detail: str


class ChatHistoryClearResponse(BaseModel):
    detail: str
    deleted_count: int = Field(
        ge=0,
    )