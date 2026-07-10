'''from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.favorite_service import FavoriteService

from app.schemas.favorite import FavoriteCreate

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)

@router.post("/")
def add_favorite(

    favorite: FavoriteCreate,

    db: Session = Depends(get_db)

):

    return FavoriteService.add_favorite(

        db,

        favorite.user_id,

        favorite.recipe_id

    )
    
@router.get("/")
def get_favorites(

    user_id: int,

    db: Session = Depends(get_db)

):

    return FavoriteService.get_favorites(

        db,

        user_id

    )
    
@router.delete("/{recipe_id}")
def delete_favorite(

    recipe_id: int,

    user_id: int,

    db: Session = Depends(get_db)

):

    return FavoriteService.delete_favorite(

        db,

        user_id,

        recipe_id

    )'''