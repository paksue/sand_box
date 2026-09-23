from __future__ import annotations

from .models import ExposureFinding, NetworkOwner, TriageDecision


def draft_notification(finding: ExposureFinding, owner: NetworkOwner, decision: TriageDecision) -> str:
    org = owner.organization or "your network"
    return (
        f"Security notification regarding {org}\n\n"
        f"Our public-service project received metadata indicating that a service at "
        f"{finding.ip}:{finding.port} was publicly reachable at {finding.observed_at.isoformat()}. "
        f"The metadata is consistent with a {decision.device_type.value.replace('_', ' ')} "
        f"(confidence {decision.camera_confidence:.0%}).\n\n"
        "We did not view video or audio, attempt credentials, bypass authentication, "
        "or send commands to the device. Please verify whether this Internet exposure is intended "
        "and, if not, restrict access and review the device/vendor security guidance.\n\n"
        f"Reference: {finding.finding_id}\n"
    )
