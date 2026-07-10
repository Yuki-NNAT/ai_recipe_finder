from pydantic import BaseModel


class NutritionResponse(BaseModel):

    fdc_id: int

    food_name: str

    data_type: str | None

    calories: float

    class Config:
        from_attributes = True