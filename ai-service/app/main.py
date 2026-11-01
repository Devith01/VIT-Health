from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, ai_intelligence, outbreak

app = FastAPI(
    title="VIT-Health AI Health Intelligence Engine",
    description="Disease Prediction, Severity Classification, NLP Symptom Extraction, and Time-Series Outbreak Prediction microservice Proposed for VTOP.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(ai_intelligence.router)
app.include_router(outbreak.router)

@app.get("/")
def root():
    return {
        "service": "VIT-Health AI Engine",
        "status": "running",
        "docs": "/docs"
    }
