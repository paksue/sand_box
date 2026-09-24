from __future__ import annotations

import json
from pathlib import Path

from .models import Finding


def write_ndjson(findings: list[Finding], path: str | Path, min_probability: float = 0.0) -> int:
    rows = [f.to_dict() for f in findings if f.camera_probability >= min_probability]
    Path(path).write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows), encoding="utf-8")
    return len(rows)
