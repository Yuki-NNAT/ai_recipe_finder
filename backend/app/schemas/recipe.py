from pydantic import BaseModel, ConfigDict, Field

class RecipeItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    recipe_id: int
    name: str

class RecipeListResponse(BaseModel):
    page: int = Field(ge=1)
    limit: int = Field(ge=1, le=100)
    total: int = Field(ge=0)
    data: list[RecipeItem]

class RecipeDetailResponse(BaseModel):

    recipe_id: int

    name: str

    description: str | None = None

    ingredients: list[str]

    ingredients_raw: list[str]

    steps: list[str]

    servings: float | None = None

    serving_size: str | None = None

    tags: list[str]

    ingredient_count: int

    ingredient_raw_count: int

    step_count: int

    tag_count: int

    has_ingredients: bool

    has_ingredients_raw: bool

    has_steps: bool

    has_tags: bool
