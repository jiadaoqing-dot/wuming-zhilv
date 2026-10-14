# 第五关首领「沙渊古神」/ 第七关首领「血月巫王」像素形象(2026-10-13 第十七轮,代替沙暴巨蜥 / 银色狼人)
# 素材:Bosses and monsters spritesheets (Ars Notoria)(作者 Balmer,原画 Stephen Challener / Redshrike,CC-BY 3.0)
#   https://opengameart.org/content/bosses-and-monsters-spritesheets-ars-notoria
#   用到:andromalius(触手古神)、tentacles(地下钻出的触手)、acid2(液柱)、mage-1 / 2 / 3(巫王三形态)、flameball(蓝色冰焰)、
#   mage-bullet(红色法球)、minion(蓝色触灵)。没用 gnu / shadow(那两个是 CC-BY-SA 的衍生图)。
# 改动:古神 / 触手 / 液柱按亮度换成沙金色(古神狂暴版换赤红);触手 / 液柱另做一套血红色给巫王用;冰焰球另做一套沙金色给古神用;其余保持原色
# 用法:python art_src/boss/build_ars.py → assets/ars_atlas.png + 打印 meta(贴进源码 ARS.M):名字 → [y, 帧宽, 帧高, 帧数],帧横排
import os, json
import numpy as np
from PIL import Image

R = os.path.join(os.path.dirname(__file__), '..', '..')
S = os.path.join(R, 'raw/boss57/ars_notoria/x/spritesheets')

def hexc(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
SAND = np.array([hexc(c) for c in ['#160d07', '#33200f', '#5c3a19', '#8a5a26', '#b9843a', '#dcb05c', '#f2d68f', '#fff4cf']], np.float32)
RAGE = np.array([hexc(c) for c in ['#160505', '#3a0c08', '#6e180c', '#a52a12', '#d4471c', '#f2793a', '#ffb070', '#ffe6c2']], np.float32)
BLOOD = np.array([hexc(c) for c in ['#0c0306', '#25060d', '#4a0a16', '#7c1022', '#b51d30', '#e0394a', '#ff7a80', '#ffd0d0']], np.float32)

def ramp(im, R_, gam=1.0, lift=0.0):
    a = np.array(im).astype(np.float32); al = a[..., 3] > 0
    l = (.3 * a[..., 0] + .59 * a[..., 1] + .11 * a[..., 2]) / 255
    l = np.clip(l ** gam + lift, 0, 1) * (len(R_) - 1); i = np.minimum(l.astype(int), len(R_) - 2); f = (l - i)[..., None]
    c = R_[i] * (1 - f) + R_[i + 1] * f; a[..., :3] = np.where(al[..., None], c, a[..., :3]); return Image.fromarray(a.astype(np.uint8))

def frames(fn, fw, fh, cols, n):
    im = Image.open(os.path.join(S, fn)).convert('RGBA'); return [im.crop(((k % cols) * fw, (k // cols) * fh, (k % cols + 1) * fw, (k // cols + 1) * fh)) for k in range(n)]

ITEMS = []
andr = frames('andromalius-57x88.png', 57, 88, 8, 24)
ITEMS.append(('andr', [ramp(f, SAND, .85, .04) for f in andr]))
ITEMS.append(('andrR', [ramp(f, RAGE, .85, .04) for f in andr]))
ten = frames('tentacles-25x90.png', 25, 90, 8, 24)
ITEMS.append(('tenS', [ramp(f, SAND, .7, .08) for f in ten]))
ITEMS.append(('tenB', [ramp(f, BLOOD, .7, .06) for f in ten]))
ac = frames('acid2-14x67.png', 14, 67, 8, 24)
ITEMS.append(('gysS', [ramp(f, SAND, .8, .1) for f in ac]))
ITEMS.append(('gysB', [ramp(f, BLOOD, .8, .08) for f in ac]))
ITEMS.append(('wiz1', frames('mage-1-85x94.png', 85, 94, 4, 8)))
ITEMS.append(('wiz2', frames('mage-2-122x110.png', 122, 110, 4, 8)))
ITEMS.append(('wiz3', frames('mage-3-87x110.png', 87, 110, 4, 8)))
fb = frames('flameball-32x32.png', 32, 32, 4, 4)
ITEMS.append(('fbB', fb))
ITEMS.append(('fbS', [ramp(f, SAND, 2.2, 0) for f in fb]))
ITEMS.append(('orb', frames('mage-bullet-13x13.png', 13, 13, 5, 5)))
ITEMS.append(('imp', frames('minion-45x66.png', 45, 66, 3, 6)))

W = max(len(fs) * fs[0].width for _, fs in ITEMS); H = sum(fs[0].height for _, fs in ITEMS)
out = Image.new('RGBA', (W, H)); meta = {}; y = 0
for nm, fs in ITEMS:
    fw, fh = fs[0].size
    for k, f in enumerate(fs): out.alpha_composite(f, (k * fw, y))
    meta[nm] = [y, fw, fh, len(fs)]; y += fh
out.save(os.path.join(R, 'assets/ars_atlas.png'), optimize=True)
print(json.dumps(meta, separators=(',', ':')))
