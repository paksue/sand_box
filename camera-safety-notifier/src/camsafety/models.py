from __future__ import annotations

from datetime import datetime
from enum import Enum
from ipaddress import ip_address
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class OwnerType(str, Enum):
    ORGANIZATION = "organization"
    RESIDENTIAL = "residential"
    UNKNOWN = "unknown"


class DeviceType(str, Enum):
    CAMERA = "camera"
    NVR_DVR = "nvr_dvr"
    WEBCAM_SERVER = "webcam_server"
    OTHER_IOT = "other_iot"
    UNKNOWN = "unknown"


class RiskLevel(str, Enum):
    REACHABLE = "reachable"
    PROBABLE_MISCONFIGURATION = "probable_misconfiguration"
    KNOWN_VULNERABILITY = "known_vulnerability"
    MANUAL_REVIEW = "manual_review"


class Route(str, Enum):
    ORG_SECURITY = "organization_security"
    ISP_ABUSE = "isp_abuse_or_security"
    VENDOR_PSIRT = "vendor_psirt"
    CERT_COORDINATION = "cert_coordination"
    HUMAN_REVIEW = "human_review"
    SAFETY_ESCALATION_REVIEW = "safety_escalation_review"


class EvidenceFlags(BaseModel):
    known_vulnerability: bool = False
    affects_multiple_vendors: bool = False
    evidence_of_unauthorized_access: bool = False
    immediate_physical_danger: bool = False
    possible_child_exploitation: bool = False


class ExposureFinding(BaseModel):
    finding_id: str = Field(min_length=3, max_length=100)
    observed_at: datetime
    source: Literal["shadowserver", "censys", "shodan_export", "authorized_dataset", "synthetic"]
    ip: str
    port: int = Field(ge=1, le=65535)
    protocol: str = Field(min_length=1, max_length=32)
    service_name: str | None = Field(default=None, max_length=100)
    banner: str | None = Field(default=None, max_length=2000)
    vendor: str | None = Field(default=None, max_length=200)
    model: str | None = Field(default=None, max_length=200)
    tags: list[str] = Field(default_factory=list, max_length=50)
    evidence: EvidenceFlags = Field(default_factory=EvidenceFlags)

    @field_validator("ip")
    @classmethod
    def valid_ip(cls, value: str) -> str:
        ip_address(value)
        return value


class NetworkOwner(BaseModel):
    owner_type: OwnerType = OwnerType.UNKNOWN
    organization: str | None = None
    asn: str | None = None
    abuse_contact: str | None = None
    security_contact: str | None = None
    vendor_security_contact: str | None = None


class TriageDecision(BaseModel):
    device_type: DeviceType
    camera_confidence: float = Field(ge=0, le=1)
    risk: RiskLevel
    route: Route
    rationale: list[str]
    requires_human_approval: bool = True
    content_accessed: bool = False
    credentials_attempted: bool = False
    device_commands_sent: bool = False
