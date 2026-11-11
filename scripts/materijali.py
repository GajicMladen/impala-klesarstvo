"""
Priprema fotografija koje dostavi radionica za sajt.

  python3 -m venv .venv && .venv/bin/pip install pillow numpy
  .venv/bin/python scripts/materijali.py dostavljeni-materijal public 78

Izlaz:
  public/materijali/<id>.jpg       kvadratni isječak bez odsjaja (max 1024 px) – katalog, modal, karusel
  public/materijali/tile/<id>.jpg  bešavna pločica 512 px – skica u konfiguratoru, pozadina naslovnice
  public/radovi/rad-11/12.jpg      screenshotovi s telefona bez crnih traka
  + ispisuje paletu boja (od tamne prema svijetloj) za `texture.palette` u src/data/materials.ts

Za novi kamen: dodati red u CROPS (x, y, veličina u pikselima originala, birati područje bez odsjaja).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(sys.argv[1])  # dostavljeni-materijal
PUB = Path(sys.argv[2])  # public/
OUT_MAT = PUB / 'materijali'
OUT_MAT.mkdir(exist_ok=True)

# (source file, id, x, y, size) in original pixels – regions chosen to avoid glare / edges
CROPS = [
    ('IMPALA.jpeg', 'impala', 720, 100, 1310),
    ('BENGAL_BLACK.jpeg', 'bengal-black', 167, 0, 666),
    ('BIANCO_SARDO.jpeg', 'bianco-sardo', 307, 0, 1433),
    ('MULTICOLOR.jpeg', 'multicolor', 1100, 0, 600),
    ('ROSA_BETA.jpeg', 'rosa-beta', 256, 0, 1536),
    ('ROSSO_PORINO.jpeg', 'rosso-porrino', 758, 102, 1290),
    ('VERDE_MARINA.jpeg', 'verde-marina', 256, 0, 1536),
    ('VIGAZ_BLUE.jpeg', 'vizag-blue', 666, 102, 1382),
    ('VISOCUNT_WHITE.jpeg', 'viscount-white', 745, 0, 790),  # stops before the reflection patch on the right
]
MAX = 1024
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 80


def palette(img: Image.Image, n: int = 5) -> list[str]:
    a = np.asarray(img.convert('RGB').resize((256, 256)), dtype=np.float32).reshape(-1, 3)
    lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    a = a[np.argsort(lum)]
    out = []
    for chunk in np.array_split(a, n):
        r, g, b = chunk.mean(axis=0).round().astype(int)
        out.append(f'#{r:02x}{g:02x}{b:02x}')
    return out


report = {}
for fname, mid, x, y, s in CROPS:
    im = Image.open(SRC / fname).convert('RGB')
    assert x + s <= im.width and y + s <= im.height, (fname, im.size)
    tile = im.crop((x, y, x + s, y + s))
    if s > MAX:
        tile = tile.resize((MAX, MAX), Image.LANCZOS)
    dst = OUT_MAT / f'{mid}.jpg'
    tile.save(dst, 'JPEG', quality=Q, optimize=True, progressive=True)
    report[mid] = {'size': tile.width, 'kb': round(dst.stat().st_size / 1024), 'palette': palette(tile)}

# Work photos: phone screenshots with black bars above / below the picture
for fname, out in [('STEPENISTE.jpeg', 'rad-11.jpg'), ('SANK.jpeg', 'rad-12.jpg')]:
    im = Image.open(SRC / fname).convert('RGB')
    rows = np.asarray(im.convert('L'), dtype=np.float32).mean(axis=1)
    content = np.where(rows > 12)[0]
    # the largest contiguous run of non-black rows is the photo (skips the home-indicator bar)
    runs, start = [], content[0]
    for a, b in zip(content, content[1:]):
        if b != a + 1:
            runs.append((start, a))
            start = b
    runs.append((start, content[-1]))
    top, bottom = max(runs, key=lambda r: r[1] - r[0])
    top, bottom = top + 2, bottom - 2  # trim anti-aliased edge rows
    photo = im.crop((0, top, im.width, bottom + 1))
    w = 800
    photo = photo.resize((w, round(photo.height * w / photo.width)), Image.LANCZOS)
    dst = PUB / 'radovi' / out
    photo.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
    report[out] = {'crop_rows': [int(top), int(bottom)], 'size': photo.size, 'kb': round(dst.stat().st_size / 1024)}

print(json.dumps(report, indent=1))


# ---- seamless 512 px tiles for SVG patterns (configurator sketch, hero background) ----
def seamless(a: np.ndarray, margin: float = 0.24) -> np.ndarray:
    """Two-pass half-offset blend; variance-preserving so the blend band keeps the grain's contrast."""
    n = a.shape[0]
    mean = a.reshape(-1, 3).mean(axis=0)
    ramp = np.clip(np.minimum(np.arange(n), n - 1 - np.arange(n)) / (margin * n), 0, 1)
    w1 = (np.sin(ramp * np.pi / 2) ** 2).astype(np.float32)
    for axis in (1, 0):
        s = np.roll(a, n // 2, axis=axis)
        w = w1[None, :, None] if axis == 1 else w1[:, None, None]
        norm = np.sqrt(w**2 + (1 - w) ** 2)
        a = mean + (w * (a - mean) + (1 - w) * (s - mean)) / norm
    return np.clip(a, 0, 255)


OUT_TILE = OUT_MAT / 'tile'
OUT_TILE.mkdir(exist_ok=True)
# tiles repeat, so a faint reflection that is fine in the photo becomes a visible pattern – use cleaner regions
TILE_CROPS = {'rosso-porrino': (760, 102, 780), 'viscount-white': (740, 0, 760)}
for fname, mid, x, y, s in CROPS:
    x, y, s = TILE_CROPS.get(mid, (x, y, s))
    im = Image.open(SRC / fname).convert('RGB').crop((x, y, x + s, y + s)).resize((512, 512), Image.LANCZOS)
    t = Image.fromarray(seamless(np.asarray(im, dtype=np.float32)).round().astype(np.uint8))
    dst = OUT_TILE / f'{mid}.jpg'
    t.save(dst, 'JPEG', quality=80, optimize=True, progressive=True)
    print(mid, 'tile', round(dst.stat().st_size / 1024), 'kB')
