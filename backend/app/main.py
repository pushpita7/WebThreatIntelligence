
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app import models
from app.routes.security import router as security_router
from app.routes.phishing import router as phishing_router
from app.routes.history import router as history_router

from datetime import datetime
from typing import Generator

from fastapi import Depends, HTTPException
from pydantic import BaseModel, HttpUrl, Field
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import CommunityReport

app = FastAPI(
    title="Web Threat Intelligence API",
    description="Website security, phishing detection, and scan history",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize shared SQLite database.
create_tables()

# SSL security module.
app.include_router(
    security_router,
    prefix="/api",
    tags=["Website Security"]
)

# Phishing detection module.
app.include_router(
    phishing_router,
    prefix="/api",
    tags=["Phishing Detection"]
)

# Scan history module.
app.include_router(
    history_router,
    prefix="/api",
    tags=["Scan History"]
)


@app.get("/", tags=["Community Threat Reporting"])
def home():
    return {"message": "WebThreat Intelligence API is running"}

# Community Threat Reporting

class ReportCreate(BaseModel):
    url: HttpUrl
    category: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=5, max_length=1000)


class ReportResponse(BaseModel):
    id: int
    url: str
    category: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


def get_report_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post(
    "/reports",
    response_model=ReportResponse,
    status_code=201,
    tags=["Community Threat Reporting"]
)
def submit_report(
    report: ReportCreate,
    db: Session = Depends(get_report_db)
):
    category = report.category.strip()

    allowed_categories = [
        "Phishing", "Scam", "Malware", "Spam", "Suspicious"
    ]

    if category not in allowed_categories:
        raise HTTPException(
            status_code=400,
            detail="Invalid threat category"
        )

    if not report.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description cannot be empty"
        )

    new_report = CommunityReport(
        url=str(report.url),
        category=category,
        description=report.description.strip()
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@app.get(
    "/reports",
    response_model=list[ReportResponse],
    tags=["Community Threat Reporting"]
)
def get_reports(db: Session = Depends(get_report_db)):
    return (
        db.query(CommunityReport)
        .order_by(CommunityReport.id.desc())
        .all()
    )

