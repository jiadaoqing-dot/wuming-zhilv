# 第九关「火山噩梦」场景 + 怪物 / 首领图集 VOL9(2026-10-13):
#   场景:2D Platformer Volcano Pack 1.1(Tio Aimar,CC0)https://opengameart.org/content/2d-platformer-volcano-pack-11
#         —— 视差背景 6 层缩到 1/4 再按「红色天空 / 暗红山脉 / 火山灰云」重新上色;地面、浮空平台、熔岩、枯树 / 小火山(喷气孔)/ 岩石 / 晶体缩到 1/4 限色
#   怪物 / 首领:Gothicvania Patreon's Collection(ansimuz,CC0)https://opengameart.org/content/gothicvania-patreons-collection
#         —— Hell Beast = 炎牙魔(原色)/ 炎狱鬼将(换成黑曜石身体 + 橙金火焰铠甲);它「化成火柱」的最后两帧 = 首领的炎柱;火球
#         —— Fire Skull = 熔火鬼(缩小一半)
#         —— Flying Demon = 熔狱魔神(翅膀换成熔岩色、斗篷加熔岩裂纹、蓝色骷髅头换成黑岩头 + 三只燃烧的眼睛);它的喷火(breath-fire)= 熔岩拳爆炸
#   熔岩魔:Golem animations(irmirx,CC-BY 3.0)https://opengameart.org/content/golem-animations
#         —— 卡通石头魔像缩到 1/6、限色,身体换成黑色玄武岩,花纹换成发光的熔岩裂纹,青色光换成橙色火
#   自画像素:火山内部的洞顶钟乳石 / 洞壁、熔岩祭坛、远景喷发的火山、两把燃烧的弯刀、地面火焰(3 帧)、熔岩裂缝、地狱之握的巨大黑手
#   所有动画统一翻成面朝右
# 用法:python art_src/volcano/build_vol9.py → assets/vol9_atlas.png + 打印 meta(贴进源码 VOL9.M)
#   meta:名字 → [y, 帧宽, 帧高, 帧数](帧横排,第 i 帧左上角 = (i×帧宽, y))
import json, os, math
import numpy as np
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(__file__), '..', '..')
GV = os.path.join(R, 'raw/volcano/gothicvania_patreon/x/ gothicvania patreon collection')
TV = os.path.join(R, 'raw/volcano/tio_volcano/x/PNG')
GO = os.path.join(R, 'raw/volcano/golem_anim/x')
def L(p): return Image.open(p).convert('RGBA')
def hexc(h, a=255): h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
def frames(im, w, h, n, y=0): return [im.crop((i * w, y, i * w + w, y + h)) for i in range(n)]
def flip(fs): return [f.transpose(Image.FLIP_LEFT_RIGHT) for f in fs]
def athr(im, t=110):
    a = np.array(im); a[..., 3] = np.where(a[..., 3] > t, 255, 0); return Image.fromarray(a)
def shrink(im, k, colors=None):
    """缩小到 1/k(LANCZOS)→ 透明度二值化 → 可选限色,得到干净的像素块"""
    im = im.resize((max(1, round(im.width / k)), max(1, round(im.height / k))), Image.LANCZOS)
    im = athr(im)
    if colors:
        a = np.array(im); rgb = Image.fromarray(a[..., :3]).quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert('RGB')
        a[..., :3] = np.array(rgb); im = Image.fromarray(a)
    return im
def outline(im, col='#120808'):
    a = np.array(im); al = a[..., 3] > 0; o = np.zeros_like(al)
    o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]; o &= ~al
    a[o] = hexc(col); return Image.fromarray(a)
def lumi(a): return a[..., :3].astype(np.float32) @ np.array([.3, .59, .11])
def ramp(t, cols):
    """t ∈ [0,1] → 按颜色表插值"""
    cs = np.array([hexc(c)[:3] for c in cols], np.float32); t = np.clip(t, 0, 1) * (len(cs) - 1)
    i = np.minimum(np.floor(t).astype(int), len(cs) - 2); f = (t - i)[..., None]; return cs[i] * (1 - f) + cs[i + 1] * f
def pad(fs, w=None, h=None, anchor='bottom'):
    """把帧放进统一大小的格子(底边对齐 / 居中)"""
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

ROWS = {}   # 名字 → 帧列表
RNG = np.random.RandomState(9)

# ======================= 场景 =======================
# 视差背景:原图 1280 宽,缩到 1/4(320 宽,游戏里 ×2 画),每层换成纯色 + 顶边一道亮边
def bgl(i, col, rim=None, k=4):
    im = L(os.path.join(TV, 'bg_volcano_layers/bg_volcano_%d.png' % i))
    im = athr(im.resize((im.width // k, im.height // k), Image.LANCZOS), 100); a = np.array(im); al = a[..., 3] > 0
    a[al, :3] = hexc(col)[:3]
    if rim:
        top = al & ~np.vstack([np.zeros((1, al.shape[1]), bool), al[:-1]])
        a[top, :3] = hexc(rim)[:3]
    return Image.fromarray(a).crop((0, Image.fromarray(a).getbbox()[1], a.shape[1], a.shape[0]))
# 天空:暗红 → 橙红渐变(自画,横向可平铺)
sky = Image.new('RGBA', (32, 180)); sa = np.zeros((180, 32, 4), np.uint8)
t = np.linspace(0, 1, 180)[:, None].repeat(32, 1)
band = np.floor(t * 14) / 14   # 色带分层(像素风)
sa[..., :3] = ramp(band, ['#1c0507', '#3d0a0c', '#6e1410', '#a4280e', '#d4561a', '#f08a2c']).astype(np.uint8); sa[..., 3] = 255
ROWS['sky'] = [Image.fromarray(sa)]
# 火山灰云(第 5 层)
cl = L(os.path.join(TV, 'bg_volcano_layers/bg_volcano_5.png')); cl = athr(cl.resize((320, cl.height // 4), Image.LANCZOS), 60); ca = np.array(cl)
lu = lumi(ca); lu = (lu - lu[ca[..., 3] > 0].min()) / (np.ptp(lu[ca[..., 3] > 0]) + 1e-6)
ca[..., :3] = ramp(np.floor(lu * 4) / 4, ['#2a1416', '#4a2220', '#6e3324', '#8c4428']).astype(np.uint8); ROWS['ash'] = [Image.fromarray(ca)]
# 远景:最远的锯齿山(第 4 层)+ 中间自画一座正在喷发的火山
far = bgl(4, '#3a0f14', '#5c1a1a'); fd = ImageDraw.Draw(far); fa = np.array(far)
H = far.height; vc = 210
cone = Image.new('RGBA', far.size); cd = ImageDraw.Draw(cone)
cd.polygon([(vc - 70, H), (vc - 14, 6), (vc + 14, 6), (vc + 70, H)], fill=hexc('#2c0b10')); cd.line([(vc - 14, 6), (vc - 70, H)], fill=hexc('#4a1518'), width=1)
for k in range(5):   # 山顶往下流的熔岩
    x0 = vc - 10 + k * 5; y = 7
    while y < H - 4:
        cd.point((x0, y), fill=hexc('#ff7a1a' if y < 30 else '#c4401a')); x0 += RNG.choice([-1, 0, 0, 1]); y += 1
cd.rectangle([vc - 13, 5, vc + 13, 7], fill=hexc('#ffb03a'))
far.alpha_composite(cone); ROWS['far'] = [far]
ROWS['mid'] = [bgl(2, '#4e1616', '#6e2219')]
ROWS['mid2'] = [bgl(3, '#30100f', '#4c1914')]
ROWS['near'] = [bgl(1, '#1a0809', '#3a1210')]
# 火山内部:洞壁(远处)+ 洞顶钟乳石(自画,横向可平铺,宽 160)
def cave_wall(w=160, h=150):
    a = np.zeros((h, w, 4), np.uint8); a[..., 3] = 255
    yy, xx = np.mgrid[0:h, 0:w]
    n = (np.sin(xx / w * 2 * np.pi * 3 + yy * .07) + np.sin(xx / w * 2 * np.pi * 5 - yy * .11) * .6 + np.sin(yy * .19) * .4)
    base = ramp(np.clip((n + 2) / 4, 0, 1), ['#140607', '#1f0a0a', '#2a0f0d'])
    a[..., :3] = base.astype(np.uint8)
    # 岩缝里的熔岩脉
    for k in range(4):
        x0 = RNG.randint(0, w); y = RNG.randint(0, 40); ln = RNG.randint(30, 90)
        for s in range(ln):
            xw = x0 % w; a[min(h - 1, y), xw, :3] = hexc('#8a2a12' if s % 7 else '#d4561a')[:3]
            if RNG.rand() < .5: a[min(h - 1, y), (xw + 1) % w, :3] = hexc('#6e1a10')[:3]
            x0 += RNG.choice([-1, 0, 1]); y += 1
    return Image.fromarray(a)
ROWS['cwall'] = [cave_wall()]
def ceiling(w=160, h=56):
    im = Image.new('RGBA', (w, h)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w, 10], fill=hexc('#120506'))
    x = 0
    while x < w:
        cw = RNG.randint(8, 20); ln = RNG.randint(10, h - 4); cx = x + cw // 2
        d.polygon([(x, 8), (x + cw, 8), (cx + RNG.randint(-2, 3), 8 + ln)], fill=hexc('#120506'))
        d.line([(x + cw, 8), (cx, 8 + ln)], fill=hexc('#2c0d0c'))
        if RNG.rand() < .4: d.point((cx, 8 + ln - 1), fill=hexc('#ff8a2a'))   # 滴着熔岩
        x += cw - 2
    a = np.array(im); a[:, -2:] = a[:, :2]   # 首尾接上
    return Image.fromarray(a)
ROWS['ceil'] = [ceiling()]
# 地面 / 平台 / 熔岩:原图 128 一格 → 32
def tile(n, k=4, col=8): return shrink(L(os.path.join(TV, 'volcano_pack_%s.png' % n)), k, col)
ROWS['g_top'] = [tile('05')]; ROWS['g_fill'] = [tile('34')]
ROWS['g_top2'] = [tile('alt_05')]; ROWS['g_fill2'] = [tile('alt_34')]   # 火山内部:灰黑色地面
pl = [tile(n) for n in ('13', '15', '17', '19')]; ROWS['plat'] = pl
ROWS['plat2'] = [tile('alt_' + n) for n in ('13', '15', '17', '19')]
ROWS['lava'] = [tile('53'), tile('54')]
# 道具(1/4)
for nm, n in [('tree', '59'), ('vent', '68'), ('rock', '70'), ('rock2', '71'), ('cry1', '56'), ('cry2', '65'), ('cry3', '72'), ('plant', '66'), ('bush', '73')]:
    ROWS[nm] = [tile(n, 4, 10).crop(tile(n, 4, 10).getbbox())]
# 熔岩祭坛(自画,220×110):三层台阶 + 两根黑曜石柱(柱顶火盆)+ 中间恶魔符文
def altar(w=240, h=112):
    im = Image.new('RGBA', (w, h)); d = ImageDraw.Draw(im)
    for i, (x0, y0) in enumerate([(0, 92), (16, 78), (34, 66)]):
        d.rectangle([x0, y0, w - 1 - x0, h - 1 if i == 0 else y0 + 14], fill=hexc(['#1e0a0a', '#281010', '#321414'][i]))
        d.line([(x0, y0), (w - 1 - x0, y0)], fill=hexc('#5a2418'))
        for k in range(x0 + 6, w - x0 - 6, 14): d.line([(k, y0 + 2), (k, y0 + 12)], fill=hexc('#140606'))
    for px in (44, w - 58):
        d.rectangle([px, 10, px + 14, 66], fill=hexc('#1a0a10')); d.line([(px, 10), (px, 66)], fill=hexc('#3c1a20')); d.line([(px + 14, 10), (px + 14, 66)], fill=hexc('#0a0306'))
        for y in range(16, 64, 9): d.line([(px + 2, y), (px + 12, y + 2)], fill=hexc('#ff6a1a' if y % 2 else '#a8300f'))   # 熔岩纹
        d.rectangle([px - 4, 4, px + 18, 10], fill=hexc('#2c1010')); d.line([(px - 4, 4), (px + 18, 4)], fill=hexc('#ff9a3a'))   # 火盆
    cx = w // 2; d.ellipse([cx - 40, 54, cx + 40, 76], outline=hexc('#c4401a')); d.ellipse([cx - 32, 57, cx + 32, 73], outline=hexc('#ff7a1a'))
    for k in range(5):
        a1 = -math.pi / 2 + k * 2 * math.pi / 5; a2 = -math.pi / 2 + (k + 2) * 2 * math.pi / 5
        d.line([(cx + math.cos(a1) * 30, 65 + math.sin(a1) * 7), (cx + math.cos(a2) * 30, 65 + math.sin(a2) * 7)], fill=hexc('#ffb03a'))
    return im
ROWS['altar'] = [altar()]

# ======================= 怪物 =======================
hb = os.path.join(GV, 'Hell-Beast-Files/PNG/with-stroke')
idle = frames(L(os.path.join(hb, 'hell-beast-idle.png')), 55, 67, 6)
breath = frames(L(os.path.join(hb, 'hell-beast-breath.png')), 64, 64, 4)
burn = frames(L(os.path.join(hb, 'hell-beast-burn.png')), 74, 160, 6)
imp = flip(pad(crop_all(idle + breath)))
ROWS['imp'] = imp   # 0~5 待机 / 走路,6~9 抬身出爪
ROWS['pillar'] = flip(crop_all(burn[4:6]))   # 炎柱(两帧交替)
# 炎狱鬼将:同一个恶魔换成黑曜石身体 + 橙金火焰铠甲 + 橙色描边
def oni_col(im):
    a = np.array(im).astype(np.float32); al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]; lu = lumi(a)
    stroke = al & (r > 150) & (g < 90)            # 原来的红色描边
    warm = al & ~stroke & (r > g * 1.35) & (r > 90) & (g > 40)   # 原来的橙褐色(护甲 / 关节)
    body = al & ~stroke & ~warm
    out = a[..., :3].copy()
    out[body] = ramp(np.clip(lu[body] / 120, 0, 1), ['#0c0608', '#1c1016', '#2e1c26', '#46303a'])
    out[warm] = ramp(np.clip(lu[warm] / 160, 0, 1), ['#a8400c', '#ff8a1a', '#ffd04a'])
    out[stroke] = hexc('#ff6a10')[:3]
    a[..., :3] = out; return Image.fromarray(a.astype(np.uint8))
ROWS['oni'] = [oni_col(f) for f in imp]
# 燃烧的弯刀(自画 36×12,刀柄在左,刀尖朝右上弯)
def scim():
    im = Image.new('RGBA', (36, 14)); d = ImageDraw.Draw(im)
    d.rectangle([0, 8, 6, 10], fill=hexc('#3a1a10')); d.rectangle([6, 6, 8, 12], fill=hexc('#ffb03a'))
    pts = [(9, 8), (16, 8), (24, 7), (30, 5), (35, 1), (33, 5), (27, 9), (18, 11), (9, 11)]
    d.polygon(pts, fill=hexc('#ffcf6a')); d.line([(9, 8), (16, 8), (24, 7), (30, 5), (35, 1)], fill=hexc('#fff3c0'))
    d.line([(9, 11), (18, 11), (27, 9), (33, 5)], fill=hexc('#c4401a'))
    return outline(im, '#3a0a04')
ROWS['scim'] = [scim()]
# 熔火鬼:火骷髅缩小一半
sk = frames(L(os.path.join(GV, 'Fire-Skull-Files/PNG/fire-skull.png')), 96, 112, 8)
ROWS['skull'] = flip(crop_all([f.resize((48, 56), Image.NEAREST) for f in sk]))
ROWS['fball'] = flip(frames(L(os.path.join(GV, 'Hell-Beast-Files/PNG/fire-ball.png')), 19, 16, 3))
# 熔岩魔:石头魔像 1/6 + 玄武岩 / 熔岩裂纹配色
def golem_col(im):
    a = np.array(im).astype(np.float32); al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]; lu = lumi(a)
    cyan = al & (b > r + 25) & (g > r + 10)
    dark = al & ~cyan & (lu < 70)               # 描边 / 花纹线
    body = al & ~cyan & ~dark
    out = a[..., :3].copy()
    out[body] = ramp(np.clip((lu[body] - 120) / 110, 0, 1), ['#2a1e22', '#40303a', '#5a4650', '#7a6066'])
    out[dark] = ramp(np.clip(lu[dark] / 70, 0, 1), ['#ff6a10', '#ffb03a'])     # 花纹 → 发光熔岩缝
    out[cyan] = ramp(np.clip(lu[cyan] / 200, 0, 1), ['#c4401a', '#ff8a1a', '#ffe08a'])
    a[..., :3] = out; return Image.fromarray(a.astype(np.uint8))
def gl(sub, pre, n): return [L(os.path.join(GO, sub, '%s_%d.png' % (pre, i))) for i in range(1, n + 1)]
gi = gl('idle-walk', 'idle', 6); ga = gl('attack', 'hit', 6); gd = gl('die', 'die', 7)
gall = pad(gi + ga)   # 统一格子后一起缩小,保持比例
gall = [outline(golem_col(shrink(f, 6, 12)), '#0a0506') for f in gall]
ROWS['golem'] = flip(crop_all(gall))   # 0~5 待机,6~11 出拳(倒下帧是半透明剪影,不用)
# 熔狱魔神:Flying Demon 换色
def demon_col(im, seed=0):
    a = np.array(im).astype(np.float32); al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]; lu = lumi(a)
    cyan = al & (b > r + 30) & (g > r + 20)
    wing = al & ~cyan & (r > g + 22) & (r > 55)           # 暗红翅膜
    body = al & ~cyan & ~wing
    out = a[..., :3].copy()
    out[wing] = ramp(np.clip((lu[wing] - 20) / 70, 0, 1), ['#5a1206', '#b8380a', '#ff7a14', '#ffc040'])
    # 斗篷 / 身体:黑岩 + 熔岩裂纹(按像素坐标固定的噪声,帧间位置基本一致)
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    vein = (np.abs(VF[:a.shape[0], :a.shape[1]] - .5) < .018) & body & (lu < 60)   # 随机场的等高线 = 弯曲的裂纹
    out[body] = ramp(np.clip(lu[body] / 90, 0, 1), ['#0a0608', '#1a1214', '#2c2226', '#463a3c'])
    out[vein] = hexc('#ff6a10')[:3]
    out[cyan] = ramp(np.clip(lu[cyan] / 220, 0, 1), ['#140c0e', '#2a2024', '#3e3236'])   # 头:黑岩
    a[..., :3] = out; img = Image.fromarray(a.astype(np.uint8))
    # 三只燃烧的眼睛:头部(原青色区域)中心偏下排成倒三角
    ys, xs = np.nonzero(cyan)
    if len(xs):
        cx, cy = int(np.median(xs)), int(np.percentile(ys, 60)); d = ImageDraw.Draw(img)
        for ex, ey in [(cx - 4, cy), (cx + 4, cy), (cx, cy - 4)]:
            d.rectangle([ex - 1, ey - 1, ex + 1, ey], fill=hexc('#ff8a1a')); d.point((ex, ey - 1), fill=hexc('#fff3a0'))
    return img
dm = os.path.join(GV, 'demon-Files/PNG')
di = frames(L(os.path.join(dm, 'demon-idle.png')), 160, 144, 6)
da = frames(L(os.path.join(dm, 'demon-attack-no-breath.png')), 192, 176, 8)
dall = pad(di + da)
VF = np.array(Image.fromarray((RNG.rand(14, 14) * 255).astype(np.uint8)).resize((dall[0].width, dall[0].height), Image.BICUBIC)).astype(np.float32) / 255
dall = [demon_col(f) for f in dall]
ROWS['demon'] = flip(crop_all(dall))   # 0~5 待机(正面),6~13 俯身出招
ROWS['dfire'] = flip(crop_all(frames(L(os.path.join(dm, 'breath-fire.png')), 160, 96, 5)))   # 熔岩拳爆炸 / 火焰
# 地面火焰(自画 3 帧 16×22)
def flame(i):
    im = Image.new('RGBA', (16, 22)); a = np.array(im); r = np.random.RandomState(40 + i)
    for y in range(22):
        w = int((22 - y) / 22 * 7 + r.randint(0, 2)) if y > 3 else r.randint(0, 2)
        cx = 8 + int(math.sin(y * .5 + i * 2) * 1.5)
        for x in range(cx - w, cx + w + 1):
            if 0 <= x < 16:
                k = abs(x - cx) / (w + .5) + (22 - y) / 44
                a[y, x] = hexc('#fff3a0' if k < .45 else '#ffb03a' if k < .75 else '#ff6a10' if k < 1 else '#b8300a')
    return Image.fromarray(a)
ROWS['flame'] = [flame(i) for i in range(3)]
# 熔岩裂缝(地面贴花 64×8)
def crack():
    im = Image.new('RGBA', (64, 8)); d = ImageDraw.Draw(im); x, y = 0, 4
    while x < 63:
        nx = x + RNG.randint(2, 5); ny = max(1, min(6, y + RNG.randint(-2, 3)))
        d.line([(x, y), (nx, ny)], fill=hexc('#ff7a1a'), width=2); d.line([(x, y), (nx, ny)], fill=hexc('#ffd04a'))
        if RNG.rand() < .3: d.line([(nx, ny), (nx + 2, ny + RNG.choice([-3, 3]))], fill=hexc('#c4401a'))
        x, y = nx, ny
    return im
ROWS['crack'] = [crack()]
# 地狱之握:从地面伸出的巨大黑手(自画 3 帧:握拳 → 张开 → 合拢),56×72
def hand(st):
    im = Image.new('RGBA', (56, 72)); d = ImageDraw.Draw(im); C, E = hexc('#0c0608'), hexc('#ff6a10')
    d.polygon([(16, 72), (40, 72), (38, 40), (18, 40)], fill=C)   # 手腕
    d.ellipse([12, 26, 44, 50], fill=C)                           # 手掌
    sp = [0, 1, 0][st] if st < 3 else 0
    for k in range(5):
        a = math.radians(-150 + k * 30 if st != 1 else -165 + k * 37); ln = 26 if st == 1 else 16
        x0, y0 = 28 + math.cos(a) * 10, 36 + math.sin(a) * 8; x1, y1 = 28 + math.cos(a) * (10 + ln), 36 + math.sin(a) * (8 + ln)
        if st == 2: x1, y1 = 28 + math.cos(a) * 12, 30 + math.sin(a) * 4
        d.line([(x0, y0), (x1, y1)], fill=C, width=6); d.polygon([(x1 - 2, y1), (x1 + 2, y1), (x1 + math.cos(a) * 5, y1 + math.sin(a) * 5)], fill=hexc('#2a1416'))
    im = outline(im, '#ff6a10')
    a = np.array(im); al = a[..., 3] > 0
    for k in range(10):   # 手背上的熔岩纹
        y, x = 40 + RNG.randint(0, 28), 20 + RNG.randint(0, 16)
        if al[y, x]: a[y, x, :3] = hexc('#ff8a1a')[:3]
    return Image.fromarray(a)
ROWS['hand'] = [hand(i) for i in range(3)]

# ======================= 打包 =======================
order = ['sky', 'ash', 'far', 'mid', 'mid2', 'near', 'cwall', 'ceil', 'g_top', 'g_fill', 'g_top2', 'g_fill2', 'plat', 'plat2', 'lava',
         'tree', 'vent', 'rock', 'rock2', 'cry1', 'cry2', 'cry3', 'plant', 'bush', 'altar',
         'imp', 'oni', 'scim', 'pillar', 'skull', 'fball', 'golem', 'demon', 'dfire', 'flame', 'crack', 'hand']
# 小东西(单帧、宽 < 80)并排放进同一行以省空间:meta 里额外给 x 偏移 → [y, w, h, n, x]
W = max(max(f.width for f in ROWS[k]) * len(ROWS[k]) for k in order)
W = max(W, 400)
meta = {}; y = 0; small_x = None; small_y = 0; small_h = 0; placed = []
for k in order:
    fs = ROWS[k]; fw = max(f.width for f in fs); fh = max(f.height for f in fs); fs = pad(fs, fw, fh)
    if len(fs) == 1 and fw < 80 and fh < 80:
        if small_x is None or small_x + fw > W: small_x = 0; small_y = y; y += 80
        placed.append((fs[0], small_x, small_y)); meta[k] = [small_y, fw, fh, 1, small_x]; small_x += fw + 1; continue
    placed += [(f, i * fw, y) for i, f in enumerate(fs)]; meta[k] = [y, fw, fh, len(fs)]; y += fh + 1
at = Image.new('RGBA', (W, y))
for f, px, py in placed: at.alpha_composite(f, (px, py))
at = at.crop((0, 0, W, at.getbbox()[3]))
out = os.path.join(R, 'assets/vol9_atlas.png'); at.save(out, optimize=True)
print(at.size, os.path.getsize(out))
print(json.dumps(meta, separators=(',', ':')))
