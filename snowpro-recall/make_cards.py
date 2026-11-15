from pathlib import Path
from collections import Counter
import json
root=Path(__file__).resolve().parent
cards=json.loads((root/'cards.json').read_text(encoding='utf-8'))
ids=[c['id'] for c in cards]
assert len(cards)>=405 and len(set(ids))==len(ids)
assert ids[:162]==['sp'+str(i).zfill(3) for i in range(1,163)]
assert all(c.get('front') and c.get('back') and c.get('doc') for c in cards)
print('Cards:',len(cards),' | Domains:',dict(Counter(c['domain'] for c in cards)))
print('Legacy:',sum(c.get('status')=='legacy' for c in cards))
print('cards.json is the source; this validates without overwriting.')
