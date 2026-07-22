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

#Verify data
#schema
expected_columns = [
    "fdc_id",
    "food_name",
    "data_type",
    "calories"
]

schema_ok = (
    nutrition.columns.tolist()
    == expected_columns
)

#Missing values
missing = nutrition.isnull().sum().to_dict()

missing_total = int(
    nutrition.isnull().sum().sum()
)

#Duplicate rows
duplicate_fdc = int(
    nutrition.duplicated(
        subset=["fdc_id"]
    ).sum()
)

duplicate_name = int(
    nutrition.duplicated(
        subset=["food_name"]
    ).sum()
)

#Calorie values
negative_calories = int(
    (nutrition["calories"] < 0).sum()
)

zero_calories = int(
    (nutrition["calories"] == 0).sum()
)

#Data types
valid_types = [
    "foundation_food",
    "sr_legacy_food",
    "survey_fndds_food"
]

invalid_type = nutrition[
    ~nutrition["data_type"].isin(valid_types)
]

invalid_type_count = len(invalid_type)

#Statistics
calories_statistics = {
    "min": float(nutrition["calories"].min()),
    "max": float(nutrition["calories"].max()),
    "mean": round(float(nutrition["calories"].mean()), 2),
    "median": round(float(nutrition["calories"].median()), 2)
}

#Random sample
sample = nutrition.sample(
    min(10, len(nutrition)),
    random_state=42
)

#Status
status = "PASS"

if (
    not schema_ok
    or missing_total > 0
    or duplicate_fdc > 0
    or negative_calories > 0
    or invalid_type_count > 0
):
    status = "FAIL"
    
#Report
details = {

    "schema": {
        "expected": expected_columns,
        "actual": nutrition.columns.tolist(),
        "status": schema_ok
    },

    "missing": missing,

    "duplicate": {
        "fdc_id": duplicate_fdc,
        "food_name": duplicate_name
    },

    "calories": {
        "negative": negative_calories,
        "zero": zero_calories,
        "statistics": calories_statistics
    },

    "data_type": nutrition["data_type"].value_counts().to_dict(),

    "sample": sample.to_dict(orient="records")

}

report = {

    "metadata": {
        "source": "nutrition_cleaned.pkl"
    },

    "summary": {

        "status": status,

        "rows": len(nutrition),

        "missing": missing_total,

        "duplicate_fdc": duplicate_fdc,

        "duplicate_food_name": duplicate_name,

        "negative_calories": negative_calories,

        "invalid_data_type": invalid_type_count

    },

    "details": details

}

report_path = os.path.join(
    REPORT_PATH,
    "verify_report.json"
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

print("=" * 50)
print("Verify Completed")
print("=" * 50)

print("Report saved:")
print(report_path)