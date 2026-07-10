from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.nutrition import NutritionCRUD


class NutritionService:

    @staticmethod
    def get_nutrition(
        db: Session,
        fdc_id: int
    ):

        nutrition = NutritionCRUD.get_by_id(
            db,
            fdc_id
        )

        if nutrition is None:
            raise HTTPException(
                status_code=404,
                detail="Nutrition not found"
            )

        return nutrition