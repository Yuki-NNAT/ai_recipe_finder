from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentDatabaseUser
from app.database.session import get_db
from app.schemas.chat_history import (
    ChatHistoryClearResponse,
    ChatHistoryDeleteResponse,
    ChatHistoryListResponse,
)
from app.services.chat_history_service import (
    ChatHistoryService,
)


router = APIRouter(
    prefix="/chat-history",
    tags=["Chat History"],
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


@router.get(
    "",
    response_model=ChatHistoryListResponse,
    summary="Get the current user's chat history",
)
def get_chat_history(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    cursor: Annotated[
        int | None,
        Query(
            ge=1,
            description=(
                "Load messages older than this chat ID."
            ),
        ),
    ] = None,
    limit: Annotated[
        int,
        Query(
            ge=1,
            le=100,
        ),
    ] = 50,
) -> ChatHistoryListResponse:
    return ChatHistoryService.get_history(
        db,
        current_user=current_user,
        before_chat_id=cursor,
        limit=limit,
    )


@router.delete(
    "/{chat_id}",
    response_model=ChatHistoryDeleteResponse,
    summary="Delete one chat history entry",
)
def delete_chat_history_entry(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    chat_id: Annotated[
        int,
        Path(ge=1),
    ],
) -> ChatHistoryDeleteResponse:
    return ChatHistoryService.delete_entry(
        db,
        current_user=current_user,
        chat_id=chat_id,
    )


@router.delete(
    "",
    response_model=ChatHistoryClearResponse,
    summary="Clear the current user's chat history",
)
def clear_chat_history(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> ChatHistoryClearResponse:
    return ChatHistoryService.clear_history(
        db,
        current_user=current_user,
    )