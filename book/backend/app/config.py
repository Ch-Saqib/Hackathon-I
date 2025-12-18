# Physical AI Textbook Backend - Configuration
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Google Gemini Configuration (Required for RAG)
    gemini_api_key: str

    # Qdrant Vector Database (Required for RAG)
    qdrant_url: str
    qdrant_api_key: str

    # Neon PostgreSQL Database (Required for Auth)
    neon_database_url: str

    # Authentication Secret
    better_auth_secret: str

    # API Configuration
    api_base_url: str = "http://localhost:8000"

    # CORS Configuration
    frontend_url: str = "http://localhost:3000"
    github_pages_url: str = ""  # Set in production, e.g., "https://username.github.io"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
