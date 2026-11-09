from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
import json

from app.database import get_db, ScanHistory

router = APIRouter()


@router.get("/history")
def get_scan_history(db: Session = Depends(get_db)):

    records = (
        db.query(ScanHistory)
        .order_by(desc(ScanHistory.scanned_at))
        .all()
    )

    history = []

    for record in records:
        history.append({
            "id": record.id,
            "original_url": record.original_url,
            "normalized_url": record.normalized_url,
            "hostname": record.hostname,
            "risk_score": record.risk_score,
            "risk_level": record.risk_level,
            "findings": json.loads(record.findings),
            "scanned_at": record.scanned_at.isoformat()
        })

    return {
        "success": True,
        "total_scans": len(history),
        "history": history
    }