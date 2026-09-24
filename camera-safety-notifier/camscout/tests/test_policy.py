from pathlib import Path
import pytest
from camscout.policy import build_plan, PolicyError


def w(tmp_path: Path,name: str,text: str)->Path:
    p=tmp_path/name;p.write_text(text);return p


def test_target_must_be_allowed(tmp_path):
    t=w(tmp_path,"targets.txt","192.0.2.0/28\n")
    a=w(tmp_path,"allow.txt","192.0.2.0/24\n")
    p=build_plan(t,a)
    assert p.address_count==16


def test_reject_outside_allowlist(tmp_path):
    t=w(tmp_path,"targets.txt","198.51.100.0/28\n")
    a=w(tmp_path,"allow.txt","192.0.2.0/24\n")
    with pytest.raises(PolicyError): build_plan(t,a)


def test_reject_broad_ipv4(tmp_path):
    t=w(tmp_path,"targets.txt","10.0.0.0/8\n")
    a=w(tmp_path,"allow.txt","10.0.0.0/8\n")
    with pytest.raises(PolicyError): build_plan(t,a)
