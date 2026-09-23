from __future__ import annotations

from .models import ExposureFinding, NetworkOwner, OwnerType, RiskLevel, Route


def choose_route(finding: ExposureFinding, owner: NetworkOwner, risk: RiskLevel) -> tuple[Route, list[str]]:
    reasons: list[str] = []

    if (
        finding.evidence.immediate_physical_danger
        or finding.evidence.possible_child_exploitation
        or finding.evidence.evidence_of_unauthorized_access
    ):
        reasons.append("Authorized evidence flag requires specialist safety/escalation review.")
        return Route.SAFETY_ESCALATION_REVIEW, reasons

    if finding.evidence.affects_multiple_vendors:
        reasons.append("Issue is marked as affecting multiple vendors; coordination review is appropriate.")
        return Route.CERT_COORDINATION, reasons

    if risk == RiskLevel.KNOWN_VULNERABILITY and owner.vendor_security_contact:
        reasons.append("Known vulnerability and a vendor security contact is available.")
        return Route.VENDOR_PSIRT, reasons

    if owner.owner_type == OwnerType.ORGANIZATION and owner.security_contact:
        reasons.append("Organization-owned asset with a security contact.")
        return Route.ORG_SECURITY, reasons

    if owner.owner_type == OwnerType.RESIDENTIAL and owner.abuse_contact:
        reasons.append("Residential subscriber; route through the ISP rather than identifying the resident.")
        return Route.ISP_ABUSE, reasons

    if owner.abuse_contact:
        reasons.append("Network abuse/security contact is the best available responsible party.")
        return Route.ISP_ABUSE, reasons

    reasons.append("No verified responsible-party contact is available.")
    return Route.HUMAN_REVIEW, reasons
