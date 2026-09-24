# CamScout

CamScout is the local/open-source discovery sidecar for Camera Safety Notifier. It identifies likely camera/NVR services from **explicitly authorized network ranges** and exports metadata-only NDJSON that the browser app can import.

## Safety model

CamScout refuses targets outside an explicit allowlist, rejects IPv4 targets broader than /16 and IPv6 targets broader than /112, and caps each run at 65,536 addresses. It does not retrieve video/audio, enumerate RTSP media paths, attempt credentials, bypass authentication, exploit vulnerabilities, or send PTZ/device commands.

The built-in scan uses TCP connect scanning plus Nmap's `rtsp-methods` script, which Nmap categorizes as `safe`. It queries RTSP server capabilities rather than media URLs.

## Requirements

- Python 3.11+
- Nmap for `camscout scan`
- Optional ZGrab2 if you already collect authorized application-handshake data and want to import it

## Quick start

```bash
python -m pip install -e .

camscout plan \
  --targets examples/targets.txt \
  --allowlist examples/allowlist.txt

camscout scan \
  --targets examples/targets.txt \
  --allowlist examples/allowlist.txt \
  --output findings.ndjson
```

Then import `findings.ndjson` into the Camera Safety Notifier web app.

## Existing tool imports

```bash
camscout import-nmap --targets targets.txt --allowlist allowlist.txt --xml scan.xml --output findings.ndjson
camscout import-zgrab --targets targets.txt --allowlist allowlist.txt --ndjson zgrab.ndjson --output findings.ndjson
```

## Why not `rtsp-url-brute`?

CamScout intentionally does not use it. That Nmap script enumerates media paths. We only use metadata/service identification.
