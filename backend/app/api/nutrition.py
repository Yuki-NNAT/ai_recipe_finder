from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.nutrition import NutritionResponse
from app.services.nutrition_service import NutritionService

router = APIRouter(
    prefix="/nutrition",
    tags=["Nutrition"],
)

@router.get(
    "/{fdc_id}",
    response_model=NutritionResponse,
)
def get_nutrition(
    fdc_id: int = Path(
        ...,
        ge=1,
    ),
    db: Session = Depends(get_db),
):
    return NutritionService.get_nutrition(
        db,
        fdc_id,
    )