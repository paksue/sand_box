from pathlib import Path

path = Path('worldtap-next/daily-touch.html')
text = path.read_text()

old_css = '<link rel="stylesheet" href="./desktop-flag.css?v=2" />'
new_css = '<link rel="stylesheet" href="./desktop-flag.css?v=3" />'
if old_css not in text:
    raise SystemExit('expected desktop CSS link not found')
text = text.replace(old_css, new_css, 1)

old_zoom = "function homeZoom(){const w=window.innerWidth,h=window.innerHeight;if(w>=1500)return h>=820?1.55:1.42;if(w>=1100)return 1.34;if(w>=800)return .98;return .64}"
new_zoom = "function homeZoom(){const w=window.innerWidth,h=window.innerHeight;if(w>=1500)return h>=820?1.78:1.62;if(w>=1100)return 1.52;if(w>=800)return .98;return .64}"
if old_zoom not in text:
    raise SystemExit('expected homeZoom function not found')
text = text.replace(old_zoom, new_zoom, 1)

path.write_text(text)
