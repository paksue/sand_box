# Camera Safety Notifier

A privacy-first public-service tool for triaging **existing, authorized exposure metadata** about potentially Internet-accessible cameras/NVRs and routing a responsible notification to the party capable of fixing it.

## Hard boundary

This project is metadata-only. It intentionally contains **no functionality** to:

- open video streams or snapshots
- listen to camera audio
- try passwords/default credentials
- bypass authentication
- send PTZ/device commands
- exploit vulnerabilities
- enumerate private camera content
- actively scan random Internet hosts

The intended input is data obtained from legitimate/authorized exposure datasets, internal inventories, or synthetic fixtures.

## Fully client-side app

Live Pages build:

https://paksue.github.io/sand_box/previews/camera-safety-notifier/

Source:

- `client/index.html`
- `client/style.css`
- `client/app.js`

The app runs entirely in the browser and stores the working project in local browser storage. No backend is required.

### Operational workflow

1. Import authorized JSON/CSV metadata or enter a finding manually.
2. Run conservative local camera/NVR triage.
3. Resolve the responsible network/contact with supplied metadata or an explicit RDAP lookup.
4. Optionally open the organization's standard `/.well-known/security.txt` page.
5. Human-review the finding and verify the recipient.
6. Approve the disclosure.
7. Open the draft in the default mail app, Gmail, or Outlook.
8. Mark the notification sent.
9. Record later re-checks from authorized datasets.
10. Mark cases resolved or follow up if they remain exposed.

### Client features

- JSON and CSV import
- manual case creation/edit/delete
- conservative camera/NVR classification and confidence
- risk classification and routing
- one-IP-at-a-time RDAP ownership lookup, only when explicitly clicked
- security.txt helper for supplied organization domains
- contact verification gate
- human approval gate
- editable disclosure drafts
- default mail, Gmail, and Outlook compose handoff
- workflow states: new, reviewed, approved, notified, follow-up due, resolved
- re-check/remediation tracking
- per-case audit trail
- local persistence
- full JSON project backup/restore
- CSV export
- privacy-preserving aggregate public report export

## Python/FastAPI prototype

The earlier backend implementation remains under `src/camsafety` for architecture/testing work. It includes deterministic classification, notification routing, safety guardrails, FastAPI endpoints, and an advisory Laya/System-One adapter.

Run tests:

```bash
PYTHONPATH=src pytest -q
```

Run locally:

```bash
PYTHONPATH=src uvicorn camsafety.api:app --host 127.0.0.1 --port 8000
```

## Laya / System One

The browser app currently uses deterministic local triage rather than pretending to run Laya in JavaScript. The Python adapter keeps Laya advisory-only and excludes IP addresses and owner/contact data from model input. Any future browser model should be benchmarked and calibrated against labeled authorized/synthetic findings before it is allowed to influence routing.

## Privacy notes

- Exact findings stay in the local browser unless the operator explicitly exports them.
- RDAP sends only the selected IP address to the public RDAP service after confirmation.
- Opening security.txt sends the supplied public domain to that site in a normal browser navigation.
- Email buttons open a compose window; they do not silently send messages.
- The public-summary export intentionally excludes IP addresses, contacts, banners, and organization names.


## CamScout discovery sidecar

The open-source collector lives in `camscout/`. It performs bounded, metadata-only discovery on explicitly authorized target ranges and exports NDJSON for the browser app. The browser importer accepts `.ndjson`/`.jsonl`, JSON, and CSV.

Typical flow:

```text
authorized CIDRs -> CamScout -> findings.ndjson -> browser review -> RDAP/contact -> human approval -> notification -> later re-check
```

CamScout's built-in scan uses Nmap TCP connect scanning on a small camera-relevant port set plus the safe `rtsp-methods` script. Its policy rejects targets outside the explicit allowlist and caps one run at 65,536 addresses.
