from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.nutrition import NutritionCRUD
from app.models.nutrition import Nutrition


class NutritionService:

    @staticmethod
    def get_nutrition(
        db: Session,
        fdc_id: int,
    ) -> Nutrition:

        try:
            nutrition = NutritionCRUD.get_by_id(
                db=db,
                fdc_id=fdc_id,
            )

        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            ) from exc

        if nutrition is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nutrition not found",
            )

        return nutrition