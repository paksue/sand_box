from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from .policy import TargetPlan

SAFE_PORTS = (80, 443, 554, 8000, 8080, 8443, 8554)


class RunnerError(RuntimeError):
    pass


def _require(binary: str) -> str:
    path = shutil.which(binary)
    if not path:
        raise RunnerError(f"required tool {binary!r} was not found in PATH")
    return path


def write_nmap_target_file(plan: TargetPlan, path: str | Path) -> Path:
    p = Path(path)
    p.write_text("\n".join(str(n) for n in plan.requested) + "\n", encoding="utf-8")
    return p


def nmap_command(target_file: str | Path, output_xml: str | Path, rate: int = 50) -> list[str]:
    nmap = _require("nmap")
    ports = ",".join(map(str, SAFE_PORTS))
    return [
        nmap, "-sT", "-Pn", "-n", "--open", "-T2",
        "--max-rate", str(max(1, min(rate, 200))),
        "-p", ports,
        "--script", "rtsp-methods",
        "-iL", str(target_file),
        "-oX", str(output_xml),
    ]


def run_nmap(target_file: str | Path, output_xml: str | Path, rate: int = 50) -> None:
    cmd = nmap_command(target_file, output_xml, rate)
    subprocess.run(cmd, check=True)
