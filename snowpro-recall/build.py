from pathlib import Path
import json
root=Path(__file__).resolve().parent
bank=json.loads((root/'cards.json').read_text())
lessons=json.loads((root/'lessons.json').read_text())
exam_links=json.loads((root/'exam-links.json').read_text())
html=(root/'template.html').read_text().replace('/*STYLE*/',(root/'style.css').read_text()).replace('/*BANK*/',json.dumps(bank,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')).replace('/*LESSONS*/',json.dumps(lessons,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')).replace('/*EXAM_LINKS*/',json.dumps(exam_links,ensure_ascii=False,separators=(',',':'))).replace('/*APP*/',(root/'app.js').read_text())
(root/'index.html').write_text(html,encoding='utf8')
print('Built',root/'index.html',len(html),'bytes',len(bank),'cards')
