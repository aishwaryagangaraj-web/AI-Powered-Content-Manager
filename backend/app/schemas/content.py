from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


CONTENT_TYPES = {"blog", "linkedin", "instagram", "email", "resume", "seo", "product", "youtube", "general"}


class ContentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content_type: str
    prompt: str = Field(min_length=1)
    generated_text: str = Field(min_length=1)
    is_favorite: bool = False
    is_archived: bool = False

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str) -> str:
        normalized = value.lower().strip()
        if normalized not in CONTENT_TYPES:
            raise ValueError(f"content_type must be one of: {', '.join(sorted(CONTENT_TYPES))}")
        return normalized


class ContentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content_type: str | None = None
    prompt: str | None = None
    generated_text: str | None = None
    is_favorite: bool | None = None
    is_archived: bool | None = None

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.lower().strip()
        if normalized not in CONTENT_TYPES:
            raise ValueError(f"content_type must be one of: {', '.join(sorted(CONTENT_TYPES))}")
        return normalized


class ContentResponse(ContentCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PaginatedContents(BaseModel):
    items: list[ContentResponse]
    total: int
    page: int
    page_size: int
