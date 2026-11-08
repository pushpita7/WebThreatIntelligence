from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


# Data received when a new scan is saved
class ScanHistoryCreate(BaseModel):

    url: str
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    is_phishing: Optional[bool] = None
    scan_details: Optional[str] = None


# Data returned when scan history is displayed
class ScanHistoryResponse(BaseModel):

    id: int
    url: str
    scanned_at: datetime
    risk_score: Optional[int] = None
    risk_level: Optional[str] = None
    is_phishing: Optional[bool] = None
    scan_details: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)