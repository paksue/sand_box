from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class Finding:
    ip: str
    port: int
    protocol: str = "tcp"
    service: str = "unknown"
    banner: str = ""
    vendor: str = ""
    model: str = ""
    source: str = "camscout"
    observed_at: str = ""
    camera_probability: float = 0.0
    reasons: list[str] | None = None
    metadata: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        if not d["observed_at"]:
            d["observed_at"] = utc_now()
        d["reasons"] = d["reasons"] or []
        d["metadata"] = d["metadata"] or {}
        return d
