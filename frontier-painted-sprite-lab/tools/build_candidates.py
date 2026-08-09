from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
from rembg import remove
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'candidate-assets'
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    'pair-of-oxen': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/A_Pair_of_Oxen_-_Rosa_Bonheur.webp',
    'oxen-pulling-cart': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Oxen_Pulling_A_Cart_-_Rosa_Bonheur.webp',
    'two-white-oxen': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Two_white_oxen_pulling_a_cart_-_Rosa_Bonheur.webp',
}

UA = {'User-Agent': 'FrontierJourneyVisualResearch/1.0 (public-domain art study)'}

def fetch(name: str, url: str) -> Path:
    path = OUT / f'{name}-source.webp'
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
        f.write(r.read())
    return path


def trim_alpha(im: Image.Image) -> Image.Image:
    alpha = im.getchannel('A')
    bbox = alpha.getbbox()
    if not bbox:
        return im
    pad = 24
    bbox = (
        max(0, bbox[0] - pad), max(0, bbox[1] - pad),
        min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad),
    )
    return im.crop(bbox)


def checker(size, cell=24):
    w, h = size
    bg = Image.new('RGB', size, (114, 110, 105))
    d = ImageDraw.Draw(bg)
    a, b = (116, 111, 105), (148, 143, 136)
    for y in range(0, h, cell):
        for x in range(0, w, cell):
            d.rectangle((x, y, x + cell, y + cell), fill=a if ((x//cell)+(y//cell))%2 else b)
    return bg


def fit_preview(sprite: Image.Image, width=720, height=520):
    sprite = sprite.copy()
    sprite.thumbnail((width - 60, height - 60), Image.Resampling.LANCZOS)
    bg = checker((width, height))
    x = (width - sprite.width) // 2
    y = (height - sprite.height) // 2
    bg.paste(sprite, (x, y), sprite)
    return bg


previews = []
for name, url in SOURCES.items():
    print(f'Fetching {name}...')
    source_path = fetch(name, url)
    source = Image.open(source_path).convert('RGBA')
    # Downsize before neural matting: enough texture for the final game sprite,
    # but keeps CI/model inference practical.
    source.thumbnail((1600, 1200), Image.Resampling.LANCZOS)
    print(f'Matting {name} at {source.size}...')
    result = remove(source, alpha_matting=True, alpha_matting_foreground_threshold=235,
                    alpha_matting_background_threshold=12, alpha_matting_erode_size=8)
    result = trim_alpha(result)
    result_path = OUT / f'{name}.png'
    result.save(result_path, optimize=True)
    preview = fit_preview(result)
    label = Image.new('RGB', (720, 54), (32, 25, 19))
    ImageDraw.Draw(label).text((18, 17), name.replace('-', ' ').title(), fill=(242, 225, 194))
    card = Image.new('RGB', (720, 574), (32, 25, 19))
    card.paste(label, (0, 0))
    card.paste(preview, (0, 54))
    previews.append(card)

contact = Image.new('RGB', (720 * len(previews), 574), (20, 16, 13))
for i, card in enumerate(previews):
    contact.paste(card, (i * 720, 0))
contact.save(OUT / 'candidate-contact-sheet.jpg', quality=92)
print('Wrote candidates to', OUT)
