from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.security import router as security_router

app = FastAPI(
    title="Web Threat Intelligence API",
    description="Website SSL and security assessment",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    security_router,
    prefix="/api",
    tags=["Website Security"]
)

@app.get("/")
def home():
    return {"message": "Web Threat Intelligence API is running"}