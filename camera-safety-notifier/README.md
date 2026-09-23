# Camera Safety Notifier — V0/V1

A privacy-first public-service prototype for triaging **existing exposure metadata** about potentially Internet-accessible cameras/NVRs and routing a responsible notification to the party capable of fixing it.

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

The intended input is data obtained from legitimate/authorized exposure datasets or synthetic fixtures.

## V0/V1 features

- Pydantic data model for exposure findings and network owners
- conservative deterministic camera/NVR classifier
- routing to organization security, ISP, vendor, CERT coordination, or human review
- safety escalation queue that **never automatically contacts law enforcement**
- notification drafting with explicit non-access language
- FastAPI `/triage` endpoint
- guardrail tests for every prohibited action
- local Laya/System-One adapter matching the current typed-decisions API; model loading is optional
- benchmark metric helpers for calibration/accuracy experiments

## Browser demo

Static demo:

https://paksue.github.io/sand_box/previews/camera-safety-notifier/

The Pages demo mirrors deterministic triage logic using synthetic records only. It is not the production FastAPI service and makes no network calls.

## Run tests

```bash
PYTHONPATH=src pytest -q
```

## Run API locally

```bash
PYTHONPATH=src uvicorn camsafety.api:app --host 127.0.0.1 --port 8000
```

Use only localhost or another environment you control during development.

## AI / Laya integration plan

Laya is implemented as an **advisory-only** adapter using the `typed-decisions` checkpoint. The adapter deliberately excludes IP addresses and owner/contact data from model input. Benchmark it against labeled synthetic/authorized findings, calibrate its probabilities, and compare it with deterministic rules before enabling it in a workflow. Safety escalation and outbound notification remain policy-controlled and human-approved.
