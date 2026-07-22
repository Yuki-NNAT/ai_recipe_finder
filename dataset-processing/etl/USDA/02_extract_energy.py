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

PROCESSED_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "usda"
)

REPORT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "reports",
    "usda"
)

os.makedirs(PROCESSED_PATH, exist_ok=True)
os.makedirs(REPORT_PATH, exist_ok=True)

#Load Data
nutrient = pd.read_csv(

    os.path.join(
        RAW_PATH,
        "nutrient.csv"
    ),

    low_memory=False

)

food_nutrient = pd.read_csv(

    os.path.join(
        RAW_PATH,
        "food_nutrient.csv"
    ),
    usecols=[
        "fdc_id",
        "nutrient_id",
        "amount"
    ],
    low_memory=False

)

food = pd.read_csv(

    os.path.join(
        RAW_PATH,
        "food.csv"
    ),

    low_memory=False

)

#Filter Food Types
KEEP_TYPES = [
    "foundation_food",
    "sr_legacy_food",
    "survey_fndds_food"
]

food = food[
    food["data_type"].isin(KEEP_TYPES)
]

print(food.shape)
print(food["data_type"].value_counts())

#Extract Energy Nutrient ID
energy = nutrient[
    (nutrient["name"].str.strip() == "Energy") &
    (nutrient["unit_name"].str.upper() == "KCAL")
]

energy_id = int(energy.iloc[0]["id"])

print(f"Energy ID: {energy_id}")

#Filter Food Nutrient for Energy
food_energy = food_nutrient[
    food_nutrient["nutrient_id"] == energy_id
]
print(f"Food items with energy data: ", food_energy.shape)

#Rename and Filter Food Energy Data
food_energy = food_energy[
    [
        "fdc_id",
        "amount"
    ]
]

food_energy.rename(
    columns={
        "amount": "calories"
    },
    inplace=True
)

food_energy = food_energy[
    food_energy["fdc_id"].isin(food["fdc_id"])
]

print("Food items with energy data (after filtering): ", food_energy.shape)

#Merge Food and Energy Data
nutrition = food.merge(
    food_energy,
    on="fdc_id",
    how="inner"
)

nutrition.rename(
    columns={
        "description": "food_name"
    },
    inplace=True
)

nutrition = nutrition[
    [
        "fdc_id",
        "food_name",
        "data_type",
        "calories"
    ]
]

#Checking and Reporting
print("=" * 50)
print("Nutrition Dataset")
print("=" * 50)

print()

print(nutrition.head())

print()

print(nutrition.info())

print()

print(nutrition.describe())

print()

print(nutrition.isnull().sum())

print()

print("Duplicate:", nutrition.duplicated().sum())

nutrition.to_pickle(
    os.path.join(
        PROCESSED_PATH,
        "nutrition_raw.pkl"
    )
)

report = {
    "metadata": {
        "source": [
            "food.csv",
            "nutrient.csv",
            "food_nutrient.csv"
        ],
        "output": "nutrition_raw.pkl"
    },
    "summary": {
        "energy_id": energy_id,
        "food_total": 2101279,
        "food_after_type_filter": len(food),
        "food_with_energy": len(food_energy),
        "nutrition_rows": len(nutrition),
        "missing": nutrition.isnull().sum().to_dict(),
        "duplicate": int(nutrition.duplicated().sum())
    },
    "details": {

        "data_type_distribution":
            food["data_type"]
                .value_counts()
                .to_dict(),

        "dataset": {

            "columns":
                nutrition.columns.tolist(),

            "dtypes": {
                col: str(dtype)
                for col, dtype
                in nutrition.dtypes.items()
            },

            "missing":
                nutrition.isnull()
                    .sum()
                    .to_dict(),

            "duplicate_rows":
                int(
                    nutrition.duplicated().sum()
                )

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
}

report_path = os.path.join(
    REPORT_PATH,
    "energy_report.json"
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