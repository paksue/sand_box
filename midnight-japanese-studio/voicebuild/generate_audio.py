#!/usr/bin/env python3
"""Build independent, male Japanese learning audio with open-weight Kokoro.

Runs in GitHub Actions. This creates the actual MP3s served by the static PWA.
No user data or external secret required. Model: hexgrad/Kokoro-82M;
voice: jm_kumo. See LICENSE-VOICE.md.
"""
from __future__ import annotations
import json
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "audio" / "male"
AUDIO.mkdir(parents=True, exist_ok=True)

def phrases_from_js():
    js = (
        "global.window=global;"
        "require('./data.js');"
        "console.log(JSON.stringify(global.MJ_CONTENT.phrases.map("
        "p=>({id:p.id,jp:p.jp}))));"
    )
    raw = subprocess.check_output(["node", "-e", js], cwd=ROOT, text=True)
    phrases = json.loads(raw)
    if not phrases or len(phrases) < 30:
        raise RuntimeError("Failed to load the expected lesson phrases")
    return phrases

def generate():
    samples = phrases_from_js()
    print("Starting Japanese Kokoro-82M male voice generator", flush=True)
    pipeline = KPipeline(lang_code="j", device="cpu")
    available = {}
    with tempfile.TemporaryDirectory() as scratch:
        scratch = Path(scratch)
        for idx, phrase in enumerate(samples, 1):
            slug = phrase["id"]
            if not slug.startswith("p") or not slug[1:].isdigit():
                raise RuntimeError(f"Invalid phrase id {slug!r}")
            target = AUDIO / f"{slug}.mp3"
            print(f"[{idx:02d}/{len(samples)}] {slug}: {phrase['jp']}", flush=True)
            chunks = []
            # Japanese original orthography preserves natural phrasing. G2P handled by misaki[ja].
            for result in pipeline(phrase["jp"], voice="jm_kumo", speed=0.91):
                audio = result.audio
                if hasattr(audio, "detach"):
                    audio = audio.detach().cpu().numpy()
                audio = np.asarray(audio, dtype=np.float32).reshape(-1)
                if len(audio):
                    chunks.append(audio)
            if not chunks:
                raise RuntimeError(f"Model returned no speech for {slug}")
            speech = np.concatenate(chunks)
            if len(speech) < 2500 or not np.isfinite(speech).all():
                raise RuntimeError(f"Unusable audio for {slug}")
            duration = len(speech) / 24000
            if not 0.18 < duration < 60:
                raise RuntimeError(f"Unexpected duration for {slug}: {duration}")
            # Leave a tiny clean margin before/after a phrase for shadowing.
            pcm = np.concatenate([np.zeros(2400, dtype=np.float32), speech, np.zeros(4800, dtype=np.float32)])
            temp = scratch / f"{slug}.wav"
            sf.write(temp, pcm, 24000)
            subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
                            "-y", "-i", str(temp), "-ac", "1", "-ar", "24000",
                            "-c:a", "libmp3lame", "-q:a", "4", str(target)], check=True)
            if target.stat().st_size < 1000:
                raise RuntimeError(f"Encoded audio too small: {target}")
            available[slug] = {"file": f"./audio/male/{slug}.mp3", "seconds": round(duration, 2)}
    manifest = {
        "format": 1, "engine": "Kokoro-82M", "voice": "jm_kumo",
        "kind": "pre-generated masculine Japanese synthetic voice",
        "model": "https://huggingface.co/hexgrad/Kokoro-82M",
        "phrases": available,
    }
    (AUDIO / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(f"Generated {len(available)} licensed male Japanese MP3s", flush=True)

if __name__ == "__main__":
    generate()
