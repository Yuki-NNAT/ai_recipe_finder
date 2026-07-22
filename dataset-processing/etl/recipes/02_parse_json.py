import pandas as pd
import json
import os

#CONFIG
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

RAW_PATH = os.path.join(
    BASE_DIR,
    "data",
    "raw",
    "recipes.csv"
)

PROFILE_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "profile.json"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "recipes_parsed.pkl"
)

PARSE_REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "parse_report.json"
)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

#LOAD DATA
df = pd.read_csv(RAW_PATH)
with open(PROFILE_PATH, "r", encoding="utf-8") as f:
    profile = json.load(f)
    
invalid_rows = {
    item["row"]
    for item in profile["invalid_json"]["details"]
}

#Drop Invalid Rows
rows_before = len(df)
print(f"Before : {rows_before:,}")
df = df.drop(index=invalid_rows)
rows_after = len(df)
print(f"After  : {rows_after:,}")
rows_removed = rows_before - rows_after
print(f"Removed : {rows_removed:,}")

#Parse JSON
def parse_json(value):

    if pd.isna(value):
        return []

    if value == "":
        return []

    try:
        return json.loads(value)

    except Exception:
        return []

#Parse JSON Columns    
json_columns = [
    "ingredients",
    "ingredients_raw",
    "steps",
    "tags"
]

for col in json_columns:

    print(f"Parsing {col}...")

    df[col] = df[col].apply(parse_json)
    
#Checking
print()
print(type(df.iloc[0]["ingredients"]))
print(df.iloc[0]["ingredients"][:5])

#Add Count Columns
df["ingredient_count"] = df["ingredients"].apply(len)
df["ingredient_raw_count"] = df["ingredients_raw"].apply(len)
df["step_count"] = df["steps"].apply(len)
df["tag_count"] = df["tags"].apply(len)
df["has_ingredients"] = df["ingredient_count"] > 0
df["has_ingredients_raw"] = df["ingredient_raw_count"] > 0
df["has_steps"] = df["step_count"] > 0
df["has_tags"] = df["tag_count"] > 0

#Save Processed Data
df.to_pickle(OUTPUT_PATH)
print() 
print("Save to: ", OUTPUT_PATH)

#Report parsed data
parse_report = {
    "metadata": {
        "source_file": "recipes.csv",   
        "output_file": "recipes_parsed.pkl"
    },
    "summary": {
        "rows_before": int(rows_before),
        "rows_after": int(rows_after),
        "rows_removed": int(rows_removed)
    },
    "json_columns": {
        "ingredients": {
            "parsed": int(df["ingredients"].notna().sum()),
            "empty": int((df["ingredient_count"] == 0).sum())
        },
        "ingredients_raw": {
            "parsed": int(df["ingredients_raw"].notna().sum()),
            "empty": int((df["ingredient_raw_count"] == 0).sum())
        },
        "steps": {
            "parsed": int(df["steps"].notna().sum()),
            "empty": int((df["step_count"] == 0).sum())
        },
        "tags": {
            "parsed": int(df["tags"].notna().sum()),
            "empty": int((df["tag_count"] == 0).sum())
        }
    }
}

os.makedirs(os.path.dirname(PARSE_REPORT_PATH), exist_ok=True)
with open(PARSE_REPORT_PATH, "w", encoding="utf-8") as f:
    json.dump(
        parse_report,
        f,
        indent=4,
        ensure_ascii=False
    )
print("\n" + "=" * 50)
print("Parse JSON Completed")
print("=" * 50)
print(f"Report : {PARSE_REPORT_PATH}")