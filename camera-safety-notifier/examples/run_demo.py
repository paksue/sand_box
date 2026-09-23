import json
from pathlib import Path

from camsafety.models import ExposureFinding, NetworkOwner
from camsafety.notifications import draft_notification
from camsafety.service import triage_finding

payload = json.loads((Path(__file__).parent / "synthetic_finding.json").read_text())
finding = ExposureFinding(**payload["finding"])
owner = NetworkOwner(**payload["owner"])
decision = triage_finding(finding, owner)

print(decision.model_dump_json(indent=2))
print("\n--- notification draft ---\n")
print(draft_notification(finding, owner, decision))
