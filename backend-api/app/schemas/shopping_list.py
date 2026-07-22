from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ShoppingListItemCreate(BaseModel):
    recipe_id: int | None = Field(default=None, gt=0)
    ingredient_text: str = Field(min_length=1, max_length=500)

    @field_validator("ingredient_text")
    @classmethod
    def validate_ingredient_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Ingredient text cannot be empty")

        return value


class ShoppingListItemUpdate(BaseModel):
    ingredient_text: str | None = Field(
        default=None,
        min_length=1,
        max_length=500,
    )
    is_checked: bool | None = None

    @field_validator("ingredient_text")
    @classmethod
    def validate_ingredient_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Ingredient text cannot be empty")

        return value


class ShoppingListItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    item_id: int
    recipe_id: int | None
    ingredient_text: str
    is_checked: bool
    created_at: datetime
    updated_at: datetime


class ShoppingListResponse(BaseModel):
    items: list[ShoppingListItemResponse]
    total: int


class ShoppingListClearResponse(BaseModel):
    deleted_count: int

class ShoppingListRecipeAddResponse(BaseModel):
    recipe_id: int
    recipe_name: str
    added_count: int
    items: list[ShoppingListItemResponse]


class ShoppingListRecipeDeleteResponse(BaseModel):
    recipe_id: int
    deleted_count: int


class ShoppingListCheckedDeleteResponse(BaseModel):
    deleted_count: int