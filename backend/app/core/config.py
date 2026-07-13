from dotenv import load_dotenv
import os

load_dotenv()

required_env = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD"
]

for env in required_env:
    if not os.getenv(env):
        raise RuntimeError(
            f"Missing required environment variable: {env}"
        )

class Settings:
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

settings = Settings()
