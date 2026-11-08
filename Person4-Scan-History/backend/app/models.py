from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from datetime import datetime

from .database import Base


class ScanHistory(Base):

    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String(2048), nullable=False)

    scanned_at = Column(DateTime, default=datetime.utcnow)

    risk_score = Column(Integer, nullable=True)

    risk_level = Column(String(50), nullable=True)

    is_phishing = Column(Boolean, nullable=True)

    scan_details = Column(Text, nullable=True)