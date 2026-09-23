from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

from .models import ExposureFinding


@dataclass(frozen=True)
class AITriageSuggestion:
    camera_probability: float
    suggested_label: str
    needs_human_review_probability: float
    raw: dict[str, Any] | None = None


class TriageModel(ABC):
    """Advisory classifier interface.

    AI output must never directly trigger law-enforcement contact, credential
    testing, exploitation, or camera-content access.
    """

    @abstractmethod
    def suggest(self, finding: ExposureFinding) -> AITriageSuggestion:
        raise NotImplementedError


class LayaAdapter(TriageModel):
    """Local Laya/System-One adapter.

    The adapter intentionally omits the finding IP address from the model state:
    the model only needs service/device metadata for classification.
    """

    MODEL_ID = "convaiinnovations/laya"
    SUBFOLDER = "typed-decisions"

    QUESTIONS = {
        "is_camera": {
            "type": "noul",
            "instructions": (
                "Does this service metadata most likely describe an IP camera, webcam, "
                "NVR, or DVR rather than an unrelated network service?"
            ),
        },
        "device_type": {
            "type": "choice",
            "instructions": "Which device category best matches this service metadata?",
            "criteria": {
                "camera": "IP/network camera or camera service",
                "nvr_dvr": "network/digital video recorder",
                "webcam_server": "webcam streaming/server software",
                "other_iot": "other Internet-connected embedded/IoT device",
                "unknown": "insufficient or conflicting evidence",
            },
        },
        "needs_human_review": {
            "type": "noul",
            "instructions": (
                "Is this metadata ambiguous enough that a human security reviewer should "
                "inspect the metadata before any notification is sent?"
            ),
        },
    }

    def __init__(self, agent: Any | None = None):
        self._agent = agent

    def _load(self) -> Any:
        if self._agent is not None:
            return self._agent
        try:
            import laya  # type: ignore
        except ImportError as exc:
            raise RuntimeError(
                "Laya is not installed. Install it only in an environment where the model "
                "weights can be downloaded/stored locally, then benchmark it before use."
            ) from exc
        self._agent = laya.load(self.MODEL_ID, subfolder=self.SUBFOLDER)
        return self._agent

    @staticmethod
    def _state(finding: ExposureFinding) -> dict[str, Any]:
        return {
            "port": finding.port,
            "protocol": finding.protocol,
            "service_name": finding.service_name,
            "banner": finding.banner,
            "vendor": finding.vendor,
            "model": finding.model,
            "tags": finding.tags,
        }

    def suggest(self, finding: ExposureFinding) -> AITriageSuggestion:
        result = self._load().predict(self._state(finding), self.QUESTIONS)
        answers = result["answers"]
        return AITriageSuggestion(
            camera_probability=float(answers["is_camera"]["noul"]),
            suggested_label=str(answers["device_type"]["choice"]),
            needs_human_review_probability=float(answers["needs_human_review"]["noul"]),
            raw=result,
        )
