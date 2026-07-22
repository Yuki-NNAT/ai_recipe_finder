import os
import json
import ast
import pandas as pd
import csv
import statistics

# CONFIG
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "raw",
    "recipes.csv"
)

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "profile.json"
)

# LOAD DATA
print("=" * 50)
print("Loading Dataset...")
print("=" * 50)

df = pd.read_csv(DATA_PATH)

print(f"Total Rows    : {len(df):,}")
print(f"Total Columns : {len(df.columns)}")

print("\nColumns")

for col in df.columns:
    print("-", col)
    
#Checking Missing Values    
print("=" * 50)
print("Checking Missing Values")
print("=" * 50)

def count_missing(series):
    s = series.astype(str).str.strip()
    return {
        "NaN": series.isna().sum(),
        "Empty String": (s == "").sum(),
        "Empty List": (s == "[]").sum()
    }
missing_report = []
for col in df.columns:
    result = count_missing(df[col])
    missing_report.append({
        "column": col,
        "NaN": int(result["NaN"]),
        "Empty String": int(result["Empty String"]),
        "Empty List": int(result["Empty List"])
    })

    print(
        f"{col:<20}"
        f"NaN={result['NaN']:<6}"
        f"Empty={result['Empty String']:<6}"
        f"[]={result['Empty List']}"
    )
    
#Checking Duplicate
print("=" * 50)
print("Checking Duplicate")
print("=" * 50)

duplicate_rows = df.duplicated().sum()

print(f"Duplicate Rows : {duplicate_rows}")

duplicate_id = df["id"].duplicated().sum()

print(f"Duplicate ID : {duplicate_id}")

duplicate_name = df["name"].duplicated().sum()

print(f"Duplicate Name : {duplicate_name}")

#Invalid JSON
print("=" * 50)
print("Checking Invalid JSON")
print("=" * 50)
INVALID_ROWS = []

def validate_json_column(series, column_name):
    invalid = 0

    for idx, value in series.items():

        if pd.isna(value):
            continue

        try:
            json.loads(value)

        except json.JSONDecodeError as e:

            invalid += 1

            INVALID_ROWS.append({
                "row": idx,
                "column": column_name,
                "error": str(e),
                "value": str(value)[:300]
            })

    return invalid

json_report = {}

for column in [
    "ingredients",
    "ingredients_raw",
    "steps",
    "tags"
]:

    invalid = validate_json_column(df[column], column)

    json_report[column] = invalid

    print(f"{column:<20} {invalid}")
    
    invalid_path = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "invalid_json.csv"
)

pd.DataFrame(INVALID_ROWS).to_csv(
    invalid_path,
    index=False,
    encoding="utf-8-sig"
)

print("\nInvalid JSON saved:", invalid_path)

#Statistics

def list_statistics(series):

    lengths = []

    for value in series:

        if pd.isna(value):
            continue

        try:
            data = json.loads(value)

            if isinstance(data, list):
                lengths.append(len(data))

        except Exception:
            continue

    if len(lengths) == 0:
        return None

    return {
        "min": min(lengths),
        "max": max(lengths),
        "mean": round(statistics.mean(lengths), 2),
        "median": statistics.median(lengths)
    }
    
print("="*50)
print("List Statistics")
print("="*50)

for col in [
    "ingredients",
    "ingredients_raw",
    "steps",
    "tags"
]:

    stat = list_statistics(df[col])

    print(f"\n{col}")

    print(stat)
    
#Text Statistics
def text_statistics(series):

    text = series.fillna("").astype(str)

    lengths = text.str.len()

    return {
        "min": int(lengths.min()),
        "max": int(lengths.max()),
        "mean": round(lengths.mean(),2),
        "median": float(lengths.median())
    }

print("="*50)
print("Text Statistics")
print("="*50)

for col in [
    "name",
    "description"
]:
    print(f"\n{col}")
    print(text_statistics(df[col]))
    
#Save Report
profile_report = {
    "dataset": {
        "rows": int(len(df)),
        "columns": int(len(df.columns)),
        "column_names": df.columns.tolist()
    },

    "missing_values": missing_report,

    "duplicates": {
        "duplicate_rows": int(duplicate_rows),
        "duplicate_id": int(duplicate_id),
        "duplicate_name": int(duplicate_name)
    },

    "invalid_json": {
        "summary": json_report,
        "details": INVALID_ROWS
    }
}

os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)

with open(REPORT_PATH, "w", encoding="utf-8") as f:
    json.dump(
        profile_report,
        f,
        indent=4,
        ensure_ascii=False
    )

print("=" * 50)
print(f"Profile report saved to:\n{REPORT_PATH}")
print("Profile report saved successfully!")
print("=" * 50)