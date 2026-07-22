from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.personal_note import PersonalNote


class PersonalNoteCRUD:
    @staticmethod
    def get_by_user_and_recipe(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> PersonalNote | None:
        statement = select(PersonalNote).where(
            PersonalNote.user_id == user_id,
            PersonalNote.recipe_id == recipe_id,
        )
        return db.scalar(statement)

    @staticmethod
    def get_all_by_user(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> list[PersonalNote]:
        statement = (
            select(PersonalNote)
            .where(PersonalNote.user_id == user_id)
            .order_by(
                PersonalNote.updated_at.desc(),
                PersonalNote.note_id.desc(),
            )
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(statement).all())

    @staticmethod
    def count_by_user(
        db: Session,
        user_id: int,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(PersonalNote)
            .where(PersonalNote.user_id == user_id)
        )
        return db.scalar(statement) or 0

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        recipe_id: int,
        content: str,
    ) -> PersonalNote:
        note = PersonalNote(
            user_id=user_id,
            recipe_id=recipe_id,
            content=content,
        )
        db.add(note)
        db.flush()
        db.refresh(note)
        return note

    @staticmethod
    def update(
        db: Session,
        note: PersonalNote,
        content: str,
    ) -> PersonalNote:
        note.content = content
        db.flush()
        db.refresh(note)
        return note

    @staticmethod
    def delete(
        db: Session,
        note: PersonalNote,
    ) -> None:
        db.delete(note)
        db.flush()