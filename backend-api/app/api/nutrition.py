from typing import Annotated

from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.nutrition import NutritionResponse
from app.services.nutrition_service import NutritionService


router = APIRouter(
    prefix="/nutrition",
    tags=["Nutrition"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get(
    "/{fdc_id}",
    response_model=NutritionResponse,
    summary="Get nutrition details",
)
def get_nutrition(
    db: DatabaseSession,
    fdc_id: int = Path(
        ...,
        ge=1,
    ),
) -> NutritionResponse:
    return NutritionService.get_nutrition(
        db=db,
        fdc_id=fdc_id,
    )