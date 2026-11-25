import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_env_path = os.path.join(_backend_dir, ".env")
_default_db_path = os.path.join(_backend_dir, "casely.db").replace("\\", "/")
_default_db_url = f"sqlite+aiosqlite:///{_default_db_path}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_env_path if os.path.exists(_env_path) else ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # App
    APP_NAME: str = "Casely"
    ENVIRONMENT: str = "development"

    # Database — default to aiosqlite for zero-config demonstration
    DATABASE_URL: str = _default_db_url

    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USERNAME: str = "neo4j"
    NEO4J_PASSWORD: str = "casely_neo4j_pass"

    # Qdrant
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""

    # Auth / JWT
    JWT_SECRET: str = "changeme_very_long_random_string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Gemini
    GEMINI_API_KEY: str = ""

    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",")]


settings = Settings()
