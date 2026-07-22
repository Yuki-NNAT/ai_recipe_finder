import json
import logging
import os
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
from tqdm import tqdm


BATCH_SIZE = 5_000

JSON_COLUMNS = [
    "ingredients",
    "ingredients_raw",
    "steps",
    "tags",
]

BASE_DIR = Path(__file__).resolve().parent.parent

RECIPES_PATH = BASE_DIR / "seed" / "recipes_cleaned.pkl"
NUTRITION_PATH = BASE_DIR / "seed" / "nutrition_cleaned.pkl"


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


def build_engine() -> Engine:
    """
    Create a SQLAlchemy engine using environment variables.

    Required variables:
        DB_USER
        DB_PASSWORD
        DB_HOST
        DB_PORT
        DB_NAME
    """
    load_dotenv()

    required_variables = [
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
    ]

    missing_variables = [
        variable
        for variable in required_variables
        if not os.getenv(variable)
    ]

    if missing_variables:
        raise RuntimeError(
            "Missing required environment variables: "
            + ", ".join(missing_variables)
        )

    db_user = quote_plus(os.environ["DB_USER"])
    db_password = quote_plus(os.environ["DB_PASSWORD"])
    db_host = os.environ["DB_HOST"]
    db_port = os.environ["DB_PORT"]
    db_name = os.environ["DB_NAME"]

    database_url = (
        f"mysql+pymysql://{db_user}:{db_password}"
        f"@{db_host}:{db_port}/{db_name}"
        "?charset=utf8mb4"
    )

    return create_engine(
        database_url,
        pool_pre_ping=True,
        pool_recycle=3600,
    )


def convert_json(value: Any) -> str:
    """
    Convert list-like recipe fields into valid JSON strings.

    Unexpected values raise an error instead of being silently
    converted to an empty list.
    """
    if isinstance(value, np.ndarray):
        value = value.tolist()

    if value is None:
        value = []

    if isinstance(value, float) and pd.isna(value):
        value = []

    if not isinstance(value, list):
        raise ValueError(
            "Invalid JSON source value. "
            f"Expected list, got {type(value).__name__}: {value!r}"
        )

    return json.dumps(
        value,
        ensure_ascii=False,
    )


def validate_file_paths() -> None:
    """Ensure required PKL files exist before loading."""
    if not RECIPES_PATH.exists():
        raise FileNotFoundError(
            f"Recipes dataset not found: {RECIPES_PATH}"
        )

    if not NUTRITION_PATH.exists():
        raise FileNotFoundError(
            f"Nutrition dataset not found: {NUTRITION_PATH}"
        )


def validate_recipe_dataframe(recipes: pd.DataFrame) -> None:
    """Validate required recipe columns and primary keys."""
    required_columns = {
        "recipe_id",
        "name",
        "description",
        "ingredients",
        "ingredients_raw",
        "steps",
        "servings",
        "serving_size",
        "tags",
        "ingredient_count",
        "ingredient_raw_count",
        "step_count",
        "tag_count",
        "has_ingredients",
        "has_ingredients_raw",
        "has_steps",
        "has_tags",
    }

    missing_columns = required_columns - set(recipes.columns)

    if missing_columns:
        raise ValueError(
            "Recipes dataset is missing required columns: "
            f"{sorted(missing_columns)}"
        )

    if recipes["recipe_id"].isna().any():
        raise ValueError(
            "Recipes dataset contains NULL recipe_id values."
        )

    if recipes["recipe_id"].duplicated().any():
        duplicate_ids = (
            recipes.loc[
                recipes["recipe_id"].duplicated(),
                "recipe_id",
            ]
            .head(10)
            .tolist()
        )

        raise ValueError(
            "Recipes dataset contains duplicate recipe_id values. "
            f"Examples: {duplicate_ids}"
        )


def validate_nutrition_dataframe(
    nutrition: pd.DataFrame,
) -> None:
    """Validate required nutrition columns and primary keys."""
    required_columns = {
        "fdc_id",
        "food_name",
        "data_type",
        "calories",
    }

    missing_columns = required_columns - set(nutrition.columns)

    if missing_columns:
        raise ValueError(
            "Nutrition dataset is missing required columns: "
            f"{sorted(missing_columns)}"
        )

    if nutrition["fdc_id"].isna().any():
        raise ValueError(
            "Nutrition dataset contains NULL fdc_id values."
        )

    if nutrition["fdc_id"].duplicated().any():
        duplicate_ids = (
            nutrition.loc[
                nutrition["fdc_id"].duplicated(),
                "fdc_id",
            ]
            .head(10)
            .tolist()
        )

        raise ValueError(
            "Nutrition dataset contains duplicate fdc_id values. "
            f"Examples: {duplicate_ids}"
        )


def load_and_prepare_data() -> tuple[
    pd.DataFrame,
    pd.DataFrame,
]:
    """
    Load and validate trusted project PKL files.

    Warning:
        Pickle files may execute code during deserialization.
        Only load files created and verified by this project.
    """
    validate_file_paths()

    logger.info("Loading recipes dataset...")
    recipes = pd.read_pickle(RECIPES_PATH)

    logger.info("Loading nutrition dataset...")
    nutrition = pd.read_pickle(NUTRITION_PATH)

    recipes = recipes.rename(
        columns={"id": "recipe_id"}
    ).copy()

    validate_recipe_dataframe(recipes)
    validate_nutrition_dataframe(nutrition)

    logger.info("Converting recipe JSON columns...")

    for column in JSON_COLUMNS:
        recipes[column] = recipes[column].map(
            convert_json
        )

    logger.info(
        "Datasets loaded successfully. recipes=%s, nutrition=%s",
        len(recipes),
        len(nutrition),
    )

    return recipes, nutrition


def get_table_count(
    engine: Engine,
    table_name: str,
) -> int:
    """
    Return the row count for an approved table.

    Table names are allow-listed because SQL parameters cannot
    safely bind SQL identifiers.
    """
    allowed_tables = {
        "recipes",
        "nutrition",
    }

    if table_name not in allowed_tables:
        raise ValueError(
            f"Unsupported table name: {table_name}"
        )

    query = text(
        f"SELECT COUNT(*) FROM `{table_name}`"
    )

    with engine.connect() as connection:
        return int(
            connection.execute(query).scalar_one()
        )


def ensure_target_tables_are_empty(
    engine: Engine,
) -> None:
    """
    Prevent accidental duplicate imports into immutable tables.
    """
    recipe_count = get_table_count(
        engine,
        "recipes",
    )

    nutrition_count = get_table_count(
        engine,
        "nutrition",
    )

    if recipe_count > 0 or nutrition_count > 0:
        raise RuntimeError(
            "Import aborted because immutable target tables "
            "already contain data. "
            f"recipes={recipe_count}, "
            f"nutrition={nutrition_count}. "
            "Do not run this script on the current populated RDS "
            "database unless the tables are intentionally rebuilt."
        )


def import_dataframe(
    dataframe: pd.DataFrame,
    table_name: str,
    engine: Engine,
    batch_size: int = BATCH_SIZE,
) -> None:
    """
    Import a DataFrame using controlled batches.

    Each batch may commit independently. If a batch fails, the
    script stops and logs the failed row range.
    """
    logger.info(
        "Importing %s: %s rows",
        table_name,
        len(dataframe),
    )

    ranges = range(
        0,
        len(dataframe),
        batch_size,
    )

    for start in tqdm(
        ranges,
        desc=f"Importing {table_name}",
    ):
        end = min(
            start + batch_size,
            len(dataframe),
        )

        batch = dataframe.iloc[start:end]

        try:
            batch.to_sql(
                table_name,
                engine,
                if_exists="append",
                index=False,
                method="multi",
                chunksize=batch_size,
            )
        except SQLAlchemyError:
            logger.exception(
                "Failed importing %s rows %s to %s",
                table_name,
                start,
                end - 1,
            )
            raise

    logger.info(
        "%s imported successfully.",
        table_name,
    )


def verify_import(
    engine: Engine,
    expected_recipe_count: int,
    expected_nutrition_count: int,
) -> None:
    """Verify target row counts against source datasets."""
    actual_recipe_count = get_table_count(
        engine,
        "recipes",
    )

    actual_nutrition_count = get_table_count(
        engine,
        "nutrition",
    )

    logger.info("========== IMPORT RESULT ==========")
    logger.info(
        "Recipes: %s / expected %s",
        actual_recipe_count,
        expected_recipe_count,
    )
    logger.info(
        "Nutrition: %s / expected %s",
        actual_nutrition_count,
        expected_nutrition_count,
    )

    if actual_recipe_count != expected_recipe_count:
        raise RuntimeError(
            "Recipe import verification failed. "
            f"Expected {expected_recipe_count}, "
            f"got {actual_recipe_count}."
        )

    if actual_nutrition_count != expected_nutrition_count:
        raise RuntimeError(
            "Nutrition import verification failed. "
            f"Expected {expected_nutrition_count}, "
            f"got {actual_nutrition_count}."
        )

    logger.info(
        "Import verification completed successfully."
    )


def main() -> None:
    """
    Import immutable reference datasets into empty tables.

    This script is intended for controlled database initialization
    or rebuild only. It must not be run against the current populated
    RDS tables.
    """
    engine = build_engine()

    try:
        recipes, nutrition = load_and_prepare_data()

        ensure_target_tables_are_empty(engine)

        import_dataframe(
            recipes,
            "recipes",
            engine,
        )

        import_dataframe(
            nutrition,
            "nutrition",
            engine,
        )

        verify_import(
            engine,
            expected_recipe_count=len(recipes),
            expected_nutrition_count=len(nutrition),
        )

    finally:
        engine.dispose()


if __name__ == "__main__":
    main()