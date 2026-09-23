from fastapi import FastAPI
from pydantic import BaseModel

from .models import ExposureFinding, NetworkOwner, TriageDecision
from .notifications import draft_notification
from .service import triage_finding

app = FastAPI(
    title="Camera Safety Notifier",
    version="0.1.0",
    description="Metadata-only triage; no camera-feed access or active scanning.",
)


class TriageRequest(BaseModel):
    finding: ExposureFinding
    owner: NetworkOwner


class TriageResponse(BaseModel):
    decision: TriageDecision
    draft_notification: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "metadata-only"}


@app.post("/triage", response_model=TriageResponse)
def triage(req: TriageRequest) -> TriageResponse:
    decision = triage_finding(req.finding, req.owner)
    return TriageResponse(
        decision=decision,
        draft_notification=draft_notification(req.finding, req.owner, decision),
    )
