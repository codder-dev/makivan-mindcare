from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import CaseInput, AnalysisResult, ReviewDecision
from .engine import ClinicalEngine
from .library import LIBRARY

app = FastAPI(
    title="Counselling Clinical Engine",
    version="1.0.0",
    description="Clinician-in-the-loop counselling decision-support prototype."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ClinicalEngine(LIBRARY)

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "service": "counselling-clinical-engine"}

@app.get("/api/v1/library")
def library():
    return LIBRARY

@app.post("/api/v1/cases/analyze", response_model=AnalysisResult)
def analyze(case: CaseInput):
    return engine.analyze(case)

@app.post("/api/v1/cases/review")
def review(decision: ReviewDecision):
    return {
        "status": "recorded",
        "decision": decision.model_dump(),
        "message": "Professional review decision recorded. No recommendation is activated automatically."
    }
