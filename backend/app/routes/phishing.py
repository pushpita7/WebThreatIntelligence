
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, ScanHistory
from app.schemas.phishing import URLRequest
from app.services.phishing_detector import normalize_url, analyze_url

router = APIRouter()


@router.post("/scan/phishing")
def scan_phishing(
    request: URLRequest,
    db: Session = Depends(get_db)
):
    try:
        # Normalize the submitted URL.
        normalized_url, hostname, parsed = normalize_url(request.url)

        # Analyze the URL for phishing indicators.
        result = analyze_url(
            normalized_url,
            hostname,
            parsed
        )

        # Save scan results in SQLite.
        record = ScanHistory(
            original_url=request.url,
            normalized_url=normalized_url,
            hostname=hostname,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            findings=json.dumps(result["findings"])
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "scan_id": record.id,
            "original_url": request.url,
            "normalized_url": normalized_url,
            "hostname": hostname,
            "risk_score": result["risk_score"],
            "risk_level": result["risk_level"],
            "indicators": result["indicators"],
            "findings": result["findings"],
            "message": "Phishing analysis completed."
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
