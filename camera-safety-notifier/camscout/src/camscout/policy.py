from __future__ import annotations

import ipaddress
from dataclasses import dataclass
from pathlib import Path

MAX_TOTAL_ADDRESSES = 65_536
MIN_PREFIX_V4 = 16
MIN_PREFIX_V6 = 112


class PolicyError(ValueError):
    pass


@dataclass(frozen=True)
class TargetPlan:
    requested: tuple[ipaddress._BaseNetwork, ...]
    allowed_by: tuple[ipaddress._BaseNetwork, ...]
    address_count: int


def _parse_networks(path: str | Path) -> list[ipaddress._BaseNetwork]:
    nets: list[ipaddress._BaseNetwork] = []
    for lineno, raw in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        try:
            nets.append(ipaddress.ip_network(line, strict=False))
        except ValueError as e:
            raise PolicyError(f"{path}:{lineno}: invalid network {line!r}: {e}") from e
    if not nets:
        raise PolicyError(f"{path}: no networks found")
    return nets


def build_plan(target_file: str | Path, allowlist_file: str | Path) -> TargetPlan:
    targets = _parse_networks(target_file)
    allow = _parse_networks(allowlist_file)

    total = 0
    for target in targets:
        if target.version == 4 and target.prefixlen < MIN_PREFIX_V4:
            raise PolicyError(f"target {target} is too broad; IPv4 targets must be /{MIN_PREFIX_V4} or narrower")
        if target.version == 6 and target.prefixlen < MIN_PREFIX_V6:
            raise PolicyError(f"target {target} is too broad; IPv6 targets must be /{MIN_PREFIX_V6} or narrower")
        if not any(target.subnet_of(a) for a in allow if a.version == target.version):
            raise PolicyError(f"target {target} is not contained by the explicit allowlist")
        total += target.num_addresses
        if total > MAX_TOTAL_ADDRESSES:
            raise PolicyError(f"target set exceeds {MAX_TOTAL_ADDRESSES:,} addresses")

    return TargetPlan(tuple(targets), tuple(allow), total)


def assert_ip_allowed(ip: str, plan: TargetPlan) -> None:
    addr = ipaddress.ip_address(ip)
    if not any(addr in n for n in plan.requested):
        raise PolicyError(f"result IP {ip} is outside the requested target set")
