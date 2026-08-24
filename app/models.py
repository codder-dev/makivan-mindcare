from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class CaseInput(BaseModel):
    client_id: str
    presenting_case: str
    history: List[str] = Field(default_factory=list)
    goals: List[str] = Field(default_factory=list)
    context: List[str] = Field(default_factory=list)
    previous_interventions: List[str] = Field(default_factory=list)
    counsellor_preferences: List[str] = Field(default_factory=list)
    risk_responses: dict = Field(default_factory=dict)

class RiskResult(BaseModel):
    level: Literal["unknown", "low", "moderate", "high", "urgent"]
    flags: List[str] = Field(default_factory=list)
    rationale: List[str] = Field(default_factory=list)
    requires_professional_review: bool = True

class Formulation(BaseModel):
    presenting_problem: List[str]
    predisposing_factors: List[str]
    precipitating_factors: List[str]
    perpetuating_factors: List[str]
    protective_factors: List[str]
    client_goals: List[str]
    counselling_formulation: str

class Recommendation(BaseModel):
    approach: str
    reason: str
    skills: List[str]
    techniques: List[str]
    contraindications: List[str]
    evidence_level: str
    library_version: str
    counsellor_approval_required: bool = True

class AnalysisResult(BaseModel):
    client_id: str
    presenting_problem: List[str]
    emotional_analysis: List[str]
    behavioural_analysis: List[str]
    cognitive_analysis: List[str]
    risk: RiskResult
    formulation: Formulation
    recommendations: List[Recommendation]
    clinical_considerations: List[str]
    disclaimer: str

class ReviewDecision(BaseModel):
    case_id: str
    recommendation_index: int
    action: Literal["accept", "modify", "reject", "add_alternative"]
    modified_approach: Optional[str] = None
    modified_skills: List[str] = Field(default_factory=list)
    modified_techniques: List[str] = Field(default_factory=list)
    reviewer_id: str
    rationale: str
