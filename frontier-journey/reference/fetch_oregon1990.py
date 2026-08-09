#!/usr/bin/env python3
import json
import pathlib
import sys
import urllib.parse
import urllib.request

metadata_path = pathlib.Path(sys.argv[1])
out_path = pathlib.Path(sys.argv[2])
meta = json.loads(metadata_path.read_text())
identifier = meta.get('metadata', {}).get('identifier', 'msdos_Oregon_Trail_The_1990')
files = meta.get('files', [])

# Preserve a compact manifest for reproducibility.
manifest = []
for f in files:
    manifest.append({k: f.get(k) for k in ('name', 'source', 'format', 'size', 'md5', 'sha1') if f.get(k) is not None})
(metadata_path.parent / 'archive-files.json').write_text(json.dumps(manifest, indent=2))

candidates = []
for f in files:
    name = f.get('name', '')
    lower = name.lower()
    if not lower.endswith('.zip'):
        continue
    if any(token in lower for token in ('screenshots', 'thumb', 'torrent', 'metadata')):
        continue
    score = 0
    if f.get('source') == 'original': score += 20
    if 'oregon' in lower: score += 8
    if '1990' in lower: score += 4
    if f.get('format') in ('ZIP', 'Unknown'): score += 2
    try:
        size = int(f.get('size', 0))
    except Exception:
        size = 0
    # A DOS game bundle should be reasonably small; prefer plausible game archives.
    if 50_000 <= size <= 20_000_000: score += 5
    candidates.append((score, size, name))

if not candidates:
    print('No ZIP candidate found. Available files:', file=sys.stderr)
    for row in manifest:
        print(row, file=sys.stderr)
    raise SystemExit(2)

candidates.sort(reverse=True)
score, size, name = candidates[0]
url = f"https://archive.org/download/{urllib.parse.quote(identifier)}/{urllib.parse.quote(name)}"
print(f"Selected archive: {name} ({size} bytes, score={score})")
print(f"Download URL: {url}")
out_path.parent.mkdir(parents=True, exist_ok=True)
with urllib.request.urlopen(url, timeout=90) as response, out_path.open('wb') as out:
    while True:
        chunk = response.read(1024 * 1024)
        if not chunk:
            break
        out.write(chunk)
print(f"Downloaded {out_path.stat().st_size} bytes to {out_path}")
(metadata_path.parent / 'selected-archive.txt').write_text(f"{name}\n{url}\n")
