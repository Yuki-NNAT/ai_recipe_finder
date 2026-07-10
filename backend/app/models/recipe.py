from sqlalchemy import Integer,String,Float,Boolean,JSON,Text

from sqlalchemy.orm import Mapped,mapped_column

from app.models.base import Base


class Recipe(Base):

    __tablename__="recipes"

    recipe_id:Mapped[int]=mapped_column(
        Integer,
        primary_key=True
    )

    name:Mapped[str]=mapped_column(
        String(255),
        nullable=False
    )

    description:Mapped[str|None]=mapped_column(Text)

    ingredients= mapped_column(JSON)

    ingredients_raw= mapped_column(JSON)

    steps= mapped_column(JSON)

    servings= mapped_column(Float)

    serving_size= mapped_column(String(100))

    tags= mapped_column(JSON)

    ingredient_count= mapped_column(Integer)

    ingredient_raw_count= mapped_column(Integer)

    step_count= mapped_column(Integer)

    tag_count= mapped_column(Integer)

    has_ingredients= mapped_column(Boolean)

    has_ingredients_raw= mapped_column(Boolean)

    has_steps= mapped_column(Boolean)

    has_tags= mapped_column(Boolean)