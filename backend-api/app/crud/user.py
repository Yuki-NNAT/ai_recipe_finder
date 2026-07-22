from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserCRUD:
    @staticmethod
    def get_by_cognito_sub(
        db: Session,
        cognito_sub: str,
    ) -> User | None:
        statement = select(User).where(
            User.cognito_sub == cognito_sub
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:
        statement = select(User).where(
            User.email == email
        )

        return db.scalar(statement)

    @staticmethod
    def create(
        db: Session,
        *,
        cognito_sub: str,
        email: str,
        username: str | None,
    ) -> User:
        user = User(
            cognito_sub=cognito_sub,
            email=email,
            username=username,
        )

        db.add(user)
        return user

    @staticmethod
    def update_identity(
        user: User,
        *,
        email: str,
        username: str | None,
    ) -> User:
        user.email = email

        if username is not None:
            user.username = username

        return user

    @staticmethod
    def update_username(
        user: User,
        username: str,
    ) -> User:
        user.username = username
        return user