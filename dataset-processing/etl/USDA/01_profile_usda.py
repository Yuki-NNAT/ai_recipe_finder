import os
import json
import pandas as pd

# CONFIG
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

RAW_PATH = os.path.join(
    BASE_DIR,
    "data",
    "raw",
    "usda"
)

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "usda",
)

os.makedirs(REPORT_PATH, exist_ok=True)

# Load Data
FILES = [
    "food.csv",
    "food_nutrient.csv",
    "nutrient.csv"
]

def profile_dataframe(df):

    sample_df = df.head(5).copy()

# Chuyển sang object để có thể chứa None
    sample_df = sample_df.astype(object)
    sample_df = sample_df.where(pd.notna(sample_df), None)
    sample = sample_df.to_dict(orient="records")

    return {
        "shape": list(df.shape),
        "columns": df.columns.tolist(),
        "dtypes": {
            col: str(dtype)
            for col, dtype in df.dtypes.items()
        },
        "missing": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "sample": sample
    }

#Read and report each file
report = {}

for file in FILES:

    file_path = os.path.join(
        RAW_PATH,
        file
    )

    print(f"Reading {file}...")

    df = pd.read_csv(
        file_path,
        low_memory=False
    )

    report[file] = profile_dataframe(df)
    
output_file = os.path.join(
    REPORT_PATH,
    "usda_profile.json"
)

with open(
    output_file,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )

print("\nUSDA profiling completed.")
print(f"Saved: {output_file}")

