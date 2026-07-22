from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PersonalNoteCreate(BaseModel):
    content: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Content must not be empty")

        return value


class PersonalNoteUpdate(BaseModel):
    content: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Content must not be empty")

        return value


class PersonalNoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    note_id: int
    recipe_id: int
    content: str
    created_at: datetime
    updated_at: datetime


class PersonalNoteListResponse(BaseModel):
    items: list[PersonalNoteResponse]
    total: int