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

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "recipes",
    "duplicate_report.json"
)

#Load Data
df = pd.read_pickle(INPUT_PATH)
duplicate_df = df[
    df["id"].duplicated(keep=False)
].copy()

print(f"Duplicate Rows : {len(duplicate_df)}")

groups = duplicate_df.groupby("id")
analysis = {
    "total_duplicate_groups":0,
    "identical":0,
    "missing_data":0,
    "content_conflict":0,
    "complex_conflict":0,
    "merge_candidate":0,
    "non_merge_candidate":0,
    "skipped": 0
}

details = []

compare_columns=[
"name",
"description",
"ingredients",
"ingredients_raw",
"steps",
"servings",
"serving_size",
"tags"
]

#Check Missing 
def is_missing(value):

    if value is None:
        return True

    if isinstance(value, list):
        return len(value)==0

    if isinstance(value,str):
        return value.strip()==""

    return pd.isna(value)

#Analyze Duplicate Groups
for recipe_id, group in groups:
    analysis["total_duplicate_groups"] += 1
    #Only analyze groups with exactly 2 rows. If there are more than 2 rows, skip the analysis for that group.
    if len(group) != 2:
        analysis["skipped"] += 1
        details.append({
            "recipe_id": int(recipe_id),
            "rows": len(group),
            "classification": "skipped"
        })
        continue
    row1 = group.iloc[0]
    row2 = group.iloc[1]
    diff = []
    missing = []
    conflict = []
    for col in compare_columns:
        if row1[col] == row2[col]:
            continue
        diff.append(col)
        if is_missing(row1[col]) ^ is_missing(row2[col]):
            missing.append(col)
        else:
            conflict.append(col)
    if len(diff) == 0:
        classification = "identical"
        merge = True
        analysis["identical"] += 1
        analysis["merge_candidate"] += 1
    elif len(conflict) == 0:
        classification = "missing_data"
        merge = True
        analysis["missing_data"] += 1
        analysis["merge_candidate"] += 1
    elif len(conflict) == 1:
        classification = "content_conflict"
        merge = False
        analysis["content_conflict"] += 1
        analysis["non_merge_candidate"] += 1
    else:
        classification = "complex_conflict"
        merge = False
        analysis["complex_conflict"] += 1
        analysis["non_merge_candidate"] += 1
    details.append({
        "recipe_id": int(recipe_id),
        "rows": 2,
        "classification": classification,
        "merge_candidate": merge,
        "different_columns": diff,
        "missing_columns": missing,
        "conflict_columns": conflict
    })
    
#Report
report = {
"metadata": {
    "source": "recipes_parsed.pkl"
},
"summary": analysis,
"details": details
}
os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
with open(REPORT_PATH, "w", encoding="utf-8") as f:
    json.dump(
        report,
        f,
        indent=4,
        ensure_ascii=False
    )
    
print("=" * 50)
print("Duplicate Analysis Completed")
print("=" * 50)

for key, value in analysis.items():
    print(f"{key:<25}: {value}")
print()
print("Report saved to:")
print(REPORT_PATH)