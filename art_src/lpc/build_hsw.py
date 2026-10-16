# 剑士手里的大剑(纸娃娃用):Fantasy Sword Set(Melissa Krautheim / melle,CC0)
#   https://opengameart.org/content/fantasy-sword-set 的 sword / lightning_sword / fire_sword / ice_sword
# 2026-10-13 第十七轮:代替原来代码逐像素画的剑。四个系列各一把:0 旅者 = 牛角护手银剑,1 林王 = 雷光剑(金色剑芯换成翠绿),
#   2 荒漠 = 火焰剑,3 雪原 = 寒冰剑。改动:去掉外发光,缩小到剑身(护手 → 剑尖)46 像素,限 11 色 + 1 像素深色描边,剑尖转向右
# 用法:python art_src/lpc/build_hsw.py → assets/hsw_atlas.png(4 行,一行一把)+ 打印 meta(贴进源码 HSW.M):
#   每把 [y, 宽, 高, 握把 x, 中线 y],握把 = 前手握的位置(护手下面一点)
import os, json, colorsys
import numpy as np
from PIL import Image

R = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(R, 'raw/giant_sword/fantasy_sword_melle')
FILES = ['sword.png', 'lightning_sword.png', 'fire_sword.png', 'ice_sword.png', 'sword.png', 'fire_sword.png', 'fire_sword.png']  # 第四十一轮:4 机械 = 银剑换成黄铜色  # 第四十二轮:5 火之大剑 = 火焰剑加深成赤红烈焰,6 真~火之大剑 = 火焰剑换成蓝焰
BL = 46  # 护手到剑尖的像素数

def load(fn, green=False, brass=False, fire=0):
    im = Image.open(os.path.join(SRC, fn)).convert('RGBA')
    a = np.array(im).astype(np.float32)
    a[..., 3] = np.where(a[..., 3] > 150, 255, 0)  # 去掉半透明外发光
    if green:  # 雷光剑的金色剑芯 / 金环 → 翠绿
        rgb = a[..., :3] / 255
        for y, x in zip(*np.nonzero(a[..., 3])):
            r, g, b = rgb[y, x]; h, s, v = colorsys.rgb_to_hsv(r, g, b)
            if s > .25 and .05 < h < .2:
                r2, g2, b2 = colorsys.hsv_to_rgb(.36, min(1, s * 1.05), v)
                a[y, x, :3] = [r2 * 255, g2 * 255, b2 * 255]
    if brass:  # 低饱和的银灰 → 黄铜色(亮度不变),有颜色的部分 → 深铜色
        rgb = a[..., :3] / 255
        for y, x in zip(*np.nonzero(a[..., 3])):
            r, g, b = rgb[y, x]; h, s, v = colorsys.rgb_to_hsv(r, g, b)
            r2, g2, b2 = colorsys.hsv_to_rgb(.11 if s < .3 else .07, .55 if s < .3 else min(1, s * 1.1), v)
            a[y, x, :3] = [r2 * 255, g2 * 255, b2 * 255]
    if fire:  # 1 赤红烈焰(橙色 → 深红、亮处 → 金黄)/ 2 蓝焰(有颜色的部分 → 蓝青,亮处发白)
        rgb = a[..., :3] / 255
        for y, x in zip(*np.nonzero(a[..., 3])):
            r, g, b = rgb[y, x]; h, s, v = colorsys.rgb_to_hsv(r, g, b)
            if s < .15: continue
            if fire == 1: h2, s2 = (.98 + .09 * v ** 4), min(1, s * 1.25 + .1)
            else: h2, s2 = (.62 - .1 * v ** 2), min(1, s * .95)
            r2, g2, b2 = colorsys.hsv_to_rgb(h2 % 1, s2, v); a[y, x, :3] = [r2 * 255, g2 * 255, b2 * 255]
    im = Image.fromarray(a.astype(np.uint8)); return im.crop(im.getbbox())

rows, meta, y0 = [], [], 0
for i, fn in enumerate(FILES):
    im = load(fn, green=(i == 1), brass=(i == 4), fire=(i - 4 if i >= 5 else 0))
    al = np.array(im)[..., 3] > 0; w = al.sum(1); H = al.shape[0]
    lo = int(H * .5); guard = lo + int(np.argmax(w[lo:int(H * .85)]))      # 护手 = 下半部分最宽的一行
    gb = guard
    while gb < H - 1 and w[gb] > w[guard] * .45: gb += 1                      # 护手下沿
    top = int(np.nonzero(w)[0].min()); k = BL / (guard - top)
    sm = im.resize((max(1, round(im.width * k)), max(1, round(H * k))), Image.LANCZOS)
    b = np.array(sm); b[..., 3] = np.where(b[..., 3] > 120, 255, 0)
    q = Image.fromarray(b[..., :3]).quantize(colors=11, method=Image.Quantize.MEDIANCUT).convert('RGB'); b[..., :3] = np.array(q)
    al = b[..., 3] > 0; o = np.zeros_like(al)
    o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]; o &= ~al
    b[o] = [26, 18, 32, 255]
    pad = np.zeros((b.shape[0] + 2, b.shape[1] + 2, 4), np.uint8); pad[1:-1, 1:-1] = b
    sw = Image.fromarray(pad).rotate(-90, expand=True)                        # 剑尖朝上 → 朝右
    gy = round(gb * k) + 1 + 2                                                # 握把:护手下沿往下 2 像素
    gx = sw.width - 1 - gy
    rows.append(sw); meta.append([y0, sw.width, sw.height, gx, sw.height // 2]); y0 += sw.height
out = Image.new('RGBA', (max(r.width for r in rows), y0))
for r, m in zip(rows, meta): out.alpha_composite(r, (0, m[0]))
out.save(os.path.join(R, 'assets/hsw_atlas.png'), optimize=True)
print(json.dumps(meta))
