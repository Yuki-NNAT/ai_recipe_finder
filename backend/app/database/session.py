from sqlalchemy.orm import sessionmaker
from collections.abc import Generator
from sqlalchemy.orm import Session
from app.database.database import engine

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine

)

def get_db() -> Generator[Session, None, None]:

    db = SessionLocal()

    try:

        yield db

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()
        
        