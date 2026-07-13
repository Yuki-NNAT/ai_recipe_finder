from sqlalchemy.orm import Session

from app.models.nutrition import Nutrition


class NutritionCRUD:

    @staticmethod
    def get_by_id(
        db: Session,
        fdc_id: int,
    ) -> Nutrition | None:

        return db.get(
            Nutrition,
            fdc_id,
        )