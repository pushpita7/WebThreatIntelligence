
from pydantic import BaseModel, Field


class URLRequest(BaseModel):
    url: str = Field(
        min_length=1,
        max_length=2048,
        description="Website URL to analyze"
    )
