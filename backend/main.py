from fastapi import FastAPI

from app.api.recipes import router as recipe_router
from app.api.nutrition import router as nutrition_router
#from app.api.favorites import router as favorite_router

app = FastAPI(
    title="AI Recipe Finder API",
    version="1.0.0"
)

app.include_router(recipe_router)
app.include_router(nutrition_router)
#app.include_router(favorite_router)


@app.get("/")
def root():

    return {
        "status": "running"
    }