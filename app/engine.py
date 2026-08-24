import re
from .models import AnalysisResult, Formulation, Recommendation, RiskResult

KEYWORDS = {
    "anxiety/worry": ["worry", "anxious", "anxiety", "fear", "panic", "overthinking"],
    "low motivation": ["unmotivated", "motivation", "can't get started", "no energy", "withdraw"],
    "low self-esteem": ["not good enough", "worthless", "low confidence", "self-esteem", "failure"],
    "grief": ["died", "death", "bereavement", "grief", "lost my", "funeral"],
    "relationship conflict": ["husband", "wife", "partner", "relationship", "argument", "conflict"],
    "substance-use concern": ["alcohol", "drinking", "drug", "substance", "using again"],
    "trauma-related concerns": ["trauma", "abuse", "assault", "flashback", "nightmare"],
    "anger": ["angry", "anger", "rage", "irritable", "irritated"],
    "procrastination": ["procrastinate", "avoid", "put off", "can't start"],
    "career uncertainty": ["job", "career", "work", "employment", "interview"],
}

RISK_TERMS = {
    "urgent": ["suicide", "kill myself", "end my life", "homicide", "kill someone"],
    "high": ["self-harm", "overdose", "plan to die", "weapon", "immediate danger"],
    "moderate": ["hopeless", "unsafe", "abuse", "violence", "can't cope"],
}

class ClinicalEngine:
    def __init__(self, library):
        self.library = library

    def _text(self, c):
        return " ".join([
            c.presenting_case,
            *c.history, *c.goals, *c.context,
            *c.previous_interventions
        ]).lower()

    def detect_presentations(self, text):
        found = []
        for label, terms in KEYWORDS.items():
            if any(t in text for t in terms):
                found.append(label)
        return found or ["complex or mixed presentation"]

    def risk(self, case):
        text = self._text(case)
        flags = []
        level = "unknown"
        rank = {"unknown":0, "low":1, "moderate":2, "high":3, "urgent":4}
        for candidate, terms in RISK_TERMS.items():
            matched = [t for t in terms if t in text]
            if matched:
                flags.extend(matched)
                if rank[candidate] > rank[level]:
                    level = candidate

        # Explicit structured screening can raise or lower only after review.
        if case.risk_responses.get("immediate_danger") is True:
            level = "urgent"
            flags.append("structured screen: immediate danger")
        elif case.risk_responses.get("self_harm") is True and rank[level] < 3:
            level = "high"
            flags.append("structured screen: self-harm")

        rationale = ["Risk screening is preliminary and must be professionally reviewed."]
        if level == "urgent":
            rationale.append("Urgent safety indicators detected; do not proceed as though routine counselling is sufficient.")
        elif level == "high":
            rationale.append("High-risk indicators detected; safety assessment and professional escalation should precede routine intervention.")
        elif level == "moderate":
            rationale.append("Moderate concern indicators detected; clarify severity, context, protective factors and safety.")
        else:
            rationale.append("No high-risk keyword/structured flag was detected; absence of a flag does not establish safety.")

        return RiskResult(level=level, flags=flags, rationale=rationale)

    def formulate(self, case, presentations):
        text = self._text(case)
        presenting = presentations
        predisposing = [x for x in case.history if x.strip()][:5]
        precipitating = [x for x in case.context if x.strip()][:5]
        perpetuating = []
        if any(x in text for x in ["avoid", "withdraw", "procrastinate", "ruminat", "overthink"]):
            perpetuating.append("Avoidance, withdrawal or repetitive negative thinking may be maintaining distress.")
        if any(x in text for x in ["negative", "not good enough", "failure", "worthless"]):
            perpetuating.append("Negative self-appraisals may be maintaining distress.")
        protective = []
        if case.goals:
            protective.append("Client has articulated goals.")
        if any(x in text for x in ["family", "friend", "sister", "church", "community", "support"]):
            protective.append("Potential social/community support identified.")
        protective.extend(["Personal strengths and coping resources require further exploration."])

        formulation = (
            "Working counselling formulation: the presenting difficulties are being understood "
            "in relation to the client's reported thoughts, emotions, behaviours, context and "
            "protective resources. This is a hypothesis for professional review, not an automatic diagnosis."
        )
        return Formulation(
            presenting_problem=presenting,
            predisposing_factors=predisposing,
            precipitating_factors=precipitating,
            perpetuating_factors=perpetuating,
            protective_factors=protective,
            client_goals=case.goals,
            counselling_formulation=formulation
        )

    def recommend(self, presentations, case, risk):
        matched = []
        for lib in self.library:
            overlap = set(presentations) & set(lib["presentations"])
            if overlap:
                score = len(overlap)
                if case.counsellor_preferences and lib["approach"].lower() in " ".join(case.counsellor_preferences).lower():
                    score += 1
                matched.append((score, lib, overlap))

        matched.sort(key=lambda x: x[0], reverse=True)
        recs = []
        for _, lib, overlap in matched[:5]:
            reason = "Relevant to: " + ", ".join(sorted(overlap)) + "."
            if risk.level in ("high", "urgent"):
                reason += " Because risk is elevated, safety review should precede routine technique selection."
            recs.append(Recommendation(
                approach=lib["approach"],
                reason=reason,
                skills=lib["skills"],
                techniques=lib["techniques"],
                contraindications=lib["contraindications"],
                evidence_level=lib["evidence_level"],
                library_version=lib["version"],
            ))
        return recs

    def analyze(self, case):
        text = self._text(case)
        presentations = self.detect_presentations(text)
        risk = self.risk(case)
        formulation = self.formulate(case, presentations)

        emotional = []
        behavioural = []
        cognitive = []

        if any(x in text for x in ["sad", "empty", "grief", "anxious", "fear", "angry"]):
            emotional.append("Emotional distress is suggested by the client's language; clarify intensity, duration and functional impact.")
        if any(x in text for x in ["avoid", "withdraw", "procrastinate", "apply", "drink"]):
            behavioural.append("Avoidance, withdrawal or behaviour-change concerns may be present; assess function and context.")
        if any(x in text for x in ["not good enough", "failure", "worthless", "worry", "overthink"]):
            cognitive.append("Negative predictions, self-appraisals or repetitive worry may be relevant; explore rather than assume.")

        recommendations = self.recommend(presentations, case, risk)
        considerations = [
            "The system does not convert keywords into a diagnosis.",
            "Approach selection considers presentation, goals, context, risk and available library mappings.",
            "Counsellor approval is required before recommendations become part of the treatment plan.",
            "Contraindications and professional competence must be reviewed before using any technique.",
            "DSM-5-TR and ICD considerations, when required, should be completed by an appropriately qualified professional using the full assessment record."
        ]

        return AnalysisResult(
            client_id=case.client_id,
            presenting_problem=presentations,
            emotional_analysis=emotional,
            behavioural_analysis=behavioural,
            cognitive_analysis=cognitive,
            risk=risk,
            formulation=formulation,
            recommendations=recommendations,
            clinical_considerations=considerations,
            disclaimer="Clinical decision-support only. Not an autonomous therapist, diagnosis, emergency service, or substitute for qualified professional judgment."
        )
