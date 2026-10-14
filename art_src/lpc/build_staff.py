# 纸娃娃手里的法杖(第二十六轮):Staff [64x64](LordNeo,CC0)
#   https://opengameart.org/content/staff-64-x64   原始包:raw/staff_lordneo/staves.zip
# 改动:四个系列 = 旅者 holly staff 金框改银、红宝石改蓝 / 林王 staff04 红宝石改绿 / 荒漠 holly staff 原色 / 雪原 staff05 木杖改冰蓝、金缠绕改银白;
#   每把在格子里保持原图的斜向(杖头朝左上),游戏里按握持角度最近邻旋转。
# 输出 assets/stf_atlas.png(4 格 × 64×64,一行),打印每把杖尾 / 杖头的像素坐标(贴进源码 STF.M)
import sys, zipfile, io, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
Z = zipfile.ZipFile(os.path.join(ROOT, 'raw', 'staff_lordneo', 'staves.zip'))
def load(n):
    for f in Z.namelist():
        if f.endswith(n): return Image.open(io.BytesIO(Z.read(f))).convert('RGBA')
    raise SystemExit('missing ' + n)

def recolor_red_to_green(im):
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and r > 150 and g < 90 and b < 90:   # 红宝石
                px[x, y] = (int(g * .6), r, int(r * .45), a)
    return im

def shrink(im):
    s = im.resize((64, 64), Image.LANCZOS)
    px = s.load()
    for y in range(64):
        for x in range(64):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= 110 else (0, 0, 0, 0)
    q = s.convert('RGB').quantize(24, method=Image.Quantize.MEDIANCUT).convert('RGBA')
    q.putalpha(s.getchannel('A'))
    return q

import colorsys
def remap(im, fn):
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a: continue
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            v = fn(h * 360, l, s)
            if v: px[x, y] = tuple(int(max(0, min(1, c)) * 255) for c in colorsys.hls_to_rgb(*v)) + (a,)
    return im
def silver(H, l, s):   # 金色 → 银白;红宝石 → 蓝宝石
    if s > .35 and 18 <= H <= 70: return (215 / 360, min(.95, l * 1.05), .18)
    if s > .35 and (H < 15 or H > 340): return (215 / 360, l, s)
def icy(H, l, s):      # 木头 → 冰蓝;金色 → 银白
    if s > .35 and 35 <= H <= 70: return (195 / 360, min(.95, l * 1.15), .25)
    if 10 <= H < 35: return (205 / 360, min(.9, l * 1.35 + .08), .45)
L = [remap(load('holly staff.png'), silver), recolor_red_to_green(load('staff04.png')), load('holly staff.png'), remap(load('staff05.png'), icy)]
# 第二十七轮(用户):手后面那一截加长 —— 把杖尾前面一段杖身的横截面沿斜线复制 EXT 次,杖尾端整体往右下挪(格子变成 C×C)
EXT = 12; C = 64 + EXT
def lengthen(im):
    a = im.getchannel('A').load(); px = im.load()
    pts = [(x, y) for y in range(64) for x in range(64) if a[x, y]]
    td = max(x + y for x, y in pts); cut = td - 12
    n = Image.new('RGBA', (C, C), (0, 0, 0, 0)); q = n.load()
    for x, y in pts:
        d = x + y
        if d <= cut: q[x, y] = px[x, y]
        else: q[x + EXT, y + EXT] = px[x, y]
        if cut - 2 < d <= cut:
            for j in range(1, EXT + 1): q[x + j, y + j] = px[x, y]
    return n
L = [lengthen(im) for im in L]
out = Image.new('RGBA', (C * 4, C), (0, 0, 0, 0))
meta = []
for i, im in enumerate(L):
    out.alpha_composite(im, (C * i, 0))
    a = im.getchannel('A').load()
    pts = [(x, y) for y in range(C) for x in range(C) if a[x, y]]
    tail = max(pts, key=lambda p: p[0] + p[1])   # 右下 = 杖尾
    head = min(pts, key=lambda p: p[0] + p[1])   # 左上 = 杖头
    meta.append([tail[0], tail[1], head[0], head[1]])
out.save(os.path.join(ROOT, 'assets', 'stf_atlas.png'))
print('STF.M =', meta)
