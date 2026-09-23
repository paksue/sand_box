from enum import Enum


class SafeAction(str, Enum):
    INGEST_METADATA = "ingest_metadata"
    CLASSIFY_METADATA = "classify_metadata"
    RESOLVE_CONTACT = "resolve_contact"
    DRAFT_NOTIFICATION = "draft_notification"
    PASSIVE_RECHECK_METADATA = "passive_recheck_metadata"


class ProhibitedAction(str, Enum):
    OPEN_VIDEO_STREAM = "open_video_stream"
    FETCH_SNAPSHOT = "fetch_snapshot"
    LISTEN_AUDIO = "listen_audio"
    TRY_CREDENTIALS = "try_credentials"
    BRUTE_FORCE = "brute_force"
    AUTH_BYPASS = "auth_bypass"
    SEND_PTZ_COMMAND = "send_ptz_command"
    EXPLOIT_VULNERABILITY = "exploit_vulnerability"
    ENUMERATE_PRIVATE_CONTENT = "enumerate_private_content"


class GuardrailViolation(RuntimeError):
    pass


def authorize(action: SafeAction | ProhibitedAction) -> None:
    if isinstance(action, ProhibitedAction):
        raise GuardrailViolation(
            f"Blocked prohibited action: {action.value}. This project is metadata-only."
        )
