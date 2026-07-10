from sqlalchemy import BigInteger,String,Float

from sqlalchemy.orm import Mapped,mapped_column

from app.models.base import Base


class Nutrition(Base):

    __tablename__="nutrition"

    fdc_id:Mapped[int]=mapped_column(
        BigInteger,
        primary_key=True
    )

    food_name:Mapped[str]=mapped_column(
        String(255),
        nullable=False
    )

    data_type= mapped_column(String(100))

    calories= mapped_column(Float)