from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import ScanHistory
from .schemas import ScanHistoryCreate, ScanHistoryResponse


# Create API router
router = APIRouter()


# 1. Save a new scan
@router.post("/", response_model=ScanHistoryResponse)
def create_scan(
    scan: ScanHistoryCreate,
    db: Session = Depends(get_db)
):

    new_scan = ScanHistory(
        url=scan.url,
        risk_score=scan.risk_score,
        risk_level=scan.risk_level,
        is_phishing=scan.is_phishing,
        scan_details=scan.scan_details
    )

    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    return new_scan


# 2. Get all scan history
@router.get("/", response_model=list[ScanHistoryResponse])
def get_all_scans(db: Session = Depends(get_db)):

    scans = db.query(ScanHistory).order_by(
        ScanHistory.id.desc()
    ).all()

    return scans


# 3. Get one scan using its ID
@router.get("/{scan_id}", response_model=ScanHistoryResponse)
def get_scan_by_id(
    scan_id: int,
    db: Session = Depends(get_db)
):

    scan = db.query(ScanHistory).filter(
        ScanHistory.id == scan_id
    ).first()

    if scan is None:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    return scan