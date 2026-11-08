
from datetime import datetime
from typing import Generator

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, Field
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import CommunityReport


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Community Threat Reporting API")


# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Data required when submitting a report
class ReportCreate(BaseModel):
    url: HttpUrl
    category: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=5, max_length=1000)


# Data returned by the API
class ReportResponse(BaseModel):
    id: int
    url: str
    category: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


# Home page
@app.get("/")
def home():
    return {"message": "Community Threat Reporting API is running!"}


# Submit a report
@app.post("/reports", response_model=ReportResponse, status_code=201)
def submit_report(report: ReportCreate, db: Session = Depends(get_db)):
    category = report.category.strip()

    allowed_categories = [
        "Phishing", "Scam", "Malware", "Spam", "Suspicious"
    ]

    if category not in allowed_categories:
        raise HTTPException(status_code=400, detail="Invalid threat category")

    if not report.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")

    new_report = CommunityReport(
        url=str(report.url),
        category=category,
        description=report.description.strip()
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


# Retrieve all reports
@app.get("/reports", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return (
        db.query(CommunityReport)
        .order_by(CommunityReport.id.desc())
        .all()
    )
