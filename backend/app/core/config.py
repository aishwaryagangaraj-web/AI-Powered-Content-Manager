from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI-Powered Content Manager"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./content_manager.db"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"
    groq_api_key: str | None = None
    gemini_api_key: str | None = None
    ai_provider: str = "demo"
    frontend_url: str = "http://localhost:5173"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    cors_origin_regex: str | None = r"https://.*\.vercel\.app"

    @property
    def allowed_origins(self) -> list[str]:
        configured = [origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()]
        configured.append(self.frontend_url.strip().rstrip("/"))
        return list(dict.fromkeys(configured))

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
