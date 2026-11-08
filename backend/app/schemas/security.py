from pydantic import BaseModel
from typing import Optional


class SecurityRequest(BaseModel):
    url: str


class SecurityResponse(BaseModel):
    url: str
    https_available: bool
    ssl_valid: bool
    certificate_issuer: Optional[str] = None
    expiry_date: Optional[str] = None
    days_remaining: Optional[int] = None
    status: str
    error: Optional[str] = None