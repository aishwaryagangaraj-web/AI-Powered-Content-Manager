from pydantic import BaseModel, Field


class ExportRequest(BaseModel):
    title: str = Field(default="Generated Content", max_length=200)
    text: str = Field(min_length=1)
