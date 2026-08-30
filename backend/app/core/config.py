import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "SAFRA"
    PROJECT_TAGLINE: str = "Catch the ₹ slipping before it disappears."
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Server & Port
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Database Settings (SQLite default, PostgreSQL compatible)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./safra.db")
    
    # Hugging Face Inference Settings for Gemma
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    HF_MODEL_ID: str = os.getenv("HF_MODEL_ID", "google/gemma-3-12b-it")
    
    # Groq API Fallback (Optional)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Production CORS Settings (Accepts local, Vercel preview & prod domains)
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://safra-frontend.vercel.app",
        "https://safra.vercel.app",
        "*"
    ]

    # ML Models artifact directory
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml", "artifacts")

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
