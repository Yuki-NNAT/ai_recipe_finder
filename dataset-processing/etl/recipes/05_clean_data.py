import os
import json
import pandas as pd

#Config
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

INPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "recipes_merged.pkl"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "recipes_cleaned.pkl"
)

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "clean_report.json"
)

DETAIL_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "clean_details.csv"
)

#Load Data
df = pd.read_pickle(INPUT_PATH)
summary = {

    "input_rows": len(df),

    "output_rows": 0,

    "removed_invalid_recipe": 0,

    "description_filled": 0,

    "servings_fixed": 0,

    "serving_size_filled": 0,

    "list_trimmed": 0

}

details = []

#Missing Values Data Cleaning
#Description: Fill missing descriptions with empty string
mask = df["description"].isna()

summary["description_filled"] = mask.sum()

df["description"] = df["description"].fillna("")

#Servings and Serving Size: Fill missing or invalid servings and serving size with 1
mask = (

    df["servings"].isna()

) | (

    df["servings"] <= 0

)

summary["servings_fixed"] = mask.sum()

df["servings"] = df["servings"].fillna(1)

df.loc[

    df["servings"] <= 0,

    "servings"

] = 1

#Serving Size: Fill missing serving size with empty string

mask = df["serving_size"].isna()

summary["serving_size_filled"] = mask.sum()

df["serving_size"] = df["serving_size"].fillna("")

#Clean List Columns: Remove empty strings and whitespace from list columns
def clean_list(lst):

    if not isinstance(lst, list):

        return []

    cleaned = []

    for item in lst:

        item = str(item).strip()

        if item:

            cleaned.append(item)

    return cleaned

list_columns = [

    "ingredients",

    "ingredients_raw",

    "steps",

    "tags"

]

for col in list_columns:

    df[col] = df[col].apply(clean_list)
    
#Remove Invalid Recipes: Remove recipes with empty ingredients
invalid_mask = (

    df["ingredients"].apply(len) == 0

) | (

    df["ingredients_raw"].apply(len) == 0

)

for _, row in df[invalid_mask].iterrows():

    reasons = []

    if len(row["ingredients"]) == 0:
        reasons.append("empty_ingredients")

    if len(row["ingredients_raw"]) == 0:
        reasons.append("empty_ingredients_raw")

    details.append({

        "recipe_id": row["id"],

        "reason": ", ".join(reasons)

    })
    
summary["removed_invalid_recipe"] = invalid_mask.sum()

df = df[~invalid_mask] 

#Clean Steps: Remove recipes with empty steps
step_mask = (

    df["steps"].apply(len) == 0

)

for _, row in df[step_mask].iterrows():

    details.append({

        "recipe_id": row["id"],

        "reason": "empty_steps"

    })
    
summary["removed_invalid_recipe"] += step_mask.sum()

df = df[~step_mask]

#Trim Whitespace: Remove leading and trailing whitespace from string columns
df["name"] = df["name"].str.strip()

df["description"] = df["description"].str.strip()  

#Save Cleaned Data and Report
summary["output_rows"] = len(df)

os.makedirs(

    os.path.dirname(OUTPUT_PATH),

    exist_ok=True

)

df.to_pickle(OUTPUT_PATH)

details_df = pd.DataFrame(details)

details_df.to_csv(

    DETAIL_PATH,

    index=False,

    encoding="utf-8-sig"

)

summary = {
    key: value.item() if hasattr(value, "item") else value
    for key, value in summary.items()
}

report = {

    "metadata": {

        "source": "recipes_merged.pkl",

        "output": "recipes_cleaned.pkl"

    },

    "summary": summary,

    "details": {

        "type": "csv",

        "path": "data/reports/clean_details.csv"

    }

}

with open(REPORT_PATH, "w", encoding="utf-8") as f:

    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )
    
print("=" * 50)
print("Data Cleaning Completed")
print("=" * 50)

for key, value in summary.items():

    print(f"{key:<30}: {value}")

print("=" * 50)
print("Final Validation")
print("=" * 50)

print("Empty ingredients     :", (df["ingredients"].apply(len) == 0).sum())
print("Empty ingredients_raw :", (df["ingredients_raw"].apply(len) == 0).sum())
print("Empty steps           :", (df["steps"].apply(len) == 0).sum())
print("Duplicate ID          :", df["id"].duplicated().sum())

print("=" * 50)
print(f"Dataset saved : {OUTPUT_PATH}")
print(f"Report saved  : {REPORT_PATH}")
print(f"Details saved : {DETAIL_PATH}")