# Counselling Clinical Engine

A clinician-in-the-loop counselling platform implementing the requested workflow:

CLIENT PRESENTS CASE
→ INTAKE + HISTORY
→ PRESENTING PROBLEM
→ EMOTIONAL / BEHAVIOURAL / COGNITIVE ANALYSIS
→ RISK & SAFETY SCREENING
→ CASE FORMULATION
→ SELECT APPROPRIATE COUNSELLING APPROACH
→ SELECT COUNSELLING SKILLS
→ SELECT TECHNIQUES / INTERVENTIONS
→ GUIDED COUNSELLING SESSION
→ REASSESS CLIENT RESPONSE
→ ADJUST INTERVENTION
→ SESSION SUMMARY
→ PROFESSIONAL REVIEW
→ REPORT + FOLLOW-UP PLAN

## Safety boundary

This prototype is a decision-support system, not an autonomous therapist, diagnostician, or emergency service. Recommendations are suggestions for qualified counsellor review. The counsellor can Accept, Modify, Reject, or Add an alternative approach.

The clinical library stores evidence level, source attribution, contraindications, versioning, and approval state. Risk flags are surfaced before intervention selection.

## Run

Requires Python 3.10+.

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs for the API.

## Example

POST `/api/v1/cases/analyze` with the JSON in `examples/analyze_case.json`.

This is an intentionally transparent rules-based baseline. A production AI layer can later be added behind the same interfaces without changing the clinical workflow.
