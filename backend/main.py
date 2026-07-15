from fastapi import FastAPI

from app.api.nutrition import router as nutrition_router
from app.api.recipes import router as recipe_router

tags_metadata = [
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