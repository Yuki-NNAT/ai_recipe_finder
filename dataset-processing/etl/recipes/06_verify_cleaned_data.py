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
    "recipes_cleaned.pkl"
)

VERIFY_REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "verify_report.json"
)

#Load Data
df = pd.read_pickle(INPUT_PATH)

#Dataset Information
print("=" * 60)
print("Dataset Information")
print("=" * 60)

print(df.info())

#Missing Values
print("=" * 60)
print("Missing Value")
print("=" * 60)

print(df.isna().sum())

#Duplicate
print("=" * 60)
print("Duplicate")
print("=" * 60)

print(df["id"].duplicated().sum())

#Empty List
print("=" * 60)
print("Empty List")
print("=" * 60)

print(
    "ingredients :",
    (df["ingredients"].apply(len) == 0).sum()
)

print(
    "ingredients_raw :",
    (df["ingredients_raw"].apply(len) == 0).sum()
)

print(
    "steps :",
    (df["steps"].apply(len) == 0).sum()
)

#List Type
print("=" * 60)
print("List Type")
print("=" * 60)

for col in [

    "ingredients",

    "ingredients_raw",

    "steps",

    "tags"

]:

    print(col)

    print(df[col].apply(type).value_counts())

    print()
   
#Sample Data    
print("=" * 60)
print("Random Sample")
print("=" * 60)

sample = df.sample(1, random_state=42)

row = sample.iloc[0]

print(row["name"])

print()

print(row["ingredients"])

print()

print(row["ingredients_raw"])

print()

print(row["steps"])

print()

print(row["tags"])

#Statistics
print("=" * 60)
print("Statistics")
print("=" * 60)

for col in [

    "ingredients",

    "ingredients_raw",

    "steps",

    "tags"

]:

    print(col)

    lengths = df[col].apply(len)

    print(lengths.describe())

    print()    
    
#Report
summary = {

    "total_rows": int(len(df)),

    "total_columns": int(len(df.columns)),

    "duplicate_id": int(df["id"].duplicated().sum()),

    "missing_values": {

        column: int(df[column].isna().sum())

        for column in df.columns

    },

    "empty_lists": {

        "ingredients": int(

            (df["ingredients"].apply(len)==0).sum()

        ),

        "ingredients_raw": int(

            (df["ingredients_raw"].apply(len)==0).sum()

        ),

        "steps": int(

            (df["steps"].apply(len)==0).sum()

        )

    }

}
    
details = {

    "list_columns": {

        "ingredients": str(

            df["ingredients"].apply(type).value_counts().index[0]

        ),

        "ingredients_raw": str(

            df["ingredients_raw"].apply(type).value_counts().index[0]

        ),

        "steps": str(

            df["steps"].apply(type).value_counts().index[0]

        ),

        "tags": str(

            df["tags"].apply(type).value_counts().index[0]

        )

    },

    "sample_checked": True,

    "dataset_ready": True,

    "next_stage": "Amazon RDS Database Design"

}

report = {

    "metadata": {
        "source": "recipes_cleaned.pkl",
        "stage": "Dataset Verification"
    },

    "summary": summary,

    "details": details

}

with open(
    VERIFY_REPORT_PATH,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )