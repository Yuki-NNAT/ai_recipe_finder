from sqlalchemy.orm import Session

from app.models.nutrition import Nutrition


class NutritionCRUD:

    @staticmethod
    def get_by_id(
        db: Session,
        fdc_id: int
    ):

        return (
            db.query(Nutrition)
            .filter(Nutrition.fdc_id == fdc_id)
            .first()
        )