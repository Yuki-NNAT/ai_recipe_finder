from pydantic import BaseModel

class FavoriteCreate(BaseModel):

    user_id: int

    recipe_id: int
    
class FavoriteResponse(BaseModel):

    recipe_id: int

    name: str

    created_at: str

    class Config:
        from_attributes = True
        
