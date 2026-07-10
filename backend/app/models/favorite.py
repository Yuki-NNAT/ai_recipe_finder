from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship

from app.models.base import Base

class Favorite(Base):

    __tablename__ = "favorites"

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        primary_key=True
    )

    recipe_id = Column(
        Integer,
        ForeignKey("recipes.recipe_id"),
        primary_key=True
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    user = relationship("User")

    recipe = relationship("Recipe")