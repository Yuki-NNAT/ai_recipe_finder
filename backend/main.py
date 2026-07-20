import logging

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth import router as auth_router
from app.api.nutrition import router as nutrition_router
from app.api.recipes import router as recipe_router
from app.api.favorites import router as favorite_router
from app.api.search_history import router as search_history_router
from app.api.chat_history import router as chat_history_router


logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | %(levelname)s | "
        "%(name)s | %(message)s"
    ),
)

logger = logging.getLogger(__name__)


tags_metadata = [
    {
        "name": "System",
        "description": "System status endpoints",
    },
    {
        "name": "Authentication",
        "description": (
            "Cognito-authenticated user endpoints"
        ),
    },
    {
        "name": "Recipes",
        "description": "Recipe endpoints",
    },
    {
        "name": "Nutrition",
        "description": "Nutrition endpoints",
    },
    {
        "name": "Favorites",
        "description": (
            "Authenticated user's favorite recipes"
        ),
    },
    {
        "name": "Search History",
        "description": (
            "Authenticated user's search history"
        ),
    },
    {
        "name": "Chat History",
        "description": (
            "Authenticated user chat history endpoints"
        ),
    },
]


app = FastAPI(
    title="AI Recipe Finder API",
    description="Backend API for AI Recipe Finder.",
    version="1.0.0",
    openapi_tags=tags_metadata,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        (
            "https://main."
            "d2ykhh6couuz7m.amplifyapp.com"
        ),
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.error(
        "Unhandled exception: method=%s path=%s",
        request.method,
        request.url.path,
        exc_info=(
            type(exc),
            exc,
            exc.__traceback__,
        ),
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error.",
        },
    )

app.include_router(auth_router)
app.include_router(recipe_router)
app.include_router(nutrition_router)
app.include_router(favorite_router)
app.include_router(search_history_router)
app.include_router(chat_history_router)

@app.get(
    "/",
    tags=["System"],
)
def root():
    return {
        "status": "running",
        "version": "1.0.0",
    }