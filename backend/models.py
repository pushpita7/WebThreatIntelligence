
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone

from .database import Base


class CommunityReport(Base):
    __tablename__ = "community_reports"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
