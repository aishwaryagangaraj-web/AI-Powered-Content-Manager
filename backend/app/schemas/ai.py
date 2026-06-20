from pydantic import BaseModel, Field, field_validator

from app.schemas.content import CONTENT_TYPES


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=10000)
    content_type: str = "general"
    tone: str = "professional"
    length: str = "medium"

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str) -> str:
        normalized = value.lower().strip()
        if normalized not in CONTENT_TYPES:
            raise ValueError("Unsupported content type")
        return normalized

    @field_validator("tone")
    @classmethod
    def clean_tone(cls, value: str) -> str:
        return value.strip()[:50] or "professional"

    @field_validator("length")
    @classmethod
    def validate_length(cls, value: str) -> str:
        normalized = value.lower().strip()
        if normalized not in {"short", "medium", "long"}:
            raise ValueError("length must be short, medium, or long")
        return normalized


class GenerateResponse(BaseModel):
    generated_text: str
    provider: str
