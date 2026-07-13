from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.nutrition import NutritionCRUD
from app.models.nutrition import Nutrition


class NutritionService:

    @staticmethod
    def get_nutrition(
        db: Session,
        fdc_id: int
    ) -> Nutrition:

        nutrition = NutritionCRUD.get_by_id(
            db,
            fdc_id
        )

        if nutrition is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nutrition not found"
            )

        return nutrition