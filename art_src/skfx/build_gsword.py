# 剑士 O「苍蓝巨剑」的剑:Fantasy Sword Set(Melissa Krautheim / melle,CC0)
#   https://opengameart.org/content/fantasy-sword-set 的 lightning_sword(宽刃银剑 + 发光剑芯)
# 2026-10-13 第十轮:剑尖转向右;剑柄压短一半;缩小到剑身(护手 → 剑尖)正好 300 像素(游戏里巨剑的长度 GL)
# 2026-10-13 第十一轮(暗黑风格):整把剑换成黑紫色的暗钢(按亮度分 6 级),原来的金色剑芯换成暗红色的光;
#       剑刃上下两边每隔 10 像素加一颗朝剑柄方向倒钩的锯齿;限 16 色 + 1 像素黑紫描边,像素块更干净;外发光换成暗紫色
# 用法:python art_src/skfx/build_gsword.py → assets/gsword.png(上半 = 剑,下半 = 发光剪影)+ 打印 meta [宽, 高, 护手 x, 中线 y](贴进源码 GSW.M)
import os, json, colorsys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

R = os.path.join(os.path.dirname(__file__), '..', '..')
im = Image.open(os.path.join(R, 'raw/giant_sword/fantasy_sword_melle/lightning_sword.png')).convert('RGBA')
im = im.crop(im.getbbox())
a = np.array(im); al = a[..., 3] > 128
# 护手 = 下半部分最宽的一行
w = al.sum(1); H = a.shape[0]; lo = int(H * .55)
guard = lo + int(np.argmax(w[lo:int(H * .85)]))
# 剑柄(护手横杆以下)纵向压到一半,整把剑的长短和原来的巨剑接近
gb = guard
while gb < H - 1 and w[gb] > w[guard] * .45: gb += 1
gb += 2
hilt = im.crop((0, gb, im.width, H)); hilt = hilt.resize((hilt.width, max(1, hilt.height // 2)), Image.LANCZOS)
im2 = Image.new('RGBA', (im.width, gb + hilt.height)); im2.alpha_composite(im.crop((0, 0, im.width, gb)), (0, 0)); im2.alpha_composite(hilt, (0, gb)); im = im2
L = 300; k = L / guard                               # 剑尖在第 0 行
im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
a = np.array(im).astype(np.float32); al = a[..., 3] > 110

def hexc(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
DARK = np.array([hexc(c) for c in ['#050308', '#120a1a', '#22122f', '#361c48', '#52306c', '#7d55a0']], np.float32)
CORE = np.array([hexc(c) for c in ['#2a0410', '#5c0a22', '#a0123c', '#e0244f', '#ff6b81']], np.float32)
def pick(ramp, t): t = min(max(t, 0), 1) * (len(ramp) - 1); i = min(int(t), len(ramp) - 2); f = t - i; return ramp[i] * (1 - f) + ramp[i + 1] * f
rgb = a[..., :3] / 255
for y, x in zip(*np.nonzero(al)):
    r, g, b = rgb[y, x]; h, s, v = colorsys.rgb_to_hsv(r, g, b)
    if s > .18 and .06 < h < .2: a[y, x, :3] = pick(CORE, v * 1.1)          # 原来的金色剑芯 / 宝石 → 暗红光
    else: a[y, x, :3] = pick(DARK, (.3 * r + .59 * g + .11 * b) ** 1.15)     # 其余 → 黑紫暗钢
a[..., 3] = np.where(al, 255, 0); sw = Image.fromarray(a.astype(np.uint8))
# 转成剑尖朝右(原图剑尖朝上 → 顺时针转 90°)
sw = sw.rotate(-90, expand=True)
gx = sw.width - round(guard * k)                     # 护手在 x = gx
pad = 8
c = Image.new('RGBA', (sw.width + pad * 2, sw.height + pad * 2)); c.alpha_composite(sw, (pad, pad)); sw = c; gx += pad
# 锯齿:剑刃上下两边,每隔 10 像素一颗倒钩(尖端朝剑柄方向)
m = np.array(sw)[..., 3] > 0; cols = np.nonzero(m.any(0))[0]; tip = cols.max(); d = ImageDraw.Draw(sw)
EDGE = tuple(int(v) for v in DARK[4]) + (255,); TIPC = tuple(int(v) for v in DARK[5]) + (255,)
for x0 in range(gx + 16, tip - 26, 10):
    ys = np.nonzero(m[:, x0])[0]
    if len(ys) < 6: continue
    top, bot = ys.min(), ys.max(); hgt = 3 + (x0 // 10) % 2      # 大小交替,看起来更「狰狞」
    d.polygon([(x0, top + 1), (x0 + 7, top + 1), (x0 - 2, top - hgt)], fill=EDGE); d.point((x0 - 2, top - hgt), fill=TIPC)
    d.polygon([(x0, bot - 1), (x0 + 7, bot - 1), (x0 - 2, bot + hgt)], fill=EDGE); d.point((x0 - 2, bot + hgt), fill=TIPC)
# 限 16 色(像素块更干净)+ 1 像素黑紫描边
b = np.array(sw); q = Image.fromarray(b[..., :3]).quantize(colors=16, method=Image.Quantize.MEDIANCUT).convert('RGB'); b[..., :3] = np.array(q); b[..., 3] = np.where(b[..., 3] > 0, 255, 0)
al = b[..., 3] > 0; o = np.zeros_like(al); o[1:, :] |= al[:-1, :]; o[:-1, :] |= al[1:, :]; o[:, 1:] |= al[:, :-1]; o[:, :-1] |= al[:, 1:]; o &= ~al
b[o] = [8, 2, 14, 255]; sw = Image.fromarray(b)
# 外发光:向外扩 3 像素的暗紫色剪影
m = np.array(sw)[..., 3] > 0
gl = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))
g = np.zeros((sw.height, sw.width, 4), np.uint8); g[..., 0] = 157; g[..., 1] = 60; g[..., 2] = 230; g[..., 3] = np.array(gl)
out = Image.new('RGBA', (sw.width, sw.height * 2)); out.alpha_composite(sw, (0, 0)); out.alpha_composite(Image.fromarray(g), (0, sw.height))
out.save(os.path.join(R, 'assets/gsword.png'), optimize=True)
print(json.dumps([sw.width, sw.height, gx, sw.height // 2]))
