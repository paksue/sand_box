from __future__ import annotations

from .classifier import classify_device, classify_risk
from .guardrails import SafeAction, authorize
from .models import ExposureFinding, NetworkOwner, TriageDecision
from .routing import choose_route


def triage_finding(finding: ExposureFinding, owner: NetworkOwner) -> TriageDecision:
    authorize(SafeAction.CLASSIFY_METADATA)
    device_type, confidence, classify_reasons = classify_device(finding)
    risk = classify_risk(finding, device_type, confidence)
    route, route_reasons = choose_route(finding, owner, risk)

    return TriageDecision(
        device_type=device_type,
        camera_confidence=confidence,
        risk=risk,
        route=route,
        rationale=classify_reasons + route_reasons,
        requires_human_approval=True,
    )
