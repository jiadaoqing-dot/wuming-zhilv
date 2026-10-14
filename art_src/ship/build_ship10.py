# 第十关「幽灵船」场景 + 怪物 / 首领图集 SHIP10(2026-10-13):一艘幽灵船在夜空里航行,甲板就是地面
#   夜空:Moon and Sea Pixel Art Background(CraftPix.net,OGA-BY 3.0)https://opengameart.org/content/moon-and-sea-pixel-art-background
#         —— 天空 / 星星 / 月亮 / 云四层缩到 1/2,云改成幽灵的青绿色
#   远处的幽灵船:Old-fashioned pirate ship(KokoroReflections,CC-BY 4.0)https://opengameart.org/content/old-fashioned-pirate-ship
#         —— 缩到 1/6,整艘船换成半透明的青绿色剪影
#   甲板 / 浮空木板 / 木桶 / 大炮:Pirate Bomb(Pixel Frog,CC-BY 4.0)https://opengameart.org/content/pirate-bomb
#         —— 木板缩到 1/2,换成发灰发绿的朽木色;木桶 / 大炮缩到 1/2 同样换色
#   翼魔 / 空翼妖:LPC Imp(William.Thompsonj,CC-BY 3.0 / OGA-BY 3.0)https://opengameart.org/content/lpc-imp 、LPC Imp 2 https://opengameart.org/content/lpc-imp-2
#         —— 红色小恶魔 = 翼魔(原色);蓝色换成暗紫 + 青色眼睛 = 空翼妖
#   浮游眼魔:Flying Eye Monster(Lil Pie,CC-BY 3.0)https://opengameart.org/content/flying-eye-monster-eye(原色)
#   首领归蝇:Fallen Angel(BlackSwordo,CC-BY 4.0)https://opengameart.org/content/fallen-angel
#         —— 缩到 1/2、去掉脚下影子,剑光换成紫色,拆成「翅膀」和「身体」两层(翅膀可以扇动)
#   自画像素:桅杆 + 破帆、幽灵灯笼、船舷栏杆、首领的第二对手臂 / 长尾 / 漂浮碎片、追踪弹、魔法球
#   所有动画统一翻成面朝右
# 用法:python art_src/ship/build_ship10.py → assets/ship10_atlas.png + 打印 meta(贴进源码 SHIP10.M)
#   meta:名字 → [y, 帧宽, 帧高, 帧数, (x 偏移)](帧横排)
import json, os, math
import numpy as np
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(__file__), '..', '..')
S = os.path.join(R, 'raw/ship')
def L(p): return Image.open(os.path.join(S, p)).convert('RGBA')
def hexc(h, a=255): h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
def frames(im, w, h, n, y=0): return [im.crop((i * w, y, i * w + w, y + h)) for i in range(n)]
def flip(fs): return [f.transpose(Image.FLIP_LEFT_RIGHT) for f in fs]
def athr(im, t=110):
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > t, 255, 0); return Image.fromarray(a)
def shrink(im, k, colors=None, thr=True):
    im = im.resize((max(1, round(im.width / k)), max(1, round(im.height / k))), Image.LANCZOS)
    if thr: im = athr(im)
    if colors:
        a = np.array(im); rgb = Image.fromarray(a[..., :3]).quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert('RGB')
        a[..., :3] = np.array(rgb); im = Image.fromarray(a)
    return im
def half(im): return im.resize((im.width // 2, im.height // 2), Image.NEAREST)
def outline(im, col='#0a0c10'):
    a = np.array(im); al = a[..., 3] > 0; o = np.zeros_like(al)
    o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]; o &= ~al
    a[o] = hexc(col); return Image.fromarray(a)
def lumi(a): return a[..., :3].astype(np.float32) @ np.array([.3, .59, .11])
def ramp(t, cols):
    cs = np.array([hexc(c)[:3] for c in cols], np.float32); t = np.clip(t, 0, 1) * (len(cs) - 1)
    i = np.minimum(np.floor(t).astype(int), len(cs) - 2); f = (t - i)[..., None]; return cs[i] * (1 - f) + cs[i + 1] * f
def recol(im, cols, lo=None, hi=None):
    a = np.array(im).astype(np.float32); l = lumi(a); m = a[..., 3] > 0
    lo = l[m].min() if lo is None else lo; hi = l[m].max() if hi is None else hi
    a[..., :3] = ramp((l - lo) / max(1, hi - lo), cols); return Image.fromarray(a.astype(np.uint8))
def pad(fs, w=None, h=None, anchor='bottom'):
    w = w or max(f.width for f in fs); h = h or max(f.height for f in fs); out = []
    for f in fs:
        c = Image.new('RGBA', (w, h)); c.alpha_composite(f, ((w - f.width) // 2, h - f.height if anchor == 'bottom' else (h - f.height) // 2)); out.append(c)
    return out
def crop_all(fs):
    bb = None
    for f in fs:
        b = f.getbbox()
        if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    return [f.crop(bb) for f in fs]

ROWS = {}
RNG = np.random.RandomState(10)
WOOD = ['#0b1013', '#1c2a2e', '#2f4544', '#4c6862', '#7f9e90', '#b6d0bf']

# ======================= 夜空 =======================
ROWS['sky'] = [L('moon_sea/1.png').resize((160, 90), Image.LANCZOS)]
s2 = np.array(L('moon_sea/2.png')); big = lumi(s2) > 120; big &= s2[..., 3] > 0       # 2.png = 星星 + 月亮:亮的大块是月亮
ys, xs = np.nonzero(big); my, mx = int(np.median(ys)), int(np.median(xs)); near = (abs(ys - my) < 60) & (abs(xs - mx) < 60)
mb = (xs[near].min() - 4, ys[near].min() - 4, xs[near].max() + 5, ys[near].max() + 5)
ROWS['moon'] = [half(Image.fromarray(s2).crop(mb))]
s2[mb[1]:mb[3], mb[0]:mb[2], 3] = 0; ROWS['stars'] = [half(Image.fromarray(s2))]
cl = half(L('moon_sea/3.png'))                                                            # 3.png = 云(4.png 是海面反光,不用)
ROWS['cl1'] = [recol(cl, ['#0c1a24', '#163a44', '#2a6660', '#58a394'])]
ROWS['cl2'] = [recol(cl.transpose(Image.FLIP_LEFT_RIGHT), ['#090f18', '#122630', '#1f4448', '#2f6a66'])]
gs = L('pirateship/ship_parallax_complete.png'); gs = shrink(gs.crop(gs.getbbox()), 6, thr=False)
a = np.array(gs).astype(np.float32); l = lumi(a); a[..., :3] = ramp(l / 255, ['#0d2a2c', '#2f7a70', '#8fe0c8']); a[..., 3] = np.where(a[..., 3] > 60, 150 + (l / 255) * 80, 0)
ROWS['gship'] = [Image.fromarray(a.astype(np.uint8))]

# ======================= 甲板 / 木板 / 道具 =======================
TS = L('pirate_bomb/Sprites/8-Tile-Sets/Tile-Sets (64-64).png')
blk = half(TS.crop((64, 0, 128, 192)))                 # 32×96:上面一条雕花边 + 木板
ROWS['g_top'] = [recol(blk.crop((0, 0, 32, 32)), WOOD)]
ROWS['g_fill'] = [recol(blk.crop((0, 32, 32, 64)), WOOD[:5])]
ROWS['hull'] = [recol(half(TS.crop((256, 192, 320, 256))), ['#05080a', '#101a1d', '#1c2c2e', '#2c4442'])]   # 船舱内墙(远处)
pl = TS.crop((256, 192, 384, 216)); pl = pl.crop(pl.getbbox())                          # 浮空木板保持原大(缩小后太细看不清)
pl = recol(pl, WOOD); ROWS['plat'] = [pl.crop((0, 0, 16, pl.height)), pl.crop((32, 0, 48, pl.height)), pl.crop((pl.width - 16, 0, pl.width, pl.height))]
ROWS['barrel'] = [recol(half(L('pirate_bomb/Sprites/7-Objects/12-Other Objects/Barrel.png')), WOOD)]
cn = L('pirate_bomb/Sprites/7-Objects/16-Enemy-Cannon/1-Idle/1.png'); ROWS['cannon'] = [recol(half(cn), ['#06090b', '#1a2629', '#3a4f50', '#6f8c86', '#a9c4b6'])]
# 桅杆 + 破帆(自画):帆是半透明的灰绿色,有破洞
def mast():
    im = Image.new('RGBA', (90, 220)); d = ImageDraw.Draw(im)
    d.rectangle((43, 0, 47, 219), fill=hexc('#1c2a2e')); d.line((44, 0, 44, 219), fill=hexc('#2f4544'))
    for y0, w in ((20, 70), (100, 84)):
        d.rectangle((45 - w // 2, y0, 45 + w // 2, y0 + 3), fill=hexc('#1c2a2e'))
        h = 64 if y0 == 20 else 70
        pts = [(45 - w // 2 + 3, y0 + 4), (45 + w // 2 - 3, y0 + 4)]
        for i in range(9):
            pts.append((45 + w // 2 - 3 - i * (w - 6) / 8, y0 + 4 + h + RNG.randint(-12, 4)))
        d.polygon(pts, fill=hexc('#9db8aa', 120))
        for k in range(7):   # 破洞
            cx, cy = 45 + RNG.randint(-w // 2 + 8, w // 2 - 8), y0 + 10 + RNG.randint(0, h - 20); r = RNG.randint(2, 6)
            d.ellipse((cx - r, cy - r * .7, cx + r, cy + r * .7), fill=(0, 0, 0, 0))
        for k in range(5):   # 折痕
            x0 = 45 + RNG.randint(-w // 2 + 6, w // 2 - 6); d.line((x0, y0 + 6, x0 + RNG.randint(-4, 4), y0 + h - 6), fill=hexc('#7f9e90', 140))
    d.polygon([(47, 0), (70, 6), (47, 12)], fill=hexc('#3a1830'))   # 破旗
    return im
ROWS['mast'] = [mast()]
def lantern(i):
    im = Image.new('RGBA', (10, 16)); d = ImageDraw.Draw(im)
    d.line((5, 0, 5, 2), fill=hexc('#1c2a2e')); d.rectangle((2, 3, 7, 4), fill=hexc('#2f4544'))
    g = ['#7dffcf', '#b8ffe6', '#5ae0b0'][i]; d.rectangle((2, 5, 7, 12), fill=hexc('#1c2a2e')); d.rectangle((3, 6, 6, 11), fill=hexc(g))
    d.rectangle((2, 13, 7, 14), fill=hexc('#2f4544')); return im
ROWS['lantern'] = [lantern(i) for i in range(3)]
def rail():
    im = Image.new('RGBA', (32, 14)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 31, 2), fill=hexc('#4c6862')); d.line((0, 0, 31, 0), fill=hexc('#7f9e90'))
    for x0 in (2, 12, 22): d.rectangle((x0, 3, x0 + 3, 13), fill=hexc('#2f4544')); d.line((x0, 3, x0, 13), fill=hexc('#4c6862'))
    return outline(im, '#0b1013')
ROWS['rail'] = [rail()]

# ======================= 怪物 =======================
IMP = 'lpc_imp2/LPC Imp 2/'
def lpc_row(p, row, n=4): return frames(L(p), 64, 64, n, row * 64)
wf = crop_all(lpc_row(IMP + 'red/walk - vanilla.png', 2)); ROWS['wimp'] = pad(wf)
ws = crop_all(lpc_row(IMP + 'red/walk - vanilla.png', 3)); ROWS['wimps'] = pad(ws)
wa = crop_all(lpc_row(IMP + 'red/attack - vanilla.png', 3)); ROWS['wimpa'] = pad(wa)
def violet(im):
    a = np.array(im).astype(np.float32); l = lumi(a); m = a[..., 3] > 0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    eye = m & (r > 200) & (g > 180)          # 眼睛 / 牙齿等高亮 → 青色
    a[..., :3] = ramp(l / 200, ['#0a0614', '#2a1048', '#5a2690', '#9a5ad8', '#e0c8ff'])
    a[eye, :3] = hexc('#7dffe6')[:3]; return Image.fromarray(a.astype(np.uint8))
sf_ = crop_all(lpc_row(IMP + 'blue/walk - vanilla.png', 2)); ROWS['swf'] = pad([violet(f) for f in sf_])
ss_ = crop_all(lpc_row(IMP + 'blue/walk - vanilla.png', 3)); ROWS['sws'] = pad([violet(f) for f in ss_])
EY = 'flying_eye/flying eye/'
ei = frames(L(EY + 'Idle/flyingeyesheet.png'), 64, 64, 4); eh = frames(L(EY + 'Hit/flyingeye_hit01_sheet.png'), 64, 64, 4)
both = crop_all(ei + eh); ROWS['eye'] = pad(both[:4]); ROWS['eyeh'] = pad(both[4:])

# ======================= 首领 · 归蝇 =======================
fa = L('fallen_angel.png')
a = np.array(fa); a[222:, :, 3] = 0                       # 去掉脚下的影子
r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
grn = (a[..., 3] > 0) & (g > r + 40) & (g > b + 10)        # 绿色剑光 → 紫色
a[grn, 0] = np.clip(g[grn] * .8 + 40, 0, 255); a[grn, 1] = np.clip(g[grn] * .3, 0, 255); a[grn, 2] = np.clip(g[grn] + 30, 0, 255)
cy_ = (a[..., 3] > 0) & (b > 180) & (g > 150) & (r < 120)  # 青色眼睛 → 发光的紫红
a[cy_, :3] = hexc('#ff5ad8')[:3]
fa = Image.fromarray(a)
bx0, bx1, by0 = 58, 142, 60                                # 身体所在的矩形(原图坐标)
am = np.array(fa); body = np.zeros_like(am); body[by0:, bx0:bx1] = am[by0:, bx0:bx1]
wing = am.copy(); wing[by0:, bx0:bx1] = 0
body = shrink(Image.fromarray(body), 2, 24); wing = shrink(Image.fromarray(wing), 2, 16)
bb = Image.new('RGBA', body.size); bb.alpha_composite(wing); bb.alpha_composite(body); box = bb.getbbox()
ROWS['bwing'] = [wing.crop(box)]; ROWS['bbody'] = [body.crop(box)]
print('boss box', box, 'size', (box[2] - box[0], box[3] - box[1]))
def arms(k):
    """第二对手臂(腰部两侧往前伸的细长利爪),k=0 垂着 / 1 张开"""
    im = Image.new('RGBA', (60, 36)); d = ImageDraw.Draw(im); C = hexc('#2b2b33'); H = hexc('#4a4a56')
    for s in (-1, 1):
        x0 = 30 + s * 8; ang = (0.9 if k == 0 else 0.35) * s
        x1, y1 = x0 + s * 10, 12 + (6 if k == 0 else 0); x2, y2 = x1 + math.sin(ang) * 14, y1 + math.cos(ang) * 14 * (1 if k == 0 else .6)
        d.line((x0, 6, x1, y1), fill=C, width=4); d.line((x1, y1, x2, y2), fill=C, width=3); d.line((x0, 5, x1, y1 - 1), fill=H, width=1)
        for c in (-2, 0, 2): d.line((x2, y2, x2 + s * 3 + c, y2 + 5), fill=hexc('#d0c8e0'), width=1)
    return outline(im, '#050407')
ROWS['barm'] = [arms(0), arms(1)]
def tseg():
    im = Image.new('RGBA', (8, 8)); d = ImageDraw.Draw(im); d.ellipse((0, 1, 7, 6), fill=hexc('#24242c')); d.line((2, 2, 5, 2), fill=hexc('#45455a')); return im
ROWS['tseg'] = [tseg()]
def ttip():
    im = Image.new('RGBA', (14, 14)); d = ImageDraw.Draw(im); d.polygon([(0, 7), (8, 1), (13, 7), (8, 13)], fill=hexc('#24242c')); d.polygon([(3, 7), (8, 4), (10, 7), (8, 10)], fill=hexc('#a040c0'))
    return outline(im, '#050407')
ROWS['ttip'] = [ttip()]
def shard(i):
    im = Image.new('RGBA', (14, 14)); d = ImageDraw.Draw(im)
    P = [[(2, 9), (6, 1), (12, 6), (9, 13)], [(1, 5), (8, 1), (13, 10), (5, 12)], [(4, 1), (12, 4), (10, 12), (2, 10)]][i]
    d.polygon(P, fill=hexc('#2a2633')); d.line(P[:2], fill=hexc('#6a5a88')); d.point(P[1], fill=hexc('#d8a0ff'))
    return outline(im, '#0a0610')
ROWS['shard'] = [shard(i) for i in range(3)]
def orb(i, r, cols):
    n = 2 * r + 2; im = Image.new('RGBA', (n, n)); d = ImageDraw.Draw(im); c = n / 2 - .5
    rr = r - (i % 2)
    d.ellipse((c - rr, c - rr, c + rr, c + rr), fill=hexc(cols[0])); d.ellipse((c - rr + 2, c - rr + 2, c + rr - 2, c + rr - 2), fill=hexc(cols[1]))
    d.ellipse((c - 2, c - 2 - i % 2, c + 1, c + 1 - i % 2), fill=hexc(cols[2])); return im
ROWS['orb'] = [orb(i, 5, ['#8a1a6a', '#ff5ad8', '#ffe0f6']) for i in range(3)]
ROWS['mball'] = [orb(i, 7, ['#3a1478', '#9a5ad8', '#f0e0ff']) for i in range(3)]

# ======================= 打包 =======================
order = ['sky', 'stars', 'moon', 'cl1', 'cl2', 'gship', 'g_top', 'g_fill', 'hull', 'plat', 'barrel', 'cannon', 'mast', 'lantern', 'rail',
         'wimp', 'wimps', 'wimpa', 'swf', 'sws', 'eye', 'eyeh', 'bwing', 'bbody', 'barm', 'tseg', 'ttip', 'shard', 'orb', 'mball']
W = max(max(f.width for f in ROWS[k]) * len(ROWS[k]) for k in order); W = max(W, 400)
meta = {}; y = 0; small_x = None; small_y = 0; placed = []
for k in order:
    fs = ROWS[k]; fw = max(f.width for f in fs); fh = max(f.height for f in fs); fs = pad(fs, fw, fh)
    if len(fs) == 1 and fw < 80 and fh < 80:
        if small_x is None or small_x + fw > W: small_x = 0; small_y = y; y += 80
        placed.append((fs[0], small_x, small_y)); meta[k] = [small_y, fw, fh, 1, small_x]; small_x += fw + 1; continue
    placed += [(f, i * fw, y) for i, f in enumerate(fs)]; meta[k] = [y, fw, fh, len(fs)]; y += fh + 1
at = Image.new('RGBA', (W, y))
for f, px, py in placed: at.alpha_composite(f, (px, py))
at = at.crop((0, 0, W, at.getbbox()[3]))
out = os.path.join(R, 'assets/ship10_atlas.png'); at.save(out, optimize=True)
print(at.size, os.path.getsize(out))
print(json.dumps(meta, separators=(',', ':')))
