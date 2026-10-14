# 第八关「幽魂都市」怪物 / 首领图集 GH8(2026-10-13):
#   飞行鬼魂:Ghost monster(ImogiaGames,CC0,Balmer「Skeleton and Ghost」的重制)https://opengameart.org/content/ghost-monster
#            —— 白色一行(普通);灰色一行压成黑紫 + 红眼(精英)
#   陆地鬼魂:GothicVania Cemetery Pack(ansimuz,CC0)https://opengameart.org/content/gothicvania-cemetery-pack 的 ghost / ghost-halo(精英)
#   假人(精英陆地鬼魂伪装的路人):Streets of Fight(ansimuz,CC0)的 Enemy Punk 待机帧,压暗
#   自画像素:怨婴「银太郎」(浮空的婴儿,6 帧)+ 它的巨大黑影投影、巨型鬼爪、地面鬼手(3 帧)、黑色摇篮、鬼火(4 帧)、窗后的鬼影、女神灵魂碎片
# 用法:python art_src/city/build_gh8.py → assets/gh8_atlas.png + 打印 meta(贴进源码 GH8.M)
import json, os, math
import numpy as np
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(__file__), '..', '..')
CEM = os.path.join(R, 'raw/ghost/gothicvania-cemetery-files_1/gothicvania-cemetery-files/PNG/Sprites')
PUNK = os.path.join(R, 'raw/city/streets_of_fight_files/Streets of Fight files/Sprites/Enemy-Punk/Idle')
def L(p): return Image.open(p).convert('RGBA')
def hexc(h, a=255): h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
def outline(im, col='#0b0910'):
    a = np.array(im); al = a[..., 3] > 0; o = np.zeros_like(al)
    o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]; o &= ~al
    a[o] = hexc(col); return Image.fromarray(a)
def trim_box(ims):
    bb = None
    for im in ims:
        b = im.getbbox()
        if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    return bb

# ---- 飞行鬼魂 ----
G = L(os.path.join(R, 'raw/ghost/monster-ghost-11variations.png'))
fly = [G.crop((i * 32, 3 * 32, i * 32 + 32, 4 * 32)) for i in range(6)]
def dark_ghost(im):
    a = np.array(im).astype(np.float32); al = a[..., 3] > 0; rgb = a[..., :3]; lum = rgb @ np.array([.3, .59, .11])
    out = np.stack([lum * .32 + 18, lum * .22 + 8, lum * .42 + 26], -1)
    eye = al & (lum < 60)
    out[eye] = [255, 40, 50]
    a[..., :3] = np.clip(out, 0, 255); return Image.fromarray(a.astype(np.uint8))
fly2 = [dark_ghost(G.crop((i * 32, 10 * 32, i * 32 + 32, 11 * 32))) for i in range(6)]

# ---- 陆地鬼魂(Cemetery)----
land = [L(os.path.join(CEM, 'ghost/ghost-%d.png' % i)) for i in range(1, 5)]
land2 = [L(os.path.join(CEM, 'ghost-halo/ghost-halo-%d.png' % i)) for i in range(1, 5)]
punk = []
for i in range(1, 5):
    p = L(os.path.join(PUNK, 'idle%d.png' % i)); a = np.array(p).astype(np.float32); a[..., :3] *= np.array([.62, .62, .72]); punk.append(Image.fromarray(a.astype(np.uint8)))
bb = trim_box(punk); punk = [p.crop(bb) for p in punk]

# ---- 怨婴(自画):28×30,脚底(襁褓尾巴)在底边,面朝右 ----
SK = ['#e6e9f0', '#b9c0cf', '#7c8499']; CL = ['#dcd5c6', '#a8a091', '#6e675b']
def ell(a, cx, cy, rx, ry):
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]; return ((xx + .5 - cx) / rx) ** 2 + ((yy + .5 - cy) / ry) ** 2 <= 1
def baby(mouth=0, arm=0, tear=0, sq=0):
    Wd, Hd = 28, 30; a = np.zeros((Hd, Wd, 4), np.uint8)
    def put(m, c): a[m] = hexc(c)
    yy, xx = np.mgrid[0:Hd, 0:Wd]
    # 襁褓 + 破布尾巴(飘在身后左下)
    body = ell(a, 13, 22 + sq, 7.5, 6)
    tail = ((xx < 9) & (xx > 1) & (yy > 20) & (yy < 29) & ((yy - 20) * 1.1 > (9 - xx) * .6)) & ~((xx % 3 == 0) & (yy > 25))
    put(body | tail, CL[0]); put((body | tail) & (yy > 23 + sq), CL[1]); put(tail & (yy > 26), CL[2])
    for k in range(3): put((xx == 6 + k * 4) & (yy >= 19 + sq) & (yy <= 27), CL[1])
    # 头
    head = ell(a, 16, 10 + sq, 8.6, 8.2)
    put(head, SK[0]); put(head & ((xx - 10) + (yy - 10) * .6 > 7), SK[1]); put(head & (xx < 10) & (yy > 12), SK[1])
    # 稀疏的头发
    for hx in (13, 16, 19): a[1 + sq, hx] = hexc('#3a3442')
    # 眼睛:大黑眼眶 + 红色小瞳孔
    for ex in (14, 20):
        m = ell(a, ex + .5, 10 + sq, 1.9, 2.6); put(m, '#050308'); a[10 + sq, ex] = hexc('#ff2a2a')
    if tear:
        for ex in (14, 20):
            for k in range(3, 6 + tear): a[min(Hd - 1, 10 + sq + k), ex] = hexc('#0b0910')
    # 嘴
    if mouth == 0: a[15 + sq, 17] = a[15 + sq, 18] = hexc('#3a1a24')
    else:
        m = ell(a, 18, 15.5 + sq, 2.2 + mouth * .6, 1.4 + mouth * .7); put(m, '#2a0d14'); a[int(15 + sq), 18] = hexc('#7a1f2a')
    # 小手
    if arm:
        for k in range(6): a[17 + sq - k, 21 + k // 2] = hexc(SK[1]); a[17 + sq - k, 22 + k // 2] = hexc(SK[0])
        for fx, fy in ((24, 10), (25, 11), (23, 10)): a[fy + sq, fx] = hexc(SK[0])
    else:
        put(ell(a, 21, 20 + sq, 2.2, 1.6), SK[0])
    return outline(Image.fromarray(a))
babyF = [baby(0, 0, 0, 0), baby(0, 0, 0, 1), baby(2, 0, 1, 0), baby(3, 0, 2, 1), baby(1, 1, 0, 0), baby(1, 0, 3, 0)]
# 0 1 待机呼吸 · 2 3 哭 · 4 抬手 · 5 受伤
def shadowify(im, eye=True):
    a = np.array(im); al = a[..., 3] > 0; red = (a[..., 0] > 200) & (a[..., 1] < 80)
    b = np.zeros_like(a); b[al] = (10, 6, 16, 255)
    if eye: b[red] = (255, 40, 40, 255)
    return Image.fromarray(b)
babyS = [shadowify(babyF[i]) for i in (0, 2, 4)]

# ---- 巨型鬼爪(朝右伸):72×40 ----
claw = Image.new('RGBA', (72, 40), (0, 0, 0, 0)); d = ImageDraw.Draw(claw)
d.polygon([(0, 14), (40, 12), (48, 8), (52, 30), (40, 28), (0, 26)], fill=hexc('#120c18'))
for k, (fy, ln) in enumerate(((6, 18), (15, 22), (24, 20), (32, 14))):
    d.line([(46, 12 + k * 5), (52 + ln * .5, fy), (54 + ln, fy + 3)], fill=hexc('#120c18'), width=4)
    d.line([(54 + ln, fy + 3), (58 + ln, fy + 8)], fill=hexc('#e8e4f0'), width=2)
for k in range(0, 40, 5): d.line([(k, 15), (k + 3, 18)], fill=hexc('#2a1f36'))
claw = outline(claw, '#3a1f4a')

# ---- 地面鬼手:22×44(手掌朝上张开)----
hand = Image.new('RGBA', (22, 44), (0, 0, 0, 0)); d = ImageDraw.Draw(hand)
d.rectangle([7, 18, 14, 43], fill=hexc('#18121e')); d.ellipse([4, 12, 17, 24], fill=hexc('#18121e'))
for k, fx in enumerate((3, 7, 11, 15, 18)):
    top = [4, 1, 0, 2, 9][k]; d.line([(fx if k < 4 else 17, 16), (fx + (k - 2) * .5, top)], fill=hexc('#18121e'), width=3)
    d.point((fx + (k - 2) * .5, top - 1), fill=hexc('#e8e4f0'))
for yy in range(20, 44, 4): d.line([(8, yy), (13, yy + 1)], fill=hexc('#2c2236'))
hand = outline(hand, '#3a1f4a')

# ---- 黑色摇篮:40×34 ----
cr = Image.new('RGBA', (40, 34), (0, 0, 0, 0)); d = ImageDraw.Draw(cr)
d.arc([1, 22, 38, 38], 200, 340, fill=hexc('#3a2c44'), width=2)            # 底下的弧形摇杆
d.chord([3, 6, 36, 30], 0, 180, fill=hexc('#241a2a'))                       # 篮身(椭圆下半)
for k in range(8, 34, 4): d.line([(k, 19), (k, 27)], fill=hexc('#120c18'))   # 竹篾
d.line([(3, 18), (36, 18)], fill=hexc('#4a3a56'))                           # 篮沿
d.pieslice([3, 2, 31, 34], 180, 270, fill=hexc('#1c1520'))                  # 左边的篷
for k in range(3): d.arc([5 + k * 3, 4 + k * 3, 29 - k * 3, 32 - k * 3], 180, 270, fill=hexc('#2c2236'))
d.rectangle([18, 14, 32, 17], fill=hexc('#6b5b7a'))                          # 露出来的破襁褓
d.point((20, 13), fill=hexc('#ff2a2a')); d.point((23, 13), fill=hexc('#ff2a2a'))  # 篷下一双红眼cr = outline(cr, '#5a2a7a')

# ---- 鬼火:12×14 × 4 帧 ----
fire = []
for i in range(4):
    f = Image.new('RGBA', (12, 14), (0, 0, 0, 0)); d = ImageDraw.Draw(f)
    sway = [0, 1, 0, -1][i]
    d.ellipse([2, 5, 10, 13], fill=hexc('#2fbf9f')); d.polygon([(3, 8), (6 + sway, 0), (9, 8)], fill=hexc('#2fbf9f'))
    d.ellipse([4, 7, 8, 12], fill=hexc('#a8ffe8')); d.point((6 + sway, 3), fill=hexc('#a8ffe8'))
    d.point((5, 9), fill=hexc('#0b2a24')); d.point((7, 9), fill=hexc('#0b2a24'))
    fire.append(f)

# ---- 窗后的鬼影:10×16 ----
wg = Image.new('RGBA', (10, 16), (0, 0, 0, 0)); d = ImageDraw.Draw(wg)
d.ellipse([2, 0, 8, 6], fill=hexc('#08060c')); d.rectangle([1, 6, 9, 15], fill=hexc('#08060c')); d.point((4, 3), fill=hexc('#ff3b3b')); d.point((6, 3), fill=hexc('#ff3b3b'))

# ---- 女神灵魂碎片:12×16 ----
sh = Image.new('RGBA', (12, 16), (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
d.polygon([(6, 0), (11, 6), (7, 15), (2, 9), (1, 4)], fill=hexc('#b197fc')); d.polygon([(6, 0), (11, 6), (6, 8)], fill=hexc('#e5dbff'))
d.polygon([(2, 9), (6, 8), (7, 15)], fill=hexc('#7048e8')); d.point((7, 4), fill=hexc('#ffffff'))
sh = outline(sh, '#2b1a4a')

# ---------- 拼图集:每种一行,帧横排 ----------
ROWS = [('fly', fly), ('fly2', fly2), ('land', land), ('land2', land2), ('punk', punk), ('baby', babyF), ('babyS', babyS), ('claw', [claw]), ('hand', [hand]), ('cradle', [cr]), ('fire', fire), ('wg', [wg]), ('shard', [sh])]
AW = max(sum(f.width for f in fr) for _, fr in ROWS); M = {}; y = 0; placed = []
for k, fr in ROWS:
    w, h = fr[0].width, max(f.height for f in fr)
    M[k] = [y, w, h, len(fr)]
    for i, f in enumerate(fr): placed.append((f, i * w, y))
    y += h + 1
out = Image.new('RGBA', (AW, y), (0, 0, 0, 0))
for f, a, b in placed: out.alpha_composite(f, (a, b))
out.save(os.path.join(R, 'assets/gh8_atlas.png'), optimize=True)
print(json.dumps(M, separators=(',', ':')))
print('size', out.size)
