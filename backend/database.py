
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Location of the backend folder
BASE_DIR = Path(__file__).resolve().parent

# SQLite database file
DATABASE_URL = f"sqlite:///{(BASE_DIR / 'community_reports.db').as_posix()}"

# Create database connection
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for database tables
Base = declarative_base()
