from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud.favorite import FavoriteCRUD

class FavoriteService:
    pass

    @staticmethod
    def add_favorite(
        db: Session,
        user_id: int,
        recipe_id: int
    ):

        favorite = FavoriteCRUD.exists(
            db,
            user_id,
            recipe_id
        )

        if favorite:
            raise HTTPException(
                status_code=400,
                detail="Recipe already in favorites."
            )

        return FavoriteCRUD.add(
            db,
            user_id,
            recipe_id
        )
    
    
    @staticmethod
    def get_favorites(
        db: Session,
        user_id: int
    ):
         return FavoriteCRUD.get_all(
            db,
            user_id
        )
         
    @staticmethod
    def delete_favorite(
        db: Session,
        user_id: int,
        recipe_id: int
    ):

        favorite = FavoriteCRUD.delete(
            db,
            user_id,
            recipe_id
        )

        if favorite is None:

            raise HTTPException(
                status_code=404,
                detail="Favorite not found."
            )

        return {
            "message": "Favorite deleted successfully."
        }
        
    