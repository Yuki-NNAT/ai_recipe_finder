import os
import json
import re
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
    "usda",
    "nutrition_raw.pkl"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "usda",
    "nutrition_cleaned.pkl"
)

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "usda"
)

os.makedirs(REPORT_PATH, exist_ok=True)

#Load data
nutrition = pd.read_pickle(INPUT_PATH)

rows_before = len(nutrition)

print()

print(nutrition.info())

print()

print(nutrition.head())

#Normalize food names
nutrition["food_name"] = (
    nutrition["food_name"]
    .str.lower()
)

nutrition["food_name"] = (
    nutrition["food_name"]
    .str.strip()
)

nutrition["food_name"] = (
    nutrition["food_name"]
    .str.replace(",", " ", regex=False)
)

nutrition["food_name"] = (
    nutrition["food_name"]
    .str.replace(r"\s+", " ", regex=True)
)

nutrition["food_name"] = (
    nutrition["food_name"]
    .str.strip()
)

#Check for negative calories
negative_calories = nutrition[
    nutrition["calories"] < 0
]

negative_removed = len(negative_calories)

nutrition = nutrition[
    nutrition["calories"] >= 0
]

#Check for missing values
missing_before = nutrition.isnull().sum().to_dict()

null_removed = int(
    nutrition.isnull().any(axis=1).sum()
)

nutrition = nutrition.dropna()

#Check for duplicates
duplicate_fdc = nutrition.duplicated(
    subset=["fdc_id"]
)

duplicate_name = nutrition.duplicated(
    subset=["food_name"]
)

duplicate_fdc_count = int(
    duplicate_fdc.sum()
)

duplicate_name_count = int(
    duplicate_name.sum()
)

rows_after = len(nutrition)

#Check and save dataset
print()

print("=" * 60)

print("Cleaned Dataset")

print("=" * 60)

print()

print(nutrition.info())

print()

print(nutrition.describe())

nutrition.to_pickle(
    OUTPUT_PATH
)

#report
details = {

    "dataset": {

        "columns":
            nutrition.columns.tolist(),

        "dtypes": {
            col: str(dtype)
            for col, dtype
            in nutrition.dtypes.items()
        }

    },

    "missing_before": missing_before,

    "duplicate": {

        "fdc_id": duplicate_fdc_count,

        "food_name": duplicate_name_count

    },

    "calories_statistics": {

        "min":
            float(
                nutrition["calories"].min()
            ),

        "max":
            float(
                nutrition["calories"].max()
            ),

        "mean":
            round(
                float(
                    nutrition["calories"].mean()
                ),
                2
            ),

        "median":
            round(
                float(
                    nutrition["calories"].median()
                ),
                2
            )

    }

}

report = {

    "metadata": {

        "source":
            "nutrition_raw.pkl",

        "output":
            "nutrition_cleaned.pkl"

    },

    "summary": {

        "rows_before":
            rows_before,

        "rows_after":
            rows_after,

        "negative_removed":
            negative_removed,

        "null_removed":
            null_removed,

        "duplicate_fdc":
            duplicate_fdc_count,

        "duplicate_food_name":
            duplicate_name_count

    },

    "details": details

}

report_path = os.path.join(
    REPORT_PATH,
    "clean_report.json"
)

with open(
    report_path,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )
    
print()

print("=" * 50)
print("Clean Completed")
print("=" * 50)

print(f"Rows Before : {rows_before}")
print(f"Rows After  : {rows_after}")

print()

print("Dataset saved:")
print(OUTPUT_PATH)

print()

print("Report saved:")
print(report_path)