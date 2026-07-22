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
    "recipes_parsed.pkl"
)

DUPLICATE_REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "duplicate_report.json"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "recipes_merged.pkl"
)

MERGE_REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "merge_report.json"
)

MERGE_DETAILS_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "merge_details.csv"
)

#Load Data
df = pd.read_pickle(INPUT_PATH)

with open(DUPLICATE_REPORT_PATH, "r", encoding="utf-8") as f:
    duplicate_report = json.load(f)

#Check Missing    
def is_missing(value):

    if value is None:
        return True

    if isinstance(value, list):
        return len(value) == 0

    if isinstance(value, str):
        return value.strip() == ""

    return pd.isna(value)

def completeness_score(row, columns):

    score = 0

    for col in columns:

        if not is_missing(row[col]):
            score += 1

    return score

#Merge Duplicate
merge_columns = [
    "name",
    "description",
    "ingredients",
    "ingredients_raw",
    "steps",
    "servings",
    "serving_size",
    "tags"
]

merge_ids = {

    item["recipe_id"]

    for item in duplicate_report["details"]

    if item.get("merge_candidate", False)

}

def merge_value(value1, value2):

    if is_missing(value1):
        return value2

    if is_missing(value2):
        return value1

    if isinstance(value1, str) and isinstance(value2, str):

        if len(value2) > len(value1):
            return value2

    if isinstance(value1, list) and isinstance(value2, list):

        if len(value2) > len(value1):
            return value2

    return value1

groups = df.groupby("id")

result_rows = []

merged_groups = 0

removed_rows = 0

merge_details = []

kept_groups = 0

skipped_groups = 0

for recipe_id, group in groups:
    # Case 1: Not Duplicate
    if len(group) == 1:

        result_rows.append(group.iloc[0])

        continue
    
    # Case 2: Duplicate but NOT Merge
    if recipe_id not in merge_ids:
        
        kept_groups += 1

        merge_details.append({

            "recipe_id": int(recipe_id),

            "action": "kept",

            "reason": "content_conflict",

            "removed": 0,

            "kept": len(group)

        })
        
        for _, row in group.iterrows():

            result_rows.append(row)

        continue
    
    # Case 3: More than 2 records
    if len(group) != 2:
        skipped_groups += 1

        merge_details.append({

            "recipe_id": int(recipe_id),

            "action": "skipped",

            "reason": "more_than_two_records",

            "removed": 0,

            "kept": len(group)

        })   

        for _, row in group.iterrows():

            result_rows.append(row)

        continue
    
    # Case 4: Merge Candidate
    score1 = completeness_score(group.iloc[0], merge_columns)

    score2 = completeness_score(group.iloc[1], merge_columns)

    if score1 >= score2:

        base_row = group.iloc[0].copy()

        other_row = group.iloc[1]

    else:

        base_row = group.iloc[1].copy()

        other_row = group.iloc[0]   
    
    for col in merge_columns:

        base_row[col] = merge_value(

            base_row[col],

            other_row[col]

    )
    
    result_rows.append(base_row)

    merged_groups += 1

    removed_rows += 1
    
    merge_details.append({

        "recipe_id": int(recipe_id),

        "action": "merged",
        
        'reason': "",

        "removed": 1,

        "kept": 1

    })
    
#Create Result DataFrame
result_df = pd.DataFrame(result_rows)    
print(df.shape)
print(result_df.shape)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

result_df.to_pickle(OUTPUT_PATH)

print("=" * 50)
print("Merged dataset saved successfully!")
print(OUTPUT_PATH)
print("=" * 50)

details_df = pd.DataFrame(merge_details)

details_df.to_csv(

    MERGE_DETAILS_PATH,

    index=False,

    encoding="utf-8-sig"

)

merge_report = {

    "metadata":{

        "source":"recipes_parsed.pkl",

        "output":"recipes_merged.pkl"

    },

    "summary":{

        "input_rows":len(df),

        "output_rows":len(result_df),

        "duplicate_groups":len(duplicate_report["details"]),

        "merged_groups":merged_groups,

        "removed_rows":removed_rows,

        "kept_duplicate_groups": kept_groups,

        "skipped_groups": skipped_groups

    },
    
    "details": {
        "type": "csv",
        "path": "data/reports/merge_details.csv"
    }

}

with open(

    MERGE_REPORT_PATH,

    "w",

    encoding="utf-8"

) as f:

    json.dump(

        merge_report,

        f,

        indent=4,

        ensure_ascii=False

    )
    
print("Report saved to:")
print(MERGE_REPORT_PATH)