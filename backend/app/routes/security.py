from fastapi import APIRouter, HTTPException
from app.schemas.security import SecurityRequest, SecurityResponse
from app.services.ssl_checker import check_website_security

router = APIRouter()


@router.post("/scan/security", response_model=SecurityResponse)
def scan_website_security(request: SecurityRequest):

    url = request.url.strip()

    if not url:
        raise HTTPException(
            status_code=400,
            detail="Website URL cannot be empty"
        )

    if len(url) > 2048:
        raise HTTPException(
            status_code=400,
            detail="Website URL is too long"
        )

    result = check_website_security(url)

    return result
