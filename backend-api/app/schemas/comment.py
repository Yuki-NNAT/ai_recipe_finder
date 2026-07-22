from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class CommentContentBase(BaseModel):
    content: str = Field(
        min_length=1,
        max_length=2000,
        description="Comment content.",
    )

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        normalized_content = value.strip()

        if not normalized_content:
            raise ValueError(
                "Comment content must not be empty."
            )

        return normalized_content


class CommentCreateRequest(CommentContentBase):
    pass


class CommentUpdateRequest(CommentContentBase):
    pass


class CommentResponse(BaseModel):
    comment_id: int
    recipe_id: int
    username: str | None
    content: str
    created_at: datetime
    updated_at: datetime
    is_owner: bool


class CommentListResponse(BaseModel):
    items: list[CommentResponse]

    total: int = Field(
        ge=0,
    )

    skip: int = Field(
        ge=0,
    )

    limit: int = Field(
        ge=1,
    )


class CommentDeleteResponse(BaseModel):
    detail: str