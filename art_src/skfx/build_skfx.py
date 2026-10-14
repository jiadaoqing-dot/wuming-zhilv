# 主角技能特效图集 SKFX(2026-10-12 第六轮):剑士 I / S+空格 / WW+空格、法师全部技能的大范围特效
# 原始素材在 raw/skfx/(都是 CC0):
#  Light - Magic Effect(Cethiel,CC0)https://opengameart.org/content/light-magic-effect
#  Cosmic Time - Magic Effect(Cethiel,CC0)https://opengameart.org/content/cosmic-time-magic-effect
#  Fire Wrath - Magic Effect(Cethiel,CC0)https://opengameart.org/content/fire-wrath-magic-effect
#  2D Spell Effects(Mikodrak,CC0)https://opengameart.org/content/2d-spell-effects (fx1 蓝色落雷光柱)
#  Clouds(Igor Gundarev,CC0)https://opengameart.org/content/clouds(雷云)
#  Pixel Art 2D Asteroid Pack(Cayden Franklin,CC-BY 4.0)https://opengameart.org/content/pixel-art-2d-asteroid-pack(陨石)
# 改动:缩小成像素尺寸、按亮度换色(金 / 紫 / 青 / 红等)或保留原色,限色;先做成黑底帧,再把亮度换成透明度(6 档);游戏里用叠加(lighter)画
# 用法:python art_src/skfx/build_skfx.py → assets/skfx_atlas.png,并打印 meta(贴进源码 SKFX.M)
import os, json, glob, re
from PIL import Image
D = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); R = D + '/raw/skfx/'
nk = lambda s: [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', s)]
LIGHT = sorted(glob.glob(R + 'light_fx/x/LightEffect_*.png'), key=nk)
COS = sorted(glob.glob(R + 'cosmic_time/x/*/Cosmic_*.png'), key=nk)
FIRE = sorted(glob.glob(R + 'fire_wrath/x/SD/*/Fire-Wrath__*.png'), key=nk)
BOLT = sorted(glob.glob(R + 'mikodrak_fx/x/fx1_blue_topEffect/*.png'), key=nk)

def add_rgb(im):
  """RGBA → 预乘到黑底的 RGB(叠加画法用)"""
  im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (0, 0, 0, 255)); bg.alpha_composite(im); return bg.convert('RGB')
def pal_map(rgb, pal, th=10):
  """按亮度映射到调色板(暗 → 亮,黑 = 透明)"""
  px = rgb.load(); n = len(pal); o = Image.new('RGB', rgb.size); q = o.load()
  for y in range(rgb.height):
    for x in range(rgb.width):
      r, g, b = px[x, y]; l = max(r, g, b)
      q[x, y] = (0, 0, 0) if l < th else pal[min(n - 1, int((l - th) / (256 - th) * n))]
  return o
def keep(rgb, n=20, th=10):
  """保留原色:限色 + 去掉很暗的像素"""
  q = rgb.quantize(n, method=Image.Quantize.MEDIANCUT).convert('RGB'); px = q.load(); s = rgb.load()
  for y in range(q.height):
    for x in range(q.width):
      if max(s[x, y]) < th: px[x, y] = (0, 0, 0)
  return q
def group(files, size, pal=None, n=20):
  """一组帧:按所有帧的联合包围盒裁切(保持中心),缩到 size(最长边)"""
  ims = [Image.open(f).convert('RGBA') for f in files]
  bb = None
  for im in ims:
    b = im.getbbox()
    if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
  W, H = ims[0].size; cx, cy = W / 2, H / 2
  hw = max(cx - bb[0], bb[2] - cx); hh = max(cy - bb[1], bb[3] - cy)  # 以中心对称裁切
  box = (int(cx - hw), int(cy - hh), int(cx + hw), int(cy + hh))
  k = size / max(box[2] - box[0], box[3] - box[1])
  out = []
  for im in ims:
    c = add_rgb(im.crop(box)).resize((max(1, round((box[2] - box[0]) * k)), max(1, round((box[3] - box[1]) * k))), Image.LANCZOS)
    out.append(pal_map(c, pal) if pal else keep(c, n))
  return out
GOLD = [(90, 40, 0), (170, 90, 10), (240, 160, 30), (255, 212, 59), (255, 240, 150), (255, 255, 230)]
VIO = [(40, 10, 80), (90, 40, 170), (150, 90, 240), (200, 160, 255), (240, 225, 255)]
TEAL = [(10, 60, 50), (30, 130, 110), (90, 210, 180), (180, 250, 230), (240, 255, 250)]
BLUE = [(10, 25, 90), (30, 70, 190), (90, 150, 250), (180, 215, 255), (245, 250, 255)]
RED = [(80, 0, 10), (160, 10, 20), (230, 50, 30), (255, 120, 70), (255, 210, 170)]
F = {}
# 剑士 I 第一段:放射状光爆 → 金色
F['g-burst'] = group(LIGHT[5:10], 112, GOLD)
F['g-orb'] = group(LIGHT[0:5], 72, GOLD)
# 剑士 I 第二段落点 / 法师落雷落点:光球 → 蓝
F['b-orb'] = group(LIGHT[0:5], 72, BLUE)
# 剑士 S+空格(封尘断念斩,紫色):前方大斩 = 光之剑翼(紫)、标记 = 时钟魔法阵、风暴 = 紫色漩涡、十字斩 = 紫色爆环
F['v-wing'] = group(LIGHT[20:25], 128, VIO)
F['v-clock'] = group(COS[5:10], 72)
F['v-vortex'] = group(COS[20:25], 112)
F['v-ring'] = group(COS[15:20], 96)
F['v-gear'] = group(COS[0:5], 80)
# 剑士 WW+空格(红色):火环 / 火球 / 十字爆炎 / 火翼 / 爆环
F['r-ring'] = group(FIRE[10:15], 112)
F['r-ball'] = group(FIRE[15:20], 112)
F['r-cross'] = group(FIRE[0:5], 144)
F['r-wing'] = group(FIRE[5:10], 128)
F['r-burst'] = group(FIRE[20:25], 128)
# 法师:闪现 = 光漩涡(紫)、风眼 = 光漩涡(青)、落雷光柱(蓝,隔帧取)
F['m-swirl'] = group(LIGHT[15:20], 96, VIO)
F['t-swirl'] = group(LIGHT[15:20], 112, TEAL)
F['m-bolt'] = group(BOLT[::2], 150)
def unblack(im):
  """黑底 → 透明:亮度当透明度(分 6 档,保持像素感),颜色除回去;游戏里仍用叠加画"""
  im = im.convert('RGB'); px = im.load(); o = Image.new('RGBA', im.size); q = o.load()
  for y in range(im.height):
    for x in range(im.width):
      r, g, b = px[x, y]; l = max(r, g, b)
      if l < 10: continue
      a = min(255, (l * 6 // 255 + 1) * 255 // 6); k = 255 / l
      q[x, y] = (min(255, int(r * k)), min(255, int(g * k)), min(255, int(b * k)), a)
  return o
F = {n: [unblack(f) for f in fr] for n, fr in F.items()}
# ---- 2026-10-12 第七轮:普通(不叠加)贴图 ----
def recol(im, pal):  # 按亮度映射到调色板(暗 → 亮,按图内亮度范围拉伸),保留透明度(二值)
  im = im.convert('RGBA'); px = im.load(); n = len(pal)
  L = [(r * .3 + g * .59 + b * .11) for y in range(im.height) for x in range(im.width) for r, g, b, a in [px[x, y]] if a >= 100]
  lo, hi = min(L), max(L) + 1
  for y in range(im.height):
    for x in range(im.width):
      r, g, b, a = px[x, y]
      if a < 100: px[x, y] = (0, 0, 0, 0); continue
      l = ((r * .3 + g * .59 + b * .11) - lo) / (hi - lo); px[x, y] = pal[min(n - 1, int(l * n))] + (255,)
  return im
# 雷云(法师 O):Clouds(Igor Gundarev,CC0)https://opengameart.org/content/clouds 的 4 朵云 → 换成暗紫灰风暴色、放大 2 倍
STORM = [(22, 20, 34), (34, 32, 50), (50, 47, 70), (70, 66, 94), (96, 92, 124), (128, 124, 156)]
cl = Image.open(R + 'clouds/gundarev_clouds.png').convert('RGBA'); a = cl.split()[3].load(); rows = []; y0 = None
for yy in range(cl.height + 1):  # 按空行切开 4 朵云(第 4 行有两朵,再按空列切)
  e = yy == cl.height or not any(a[xx, yy] for xx in range(cl.width))
  if not e and y0 is None: y0 = yy
  if e and y0 is not None: rows.append((y0, yy)); y0 = None
k = 0
for (ya, yb) in rows:
  band = cl.crop((0, ya, cl.width, yb)); b = band.split()[3].load(); x0 = None
  for xx in range(band.width + 1):
    e = xx == band.width or not any(b[xx, q] for q in range(band.height))
    if not e and x0 is None: x0 = xx
    if e and x0 is not None:
      c = band.crop((x0, 0, xx, band.height)); c = c.crop(c.getbbox()); c = recol(c, STORM).resize((c.width * 2, c.height * 2), Image.NEAREST)
      F['c-cloud%d' % k] = [c]; k += 1; x0 = None
# 陨石(法师 W+空格):Pixel Art 2D Asteroid Pack(Cayden Franklin,CC-BY 4.0)https://opengameart.org/content/pixel-art-2d-asteroid-pack 的 Huge → 缩到 120、压成焦黑色
ROCK = [(10, 8, 10), (20, 16, 18), (32, 26, 28), (46, 38, 38), (62, 52, 50), (80, 68, 64)]
ast = Image.open(R + 'asteroid/Asteroid_Huge.png').convert('RGBA'); ast = ast.crop(ast.getbbox())
kk = 120 / max(ast.size); ast = ast.resize((round(ast.width * kk), round(ast.height * kk)), Image.NEAREST)
F['met-rock'] = [recol(ast, ROCK)]
# 拼图集:每种一行
W = max(sum(f.width for f in fr) for fr in F.values()); H = sum(max(f.height for f in fr) for fr in F.values())
A = Image.new('RGBA', (W, H)); M = {}; y = 0
for n, fr in F.items():
  w = max(f.width for f in fr); h = max(f.height for f in fr)
  for i, f in enumerate(fr): A.paste(f, (i * w + (w - f.width) // 2, y + (h - f.height) // 2))
  M[n] = {'y': y, 'w': w, 'h': h, 'n': len(fr), 'px': w // 2, 'py': h if n == 'm-bolt' else h // 2, 'fps': 22 if n == 'm-bolt' else 12, 'loop': False, 'im': 5}
  y += h
A.save(D + '/assets/skfx_atlas.png', optimize=True)
print(A.size, os.path.getsize(D + '/assets/skfx_atlas.png')); print(json.dumps(M, separators=(',', ':')))
