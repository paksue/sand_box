# One-shot/idempotent patch: responsive home globe + fresh desktop flag assets.
from pathlib import Path
p=Path('worldtap-next/daily-touch.html')
s=p.read_text()
old="function start(){try{map=new maplibregl.Map({container:'map',style:style(),center:[18,14],zoom:.64,minZoom:.18,maxZoom:5"
new="function homeZoom(){const w=window.innerWidth,h=window.innerHeight;if(w>=1500)return h>=820?1.55:1.42;if(w>=1100)return 1.34;if(w>=800)return .98;return .64}\nfunction start(){try{map=new maplibregl.Map({container:'map',style:style(),center:[18,14],zoom:homeZoom(),minZoom:.18,maxZoom:5"
if old in s:
    s=s.replace(old,new,1)
old2="if(reset)map.easeTo({center:[18,14],zoom:.64,duration:550})"
if old2 in s:
    s=s.replace(old2,"if(reset)map.easeTo({center:[18,14],zoom:homeZoom(),duration:550})",1)
s=s.replace('./desktop-flag.css?v=1','./desktop-flag.css?v=2')
s=s.replace('./flags/${q.flagCode}.svg?v=1','./flags/${q.flagCode}.svg?v=2')
if 'zoom:homeZoom()' not in s: raise SystemExit('responsive home zoom not present')
p.write_text(s)
