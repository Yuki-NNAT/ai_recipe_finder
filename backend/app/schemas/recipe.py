from pydantic import BaseModel
from typing import List
from typing import Optional

class RecipeItem(BaseModel):

    recipe_id: int

    name: str

    class Config:
        from_attributes = True

class RecipeListResponse(BaseModel):

    page: int

    limit: int

    total: int

    data: List[RecipeItem]

class RecipeDetailResponse(BaseModel):

    recipe_id: int

    name: str

    description: Optional[str]

    ingredients: list

    ingredients_raw: list

    steps: list

    servings: float

    serving_size: Optional[str]

    tags: list

    ingredient_count: int

    ingredient_raw_count: int

    step_count: int

    tag_count: int

    has_ingredients: bool

    has_ingredients_raw: bool

    has_steps: bool

    has_tags: bool

    class Config:
        from_attributes = True