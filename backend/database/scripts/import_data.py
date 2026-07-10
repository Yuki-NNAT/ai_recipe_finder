import json
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine
from tqdm import tqdm
from sqlalchemy import text
import numpy as np

# Database Config
DB_USER = "DPTN_admin"
DB_PASSWORD = "DPTNadmin2226"
DB_HOST = "food-db-4.clyaysamqko8.ap-southeast-1.rds.amazonaws.com"
DB_PORT = 3306
DB_NAME = "food_ai_db"

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL)

# File Paths
BASE_DIR = Path(__file__).resolve().parent.parent

RECIPES_PATH = BASE_DIR / "seed" / "recipes_cleaned.pkl"
NUTRITION_PATH = BASE_DIR / "seed" / "nutrition_cleaned.pkl"

# Read PKL
print("Loading recipes...")
recipes = pd.read_pickle(RECIPES_PATH)

print("Loading nutrition...")
nutrition = pd.read_pickle(NUTRITION_PATH)

print("Done.")

#Normalize recipes DataFrame
recipes.rename(
    columns={
        "id": "recipe_id"
    },
    inplace=True
)

json_columns = [
    "ingredients",
    "ingredients_raw",
    "steps",
    "tags"
]

def convert_json(x):
    if isinstance(x, np.ndarray):
        x = x.tolist()

    if x is None:
        x = []

    if isinstance(x, float) and pd.isna(x):
        x = []

    if not isinstance(x, list):
        x = []

    return json.dumps(x, ensure_ascii=False)

for col in json_columns:
    recipes[col] = recipes[col].apply(convert_json)
    
#Import recipes into the database in batches    
BATCH_SIZE = 5000

print("Importing recipes...")

for start in tqdm(range(0, len(recipes), BATCH_SIZE)):

    batch = recipes.iloc[start:start+BATCH_SIZE]

    batch.to_sql(
        "recipes",
        engine,
        if_exists="append",
        index=False,
        method="multi"
    )

print("Recipes imported.")    

#Import nutrition into the database
print("Importing nutrition...")

nutrition.to_sql(
    "nutrition",
    engine,
    if_exists="append",
    index=False,
    method="multi"
)

print("Nutrition imported.")

'''
#Check missing data in the database (if importing data is failed)
with engine.connect() as conn:
    db_ids = pd.read_sql(
        "SELECT recipe_id FROM recipes",
        conn
    )

missing = recipes[
    ~recipes["recipe_id"].isin(db_ids["recipe_id"])
].copy()

print(len(missing))

for col in json_columns:
    recipes[col] = recipes[col].apply(convert_json)

#Import each record and save error record
success = 0
failed = []

for _, row in missing.iterrows():

    try:
        row.to_frame().T.to_sql(
            "recipes",
            engine,
            if_exists="append",
            index=False
        )

        success += 1

    except Exception as e:

        failed.append({
            "recipe_id": row["recipe_id"],
            "error": str(e)
        })

print(success)
print(len(failed))

failed_df = pd.DataFrame(failed)

failed_df.to_csv(
    "failed_recipes.csv",
    index=False
)
'''

#Check data after importing
with engine.connect() as conn:

    recipe_count = conn.execute(
        text("SELECT COUNT(*) FROM recipes")
    ).scalar()

    nutrition_count = conn.execute(
        text("SELECT COUNT(*) FROM nutrition")
    ).scalar()

print()

print("========== RESULT ==========")

print("Recipes :", recipe_count)

print("Nutrition :", nutrition_count)
