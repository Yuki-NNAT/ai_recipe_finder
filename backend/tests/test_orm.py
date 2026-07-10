from app.database.session import SessionLocal
from app.models.recipe import Recipe
from app.models.user import User
from app.models.nutrition import Nutrition

db = SessionLocal()

print("========== ORM TEST ==========")

print("Recipes :", db.query(Recipe).count())

print("Users :", db.query(User).count())

print("Nutrition :", db.query(Nutrition).count())

db.close()

recipe = db.query(Recipe).first()

print(recipe.recipe_id)
print(recipe.name)

recipes = db.query(Recipe).limit(5).all()

for recipe in recipes:
    print(recipe.recipe_id, recipe.name)
    
food = db.query(Nutrition).first()

print(food.food_name)

print(food.calories)

recipe = db.query(Recipe).first()

print(recipe.ingredients)

print(type(recipe.ingredients))

