from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path

from .exporter import write_ndjson
from .parsers import parse_nmap_xml, parse_zgrab_ndjson
from .policy import PolicyError, build_plan
from .runner import RunnerError, run_nmap, write_nmap_target_file


def cmd_plan(args):
    plan = build_plan(args.targets, args.allowlist)
    print(json.dumps({"targets": [str(x) for x in plan.requested], "addresses": plan.address_count}, indent=2))


def cmd_scan(args):
    plan = build_plan(args.targets, args.allowlist)
    with tempfile.TemporaryDirectory(prefix="camscout-") as td:
        tf = write_nmap_target_file(plan, Path(td)/"targets.txt")
        xml = Path(td)/"nmap.xml"
        run_nmap(tf, xml, args.rate)
        findings = parse_nmap_xml(xml, plan)
    count = write_ndjson(findings, args.output, args.min_probability)
    print(f"wrote {count} findings to {args.output}")


def cmd_import_nmap(args):
    plan = build_plan(args.targets, args.allowlist)
    findings = parse_nmap_xml(args.xml, plan)
    count = write_ndjson(findings, args.output, args.min_probability)
    print(f"wrote {count} findings to {args.output}")


def cmd_import_zgrab(args):
    plan = build_plan(args.targets, args.allowlist)
    findings = parse_zgrab_ndjson(args.ndjson, plan)
    count = write_ndjson(findings, args.output, args.min_probability)
    print(f"wrote {count} findings to {args.output}")


def parser():
    p=argparse.ArgumentParser(prog="camscout",description="Authorized metadata-only camera exposure collector")
    sub=p.add_subparsers(dest="cmd",required=True)
    def common(x):
        x.add_argument("--targets",required=True,help="file containing explicit target IPs/CIDRs")
        x.add_argument("--allowlist",required=True,help="file containing networks you are authorized to assess")
        x.add_argument("--output",default="findings.ndjson")
        x.add_argument("--min-probability",type=float,default=0.30)
    q=sub.add_parser("plan",help="validate targets against the authorization policy");q.add_argument("--targets",required=True);q.add_argument("--allowlist",required=True);q.set_defaults(func=cmd_plan)
    q=sub.add_parser("scan",help="perform a bounded safe Nmap metadata scan");common(q);q.add_argument("--rate",type=int,default=50,help="max connection attempts/sec, capped at 200");q.set_defaults(func=cmd_scan)
    q=sub.add_parser("import-nmap",help="convert existing Nmap XML into CamScout findings");common(q);q.add_argument("--xml",required=True);q.set_defaults(func=cmd_import_nmap)
    q=sub.add_parser("import-zgrab",help="convert existing ZGrab2 NDJSON into CamScout findings");common(q);q.add_argument("--ndjson",required=True);q.set_defaults(func=cmd_import_zgrab)
    return p


def main(argv=None):
    args=parser().parse_args(argv)
    try:
        args.func(args)
    except (PolicyError,RunnerError,ValueError) as e:
        print(f"error: {e}",file=sys.stderr)
        return 2
    return 0


if __name__=="__main__":
    raise SystemExit(main())
