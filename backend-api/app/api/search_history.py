from fastapi import (
    APIRouter,
    Path,
    Query,
    Response,
    status,
)

from app.api.dependencies import (
    CurrentDatabaseUser,
    DatabaseSession,
)
from app.schemas.search_history import (
    SearchHistoryClearResponse,
    SearchHistoryListResponse,
)
from app.services.search_history_service import (
    SearchHistoryService,
)


router = APIRouter(
    prefix="/search-history",
    tags=["Search History"],
)


@router.get(
    "",
    response_model=SearchHistoryListResponse,
    summary="List the current user's search history",
)
def get_search_history(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> SearchHistoryListResponse:
    return SearchHistoryService.get_search_history(
        db,
        current_user=current_user,
        page=page,
        limit=limit,
    )


@router.delete(
    "/{history_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete one search history entry",
)
def delete_search_history_entry(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
    history_id: int = Path(
        ...,
        ge=1,
    ),
) -> Response:
    SearchHistoryService.delete_search_history_entry(
        db,
        current_user=current_user,
        history_id=history_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.delete(
    "",
    response_model=SearchHistoryClearResponse,
    summary="Clear the current user's search history",
)
def clear_search_history(
    db: DatabaseSession,
    current_user: CurrentDatabaseUser,
) -> SearchHistoryClearResponse:
    return SearchHistoryService.clear_search_history(
        db,
        current_user=current_user,
    )