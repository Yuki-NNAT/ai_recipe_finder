from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.recipe import Recipe


class RecipeCRUD:

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20
    ):

        return (
            db.query(Recipe)
            .offset(skip)
            .limit(limit)
            .all()
        )


    @staticmethod
    def get_by_id(
        db: Session,
        recipe_id: int
    ):

        return (
            db.query(Recipe)
            .filter(Recipe.recipe_id == recipe_id)
            .first()
        )


    @staticmethod
    def get_random(
        db: Session
    ):

        return (
            db.query(Recipe)
            .order_by(func.rand())
            .first()
        )


    @staticmethod
    def count(
        db: Session
    ):

        return db.query(Recipe).count()