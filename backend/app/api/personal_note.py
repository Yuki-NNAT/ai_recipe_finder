from fastapi import APIRouter, Query, Response, status

from app.api.dependencies import CurrentDatabaseUser, DatabaseSession
from app.schemas.personal_note import (
    PersonalNoteCreate,
    PersonalNoteListResponse,
    PersonalNoteResponse,
    PersonalNoteUpdate,
)
from app.services.personal_note import PersonalNoteService


router = APIRouter(
    prefix="/personal-notes",
    tags=["Personal Notes"],
)


@router.get(
    "",
    response_model=PersonalNoteListResponse,
)
def get_personal_notes(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
) -> PersonalNoteListResponse:
    return PersonalNoteService.get_all(
        db=db,
        user_id=current_user.user_id,
        page=page,
        limit=limit,
    )


@router.get(
    "/recipes/{recipe_id}",
    response_model=PersonalNoteResponse,
)
def get_personal_note_by_recipe(
    recipe_id: int,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> PersonalNoteResponse:
    return PersonalNoteService.get_by_recipe(
        db=db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
    )


@router.post(
    "/recipes/{recipe_id}",
    response_model=PersonalNoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_personal_note(
    recipe_id: int,
    payload: PersonalNoteCreate,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> PersonalNoteResponse:
    return PersonalNoteService.create(
        db=db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
        content=payload.content,
    )


@router.patch(
    "/recipes/{recipe_id}",
    response_model=PersonalNoteResponse,
)
def update_personal_note(
    recipe_id: int,
    payload: PersonalNoteUpdate,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> PersonalNoteResponse:
    return PersonalNoteService.update(
        db=db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
        content=payload.content,
    )


@router.delete(
    "/recipes/{recipe_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_personal_note(
    recipe_id: int,
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> Response:
    PersonalNoteService.delete(
        db=db,
        user_id=current_user.user_id,
        recipe_id=recipe_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)