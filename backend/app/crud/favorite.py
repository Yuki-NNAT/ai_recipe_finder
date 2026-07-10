'''from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.recipe import Recipe

class FavoriteCRUD:
    @staticmethod
    def add(

        db: Session,

        user_id: int,

        recipe_id: int

    ):

        favorite = Favorite(

            user_id=user_id,

            recipe_id=recipe_id

        )

        db.add(favorite)

        db.commit()

        return favorite
    
    @staticmethod
    def exists(

        db: Session,

        user_id: int,

        recipe_id: int

    ):

        return (

            db.query(Favorite)

            .filter(

                Favorite.user_id == user_id,

                Favorite.recipe_id == recipe_id

            )

            .first()

        )
        
    @staticmethod
    def get_all(

        db: Session,

        user_id: int

    ):

        return (

            db.query(Favorite, Recipe)

            .join(

                Recipe,

                Favorite.recipe_id == Recipe.recipe_id

            )

            .filter(

                Favorite.user_id == user_id

            )

            .all()

        )
        
    @staticmethod
    def delete(

        db: Session,

        user_id: int,

        recipe_id: int

    ):

        favorite = (

            db.query(Favorite)

            .filter(

                Favorite.user_id == user_id,

                Favorite.recipe_id == recipe_id

            )

            .first()

        )

        if favorite:

            db.delete(favorite)

            db.commit()

        return favorite
    '''