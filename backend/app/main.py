
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app.routes.security import router as security_router
from app.routes.phishing import router as phishing_router
from app.routes.history import router as history_router

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


@app.get("/")
def home():
    return {"message": "WebThreat Intelligence API is running"}
