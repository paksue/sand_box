from pathlib import Path
import json
root=Path(__file__).resolve().parent
cards=json.loads((root/'cards.json').read_text(encoding='utf-8'))
page=(root/'template.html').read_text(encoding='utf-8')
page=page.replace('/*STYLE*/',(root/'style.css').read_text(encoding='utf-8'))
page=page.replace('/*BANK*/',json.dumps(cards,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
page=page.replace('/*APP*/',(root/'app.js').read_text(encoding='utf-8'))
(root/'index.html').write_text(page,encoding='utf-8')
print('Built',len(cards),'cards into index.html')
