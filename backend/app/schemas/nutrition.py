from pydantic import BaseModel, ConfigDict


class NutritionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    fdc_id: int

    food_name: str

    data_type: str | None

    calories: float
