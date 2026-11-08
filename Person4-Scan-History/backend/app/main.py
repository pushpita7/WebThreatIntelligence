from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .history import router as history_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Web Threat Detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(
    history_router,
    prefix="/history",
    tags=["Scan History"]
)

@app.get("/")
def home():
    return {
        "message": "AI Web Threat Detection API is running!"
    }