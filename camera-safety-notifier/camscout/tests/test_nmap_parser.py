from camscout.parsers import parse_nmap_xml
from camscout.policy import build_plan

XML='''<?xml version="1.0"?><nmaprun><host><address addr="192.0.2.10" addrtype="ipv4"/><ports><port protocol="tcp" portid="554"><state state="open"/><service name="rtsp" product="Example Network Camera"/><script id="rtsp-methods" output="OPTIONS, DESCRIBE"/></port></ports></host></nmaprun>'''

def test_parse_nmap(tmp_path):
    (tmp_path/"t").write_text("192.0.2.0/28\n")
    (tmp_path/"a").write_text("192.0.2.0/24\n")
    (tmp_path/"x.xml").write_text(XML)
    p=build_plan(tmp_path/"t",tmp_path/"a")
    out=parse_nmap_xml(tmp_path/"x.xml",p)
    assert len(out)==1
    assert out[0].camera_probability >= .8
