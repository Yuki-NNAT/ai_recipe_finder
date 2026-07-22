from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models.shopping_list_item import ShoppingListItem
from app.schemas.shopping_list import (
    ShoppingListItemCreate,
    ShoppingListItemUpdate,
)


class ShoppingListCRUD:
    @staticmethod
    def get_items(
        db: Session,
        user_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ShoppingListItem]:
        statement = (
            select(ShoppingListItem)
            .where(ShoppingListItem.user_id == user_id)
            .order_by(
                ShoppingListItem.created_at.desc(),
                ShoppingListItem.item_id.desc(),
            )
            .offset(skip)
            .limit(limit)
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def count_items(
        db: Session,
        user_id: int,
    ) -> int:
        statement = (
            select(func.count())
            .select_from(ShoppingListItem)
            .where(ShoppingListItem.user_id == user_id)
        )

        return db.scalar(statement) or 0

    @staticmethod
    def get_item(
        db: Session,
        user_id: int,
        item_id: int,
    ) -> ShoppingListItem | None:
        statement = select(ShoppingListItem).where(
            ShoppingListItem.item_id == item_id,
            ShoppingListItem.user_id == user_id,
        )

        return db.scalar(statement)

    @staticmethod
    def create_item(
        db: Session,
        user_id: int,
        data: ShoppingListItemCreate,
    ) -> ShoppingListItem:
        item = ShoppingListItem(
            user_id=user_id,
            recipe_id=data.recipe_id,
            ingredient_text=data.ingredient_text,
        )

        db.add(item)
        db.commit()
        db.refresh(item)

        return item

    @staticmethod
    def update_item(
        db: Session,
        item: ShoppingListItem,
        data: ShoppingListItemUpdate,
    ) -> ShoppingListItem:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(item, field, value)

        db.commit()
        db.refresh(item)

        return item

    @staticmethod
    def delete_item(
        db: Session,
        item: ShoppingListItem,
    ) -> None:
        db.delete(item)
        db.commit()

    @staticmethod
    def clear_items(
        db: Session,
        user_id: int,
    ) -> int:
        statement = delete(ShoppingListItem).where(
            ShoppingListItem.user_id == user_id,
        )

        result = db.execute(statement)
        db.commit()

        return result.rowcount or 0

    @staticmethod
    def recipe_exists(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> bool:
        statement = select(
            select(ShoppingListItem.item_id)
            .where(
                ShoppingListItem.user_id == user_id,
                ShoppingListItem.recipe_id == recipe_id,
            )
            .exists()
        )

        return bool(db.scalar(statement))

    @staticmethod
    def create_recipe_items(
        db: Session,
        user_id: int,
        recipe_id: int,
        ingredient_texts: list[str],
    ) -> list[ShoppingListItem]:
        items = [
            ShoppingListItem(
                user_id=user_id,
                recipe_id=recipe_id,
                ingredient_text=ingredient_text,
            )
            for ingredient_text in ingredient_texts
        ]

        db.add_all(items)
        db.commit()

        for item in items:
            db.refresh(item)

        return items

    @staticmethod
    def delete_recipe_items(
        db: Session,
        user_id: int,
        recipe_id: int,
    ) -> int:
        statement = delete(ShoppingListItem).where(
            ShoppingListItem.user_id == user_id,
            ShoppingListItem.recipe_id == recipe_id,
        )

        result = db.execute(statement)
        db.commit()

        return result.rowcount or 0

    @staticmethod
    def delete_checked_items(
        db: Session,
        user_id: int,
    ) -> int:
        statement = delete(ShoppingListItem).where(
            ShoppingListItem.user_id == user_id,
            ShoppingListItem.is_checked.is_(True),
        )

        result = db.execute(statement)
        db.commit()

        return result.rowcount or 0