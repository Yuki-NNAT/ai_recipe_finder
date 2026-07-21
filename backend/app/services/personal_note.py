from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud.personal_note import PersonalNoteCRUD
from app.models.recipe import Recipe
from app.schemas.personal_note import (
    PersonalNoteListResponse,
    PersonalNoteResponse,
)


class PersonalNoteService:
    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        page: int = 1,
        limit: int = 20,
    ) -> PersonalNoteListResponse:
        skip = (page - 1) * limit

        notes = PersonalNoteCRUD.get_all_by_user(
            db=db,
            user_id=user_id,
            skip=skip,
            limit=limit,
        )
        total = PersonalNoteCRUD.count_by_user(
            db=db,
            user_id=user_id,
        )

        return PersonalNoteListResponse(
            items=[
                PersonalNoteResponse.model_validate(note)
                for note in notes
            ],
            total=total,
        )

    @staticmethod
    def get_by_recipe(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> PersonalNoteResponse:
        note = PersonalNoteCRUD.get_by_user_and_recipe(
            db=db,
            user_id=user_id,
            recipe_id=recipe_id,
        )

        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Personal note not found",
            )

        return PersonalNoteResponse.model_validate(note)

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        recipe_id: int,
        content: str,
    ) -> PersonalNoteResponse:
        recipe_exists = db.get(Recipe, recipe_id)

        if recipe_exists is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found",
            )

        existing_note = PersonalNoteCRUD.get_by_user_and_recipe(
            db=db,
            user_id=user_id,
            recipe_id=recipe_id,
        )

        if existing_note is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Personal note already exists for this recipe",
            )

        try:
            note = PersonalNoteCRUD.create(
                db=db,
                user_id=user_id,
                recipe_id=recipe_id,
                content=content,
            )
            db.commit()
            db.refresh(note)
        except IntegrityError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Personal note already exists for this recipe",
            ) from exc
        except Exception:
            db.rollback()
            raise

        return PersonalNoteResponse.model_validate(note)

    @staticmethod
    def update(
        db: Session,
        user_id: int,
        recipe_id: int,
        content: str,
    ) -> PersonalNoteResponse:
        note = PersonalNoteCRUD.get_by_user_and_recipe(
            db=db,
            user_id=user_id,
            recipe_id=recipe_id,
        )

        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Personal note not found",
            )

        try:
            note = PersonalNoteCRUD.update(
                db=db,
                note=note,
                content=content,
            )
            db.commit()
            db.refresh(note)
        except Exception:
            db.rollback()
            raise

        return PersonalNoteResponse.model_validate(note)

    @staticmethod
    def delete(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> None:
        note = PersonalNoteCRUD.get_by_user_and_recipe(
            db=db,
            user_id=user_id,
            recipe_id=recipe_id,
        )

        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Personal note not found",
            )

        try:
            PersonalNoteCRUD.delete(
                db=db,
                note=note,
            )
            db.commit()
        except Exception:
            db.rollback()
            raise