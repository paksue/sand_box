from __future__ import annotations
import json, re
from pathlib import Path
from urllib.parse import quote

path = Path('food_guide/index.html')
html = path.read_text(encoding='utf-8')
marker = 'const DATA = '
start = html.index(marker) + len(marker)
level = 0
in_string = False
escaped = False
end = None
for i, ch in enumerate(html[start:], start):
    if in_string:
        if escaped:
            escaped = False
        elif ch == '\\':
            escaped = True
        elif ch == '"':
            in_string = False
    else:
        if ch == '"':
            in_string = True
        elif ch == '{':
            level += 1
        elif ch == '}':
            level -= 1
            if level == 0:
                end = i + 1
                break
if end is None:
    raise RuntimeError('Could not locate DATA object')

data = json.loads(html[start:end])
foods = data['foods']
existing = {f['id'] for f in foods}

def commons_file(filename: str) -> str:
    return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + quote(filename, safe='')

new_foods = [
    {
        'id':'griessnockerlsuppe','name':'Grießnockerlsuppe','english':'Semolina-dumpling soup','category':'Soup',
        'cities':['Munich'],'meals':['Lunch','Dinner'],'venue':'Traditional restaurant','appetite':'Light',
        'flavor':['Savory','Comforting'],'familiarity':'Approachable','emoji':'🥣',
        'desc':'Clear beef or vegetable broth with tender, airy dumplings made from semolina, butter, egg, and seasoning.',
        'taste':'Mild, buttery and savory, with soft dumplings that absorb the broth.',
        'served':'Hot as a starter, usually with parsley or chives.',
        'why':'A gentle, comforting Bavarian-Austrian soup that is easy to enjoy after a long sightseeing day.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:Grie%C3%9Fnockerlsuppe_cropped.jpg',
        'photo':{'mode':'direct','value':commons_file('Grießnockerlsuppe cropped.jpg')}
    },
    {
        'id':'kartoffelsuppe','name':'Kartoffelsuppe','english':'German potato soup','category':'Soup',
        'cities':['Munich','Rothenburg'],'meals':['Lunch','Dinner'],'venue':'Restaurant or café','appetite':'Medium',
        'flavor':['Savory','Creamy'],'familiarity':'Safe','emoji':'🥔',
        'desc':'A hearty potato soup that may be smooth or chunky, often cooked with carrots, leeks, herbs, and sometimes sausage.',
        'taste':'Earthy, creamy and filling, with gentle vegetable and herb flavors.',
        'served':'Hot in a bowl, sometimes topped with parsley, croutons, or sliced sausage.',
        'why':'Familiar comfort food and a useful lighter meal when you do not want another large roast.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:Potato_soup_with_Spicy_sausage,_2011.jpg',
        'photo':{'mode':'direct','value':commons_file('Potato soup with Spicy sausage, 2011.jpg')}
    },
    {
        'id':'brotzeitplatte','name':'Brotzeitbrettl / Brotzeitplatte','english':'Bavarian cold snack board','category':'Starters & spreads',
        'cities':['Munich','Rothenburg'],'meals':['Lunch','Snack','Dinner'],'venue':'Beer garden or traditional restaurant','appetite':'Medium',
        'flavor':['Savory','Smoky'],'familiarity':'Approachable','emoji':'🧀',
        'desc':'A shareable board of rustic bread, cheese, cold meats, pickles, radish, and spreads such as Obatzda.',
        'taste':'A varied mix of salty, tangy, smoky, creamy and crunchy flavors.',
        'served':'Cold on a wooden board, usually for sharing.',
        'why':'A practical way for the family to sample several Bavarian flavors without ordering four heavy entrées.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:Brotzeit_mit_allem.jpg',
        'photo':{'mode':'direct','value':commons_file('Brotzeit mit allem.jpg')}
    },
    {
        'id':'schupfnudeln-sauerkraut','name':'Schupfnudeln mit Sauerkraut','english':'Potato noodles with sauerkraut','category':'Dumpling, noodles & sides',
        'cities':['Munich','Rothenburg'],'meals':['Lunch','Dinner'],'venue':'Traditional restaurant or market','appetite':'Filling',
        'flavor':['Savory','Tangy'],'familiarity':'Approachable','emoji':'🥔',
        'desc':'Finger-shaped potato noodles browned in a pan and served with tangy sauerkraut, sometimes with bacon.',
        'taste':'Crisp-edged and soft inside, balanced by sharp, fermented cabbage.',
        'served':'Hot as a main dish or substantial side.',
        'why':'A satisfying alternative to dumplings and a good example of southern German comfort food.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:Schupfnudeln_mit_Sauerkraut.jpg',
        'photo':{'mode':'direct','value':commons_file('Schupfnudeln mit Sauerkraut.jpg')}
    },
    {
        'id':'forelle-muellerin','name':'Forelle Müllerin','english':'Pan-fried trout, miller style','category':'Fish dish',
        'cities':['Munich','Rothenburg'],'meals':['Lunch','Dinner'],'venue':'Traditional restaurant','appetite':'Medium',
        'flavor':['Savory','Buttery'],'familiarity':'Safe','emoji':'🐟',
        'desc':'Whole trout lightly dusted with flour and pan-fried in butter, commonly finished with lemon and parsley.',
        'taste':'Delicate fish with a lightly crisp exterior, butter, lemon, and fresh herbs.',
        'served':'Whole with potatoes, salad, or vegetables; expect bones.',
        'why':'A lighter regional restaurant choice when the family wants a break from pork and sausage.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:Forelle_-_M%C3%BCllerin.jpg',
        'photo':{'mode':'direct','value':commons_file('Forelle - Müllerin.jpg')}
    },
    {
        'id':'spargel-hollandaise','name':'Spargel mit Sauce Hollandaise','english':'White asparagus with hollandaise','category':'Vegetarian dish',
        'cities':['Munich','Rothenburg'],'meals':['Lunch','Dinner'],'venue':'Seasonal restaurant menu','appetite':'Medium',
        'flavor':['Buttery','Delicate'],'familiarity':'Safe','emoji':'🌱',
        'desc':'Tender white asparagus served with rich hollandaise, boiled potatoes, and sometimes optional ham.',
        'taste':'Delicate and slightly sweet with creamy, buttery sauce.',
        'served':'Mostly during asparagus season, generally April through June.',
        'why':'A famous German seasonal ritual, though it may be difficult to find during your late-July trip.',
        'alcoholNote':'','sourcePage':'https://commons.wikimedia.org/wiki/File:21_05_01_Daniela_Kloth_Spargel_MG_0720.jpg',
        'photo':{'mode':'direct','value':commons_file('21 05 01 Daniela Kloth Spargel MG 0720.jpg')}
    },
    {
        'id':'zwiebelkuchen','name':'Zwiebelkuchen','english':'Savory German onion cake','category':'Seasonal food',
        'cities':['Rothenburg'],'meals':['Lunch','Snack','Dinner'],'venue':'Bakery, wine tavern, or seasonal market','appetite':'Medium',
        'flavor':['Savory','Rich'],'familiarity':'Approachable','emoji':'🧅',
        'desc':'A savory baked onion tart with a yeasted or pastry base, egg and cream filling, and often bacon.',
        'taste':'Sweet cooked onion, creamy custard and a crisp or bread-like crust.',
        'served':'Warm in slices, especially in late summer and autumn.',
        'why':'A distinctive regional snack worth recognizing, although availability varies by season and restaurant.',
        'alcoholNote':'The food itself may be served in wine regions, but no alcoholic drink is required.','sourcePage':'https://commons.wikimedia.org/wiki/File:Zwiebelkuchen_1.JPG',
        'photo':{'mode':'direct','value':commons_file('Zwiebelkuchen 1.JPG')}
    },
    {
        'id':'bauernbrot','name':'Bauernbrot','english':'Rustic German farmhouse bread','category':'Bread & sandwich',
        'cities':['Munich','Rothenburg'],'meals':['Breakfast','Snack','Dinner'],'venue':'Bakery or restaurant','appetite':'Light',
        'flavor':['Earthy','Tangy'],'familiarity':'Safe','emoji':'🍞',
        'desc':'A rustic mixed rye-and-wheat sourdough loaf with a flour-dusted, cracked crust and substantial crumb.',
        'taste':'Hearty, mildly tangy and aromatic, with a chewy crust.',
        'served':'Sliced with butter, cheese, cold cuts, soup, or a Brotzeit board.',
        'why':'German bread culture is exceptional, and this is an easy everyday item to buy from a bakery.',
        'alcoholNote':'','sourcePage':'https://www.guatxi.com/single-post/2018/02/18/bauernbrot',
        'photo':{'mode':'direct','value':'https://static.wixstatic.com/media/667a4c_95cad6d4581541fdb9ebbe5523c62e71~mv2_d_3888_2592_s_4_2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/667a4c_95cad6d4581541fdb9ebbe5523c62e71~mv2_d_3888_2592_s_4_2.jpg'}
    },
    {
        'id':'bayerischer-radisalat','name':'Bayerischer Radi / Rettichsalat','english':'Bavarian white-radish salad','category':'Salad & cold dish',
        'cities':['Munich'],'meals':['Lunch','Snack','Dinner'],'venue':'Beer garden or traditional restaurant','appetite':'Light',
        'flavor':['Fresh','Peppery','Tangy'],'familiarity':'Adventurous','emoji':'🥗',
        'desc':'Paper-thin white radish, often mixed with red radishes and chives, lightly salted and dressed with vinegar and oil.',
        'taste':'Crisp, refreshing, mildly peppery and tangy.',
        'served':'Cold as a side dish or part of a Bavarian Brotzeit.',
        'why':'It adds freshness beside sausages, Leberkäse, bread, and other rich Bavarian foods.',
        'alcoholNote':'','sourcePage':'https://www.gutekueche.de/bayerischer-radisalat-rezept-16509',
        'photo':{'mode':'direct','value':'https://cdn.gutekueche.de/media/recipe/55213/conv/bayerischer-radisalat-default.jpg'}
    }
]

for food in new_foods:
    if food['id'] not in existing:
        foods.append(food)
        existing.add(food['id'])

data['groups'] = [
    {'id':'breakfast','title':'Breakfast & bakery','subtitle':'Easy morning foods, bakery snacks, and familiar hotel or café breakfasts.','categories':['Breakfast'],'food_ids':['semmel-breakfast','butterbreze','kaesebreze','belegtes-broetchen','bauernfruehstueck','muesli','eggs-bread']},
    {'id':'soups','title':'Soups','subtitle':'Broth-based starters and warming bowls that can also make a lighter meal.','categories':['Soup'],'food_ids':['leberknoedelsuppe','flaedlesuppe','griessnockerlsuppe','kartoffelsuppe']},
    {'id':'salads','title':'Salads & cold dishes','subtitle':'Fresh, tangy, or chilled dishes that balance Bavaria’s richer foods.','categories':['Salad & cold dish'],'food_ids':['wurstsalat','potato-salad','cucumber-salad','bayerischer-radisalat']},
    {'id':'starters','title':'Starters & spreads','subtitle':'Shareable cold plates and spreads for a lighter beginning or casual meal.','categories':['Starters & spreads'],'food_ids':['obatzda','brotzeitplatte']},
    {'id':'breads','title':'Breads & sandwiches','subtitle':'German bakery culture, rustic loaves, and practical hand-held meals.','categories':['Bread & sandwich'],'food_ids':['bauernbrot','pretzel','leberkaessemmel','pretzel-sandwich']},
    {'id':'sausages','title':'Sausages','subtitle':'Bavarian and Franconian sausage specialties, from breakfast to street food.','categories':['Sausage'],'food_ids':['weisswurst','franconian-bratwurst','drei-im-weggla','currywurst','bratwurstsemmel','saure-zipfel']},
    {'id':'meat','title':'Meat dishes','subtitle':'Traditional roasts, cutlets, poultry, beef dishes, and hearty restaurant meals.','categories':['Main dish'],'food_ids':['schweinshaxe','schnitzel','sauerbraten','schweinsbraten','hendl','gulasch','rinderroulade','fleischpflanzerl','zwiebelrostbraten','cordon-bleu','roast-duck','wildgericht']},
    {'id':'fish','title':'Fish dishes','subtitle':'Grilled, fried, and sandwich-style fish choices for a break from meat.','categories':['Fish dish'],'food_ids':['steckerlfisch','fischsemmel','forelle-muellerin']},
    {'id':'dumplings','title':'Dumplings, noodles & sides','subtitle':'The starches and comforting accompaniments that define many southern German meals.','categories':['Dumpling, noodles & sides'],'food_ids':['semmelknoedel','kartoffelknoedel','kaesespaetzle','schupfnudeln-sauerkraut']},
    {'id':'vegetarian','title':'Vegetarian dishes','subtitle':'Meat-free dishes based on mushrooms, grains, potatoes, noodles, and seasonal vegetables.','categories':['Vegetarian dish'],'food_ids':['rahmschwammerl','gruenkern','reiberdatschi','spargel-hollandaise']},
    {'id':'quick','title':'Street food, snacks & casual bites','subtitle':'Quick, informal foods for markets, station stops, cafés, or easy family sharing.','categories':['Street food','Snack','Cafe & casual'],'food_ids':['doener','flammkuchen','toast-hawaii']},
    {'id':'seasonal','title':'Seasonal foods','subtitle':'Specialties strongly associated with a particular harvest, festival, or time of year.','categories':['Seasonal food'],'food_ids':['roasted-chestnuts','zwiebelkuchen','zwetschgendatschi','lebkuchen','spekulatius','dominosteine']},
    {'id':'desserts','title':'Desserts & pastries','subtitle':'Cakes, fried pastries, dumplings, fruit desserts, and café favorites.','categories':['Dessert & pastry'],'food_ids':['schneeballen','apfelstrudel','schmalznudel','kaiserschmarrn','prinzregententorte','bayerische-creme','dampfnudel','ofenschlupfer','bienenstich','ice-cream','fruit-tart','cheesecake']},
    {'id':'candy','title':'Candy, chocolate & sweet snacks','subtitle':'Portable sweets, chocolate, gingerbread, wafers, and edible souvenirs.','categories':['Candy & chocolate'],'food_ids':['gebrannte-mandeln','lebkuchenherz','nuernberger-lebkuchen','chocolate-schneeballen','bavarian-pralines','heilemann','marzipan-chocolate','magenbrot','schokokuesse','haribo','ritter-sport','hanuta','knoppers']},
    {'id':'drinks','title':'Non-alcoholic drinks','subtitle':'Fruit spritzers, sodas, coffee, and warm drinks with no pure alcoholic beverages.','categories':['Non-alcoholic drink'],'food_ids':['eiskaffee','hot-chocolate','apfelschorle','spezi','holunderschorle','johannisbeerschorle','rhabarberschorle','fruit-schorle']},
    {'id':'shopping','title':'Small shopping items','subtitle':'Two small non-food items retained from the original guide.','categories':['Shopping'],'food_ids':['egg-cup','christmas-ornaments']}
]

all_ids = [f['id'] for f in foods]
group_ids = [fid for g in data['groups'] for fid in g['food_ids']]
missing = sorted(set(all_ids) - set(group_ids))
unknown = sorted(set(group_ids) - set(all_ids))
duplicates = sorted({fid for fid in group_ids if group_ids.count(fid) > 1})
if missing or unknown or duplicates:
    raise RuntimeError(f'Group validation failed: missing={missing}, unknown={unknown}, duplicates={duplicates}')
if len(foods) != 94:
    raise RuntimeError(f'Expected 94 foods, got {len(foods)}')

new_json = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
html = html[:start] + new_json + html[end:]
html = re.sub(r'<span class="stat">\d+ items</span>', f'<span class="stat">{len(foods)} items</span>', html, count=1)
fix = '''\n/* iPhone/Android hard guarantee: always two food cards per row on small screens. */\n@media screen and (max-width:700px){\n  main .grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;grid-auto-flow:row!important;width:100%!important}\n  main .card{width:auto!important;max-width:none!important;min-width:0!important}\n}\n'''
if 'iPhone/Android hard guarantee' not in html:
    html = html.replace('</style>', fix + '\n</style>', 1)

path.write_text(html, encoding='utf-8')
print(f'Updated {path}: {len(foods)} items in {len(data["groups"])} sections')
