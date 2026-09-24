from __future__ import annotations

from typing import Iterable

CAMERA_HINTS = {
    "network camera": 0.55,
    "ip camera": 0.55,
    "onvif": 0.50,
    "rtsp": 0.22,
    "webcam": 0.35,
    "surveillance": 0.25,
    "nvr": 0.60,
    "dvr": 0.55,
    "network video recorder": 0.80,
}


def classify(port: int, *texts: Iterable[str]) -> tuple[float, list[str]]:
    text = " ".join(str(x or "") for x in texts).lower()
    score = 0.0
    reasons: list[str] = []
    for term, weight in CAMERA_HINTS.items():
        if term in text:
            score += weight
            reasons.append(f"metadata contains {term!r}")
    if port == 554:
        score += 0.20
        reasons.append("TCP/554 commonly carries RTSP")
    elif port == 8554:
        score += 0.14
        reasons.append("TCP/8554 commonly carries alternate RTSP")
    return min(score, 0.99), reasons
