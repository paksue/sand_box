from __future__ import annotations

from dataclasses import dataclass
from math import sqrt
from typing import Iterable


@dataclass(frozen=True)
class BinaryPrediction:
    expected: bool
    probability: float


@dataclass(frozen=True)
class BinaryMetrics:
    count: int
    accuracy_at_50: float
    brier_score: float
    root_mean_square_error: float


def binary_metrics(rows: Iterable[BinaryPrediction]) -> BinaryMetrics:
    data = list(rows)
    if not data:
        raise ValueError("At least one prediction is required")
    squared = [(r.probability - float(r.expected)) ** 2 for r in data]
    accuracy = sum((r.probability >= 0.5) == r.expected for r in data) / len(data)
    brier = sum(squared) / len(data)
    return BinaryMetrics(
        count=len(data),
        accuracy_at_50=accuracy,
        brier_score=brier,
        root_mean_square_error=sqrt(brier),
    )
