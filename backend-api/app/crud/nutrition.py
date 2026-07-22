from sqlalchemy.orm import Session

from app.models.nutrition import Nutrition


class NutritionCRUD:

    @staticmethod
    def get_by_id(
        db: Session,
        fdc_id: int,
    ) -> Nutrition | None:

        if fdc_id <= 0:
            raise ValueError(
                "fdc_id must be greater than 0"
            )

        return db.get(
            Nutrition,
            fdc_id,
        )