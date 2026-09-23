from __future__ import annotations

import re

from .models import DeviceType, ExposureFinding, RiskLevel


CAMERA_TERMS = {
    "camera": 0.35,
    "ipcam": 0.45,
    "network camera": 0.55,
    "onvif": 0.50,
    "rtsp": 0.25,
    "hikvision": 0.45,
    "dahua": 0.45,
    "axis": 0.40,
    "amcrest": 0.45,
    "reolink": 0.45,
    "foscam": 0.45,
}

NVR_TERMS = ("nvr", "dvr", "network video recorder", "digital video recorder")
WEBCAM_TERMS = ("webcam", "web camera")


def _normalized_text(finding: ExposureFinding) -> str:
    values = [
        finding.protocol,
        finding.service_name or "",
        finding.banner or "",
        finding.vendor or "",
        finding.model or "",
        " ".join(finding.tags),
    ]
    return re.sub(r"\s+", " ", " ".join(values)).lower()


def classify_device(finding: ExposureFinding) -> tuple[DeviceType, float, list[str]]:
    text = _normalized_text(finding)
    reasons: list[str] = []

    if any(term in text for term in NVR_TERMS):
        reasons.append("Metadata contains an NVR/DVR identifier.")
        return DeviceType.NVR_DVR, 0.95, reasons

    if any(term in text for term in WEBCAM_TERMS):
        reasons.append("Metadata contains a webcam identifier.")
        return DeviceType.WEBCAM_SERVER, 0.90, reasons

    score = 0.0
    for term, weight in CAMERA_TERMS.items():
        if term in text:
            score += weight
            reasons.append(f"Metadata matched camera indicator: {term!r}.")

    if finding.port == 554:
        score += 0.20
        reasons.append("Port 554 is commonly associated with RTSP; this is not camera proof by itself.")

    score = min(score, 0.99)
    if score >= 0.60:
        return DeviceType.CAMERA, score, reasons
    if score >= 0.25:
        reasons.append("Evidence is suggestive but insufficient for automatic camera classification.")
        return DeviceType.UNKNOWN, score, reasons

    reasons.append("Metadata lacks strong camera-specific indicators.")
    return DeviceType.UNKNOWN, score, reasons


def classify_risk(finding: ExposureFinding, device_type: DeviceType, confidence: float) -> RiskLevel:
    if finding.evidence.known_vulnerability:
        return RiskLevel.KNOWN_VULNERABILITY
    if device_type in {DeviceType.CAMERA, DeviceType.NVR_DVR, DeviceType.WEBCAM_SERVER} and confidence >= 0.80:
        return RiskLevel.PROBABLE_MISCONFIGURATION
    if confidence >= 0.25:
        return RiskLevel.REACHABLE
    return RiskLevel.MANUAL_REVIEW
