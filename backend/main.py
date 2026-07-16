import logging

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.api.auth import router as auth_router
from app.api.nutrition import router as nutrition_router
from app.api.recipes import router as recipe_router


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
]


app = FastAPI(
    title="AI Recipe Finder API",
    description="Backend API for AI Recipe Finder.",
    version="1.0.0",
    openapi_tags=tags_metadata,
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


@app.get(
    "/",
    tags=["System"],
)
def root():
    return {
        "status": "running",
        "version": "1.0.0",
    }