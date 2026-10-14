# 第八关「幽魂都市」场景图集 CITY8(2026-10-13):
#   素材 1:Streets of Fight(ansimuz,CC0)https://opengameart.org/content/streets-of-fight
#          —— 街道店面(披萨店 / 橱窗)、红砖楼墙块(窗 / 门 / 水管 / 栏杆)、车库、涂鸦墙、人行道、汽车、消防栓、油桶
#   素材 2:Warped City(ansimuz,CC0)https://opengameart.org/content/warped-city —— 远景天际线 / 楼群(换成阴森的暗紫灰)
#   其余自画像素(同一套暗色调):路灯、垃圾桶、斑马线、居民楼破窗 / 半开的门 / 电梯 / 外楼梯、医院外墙 / 红十字 / 百叶窗、
#   地铁入口、地下通道的天花板 / 瓷砖墙 / 柱子 / 破海报、地面(医院地砖 / 地下水泥地)、铁格平台、首领战掩体(倒下的自动售货机)
# 改动:按段落压暗、偏冷色;店面招牌保留原色(霓虹在夜里更显眼)。
# 用法:python art_src/city/build_city8.py  → assets/city8_atlas.png + 打印 meta(贴进源码 CITY8.M)
import json, os, random
import numpy as np
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(__file__), '..', '..')
SOF = os.path.join(R, 'raw/city/streets_of_fight_files/Streets of Fight files/Stage Layers')
WC = os.path.join(R, 'raw/city/warped_city_files/warped city files/ENVIRONMENT/background')
random.seed(8)

def L(p): return Image.open(p).convert('RGBA')
T = L(os.path.join(SOF, 'tileset.png'))
def cut(x0, y0, x1, y1): return T.crop((x0, y0, x1, y1))

def tint(im, mul, add=(0, 0, 0), keep_sat=0):
    a = np.array(im).astype(np.float32)
    rgb = a[..., :3]
    if keep_sat:  # 霓虹(饱和度高、亮)的像素少压一点
        mx = rgb.max(-1); mn = rgb.min(-1); sat = (mx - mn) / (mx + 1)
        k = np.clip((sat - .45) * 2.5, 0, 1)[..., None] * (mx[..., None] > 150)
    else:
        k = 0
    out = rgb * np.array(mul)[None, None] + np.array(add)[None, None]
    rgb = out * (1 - k) + rgb * k
    a[..., :3] = np.clip(rgb, 0, 255)
    return Image.fromarray(a.astype(np.uint8))

def hexc(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def outline(im, col='#0d0b14'):
    a = np.array(im); al = a[..., 3] > 0
    o = np.zeros_like(al)
    o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]
    o &= ~al
    a[o] = hexc(col)
    return Image.fromarray(a)

# ---------- 墙块 ----------
shopA = cut(0, 0, 224, 96); shopC = cut(288, 0, 512, 96); pillB = cut(240, 0, 272, 96)
def module_cols(y0, y1, x0=0, x1=544):
    a = np.array(T)[y0:y1, x0:x1, 3].max(0) > 0
    runs = []; s = None
    for i, v in enumerate(list(a) + [False]):
        if v and s is None: s = i
        if not v and s is not None: runs.append((x0 + s, x0 + i)); s = None
    return runs
MODS = [cut(a, 112, b, 208) for a, b in module_cols(112, 208)]
# 0 砖柱 · 1 砖墙 · 2 水管 · 3 拱窗 · 4 门 · 5 砖柱窄 · 6 暗柱 · 7 栏杆 · 8 栏杆 + 暗柱
garage1 = cut(176, 224, 288, 320); garage2 = cut(304, 224, 416, 320); graffiti = cut(432, 224, 528, 320)
walk = cut(48, 224, 160, 284)  # 人行道(地面条)
car = L(os.path.join(SOF, 'props/car.png')); hyd = L(os.path.join(SOF, 'props/hydrant.png')); barrel = L(os.path.join(SOF, 'props/barrel.png'))

W, H = 3200, 300
world = Image.new('RGBA', (W, H), (0, 0, 0, 0))
D = ImageDraw.Draw(world)

def paste(im, x, y):
    world.alpha_composite(im, (int(x), int(y)))

def floor_row(x, w, y, pat):
    """一层楼:按 pat 的模块号从左到右铺满宽度 w"""
    i = 0; cx = x
    while cx < x + w:
        m = MODS[pat[i % len(pat)]]
        if cx + m.width > x + w: m = m.crop((0, 0, x + w - cx, m.height))
        paste(m, cx, y); cx += m.width; i += 1

def cornice(x, w, y, c1='#2b2530', c2='#4a4150'):
    D.rectangle([x - 2, y - 5, x + w + 1, y], fill=hexc(c1)); D.line([x - 2, y - 5, x + w + 1, y - 5], fill=hexc(c2))

def lamp(x, top=170, lit=True):
    D.rectangle([x, top, x + 2, 300], fill=hexc('#2e3440')); D.line([x, top, x, 300], fill=hexc('#4c566a'))
    D.rectangle([x - 2, 296, x + 4, 300], fill=hexc('#2e3440'))
    D.line([x + 1, top, x + 12, top - 6], fill=hexc('#2e3440'), width=2)
    D.rectangle([x + 9, top - 8, x + 17, top - 4], fill=hexc('#3b4252'))
    D.rectangle([x + 10, top - 4, x + 16, top - 3], fill=hexc('#ffe9a8' if lit else '#5a5a60'))

def trashbin(x):
    D.rectangle([x, 278, x + 14, 300], fill=hexc('#3a4a3c')); D.rectangle([x - 1, 275, x + 15, 278], fill=hexc('#2c3a2e'))
    for k in range(3): D.line([x + 3 + k * 4, 280, x + 3 + k * 4, 298], fill=hexc('#2a362b'))
    D.line([x, 278, x + 14, 278], fill=hexc('#55665a'))

# ===== 第一段:城市街道 0 ~ 960 =====
def bldg(x, ground, floors, pat, top_col='#2b2530'):
    paste(ground, x, 300 - ground.height)
    w = ground.width
    for f in range(floors): floor_row(x, w, 300 - ground.height - 96 * (f + 1), pat)
    cornice(x, w, 300 - ground.height - 96 * floors, top_col)
    return x + w

x = 0
x = bldg(0, shopA, 1, [1, 3, 1, 3, 2])
lamp(236)
x = bldg(260, shopC, 2, [3, 1, 3, 1, 3])
x = bldg(484, garage1, 1, [3, 1])
x = bldg(596, graffiti, 1, [1, 3])
# 690 ~ 780 路口(斑马线画在地面上,看得到远景)
lamp(700); lamp(770)
x = bldg(790, garage2, 2, [3, 1])
x = bldg(902, pillB, 2, [5])
paste(car, 320, 300 - 46); paste(hyd, 470, 300 - 34); paste(barrel.crop((0, 0, 32, 48)), 552, 300 - 46); trashbin(208); trashbin(612); lamp(440); lamp(140)

# ===== 第二段:老旧居民楼 960 ~ 1600(三层、更暗;破窗、半开的门、外楼梯、电梯)=====
def apt(x, w, floors, gpat, upat):
    floor_row(x, w, 204, gpat)
    for f in range(floors): floor_row(x, w, 204 - 96 * (f + 1), upat)
    cornice(x, w, 204 - 96 * floors, '#231f26')
apt(960, 200, 2, [0, 4, 1, 3], [0, 3, 1, 3])
apt(1170, 150, 2, [5, 1, 1, 5], [5, 3, 3, 5])
apt(1330, 270, 2, [0, 3, 4, 2, 7, 0], [0, 3, 1, 3, 8, 0])
# 破窗:在拱窗上画碎玻璃裂纹
def crack(cx, cy):
    for a in range(6):
        ang = a * 1.05 + random.random() * .4; L_ = random.randint(5, 9)
        D.line([cx, cy, cx + int(np.cos(ang) * L_), cy + int(np.sin(ang) * L_)], fill=hexc('#0b0910'))
    D.rectangle([cx - 2, cy - 2, cx + 2, cy + 2], fill=hexc('#05040a'))
for cx, cy in [(1007, 155), (1007, 60), (1221, 157), (1385, 60), (1433, 156)]: crack(cx, cy)
# 半开的门:门缝里一片漆黑
D.polygon([(1017, 236), (1029, 240), (1029, 290), (1017, 296)], fill=hexc('#06050a'))
# 电梯(自画):金属双开门 + 楼层指示灯
ex = 1222; D.rectangle([ex - 4, 222, ex + 40, 300], fill=hexc('#2b2d33')); D.rectangle([ex, 228, ex + 36, 300], fill=hexc('#6a707c'))
D.line([ex + 18, 228, ex + 18, 300], fill=hexc('#2b2d33')); D.rectangle([ex + 8, 214, ex + 28, 220], fill=hexc('#14141a'))
D.rectangle([ex + 15, 215, ex + 21, 219], fill=hexc('#ff4040')); D.line([ex + 2, 230, ex + 2, 298], fill=hexc('#9aa0ac')); D.line([ex + 20, 230, ex + 20, 298], fill=hexc('#9aa0ac'))
# 外楼梯:斜着往上的铁楼梯 + 扶手
for k in range(14):
    sx = 1540 - k * 8; sy = 296 - k * 7
    D.rectangle([sx, sy, sx + 10, sy + 2], fill=hexc('#3b3f4a'))
D.line([1550, 286, 1438, 188], fill=hexc('#59606e'), width=1); D.line([1550, 296, 1438, 198], fill=hexc('#2a2d35'), width=1)
for k in range(0, 14, 3): D.line([1546 - k * 8, 288 - k * 7, 1546 - k * 8, 296 - k * 7], fill=hexc('#59606e'))
trashbin(1150); trashbin(1312)
seg2 = world.crop((960, 0, 1600, 300)); world.paste(tint(seg2, (.62, .62, .74), keep_sat=1), (960, 0))

# ===== 第三段:废弃医院 1600 ~ 2240(自画)=====
hx0, hx1 = 1600, 2240
D.rectangle([hx0, 70, hx1, 300], fill=hexc('#7c8a86'))
for yy in range(70, 300, 8): D.line([hx0, yy, hx1, yy], fill=hexc('#6f7c78'))
for xx in range(hx0, hx1, 16):
    for yy in range(70, 300, 16): D.line([xx + (8 if (yy // 16) % 2 else 0), yy, xx + (8 if (yy // 16) % 2 else 0), yy + 7], fill=hexc('#6f7c78'))
D.rectangle([hx0, 64, hx1, 70], fill=hexc('#3d4644')); D.rectangle([hx0, 196, hx1, 202], fill=hexc('#2f6f62'))
def hwin(x, y, kind):
    D.rectangle([x - 1, y - 1, x + 33, y + 41], fill=hexc('#3d4644'))
    D.rectangle([x, y, x + 32, y + 40], fill=hexc('#10161a' if kind != 1 else '#1c2a2a'))
    if kind == 1:  # 百叶窗半拉下
        for k in range(0, 22, 3): D.line([x, y + k, x + 32, y + k], fill=hexc('#a9b3ae'))
    if kind == 2:  # 窗后一个人影
        D.ellipse([x + 12, y + 10, x + 20, y + 19], fill=hexc('#05080a')); D.rectangle([x + 10, y + 18, x + 22, y + 40], fill=hexc('#05080a'))
    if kind == 3: crack(x + 16, y + 18)
    D.line([x + 16, y, x + 16, y + 40], fill=hexc('#3d4644')); D.line([x, y + 20, x + 32, y + 20], fill=hexc('#3d4644'))
kinds = [0, 1, 3, 0, 2, 1, 0, 3, 1, 0, 1, 2, 0, 3, 1, 0]
for i, xx in enumerate(range(hx0 + 24, hx1 - 30, 40)):
    hwin(xx, 92, kinds[i % len(kinds)])
    if not (1830 < xx < 1960): hwin(xx, 220, kinds[(i + 5) % len(kinds)])
# 大门(急诊入口):玻璃门 + 红十字灯箱
D.rectangle([1834, 212, 1958, 300], fill=hexc('#2f3836')); D.rectangle([1842, 222, 1950, 300], fill=hexc('#0d1416'))
D.line([1896, 222, 1896, 300], fill=hexc('#2f3836'), width=2); D.rectangle([1842, 222, 1950, 226], fill=hexc('#41504c'))
D.polygon([(1897, 226), (1914, 232), (1914, 296), (1897, 300)], fill=hexc('#1d2a2c'))  # 半开的玻璃门
D.rectangle([1874, 160, 1918, 196], fill=hexc('#e9ecef')); D.rectangle([1874, 160, 1918, 162], fill=hexc('#ced4da'))
D.rectangle([1892, 166, 1900, 190], fill=hexc('#d0262b')); D.rectangle([1884, 174, 1908, 182], fill=hexc('#d0262b'))
paste(outline(Image.open(os.path.join(SOF, 'props/barrel.png')).convert('RGBA').crop((32, 0, 64, 48))), 2040, 254)
seg3 = world.crop((1600, 0, 2240, 300)); world.paste(tint(seg3, (.5, .56, .58)), (1600, 0))

# ===== 第四段:地下通道 2240 ~ 3200(自画):地铁入口 → 隧道(首领在 2570 ~ 3180 的站台)=====
ux0 = 2240
D.rectangle([ux0, 0, W, 300], fill=hexc('#2a2c33'))
for xx in range(ux0, W, 12):
    for yy in range(44, 300, 12): D.rectangle([xx, yy, xx + 11, yy + 11], outline=hexc('#23252b'), fill=hexc('#34373f' if (xx // 12 + yy // 12) % 7 else '#2e3037'))
D.rectangle([ux0, 0, W, 40], fill=hexc('#16171c')); D.rectangle([ux0, 40, W, 44], fill=hexc('#0d0e12'))
for xx in range(ux0, W, 2):
    if random.random() < .35: D.point((xx, 44 + random.randint(0, 30)), fill=hexc('#22242a'))
for yy in range(244, 300, 1):
    D.line([ux0, yy, W, yy], fill=hexc('#202227') if yy % 2 else hexc('#25272d'))
D.rectangle([ux0, 240, W, 244], fill=hexc('#7a6a2a'))
# 灯管(灭的 / 亮的,亮度运行时叠加)
for xx in range(ux0 + 40, W, 120): D.rectangle([xx, 41, xx + 40, 44], fill=hexc('#c9d6d8'))
# 柱子
for xx in list(range(ux0 + 110, W, 160)):
    D.rectangle([xx, 44, xx + 22, 300], fill=hexc('#3e414a')); D.line([xx, 44, xx, 300], fill=hexc('#50545e')); D.line([xx + 22, 44, xx + 22, 300], fill=hexc('#1c1d22'))
    D.rectangle([xx - 2, 44, xx + 24, 52], fill=hexc('#2b2d33'))
# 破海报
for xx, c in [(ux0 + 60, '#7a2f3a'), (ux0 + 380, '#2f4d7a'), (ux0 + 700, '#6a5a2a'), (ux0 + 860, '#7a2f3a')]:
    D.rectangle([xx, 150, xx + 30, 196], fill=hexc(c)); D.polygon([(xx + 18, 196), (xx + 30, 176), (xx + 30, 196)], fill=hexc('#2a2c33'))
    D.rectangle([xx + 4, 156, xx + 26, 166], fill=hexc('#d8d2c0'))
# 地铁入口:往下的台阶 + 扶手 + 牌子底板(字运行时写)
D.rectangle([ux0, 0, ux0 + 70, 300], fill=hexc('#121317'))
for k in range(10): D.rectangle([ux0 + 6 + k * 6, 240 + k * 6, ux0 + 70, 244 + k * 6], fill=hexc('#2a2c33'))
D.rectangle([ux0 + 4, 140, ux0 + 66, 160], fill=hexc('#1b5e9a')); D.rectangle([ux0 + 4, 140, ux0 + 66, 141], fill=hexc('#4d8fcc'))
# 地下通道到 2570 为止:右边是往上的出口台阶
AX = 2570
for k in range(12): D.rectangle([AX - 80 + k * 6, 296 - k * 6, AX, 300 - k * 6], fill=hexc('#3a3d46'))
D.rectangle([AX - 84, 120, AX - 20, 138], fill=hexc('#1b5e9a')); D.rectangle([AX - 84, 120, AX - 20, 121], fill=hexc('#4d8fcc'))
world.paste(tint(world.crop((ux0, 0, AX, 300)), (.78, .8, .86)), (ux0, 0))
# ===== 首领场地 2570 ~ 3200:地铁出口外的十字路口(夜空下的老公寓楼群,窗户 / 路灯在「百鬼哭夜」时运行时点亮 / 熄灭)=====
D.rectangle([AX, 0, W, 300], fill=(0, 0, 0, 0))
WINS = []; LAMPS = []
def tower(x0, x1, top, base='#3a3640', dark='#2a272f'):
    D.rectangle([x0, top, x1, 300], fill=hexc(base)); D.rectangle([x0, top, x1, top + 5], fill=hexc(dark))
    for yy in range(top + 14, 230, 30):
        D.line([x0, yy + 20, x1, yy + 20], fill=hexc(dark))  # 阳台线
        for xx in range(x0 + 10, x1 - 16, 26):
            D.rectangle([xx, yy, xx + 11, yy + 14], fill=hexc('#121118')); D.line([xx, yy + 7, xx + 11, yy + 7], fill=hexc('#1c1a22'))
            WINS.append([xx, yy, 12, 15])
tower(2600, 2760, 40); tower(2770, 2900, 80, '#34313b'); tower(2910, 3090, 24); tower(3100, 3200, 70, '#34313b')
# 一楼:关着的卷帘门店面
for xx in range(2600, 3200, 112): paste(tint(garage2, (.5, .5, .6)), xx, 204)
for i, lx in enumerate((2650, 2890, 3130)):
    lamp(lx, 160); LAMPS.append([lx + 13, 155])
world.paste(tint(world.crop((AX, 0, W, 300)), (.72, .72, .84), keep_sat=1), (AX, 0))
LAMPS1 = [[l + 13, 165] for l in (236, 700, 770, 440, 140)]
# 首领场地两侧的卷帘门(只在首领战时画,单独放在图集里)

# ---------- 远景(Warped City 天际线 / 楼群,换成暗紫灰)----------
def gloom(im, base=(.42, .38, .55)):
    a = np.array(im).astype(np.float32); rgb = a[..., :3]
    lum = rgb @ np.array([.3, .59, .11])
    bright = lum > 170
    out = lum[..., None] * np.array(base)[None, None]
    out[bright] = np.array([210, 190, 120]) * (lum[bright][:, None] / 255) * .75  # 亮窗变成昏黄
    a[..., :3] = np.clip(out, 0, 255); return Image.fromarray(a.astype(np.uint8))
sky1 = gloom(L(os.path.join(WC, 'skyline-a.png')), (.3, .28, .42))
far = gloom(L(os.path.join(WC, 'buildings-bg.png')), (.36, .32, .48))
near = gloom(L(os.path.join(WC, 'near-buildings-bg.png')), (.42, .38, .52))

# ---------- 地面条(60 高)----------
def gtile_street():
    g = tint(walk, (.7, .7, .8)); return g
def gtile(kind):
    g = Image.new('RGBA', (64, 60), hexc('#000000')); d = ImageDraw.Draw(g)
    if kind == 'hos':
        for yy in range(60): d.line([0, yy, 63, yy], fill=hexc('#5a6462' if yy > 2 else '#8c9894'))
        for xx in range(0, 64, 16): d.line([xx, 3, xx, 59], fill=hexc('#4c5654'))
        for yy in range(3, 60, 12): d.line([0, yy, 63, yy], fill=hexc('#4c5654'))
        d.point((20, 30), fill=hexc('#3a2026')); d.point((21, 31), fill=hexc('#3a2026'))
    else:
        for yy in range(60): d.line([0, yy, 63, yy], fill=hexc('#2c2e34' if yy > 3 else '#4a4d56'))
        d.rectangle([0, 6, 63, 8], fill=hexc('#8a7a2a'))
        for xx in range(0, 64, 8): d.rectangle([xx, 6, xx + 3, 8], fill=hexc('#2c2e34'))
        for _ in range(20): d.point((random.randint(0, 63), random.randint(12, 59)), fill=hexc('#24262b'))
    return g
G_st = gtile_street(); G_apt = tint(walk, (.55, .55, .66)); G_hos = tint(gtile('hos'), (.8, .85, .85)); G_und = gtile('und')

# ---------- 平台(铁格栅,4 块 16×12)----------
plat = Image.new('RGBA', (64, 12), (0, 0, 0, 0)); d = ImageDraw.Draw(plat)
for i in range(4):
    x0 = i * 16
    d.rectangle([x0, 0, x0 + 15, 3], fill=hexc('#59606e')); d.line([x0, 0, x0 + 15, 0], fill=hexc('#8a93a3'))
    d.rectangle([x0, 4, x0 + 15, 7], fill=hexc('#2b2f38'))
    for k in range(x0 + 1, x0 + 15, 3): d.line([k, 4, k + 2, 7], fill=hexc('#464c59'))
    d.rectangle([x0, 8, x0 + 15, 9], fill=hexc('#3b414d'))
    if i == 0: d.rectangle([x0, 0, x0 + 1, 11], fill=hexc('#3b414d'))
    if i == 3: d.rectangle([x0 + 14, 0, x0 + 15, 11], fill=hexc('#3b414d'))
    if i == 2: d.point((x0 + 7, 2), fill=hexc('#c9d0db'))

# ---------- 首领场地道具:倒下的自动售货机(掩体)、卷帘门 ----------
vend = Image.new('RGBA', (34, 60), (0, 0, 0, 0)); d = ImageDraw.Draw(vend)
d.rectangle([2, 4, 31, 59], fill=hexc('#7a2230')); d.rectangle([5, 8, 22, 40], fill=hexc('#14181e'))
for k in range(4):
    for j in range(3): d.rectangle([7 + j * 5, 11 + k * 7, 10 + j * 5, 15 + k * 7], fill=hexc(['#3a86c8', '#e8b33a', '#4fb06a', '#d84a4a'][(k + j) % 4]))
d.rectangle([24, 12, 29, 26], fill=hexc('#2a2d33')); d.rectangle([25, 14, 28, 16], fill=hexc('#66ff99'))
d.rectangle([6, 46, 22, 54], fill=hexc('#14181e')); d.rectangle([2, 4, 31, 6], fill=hexc('#a33242'))
d.line([12, 8, 20, 30], fill=hexc('#d9dde3')); d.line([20, 30, 14, 40], fill=hexc('#d9dde3'))
vend = outline(vend)
shutter = tint(garage2, (.6, .6, .7)).crop((8, 10, 104, 96))

# ---------- 拼图集 ----------
items = [('world', world), ('sky', sky1), ('far', far), ('near', near), ('g_st', G_st), ('g_apt', G_apt), ('g_hos', G_hos), ('g_und', G_und), ('plat', plat), ('vend', vend), ('shut', shutter)]
AW = W; y = 0; M = {}; placed = []
x = 0; rowh = 0
for k, im in items:
    if k == 'world':
        M[k] = [0, 0, im.width, im.height]; placed.append((im, 0, 0)); y = im.height; continue
    if x + im.width > AW: x = 0; y += rowh; rowh = 0
    M[k] = [x, y, im.width, im.height]; placed.append((im, x, y)); x += im.width + 1; rowh = max(rowh, im.height + 1)
out = Image.new('RGBA', (AW, y + rowh), (0, 0, 0, 0))
for im, a, b in placed: out.alpha_composite(im, (a, b))
out.save(os.path.join(R, 'assets/city8_atlas.png'), optimize=True)
M['lamps'] = LAMPS; M['lamps1'] = LAMPS1; M['wins'] = WINS
print(json.dumps(M, separators=(',', ':')))
print('size', out.size, os.path.getsize(os.path.join(R, 'assets/city8_atlas.png')))
