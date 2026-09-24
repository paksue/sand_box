from __future__ import annotations

import json
import xml.etree.ElementTree as ET
from pathlib import Path

from .classifier import classify
from .models import Finding
from .policy import TargetPlan, assert_ip_allowed


def parse_nmap_xml(path: str | Path, plan: TargetPlan) -> list[Finding]:
    root = ET.parse(path).getroot()
    out: list[Finding] = []
    for host in root.findall("host"):
        addr = host.find("address")
        if addr is None or addr.attrib.get("addrtype") not in {"ipv4", "ipv6"}:
            continue
        ip = addr.attrib["addr"]
        assert_ip_allowed(ip, plan)
        for port_el in host.findall("./ports/port"):
            state = port_el.find("state")
            if state is None or state.attrib.get("state") != "open":
                continue
            port = int(port_el.attrib["portid"])
            svc = port_el.find("service")
            service = svc.attrib.get("name", "unknown") if svc is not None else "unknown"
            product = svc.attrib.get("product", "") if svc is not None else ""
            version = svc.attrib.get("version", "") if svc is not None else ""
            scripts = []
            for s in port_el.findall("script"):
                sid = s.attrib.get("id", "")
                output = s.attrib.get("output", "")
                if sid == "rtsp-methods":
                    scripts.append(output)
            banner = " | ".join(x for x in [product, version, *scripts] if x)
            probability, reasons = classify(port, service, product, version, *scripts)
            out.append(Finding(
                ip=ip,
                port=port,
                protocol=port_el.attrib.get("protocol", "tcp"),
                service=service,
                banner=banner,
                camera_probability=probability,
                reasons=reasons,
                metadata={"nmap_service": service, "rtsp_methods": scripts},
            ))
    return out


def parse_zgrab_ndjson(path: str | Path, plan: TargetPlan) -> list[Finding]:
    out: list[Finding] = []
    for lineno, raw in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        obj = json.loads(raw)
        ip = obj.get("ip") or obj.get("domain")
        if not ip:
            continue
        try:
            assert_ip_allowed(ip, plan)
        except ValueError as e:
            raise ValueError(f"{path}:{lineno}: {e}") from e
        data = obj.get("data", {})
        module_name = next(iter(data.keys()), "unknown")
        module = data.get(module_name, {}) or {}
        port = int(module.get("port") or 0)
        result = module.get("result") or {}
        banner_parts = []
        for key in ("banner", "server", "body", "status_line"):
            val = result.get(key)
            if isinstance(val, str) and val:
                banner_parts.append(val[:500])
        text = " | ".join(banner_parts)
        probability, reasons = classify(port, module_name, text)
        out.append(Finding(
            ip=ip,
            port=port,
            protocol="tcp",
            service=module_name,
            banner=text,
            camera_probability=probability,
            reasons=reasons,
            metadata={"zgrab_module": module_name, "status": module.get("status")},
        ))
    return out
